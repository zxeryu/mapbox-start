import React, { createContext, ReactNode, useContext, useEffect, useMemo } from "react";
import { useMap } from "../Map";
import {
  CanvasSource,
  CanvasSourceOptions,
  GeoJSONSource,
  GeoJSONSourceOptions,
  ImageSource,
  ImageSourceOptions,
  RasterDemSource,
  RasterSource,
  VectorSource,
  VectorSourceImpl,
  VideoSource,
  VideoSourceOptions,
} from "mapbox-gl";
import { Source } from "../core";

const SpecSourceContext = createContext<{ source: Source<keyof MapSource> }>({} as any);

export const useSpecSource = () => useContext(SpecSourceContext).source;

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

interface ISource {
  children: ReactNode;
  id?: string;
}

const createSource = <T extends keyof MapSource>(type: T) => {
  return ({ children, id, ...opts }: ISource & MapSource[T]["option"]) => {
    const map = useMap();
    const source = useMemo(() => Source.from(type, opts).named(id).addTo(map), []);
    useEffect(() => {
      return () => {
        source && source.remove();
      };
    }, []);
    return (
      <SpecSourceContext.Provider key={source.id} value={{ source }}>
        {children}
      </SpecSourceContext.Provider>
    );
  };
};

const SourceGeoJson = createSource("geojson");
const SourceGeoJsonSubData = ({ data }: { data: MapSource["geojson"]["option"]["data"] }) => {
  const source = useSpecSource();
  useEffect(() => {
    const s = source.get() as MapSource["geojson"]["impl"];
    if (s && data) {
      s.setData(data);
    }
  }, [data]);
  return null;
};

export const SpecSourceGeoJSON = ({ children, id, ...opts }: ISource & MapSource["geojson"]["option"]) => {
  return (
    <SourceGeoJson id={id} {...opts}>
      <SourceGeoJsonSubData data={opts.data} />
      {children}
    </SourceGeoJson>
  );
};
export const SpecSourceVector = createSource("vector");
export const SpecSourceImage = createSource("image");
export const SpecSourceCanvas = createSource("canvas");
export const SpecSourceRaster = createSource("raster");
export const SpecSourceRasterDem = createSource("rasterDem");
export const SpecSourceVideo = createSource("video");
