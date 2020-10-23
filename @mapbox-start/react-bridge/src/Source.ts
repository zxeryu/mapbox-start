import {
  CanvasSource,
  CanvasSourceOptions,
  GeoJSONSource,
  GeoJSONSourceOptions,
  ImageSource,
  ImageSourceOptions,
  Map,
  RasterDemSource,
  RasterSource,
  VectorSource,
  VectorSourceImpl,
  VideoSource,
  VideoSourceOptions,
  Source as ISource,
} from "mapbox-gl";
import { v4 as uuid } from "uuid";
import { some } from "lodash";

export type MapSource = {
  vector: {
    impl: VectorSourceImpl;
    option: Omit<VectorSource, "type">;
  };
  raster: {
    impl: RasterSource;
    option: Omit<RasterSource, "type">;
  };
  rasterDem: {
    impl: RasterDemSource;
    option: Omit<RasterDemSource, "type">;
  };
  geojson: {
    impl: GeoJSONSource;
    option: GeoJSONSourceOptions;
  };
  image: {
    impl: ImageSource;
    option: ImageSourceOptions;
  };
  video: {
    impl: VideoSource;
    option: VideoSourceOptions;
  };
  canvas: {
    impl: CanvasSource;
    option: CanvasSourceOptions;
  };
};

export class Source<T extends keyof MapSource, TLayerID extends string = string> {
  private m: Map | undefined;

  static from<T extends keyof MapSource>(type: T, opts: MapSource[T]["option"]): Source<T> {
    const t = type === "rasterDem" ? "raster-dem" : type;
    return new Source<T>({ ...opts, type: t } as any);
  }

  constructor(private opts: MapSource[T]["option"] & { type: ISource }, public id: string = uuid()) {}

  get(): MapSource[T]["impl"] | null {
    if (!this.m) return null;
    return this.m.getSource(this.id) as MapSource[T]["impl"];
  }

  named(id?: string) {
    return new Source<T, TLayerID>(this.opts, id);
  }

  addTo(m: Map) {
    if (m.getSource(this.id)) {
      return this;
    }
    this.m = m.addSource(this.id, this.opts as any);
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
