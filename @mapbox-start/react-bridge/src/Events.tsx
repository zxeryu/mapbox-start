import { useMap } from "./Map";
import { useEffect } from "react";
import { EventData, MapEventType, MapLayerEventType } from "mapbox-gl";

export const Event = <T extends keyof MapEventType>({
  eventName,
  listener,
}: {
  eventName: T;
  listener: (ev: MapEventType[T] & EventData) => void;
}) => {
  const m = useMap();
  useEffect(() => {
    m.on(eventName, listener);
    return () => {
      m.off(eventName, listener);
    };
  }, []);
  return null;
};

export const LayerEvent = <T extends keyof MapLayerEventType>({
  eventName,
  layer,
  listener,
}: {
  eventName: T;
  layer: string;
  listener: (ev: MapLayerEventType[T] & EventData) => void;
}) => {
  const m = useMap();
  useEffect(() => {
    m.on(eventName, layer, listener);
    return () => {
      m.off(eventName, layer, listener);
    };
  }, []);
  return null;
};
