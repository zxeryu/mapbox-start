import { Vue, Component, Provide, Inject, Watch } from "vue-property-decorator";
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

type TType = keyof MapLayerLP;

@Component
class SpecLayer<T extends keyof MapLayerLP> extends Vue {
  id?: string;
  sourceLayer?: string;
  layerRef?: string;
  paint?: MapLayerLP[T]["paint"];
  layout?: MapLayerLP[T]["layout"];
  metadata?: any;
  minzoom?: number;
  maxzoom?: number;
  interactive?: boolean;
  filter?: any[];
  before?: string;

  @Inject() map!: Map;
  @Inject() source!: Source<any>;

  protected type!: TType;

  private layer: Layer | undefined;

  mounted() {
    const t = this.type === "fillExtrusion" ? "fill-extrusion" : this.type;
    this.layer = Layer.from(this.source, this.sourceLayer)
      .named(this.id)
      .clone({
        type: t,
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
    return createElement("div", createElement(LayerProvide, { props: { value: this.layer } }, this.$slots.default));
  }
}

@Component
export class SpecLayerBackground extends SpecLayer<"background"> {
  type: TType = "background";
}

@Component
export class SpecLayerFill extends SpecLayer<"fill"> {
  type: TType = "fill";
}

@Component
export class SpecLayerFillExtrusion extends SpecLayer<"fillExtrusion"> {
  type: TType = "fillExtrusion";
}

@Component
export class SpecLayerLine extends SpecLayer<"line"> {
  type: TType = "line";
}

@Component
export class SpecLayerSymbol extends SpecLayer<"symbol"> {
  type: TType = "symbol";
}

@Component
export class SpecLayerRaster extends SpecLayer<"raster"> {
  type: TType = "raster";
}

@Component
export class SpecLayerCircle extends SpecLayer<"circle"> {
  type: TType = "circle";
}

@Component
export class SpecLayerHeatmap extends SpecLayer<"heatmap"> {
  type: TType = "heatmap";
}

@Component
export class SpecLayerHillShade extends SpecLayer<"hillshade"> {
  type: TType = "hillshade";
}
