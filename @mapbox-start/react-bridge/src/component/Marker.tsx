import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { LngLatLike, MarkerOptions } from "mapbox-gl";
import { MapboxGL, useMap } from "../Map";

const MarkerContext = createContext<{
  marker?: typeof MapboxGL.Marker;
}>({} as any);

export const useMarker = () => useContext(MarkerContext).marker;

export interface IMarker extends Omit<MarkerOptions, "element"> {
  lngLat: LngLatLike;
  children?: ReactNode;
}

export const SpecMarker = ({ children, lngLat, ...options }: IMarker) => {
  const map = useMap();
  const ref = useRef<HTMLDivElement>(null);
  const [marker, setMarker] = useState<any>();

  useEffect(() => {
    if (!children) {
      setMarker(new MapboxGL.Marker({ ...options }));
    }
    if (ref.current && children) {
      setMarker(new MapboxGL.Marker(ref.current, { ...options }));
    }
  }, []);

  useEffect(() => {
    if (!marker) return;
    marker.setLngLat(lngLat);
    marker.addTo(map);
    return () => {
      marker && marker.remove();
    };
  }, [marker, lngLat]);

  if (!children) {
    return null;
  }

  return (
    <div ref={ref}>
      <MarkerContext.Provider value={{ marker }}>{children}</MarkerContext.Provider>
    </div>
  );
};
