import { Map } from "mapbox-gl";
import { createSDF, normalize, r } from "./sdf";
import { IImageOpts, svgToDataURL } from "./index";

const loadImage = (url: string, size: number, shouldNormalize = false): Promise<HTMLImageElement> => {
  if (shouldNormalize) {
    return loadImage(url, size).then((img) => {
      const [canvas] = normalize(img, size);
      return loadImage(canvas.toDataURL("png", 100), size);
    });
  }

  return new Promise<HTMLImageElement>((resolve) => {
    const img = new Image();

    img.onload = () => {
      resolve(img);
    };

    img.src = url;
  });
};

export const prepareImage = (opt: IImageOpts) => {
  let url = opt.url;

  if (opt.svg) {
    url = svgToDataURL(opt.svg);
  }

  const size = r(opt.size);

  if (opt.sdf) {
    return loadImage(url!, size).then((img) => {
      const { dataURI } = createSDF(img, size);
      return loadImage(dataURI, size);
    });
  }

  return loadImage(url!, size, opt.normalize).then((img) => {
    return img;
  });
};

export class Img {
  static fromSVG(m: Map, svg: string, size: number, name: string, sdf = false) {
    return Img.fromURL(m, svgToDataURL(svg), size, name, sdf);
  }

  static fromURL(m: Map, url: string, size: number, name: string, sdf = false) {
    return new Promise((resolve) => {
      if (m.listImages().includes(name)) {
        resolve(name);
        return;
      }

      prepareImage({
        url,
        size,
        sdf,
      }).then((img) => {
        const im = new Img(name, img, sdf);

        img.width = size * im.pixelRatio;
        img.height = size * im.pixelRatio;

        im.addTo(m);

        resolve(name);
      });
    });
  }

  private m: Map | undefined;
  private pixelRatio: number;

  constructor(
    private name: string,
    private img:
      | HTMLImageElement
      | ArrayBufferView
      | { width: number; height: number; data: Uint8Array | Uint8ClampedArray }
      | ImageData,
    private sdf?: boolean,
  ) {
    this.pixelRatio = window.devicePixelRatio || 1;
  }

  addTo(m: Map) {
    if (m.hasImage(this.name)) {
      return;
    }
    this.m = m.addImage(this.name, this.img, {
      sdf: this.sdf,
      pixelRatio: this.pixelRatio,
    });
  }

  remove() {
    if (!this.m) {
      return;
    }
    this.m.removeImage(this.name);
    this.m = undefined;
  }
}
