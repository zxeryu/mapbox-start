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
  Layer as ILayer,
  LineLayout,
  LinePaint,
  RasterLayout,
  RasterPaint,
  SymbolLayout,
  SymbolPaint,
} from "mapbox-gl";
import React, { createContext, ReactNode, useContext, useEffect, useMemo } from "react";
import { Layer } from "../Layer";
import { useMap } from "../Map";
import { useSpecSource } from "./Sources";

const SpecLayerContext = createContext<{ layer: Layer }>({} as any);

export const useSpecLayer = () => useContext(SpecLayerContext).layer;

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

interface ISpecLayer<T extends keyof MapLayerLP> {
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
  refreshBy?: any[];
  children?: ReactNode;
}

const createLayer = <T extends keyof MapLayerLP>(type: T) => {
  return ({
    id,
    sourceLayer,
    metadata,
    layerRef,
    minzoom,
    maxzoom,
    interactive,
    filter,
    layout,
    paint,
    //
    before,
    refreshBy,
    children,
  }: ISpecLayer<T>) => {
    const map = useMap();
    const source = useSpecSource();
    const layer = useMemo(() => Layer.from(source, sourceLayer).named(id).addTo(map), []);
    useEffect(() => {
      return () => {
        layer && layer.remove();
      };
    }, []);
    useEffect(() => {
      const t = type === "fillExtrusion" ? "fill-extrusion" : type;
      const l = layer.clone({
        type: t as ILayer["type"],
        metadata,
        minzoom,
        maxzoom,
        interactive,
        filter,
        layout,
        paint,
        ref: layerRef,
      });
      l.addTo(map, before);
    }, refreshBy);

    return (
      <SpecLayerContext.Provider key={layer.id} value={{ layer }}>
        {children}
      </SpecLayerContext.Provider>
    );
  };
};

export const SpecLayerBackground = createLayer("background");
export const SpecLayerFill = createLayer("fill");
export const SpecLayerFillExtrusion = createLayer("fillExtrusion");
export const SpecLayerLine = createLayer("line");
export const SpecLayerSymbol = createLayer("symbol");
export const SpecLayerRaster = createLayer("raster");
export const SpecLayerCircle = createLayer("circle");
export const SpecHeatmap = createLayer("heatmap");
export const SpecHillShade = createLayer("hillshade");
