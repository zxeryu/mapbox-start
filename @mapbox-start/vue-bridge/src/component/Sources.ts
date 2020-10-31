import { Vue, Component, Inject, Prop, Provide, Watch } from "vue-property-decorator";
import { Map, Popup, PromoteIdSpecification } from "mapbox-gl";
import { MapSource, Source } from "../Source";
import { CreateElement, VNode } from "vue";
import { Provider } from "../core";
import { get } from "lodash";

class SourceProvide extends Provider<Source<keyof MapSource>> {
  @Provide("source") p: Popup = get(this.$options.propsData, "value");
}

type TType = keyof MapSource;

@Component
class SpecSource<T extends keyof MapSource> extends Vue {
  @Prop() id?: string;

  @Inject() map!: Map;

  protected type!: TType;

  protected source: Source<keyof MapSource> | undefined;

  mounted() {
    this.source = Source.from(this.type, this.$options.propsData as MapSource[T]["option"])
      .named(this.id)
      .addTo(this.map);
  }

  beforeDestroy() {
    this.source && this.source.remove();
  }

  render(createElement: CreateElement): VNode {
    return createElement("div", createElement(SourceProvide, { props: { value: this.source } }, this.$slots.default));
  }
}

export class SpecSourceGeoJSON extends SpecSource<"geojson"> {
  @Prop() data?: any;
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

  type: TType = "geojson";

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

  type: TType = "vector";
}
@Component
export class SpecSourceImage extends SpecSource<"image"> {
  @Prop() url?: string;
  @Prop() coordinates?: number[][];

  type: TType = "image";
}
@Component
export class SpecSourceCanvas extends SpecSource<"canvas"> {
  @Prop() coordinates!: number[][];
  @Prop() animate?: boolean;
  @Prop() canvas!: string | HTMLCanvasElement;

  type: TType = "canvas";
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

  type: TType = "raster";
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

  type: TType = "rasterDem";
}
@Component
export class SpecSourceVideo extends SpecSource<"video"> {
  @Prop() urls?: string[];
  @Prop() coordinates?: number[][];

  type: TType = "video";
}
