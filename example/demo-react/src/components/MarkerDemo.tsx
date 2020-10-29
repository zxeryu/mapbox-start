import React, { useCallback, useEffect, useState } from "react";
import { SpecMarker, SpecPopup } from "@mapbox-start/react-bridge";
import { CheckControl } from "../MapDemo";

const MarkerDefault = () => <SpecMarker original lngLat={[2, 0]} />;

const MarkerCustom = () => (
  <SpecMarker lngLat={[0, 0]}>
    <div style={{ color: "red" }}>
      custom
      <br />
      marker
    </div>
  </SpecMarker>
);

const MarkerWithPopup = () => (
  <SpecPopup
    onOpen={() => {
      console.log("@@@@@@ popup open");
    }}
    onClose={() => {
      console.log("@@@@@@ popup closed");
    }}>
    <div style={{ color: "red" }}>popup content</div>
    <SpecMarker original lngLat={[4, 0]} color={"blue"} />
  </SpecPopup>
);

const MarkerDraggable = () => {
  const [lngLat, setLngLat] = useState<[number, number]>([6, 0]);
  return (
    <SpecMarker
      lngLat={lngLat}
      draggable={true}
      onDragEnd={(marker, e) => {
        const ll = marker.getLngLat();
        console.log("@@@@@ drag end e=", e, "lngLat=", ll);
        setLngLat([ll.lng, ll.lat]);
      }}
    />
  );
};

const MarkerAnimate = () => {
  const [lngLat, setLngLat] = useState<[number, number]>([8, 0]);

  const animateMarker = useCallback((timestamp: number) => {
    const radius = 10;
    setLngLat([Math.cos(timestamp / 1000) * radius, Math.sin(timestamp / 1000) * radius]);
    requestAnimationFrame(animateMarker);
  }, []);

  useEffect(() => {
    requestAnimationFrame(animateMarker);
  }, []);

  return <SpecMarker original lngLat={lngLat} />;
};

export const MarkerDemo = () => {
  return (
    <>
      <CheckControl name={"默认"}>
        <MarkerDefault />
      </CheckControl>
      <CheckControl name={"custom"}>
        <MarkerCustom />
      </CheckControl>
      <CheckControl name={"with popup"}>
        <MarkerWithPopup />
      </CheckControl>
      <CheckControl name={"draggable"}>
        <MarkerDraggable />
      </CheckControl>
      <CheckControl name={"animate"} defaultCheck={false}>
        <MarkerAnimate />
      </CheckControl>
    </>
  );
};
