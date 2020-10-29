import React, { useMemo } from "react";
import {
  SpecLayerCircle,
  SpecSourceGeoJSON,
  SpecLayerEvent,
  SpecLayerHoverCursorToggle,
} from "@mapbox-start/react-bridge";
import { featureCollection, point } from "@turf/turf";
import { CheckControl } from "../MapDemo";

export const LayerSymbol = () => {
  const points = useMemo(() => [point([-5, 0], { name: "111" }), point([-5, 2], { name: "222" })], []);

  return (
    <SpecSourceGeoJSON data={featureCollection(points) as any}>
      <SpecLayerCircle paint={{ "circle-color": "black", "circle-radius": 6 }}>
        <SpecLayerHoverCursorToggle />
        <SpecLayerEvent
          eventName={"click"}
          listener={(e) => {
            if (e.features && e.features[0]) {
              console.log("@@@@@@ layer click", e.features[0].properties);
            }
          }}
        />
      </SpecLayerCircle>
    </SpecSourceGeoJSON>
  );
};

export const LayerDemo = () => {
  return (
    <>
      <CheckControl name={"symbol"}>
        <LayerSymbol />
      </CheckControl>
    </>
  );
};
