import React, { ReactNode, useState } from "react";
import { MapboxGL, SpecMap, TopLeftContainer } from "@mapbox-start/react-bridge";
import { MarkerDemo } from "./components/MarkerDemo";
import { LayerDemo } from "./components/LayerDemo";

MapboxGL.accessToken = "pk.eyJ1IjoiZXJ5dSIsImEiOiJjazZybDNjbHEwNWY1M2Vtcnl3c3dqemNoIn0.GKMcdxRq_GrdMFmoUCXvYQ";

export const CheckControl = ({
  name,
  children,
  defaultCheck = true,
}: {
  name: string;
  children: ReactNode;
  defaultCheck?: boolean;
}) => {
  const [checked, setChecked] = useState<boolean>(defaultCheck);
  return (
    <div
      style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
      onClick={() => {
        setChecked((prevState) => !prevState);
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
