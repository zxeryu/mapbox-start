import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { LngLatLike, MarkerOptions } from "mapbox-gl";
import { MapboxGL, useMap } from "../Map";

export interface IMarker extends Omit<MarkerOptions, "element"> {
  lngLat: LngLatLike;
  children: ReactNode;
}

export interface IMarkerContext {
  marker?: typeof MapboxGL.Marker;
}

const MarkerContext = createContext<IMarkerContext>({} as any);

export const useMarker = () => useContext(MarkerContext).marker;

export const Marker = ({ children, lngLat, ...options }: IMarker) => {
  const map = useMap();
  const ref = useRef<HTMLDivElement>(null);
  const [marker, setMarker] = useState<typeof MapboxGL.Marker>();
  useEffect(() => {
    if (!ref.current) return;
    const marker = new MapboxGL.Marker(ref.current, { ...options });
    marker.setLngLat(lngLat);
    marker.addTo(map);
    setMarker(marker as any);
    return () => {
      marker && marker.remove();
    };
  }, []);
  return (
    <div ref={ref}>
      <MarkerContext.Provider value={{ marker }}>{children}</MarkerContext.Provider>
    </div>
  );
};
