const INF = 1e20;

// 1D squared distance transform
const edt1d = (
  grid: Float64Array,
  offset: number,
  stride: number,
  length: number,
  f: Float64Array,
  v: Uint16Array,
  z: Float64Array,
) => {
  let q, k, s, r;
  v[0] = 0;
  z[0] = -INF;
  z[1] = INF;

  for (q = 0; q < length; q++) f[q] = grid[offset + q * stride];

  for (q = 1, k = 0, s = 0; q < length; q++) {
    do {
      r = v[k];
      s = (f[q] - f[r] + q * q - r * r) / (q - r) / 2;
    } while (s <= z[k] && --k > -1);

    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = INF;
  }

  for (q = 0, k = 0; q < length; q++) {
    while (z[k + 1] < q) k++;
    r = v[k];
    grid[offset + q * stride] = f[r] + (q - r) * (q - r);
  }
};

// SDF icon copy from https://github.com/mapbox/tiny-sdf/blob/master/index.js
// 2D Euclidean squared distance transform by Felzenszwalb & Huttenlocher https://cs.brown.edu/~pff/papers/dt-final.pdf
const edt = (data: Float64Array, width: number, height: number, f: Float64Array, v: Uint16Array, z: Float64Array) => {
  for (let x = 0; x < width; x++) edt1d(data, x, width, height, f, v, z);
  for (let y = 0; y < height; y++) edt1d(data, y * width, 1, width, f, v, z);
};

const signDistanceField = ({
  imageData,
  size,
  radius = 8,
  cutoff = 0.25,
}: {
  imageData: ImageData;
  size: number;
  radius?: number;
  cutoff?: number;
}) => {
  const gridOuter = new Float64Array(size * size);
  const gridInner = new Float64Array(size * size);
  const f = new Float64Array(size);
  const z = new Float64Array(size + 1);
  const v = new Uint16Array(size);

  const alphaChannel = new Uint8ClampedArray(size * size);

  for (let i = 0; i < size * size; i++) {
    const a = imageData.data[i * 4 + 3] / 255; // alpha value
    gridOuter[i] = a === 1 ? 0 : a === 0 ? INF : Math.pow(Math.max(0, 0.5 - a), 2);
    gridInner[i] = a === 1 ? INF : a === 0 ? 0 : Math.pow(Math.max(0, a - 0.5), 2);
  }

  edt(gridOuter, size, size, f, v, z);
  edt(gridInner, size, size, f, v, z);

  for (let i = 0; i < size * size; i++) {
    const d = Math.sqrt(gridOuter[i]) - Math.sqrt(gridInner[i]);
    alphaChannel[i] = Math.round(255 - 255 * (d / radius + cutoff));
  }

  // put data back
  const newImageData = new ImageData(size, size);
  for (let i = 0; i < alphaChannel.length; i++) {
    newImageData.data[4 * i] = 0;
    newImageData.data[4 * i + 1] = 0;
    newImageData.data[4 * i + 2] = 0;
    newImageData.data[4 * i + 3] = alphaChannel[i];
  }

  return newImageData;
};

export const r = (v: number): number => (globalThis.devicePixelRatio || 1) * v;

export const normalize = (img: HTMLImageElement, size: number, buffer: number = r(5)) => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;

  const ctx = canvas.getContext("2d")!;

  const contentSize = size - buffer * 2;

  const [width, height] = [img.width, img.height];

  const rs = contentSize / Math.max(width, height);

  ctx.drawImage(img, (contentSize - width * rs) / 2, (contentSize - height * rs) / 2);

  return [canvas, ctx] as const;
};

export const createSDF = (img: HTMLImageElement, size: number, buffer = r(5), radius = 8, cutoff = 0.25) => {
  const [canvas, ctx] = normalize(img, size, buffer);
  const imageData = ctx.getImageData(0, 0, size, size);

  const newImageData = signDistanceField({
    imageData: imageData,
    size: size,
    radius: radius,
    cutoff: cutoff,
  });

  ctx.putImageData(newImageData, 0, 0);

  return {
    dataURI: canvas.toDataURL("png", 100),
  };
};
