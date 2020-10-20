import M, { Map, MapboxOptions } from "mapbox-gl";
import React, { createContext, CSSProperties, ReactNode, useContext, useEffect, useRef, useState } from "react";

export const MapboxGL: typeof M = M || window.mapboxgl;

const MapContext = createContext<{
  map: Map;
}>({} as any);

export const useMap = () => useContext(MapContext).map;

export type TMapbox = Omit<MapboxOptions, "container"> & {
  children: ReactNode;
  divStyle?: CSSProperties;
};

export const Mapbox = ({ children, divStyle, ...options }: TMapbox) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map>();

  useEffect(() => {
    if (ref.current && !map) {
      const map = new MapboxGL.Map({ ...options, container: ref.current });
      map.once("load", () => {
        setMap(map);
      });
    }
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", ...divStyle }} ref={ref}>
      {map && <MapContext.Provider value={{ map }}>{children}</MapContext.Provider>}
    </div>
  );
};
