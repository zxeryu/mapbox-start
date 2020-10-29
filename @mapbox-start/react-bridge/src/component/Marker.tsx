import React, { createContext, ReactNode, useContext, useEffect, useMemo } from "react";
import { LngLatLike, MarkerOptions, Marker, MapboxEvent } from "mapbox-gl";
import { MapboxGL, useMap } from "../Map";
import { createPortal } from "react-dom";
import { useSpecPopup } from "./Popup";

const MarkerContext = createContext<{
  marker: Marker;
}>({} as any);

export const useSpecMarker = () => useContext(MarkerContext).marker;

export interface IMarker extends Omit<MarkerOptions, "element"> {
  lngLat: LngLatLike;
  children?: ReactNode;
  original?: boolean;
  onDrag?: (marker: Marker, e: MapboxEvent) => void;
  onDragStart?: (marker: Marker, e: MapboxEvent) => void;
  onDragEnd?: (marker: Marker, e: MapboxEvent) => void;
}

export const SpecMarker = ({
  children,
  lngLat,
  original = false,
  onDrag,
  onDragStart,
  onDragEnd,
  ...options
}: IMarker) => {
  const map = useMap();
  const popup = useSpecPopup();

  const { marker, $mount } = useMemo(() => {
    if (!original && children) {
      const $mount = document.createElement("div");
      return { marker: new MapboxGL.Marker($mount, { ...options }), $mount };
    } else {
      return { marker: new MapboxGL.Marker({ ...options }) };
    }
  }, []);

  useEffect(() => {
    lngLat && marker.setLngLat(lngLat);
  }, [lngLat]);

  useEffect(() => {
    marker.addTo(map);
    return () => {
      marker && marker.remove();
    };
  }, []);

  useEffect(() => {
    popup && marker.setPopup(popup);
  }, [popup]);

  useEffect(() => {
    const handleDrag = (e: MapboxEvent) => onDrag && onDrag(marker, e);
    const handleDragStart = (e: MapboxEvent) => onDragStart && onDragStart(marker, e);
    const handleDragEnd = (e: MapboxEvent) => onDragEnd && onDragEnd(marker, e);

    marker.on("drag", handleDrag);
    marker.on("dragstart", handleDragStart);
    marker.on("dragend", handleDragEnd);
    return () => {
      marker.off("drag", handleDrag);
      marker.off("dragstart", handleDragStart);
      marker.off("dragend", handleDragEnd);
    };
  }, []);

  if ($mount) {
    return createPortal(<MarkerContext.Provider value={{ marker }}>{children}</MarkerContext.Provider>, $mount);
  }

  return <MarkerContext.Provider value={{ marker }}>{children}</MarkerContext.Provider>;
};
