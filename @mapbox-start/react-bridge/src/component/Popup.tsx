import React, { createContext, ReactNode, useContext, useEffect, useMemo, useRef } from "react";
import { MapboxGL } from "../Map";
import { LngLatLike, PopupOptions } from "mapbox-gl";

const PopupContext = createContext<{
  popup?: typeof MapboxGL.Popup;
}>({} as any);

export const usePopup = () => useContext(PopupContext);

export interface IPopup extends PopupOptions {
  lngLat: LngLatLike;
  children: ReactNode;
}

export const SpecPopup = ({ children, lngLat, ...options }: IPopup) => {
  const ref = useRef<HTMLDivElement>(null);
  const popup: any = useMemo(() => {
    return new MapboxGL.Popup({ ...options });
  }, []);
  useEffect(() => {
    if (ref.current) {
      popup.setDOMContent(ref.current);
    }
    popup.setLngLat(lngLat);
  }, [lngLat]);

  return (
    <div ref={ref}>
      <PopupContext.Provider value={{ popup }}>{children}</PopupContext.Provider>
    </div>
  );
};
