import React, { createContext, ReactNode, useContext, useEffect, useMemo, useRef } from "react";
import { MapboxGL, useMap } from "../Map";
import { LngLatLike, PopupOptions } from "mapbox-gl";

const PopupContext = createContext<{
  popup?: typeof MapboxGL.Popup;
}>({} as any);

export const usePopup = () => useContext(PopupContext);

export interface IPopup extends PopupOptions {
  lngLat: LngLatLike;
  children: ReactNode;
  onClose?: () => void;
  onOpen?: () => void;
}

export const SpecPopup = ({ children, lngLat, onOpen, onClose, ...options }: IPopup) => {
  const map = useMap();
  const ref = useRef<HTMLDivElement>(null);
  const popup = useMemo(() => {
    return new MapboxGL.Popup({ ...options });
  }, []);
  useEffect(() => {
    if (ref.current) {
      popup.setDOMContent(ref.current);
    }
    popup.setLngLat(lngLat);
    popup.addTo(map);
    return () => {
      popup.remove();
    };
  }, [lngLat]);

  useEffect(() => {
    const handleClose = () => {
      onClose && onClose();
    };
    const handleOpen = () => {
      onOpen && onOpen();
    };
    popup.on("close", handleClose);
    popup.on("open", handleOpen);
    return () => {
      popup.off("close", handleClose);
      popup.off("open", handleOpen);
    };
  }, []);

  return (
    <div ref={ref}>
      <PopupContext.Provider value={{ popup: popup as any }}>{children}</PopupContext.Provider>
    </div>
  );
};
