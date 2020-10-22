import React, { useMemo } from "react";
import {
  MapboxGL,
  SpecLayerCircle,
  SpecMap,
  SpecMarker,
  SpecPopup,
  SpecSourceGeoJson,
} from "@mapbox-start/react-bridge";
import { point, featureCollection } from "@turf/turf";

MapboxGL.accessToken = "pk.eyJ1IjoiZXJ5dSIsImEiOiJjazZybDNjbHEwNWY1M2Vtcnl3c3dqemNoIn0.GKMcdxRq_GrdMFmoUCXvYQ";

const MarkerTest = () => {
  return (
    <>
      <SpecMarker lngLat={[0, 2]} color={"red"} />
      <SpecMarker lngLat={[0, 0]}>
        <div style={{ color: "red" }}>marker</div>
      </SpecMarker>
    </>
  );
};

const PopupTest = () => {
  return (
    <SpecPopup
      lngLat={[5, 0]}
      onClose={() => {
        console.log("@@@@@@ popup closed");
      }}>
      <div style={{ color: "red" }}>popup content</div>
    </SpecPopup>
  );
};

const SourceLayerTest = () => {
  const data = useMemo(() => [point([-5, 0]), point([-5, 2])], []);
  return (
    <SpecSourceGeoJson data={featureCollection(data) as any}>
      <SpecLayerCircle id={"zhaoxi"} paint={{ "circle-color": "black", "circle-radius": 6 }} />
    </SpecSourceGeoJson>
  );
};

export const MapDemo = () => {
  return (
    <SpecMap style={"mapbox://styles/mapbox/streets-v11"} divStyle={{ backgroundColor: "pink", height: "90vh" }}>
      <MarkerTest />
      <PopupTest />
      <SourceLayerTest />
    </SpecMap>
  );
};
