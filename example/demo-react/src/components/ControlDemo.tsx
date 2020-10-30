import { CheckControl } from "../MapDemo";
import React, { useMemo } from "react";
import { useMap, MapboxGL } from "@mapbox-start/react-bridge";

const ControlFullScreen = () => {
  const map = useMap();

  const fsc = useMemo(() => new MapboxGL.FullscreenControl(), []);

  return (
    <CheckControl
      name={"fullscreen"}
      defaultCheck={false}
      onChange={(state) => {
        if (state) {
          map.addControl(fsc);
        } else {
          map.removeControl(fsc);
        }
      }}
    />
  );
};

const ControlNavigation = () => {
  const map = useMap();

  const nc = useMemo(() => new MapboxGL.NavigationControl(), []);

  return (
    <CheckControl
      name={"navigation"}
      defaultCheck={false}
      onChange={(state) => {
        if (state) {
          map.addControl(nc, "bottom-right");
        } else {
          map.removeControl(nc);
        }
      }}
    />
  );
};

export const ControlDemo = () => {
  return (
    <>
      <ControlFullScreen />
      <ControlNavigation />
    </>
  );
};
