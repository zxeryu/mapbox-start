import { Vue, Component, Inject, Prop, Provide, Watch } from "vue-property-decorator";
import {
  CanvasSource,
  CanvasSourceOptions,
  GeoJSONSource,
  GeoJSONSourceOptions,
  ImageSource,
  ImageSourceOptions,
  Map,
  Popup,
  PromoteIdSpecification,
  RasterDemSource,
  RasterSource,
  VectorSource,
  VectorSourceImpl,
  VideoSource,
  VideoSourceOptions,
} from "mapbox-gl";
import { CreateElement, VNode } from "vue";
import { Provider, Source } from "../core";
import { get } from "lodash";

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
    option: Omit<GeoJSONSourceOptions, "data"> & { data?: any };
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

@Component
class SourceProvide extends Provider<Source<any>> {
  @Provide("source") p: Popup = get(this.$options.propsData, "value");
}

@Component
class SpecSource<T extends keyof MapSource> extends Vue {
  @Prop() id?: string;

  @Inject() map!: Map;

  protected type!: T;

  protected source: Source<T> | undefined;

  data(): object {
    return {
      source: undefined,
    };
  }

  mounted() {
    this.source = Source.from(this.type, this.$options.propsData as MapSource[T]["option"])
      .named(this.id)
      .addTo(this.map);
  }

  beforeDestroy() {
    this.source && this.source.remove();
  }

  render(createElement: CreateElement): VNode {
    return createElement(
      "div",
      this.source ? [createElement(SourceProvide, { props: { value: this.source } }, this.$slots.default)] : undefined,
    );
  }
}

@Component
export class SpecSourceGeoJSON extends SpecSource<"geojson"> {
  @Prop() data: any;
  @Prop() maxzoom?: number;
  @Prop() attribution?: string;
  @Prop() buffer?: number;
  @Prop() tolerance?: number;
  @Prop() cluster?: number | boolean;
  @Prop() clusterRadius?: number;
  @Prop() clusterMaxZoom?: number;
  @Prop() clusterMinPoints?: number;
  @Prop() clusterProperties?: object;
  @Prop() lineMetrics?: boolean;
  @Prop() generateId?: boolean;
  @Prop() promoteId?: PromoteIdSpecification;
  @Prop() filter?: any;

  type: "geojson" = "geojson";

  @Watch("data")
  onDataChange() {
    if (!this.source) return;
    const s = this.source.get() as MapSource["geojson"]["impl"];
    if (!s) return;
    if (!this.data) return;
    s.setData(this.data);
  }
}

@Component
export class SpecSourceVector extends SpecSource<"vector"> {
  @Prop() url?: string;
  @Prop() tiles?: string[];
  @Prop() bounds?: number[];
  @Prop() scheme?: "xyz" | "tms";
  @Prop() minzoom?: number;
  @Prop() maxzoom?: number;
  @Prop() attribution?: string;
  @Prop() promoteId?: PromoteIdSpecification;

  type: "vector" = "vector";
}
@Component
export class SpecSourceImage extends SpecSource<"image"> {
  @Prop() url?: string;
  @Prop() coordinates?: number[][];

  type: "image" = "image";
}
@Component
export class SpecSourceCanvas extends SpecSource<"canvas"> {
  @Prop() coordinates!: number[][];
  @Prop() animate?: boolean;
  @Prop() canvas!: string | HTMLCanvasElement;

  type: "canvas" = "canvas";
}
@Component
export class SpecSourceRaster extends SpecSource<"raster"> {
  @Prop() url?: string;
  @Prop() tiles?: string[];
  @Prop() bounds?: number[];
  @Prop() minzoom?: number;
  @Prop() maxzoom?: number;
  @Prop() tileSize?: number;
  @Prop() scheme?: "xyz" | "tms";
  @Prop() attribution?: string;

  type: "raster" = "raster";
}
@Component
export class SpecSourceRasterDem extends SpecSource<"rasterDem"> {
  @Prop() url?: string;
  @Prop() tiles?: string[];
  @Prop() bounds?: number[];
  @Prop() minzoom?: number;
  @Prop() maxzoom?: number;
  @Prop() tileSize?: number;
  @Prop() attribution?: string;
  @Prop() encoding?: "terrarium" | "mapbox";

  type: "rasterDem" = "rasterDem";
}
@Component
export class SpecSourceVideo extends SpecSource<"video"> {
  @Prop() urls?: string[];
  @Prop() coordinates?: number[][];

  type: "video" = "video";
}
