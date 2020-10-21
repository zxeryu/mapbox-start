import React, { ReactNode, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { IControl } from "mapbox-gl";
import { useMap } from "../Map";

export const Control = ({
  children,
  position,
}: {
  children?: ReactNode;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  inline?: boolean;
}) => {
  const map = useMap();
  const portalNode = useMemo(() => {
    return document.createElement("div");
  }, []);
  useEffect(() => {
    const ctrl: IControl = {
      onAdd(): HTMLElement {
        return portalNode;
      },
      onRemove(): void {
        if (portalNode.parentNode) {
          portalNode.parentNode.removeChild(portalNode);
        }
      },
    };

    map.addControl(ctrl, position);

    return () => {
      map.removeControl(ctrl);
    };
  }, []);

  return <>{createPortal(children, portalNode)}</>;
};

interface IContainerProps {
  children?: ReactNode;
}

export const TopLeftContainer = (props: IContainerProps) => <Control {...props} position={"top-left"} />;

export const TopRightContainer = (props: IContainerProps) => <Control {...props} position={"top-right"} />;

export const BottomLeftContainer = (props: IContainerProps) => <Control {...props} position={"bottom-left"} />;

export const BottomRightContainer = (props: IContainerProps) => <Control {...props} position={"bottom-right"} />;
