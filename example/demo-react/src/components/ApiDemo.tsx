import { backHome, CheckControl } from "../MapDemo";
import React from "react";
import { useMap } from "@mapbox-start/react-bridge";

const ApiFlyTo = () => {
  const map = useMap();
  return (
    <CheckControl
      name={"flyTo"}
      defaultCheck={false}
      onChange={(state) => {
        if (state) {
          map.flyTo({ center: [-87.61694, 41.86625], zoom: 10 });
        } else {
          backHome(map);
        }
      }}
    />
  );
};

const ApiFitBounds = () => {
  const map = useMap();
  return (
    <CheckControl
      defaultCheck={false}
      name={"fitBounds"}
      onChange={(state) => {
        if (state) {
          map.fitBounds([
            [32.958984, -5.353521],
            [43.50585, 5.615985],
          ]);
        } else {
          backHome(map);
        }
      }}
    />
  );
};

export const ApiDemo = () => {
  return (
    <>
      <ApiFlyTo />
      <ApiFitBounds />
    </>
  );
};
