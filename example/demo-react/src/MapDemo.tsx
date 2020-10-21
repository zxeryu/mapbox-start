import React from "react";
import { MapboxGL, SpecMap, SpecMarker, SpecPopup } from "@mapbox-start/react-bridge";

MapboxGL.accessToken = "pk.eyJ1IjoiZXJ5dSIsImEiOiJjazZybDNjbHEwNWY1M2Vtcnl3c3dqemNoIn0.GKMcdxRq_GrdMFmoUCXvYQ";

export const MarkerTest = () => {
  return (
    <>
      <SpecMarker lngLat={[0, 2]} color={"red"} />
      <SpecMarker lngLat={[0, 0]}>
        <div style={{ color: "red" }}>marker</div>
      </SpecMarker>
    </>
  );
};

export const PopupTest = () => {
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

export const MapDemo = () => {
  return (
    <SpecMap style={"mapbox://styles/mapbox/streets-v11"} divStyle={{ backgroundColor: "pink", height: "90vh" }}>
      <MarkerTest />
      <PopupTest />
    </SpecMap>
  );
};
