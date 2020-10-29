import React, { createContext, ReactNode, useContext, useEffect, useMemo } from "react";
import { MapboxGL, useMap } from "../Map";
import { LngLatLike, PopupOptions, Popup } from "mapbox-gl";
import { createPortal } from "react-dom";

const PopupContext = createContext<{
  popup: Popup;
}>({} as any);

export const useSpecPopup = () => useContext(PopupContext).popup;

export interface IPopup extends PopupOptions {
  lngLat?: LngLatLike;
  children: ReactNode;
  onClose?: () => void;
  onOpen?: () => void;
}

export const SpecPopup = ({ children, lngLat, onOpen, onClose, ...options }: IPopup) => {
  const map = useMap();
  const { popup, $mount } = useMemo(() => {
    const $mount = document.createElement("div");
    return { popup: new MapboxGL.Popup({ ...options }), $mount };
  }, []);
  useEffect(() => {
    popup.setDOMContent($mount);
    popup.addTo(map);
    return () => {
      popup.remove();
    };
  }, []);

  useEffect(() => {
    lngLat && popup.setLngLat(lngLat);
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

  return createPortal(<PopupContext.Provider value={{ popup: popup }}>{children}</PopupContext.Provider>, $mount);
};
