import { Vue, Component, Provide, Inject, Watch, Prop } from "vue-property-decorator";
import {
  BackgroundLayout,
  BackgroundPaint,
  CircleLayout,
  CirclePaint,
  FillExtrusionLayout,
  FillExtrusionPaint,
  FillLayout,
  FillPaint,
  HeatmapLayout,
  HeatmapPaint,
  HillshadeLayout,
  HillshadePaint,
  LineLayout,
  LinePaint,
  Map,
  Popup,
  RasterLayout,
  RasterPaint,
  SymbolLayout,
  SymbolPaint,
  Layer as ILayer,
} from "mapbox-gl";
import { CreateElement, VNode } from "vue";
import { Provider } from "../core";
import { Layer } from "../Layer";
import { get } from "lodash";
import { Source } from "../Source";

@Component
class LayerProvide extends Provider<Layer> {
  @Provide("layer") p: Popup = get(this.$options.propsData, "value");
}

type MapLayerLP = {
  background: {
    layout: BackgroundLayout;
    paint: BackgroundPaint;
  };
  fill: {
    layout: FillLayout;
    paint: FillPaint;
  };
  fillExtrusion: {
    layout: FillExtrusionLayout;
    paint: FillExtrusionPaint;
  };
  line: {
    layout: LineLayout;
    paint: LinePaint;
  };
  symbol: {
    layout: SymbolLayout;
    paint: SymbolPaint;
  };
  raster: {
    layout: RasterLayout;
    paint: RasterPaint;
  };
  circle: {
    layout: CircleLayout;
    paint: CirclePaint;
  };
  heatmap: {
    layout: HeatmapLayout;
    paint: HeatmapPaint;
  };
  hillshade: {
    layout: HillshadeLayout;
    paint: HillshadePaint;
  };
};

@Component
class SpecLayer<T extends keyof MapLayerLP> extends Vue {
  @Prop() id?: string;
  @Prop() sourceLayer?: string;
  @Prop() layerRef?: string;
  @Prop() paint?: MapLayerLP[T]["paint"];
  @Prop() layout?: MapLayerLP[T]["layout"];
  @Prop() metadata?: any;
  @Prop() minzoom?: number;
  @Prop() maxzoom?: number;
  @Prop() interactive?: boolean;
  @Prop() filter?: any[];
  @Prop() before?: string;

  @Inject() map!: Map;
  @Inject("source") source!: Source<any>;

  protected type!: T;

  private layer: Layer | undefined;

  data(): object {
    return { layer: undefined };
  }

  mounted() {
    const t = this.type === "fillExtrusion" ? "fill-extrusion" : this.type;
    this.layer = Layer.from(this.source, this.sourceLayer)
      .named(this.id)
      .clone({
        type: t as ILayer["type"],
        metadata: this.metadata,
        minzoom: this.minzoom,
        maxzoom: this.maxzoom,
        interactive: this.interactive,
        filter: this.filter,
        layout: this.layout,
        paint: this.paint,
        ref: this.layerRef,
      })
      .addTo(this.map, this.before);
  }

  beforeDestroy() {
    this.layer && this.layer.remove();
  }

  @Watch("layout")
  onLayoutChange() {
    const l = this.layer?.clone({ layout: this.layout });
    l?.addTo(this.map, this.before);
  }
  @Watch("paint")
  onPaintChange() {
    const l = this.layer?.clone({ paint: this.paint });
    l?.addTo(this.map, this.before);
  }
  @Watch("filter")
  onFilterChange() {
    const l = this.layer?.clone({ filter: this.filter });
    l?.addTo(this.map, this.before);
  }

  render(createElement: CreateElement): VNode {
    return createElement(
      "div",
      this.layer ? [createElement(LayerProvide, { props: { value: this.layer } }, this.$slots.default)] : undefined,
    );
  }
}

@Component
export class SpecLayerBackground extends SpecLayer<"background"> {
  type: "background" = "background";
}

@Component
export class SpecLayerFill extends SpecLayer<"fill"> {
  type: "fill" = "fill";
}

@Component
export class SpecLayerFillExtrusion extends SpecLayer<"fillExtrusion"> {
  type: "fillExtrusion" = "fillExtrusion";
}

@Component
export class SpecLayerLine extends SpecLayer<"line"> {
  type: "line" = "line";
}

@Component
export class SpecLayerSymbol extends SpecLayer<"symbol"> {
  type: "symbol" = "symbol";
}

@Component
export class SpecLayerRaster extends SpecLayer<"raster"> {
  type: "raster" = "raster";
}

@Component
export class SpecLayerCircle extends SpecLayer<"circle"> {
  type: "circle" = "circle";
}

@Component
export class SpecLayerHeatmap extends SpecLayer<"heatmap"> {
  type: "heatmap" = "heatmap";
}

@Component
export class SpecLayerHillShade extends SpecLayer<"hillshade"> {
  type: "hillshade" = "hillshade";
}
