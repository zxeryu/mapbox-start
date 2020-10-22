import {
  CanvasSource,
  CanvasSourceOptions,
  CanvasSourceRaw,
  GeoJSONSource,
  GeoJSONSourceOptions,
  GeoJSONSourceRaw,
  ImageSource,
  ImageSourceOptions,
  ImageSourceRaw,
  Map,
  RasterDemSource,
  RasterSource,
  VectorSource,
  VectorSourceImpl,
  VideoSource,
  VideoSourceOptions,
  VideoSourceRaw,
} from "mapbox-gl";
import { v4 as uuid } from "uuid";
import { some } from "lodash";

type MapSourceImpl = {
  vector: VectorSourceImpl;
  raster: RasterSource;
  rasterDem: RasterDemSource;
  geojson: GeoJSONSource;
  image: ImageSource;
  video: VideoSource;
  canvas: CanvasSource;
};
type MapSourceData = {
  vector: VectorSource;
  raster: RasterSource;
  rasterDem: RasterDemSource;
  geojson: GeoJSONSourceRaw;
  image: ImageSourceRaw;
  video: VideoSourceRaw;
  canvas: CanvasSourceRaw;
};
export type MapSourceOptions = {
  vector: Omit<VectorSource, "type">;
  raster: Omit<RasterSource, "type">;
  rasterDem: Omit<RasterDemSource, "type">;
  geojson: GeoJSONSourceOptions;
  image: ImageSourceOptions;
  video: VideoSourceOptions;
  canvas: CanvasSourceOptions;
};

export class Source<T extends keyof MapSourceOptions, TLayerID extends string = string> {
  private m: Map | undefined;

  static from<T extends keyof MapSourceOptions>(type: T, opts: MapSourceOptions[T]): Source<T> {
    const t = type === "rasterDem" ? "raster-dem" : type;
    return new Source<T>({ ...opts, type: t } as any);
  }

  constructor(private opts: MapSourceData[T], public id: string = uuid()) {}

  get(): MapSourceImpl[T] | null {
    if (!this.m) return null;
    return this.m.getSource(this.id) as MapSourceImpl[T];
  }

  named(id?: string) {
    return new Source<T, TLayerID>(this.opts, id);
  }

  addTo(m: Map) {
    if (m.getSource(this.id)) {
      return this;
    }
    this.m = m.addSource(this.id, this.opts);
    return this;
  }

  remove() {
    if (!this.m) return;
    const isUse = some(this.m.getStyle().layers, (layer) => {
      return layer.source === this.id;
    });
    if (!isUse) {
      this.m.removeSource(this.id);
      this.m = undefined;
    }
  }
}

// export class Source<T extends AnySourceImpl = AnySourceImpl, TOpts = any, TLayerID extends string = string> {
//   private m: Map | null = null;
//
//   static vector<TLayers extends string = string>(opts: Omit<VectorSource, "type">) {
//     return new Source<VectorSourceImpl, typeof opts, TLayers>(opts, (opts) => ({
//       ...opts,
//       type: "vector",
//     }));
//   }
//
//   static geoJson(opts: GeoJSONSourceOptions) {
//     return new Source<GeoJSONSource, typeof opts>(opts, (opts) => ({
//       ...opts,
//       type: "geojson",
//     }));
//   }
//
//   static canvas(opts: CanvasSourceOptions) {
//     return new Source<CanvasSource, typeof opts>(opts, (opts) => ({
//       ...opts,
//       type: "canvas",
//     }));
//   }
//
//   static image(opts: ImageSourceOptions) {
//     return new Source<ImageSource, typeof opts>(opts, (opts) => ({
//       ...opts,
//       type: "image",
//     }));
//   }
//
//   static raster(opts: Omit<RasterSource, "type">) {
//     return new Source<RasterSource, typeof opts>(opts, (opts) => ({
//       ...opts,
//       type: "raster",
//     }));
//   }
//
//   static rasterDem(opts: Omit<RasterDemSource, "type">) {
//     return new Source<RasterDemSource, typeof opts>(opts, (opts) => ({
//       ...opts,
//       type: "raster-dem",
//     }));
//   }
//
//   static video(opts: VideoSourceOptions) {
//     return new Source<VideoSource, typeof opts>(opts, (opts) => ({
//       ...opts,
//       type: "video",
//     }));
//   }
//
//   constructor(
//     private opts: TOpts,
//     private sourceCreator: (opts: TOpts) => any = (v) => v,
//     public id: string = uuid(),
//   ) {}
//
//   get(): T | null {
//     if (!this.m) return null;
//     return this.m.getSource(this.id) as T;
//   }
//
//   named(id?: string) {
//     return new Source<T, TOpts, TLayerID>(this.opts, this.sourceCreator, id);
//   }
//
//   addTo(m: Map) {
//     if (m.getSource(this.id)) {
//       return this;
//     }
//     this.m = m.addSource(this.id, this.sourceCreator(this.opts));
//     return this;
//   }
//
//   remove() {
//     if (!this.m) return;
//     const isUse = some(this.m.getStyle().layers, (layer) => {
//       return layer.source === this.id;
//     });
//     if (!isUse) {
//       this.m.removeSource(this.id);
//       this.m = null;
//     }
//   }
// }
