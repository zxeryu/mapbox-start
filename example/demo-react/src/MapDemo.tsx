import React, { ReactNode, useState } from "react";
import { MapboxGL, SpecMap, TopLeftContainer } from "@mapbox-start/react-bridge";
import { MarkerDemo } from "./components/MarkerDemo";
import { LayerDemo } from "./components/LayerDemo";
import { SourceDemo } from "./components/SourceDemo";
import { ApiDemo } from "./components/ApiDemo";
import { Map } from "mapbox-gl";
import { ControlDemo } from "./components/ControlDemo";

MapboxGL.accessToken = "pk.eyJ1IjoiZXJ5dSIsImEiOiJjazZybDNjbHEwNWY1M2Vtcnl3c3dqemNoIn0.GKMcdxRq_GrdMFmoUCXvYQ";

export const backHome = (map: Map) => {
  map.flyTo({ center: [0, 0], zoom: 3 });
};

export const CheckControl = ({
  name,
  children,
  defaultCheck = true,
  onChange,
}: {
  name: string;
  children?: ReactNode;
  defaultCheck?: boolean;
  onChange?: (state: boolean) => void;
}) => {
  const [checked, setChecked] = useState<boolean>(defaultCheck);
  return (
    <div
      style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
      onClick={() => {
        setChecked((prevState) => {
          onChange && onChange(!prevState);
          return !prevState;
        });
      }}>
      <input type={"checkbox"} checked={checked} />
      &nbsp;&nbsp;
      {name}
      {checked ? children : null}
    </div>
  );
};

const Title = ({ children, title }: { children: ReactNode; title: string }) => {
  return (
    <>
      <h2 style={{ marginTop: "1em" }}>{title}</h2>
      {children}
    </>
  );
};

const Menu = () => {
  return (
    <TopLeftContainer>
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          width: "22vw",
          padding: ".5em 1em",
          color: "rgba(255,255,255,0.9)",
        }}>
        <Title title={"Marker"}>
          <MarkerDemo />
        </Title>
        <Title title={"Layer"}>
          <LayerDemo />
        </Title>
        <Title title={"Source"}>
          <SourceDemo />
        </Title>
        <Title title={"Control"}>
          <ControlDemo />
        </Title>
        <Title title={"Some Api"}>
          <ApiDemo />
        </Title>
      </div>
    </TopLeftContainer>
  );
};

export const MapDemo = () => {
  return (
    <SpecMap style={"mapbox://styles/mapbox/streets-v11"} divStyle={{ backgroundColor: "pink", height: "100vh" }}>
      <Menu />
    </SpecMap>
  );
};
