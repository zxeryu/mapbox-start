import React, { useState } from "react";
import {
  MapboxGL,
  SpecLayerCircle,
  SpecLayerEvent,
  SpecLayerHoverCursorToggle,
  SpecMap,
  SpecMarker,
  SpecPopup,
  SpecSourceGeoJson,
  TopLeftContainer,
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

const pointsOne = [point([-5, 0], { name: "111" }), point([-5, 2], { name: "222" })];
const pointsTwo = [point([-7, 0], { name: "111" }), point([-7, 2], { name: "222" })];

const SourceLayerTest = () => {
  const [points, setPoints] = useState(pointsOne);

  return (
    <TopLeftContainer>
      <div>
        <button
          onClick={() => {
            setPoints((prevState) => (prevState === pointsOne ? pointsTwo : pointsOne));
          }}>
          change geojson data
        </button>
        <SpecSourceGeoJson data={featureCollection(points) as any}>
          <SpecLayerCircle id={"zhaoxi"} paint={{ "circle-color": "black", "circle-radius": 6 }}>
            <SpecLayerHoverCursorToggle />
            <SpecLayerEvent
              eventName={"click"}
              listener={(e) => {
                if (e.features && e.features[0]) {
                  console.log("----layer click----", e.features[0].properties);
                }
              }}
            />
          </SpecLayerCircle>
        </SpecSourceGeoJson>
      </div>
    </TopLeftContainer>
  );
};

export const MapDemo = () => {
  return (
    <SpecMap style={"mapbox://styles/mapbox/streets-v11"} divStyle={{ backgroundColor: "pink", height: "100vh" }}>
      <MarkerTest />
      <PopupTest />
      <SourceLayerTest />
    </SpecMap>
  );
};
