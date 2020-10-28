import { useMap } from "./Map";
import React, { useCallback, useEffect, useMemo } from "react";
import { EventData, MapboxGeoJSONFeature, MapEventType, MapLayerEventType, MapLayerMouseEvent } from "mapbox-gl";
import { useSpecLayer } from "./component";
import { Dictionary, forEach } from "lodash";

export const SpecEvent = <T extends keyof MapEventType>({
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

export const SpecLayerEvent = <T extends keyof MapLayerEventType>({
  eventName,
  listener,
}: {
  eventName: T;
  listener: (ev: MapLayerEventType[T] & EventData) => void;
}) => {
  const m = useMap();
  const layer = useSpecLayer();
  useEffect(() => {
    m.on(eventName, layer.id, listener);
    return () => {
      m.off(eventName, layer.id, listener);
    };
  }, []);
  return null;
};

export const SpecLayerHoverCursorToggle = () => {
  const hoveredFeatures: Dictionary<MapboxGeoJSONFeature> = useMemo(() => ({}), []);
  const handleEnter = useCallback((e: MapLayerMouseEvent) => {
    const m = e.target;
    m.getCanvas().style.cursor = "pointer";
    forEach(e.features, (f) => {
      if (f.id) {
        hoveredFeatures[f.id] = f;
        m.setFeatureState(f, { hover: true });
      }
    });
  }, []);
  const handleLeave = useCallback((e: MapLayerMouseEvent) => {
    const m = e.target;
    m.getCanvas().style.cursor = "";
    forEach(hoveredFeatures, (f, id) => {
      delete hoveredFeatures[id];
      m.setFeatureState(f, { hover: false });
    });
  }, []);
  return (
    <>
      <SpecLayerEvent eventName={"mouseenter"} listener={handleEnter} />
      <SpecLayerEvent eventName={"mouseleave"} listener={handleLeave} />
    </>
  );
};
