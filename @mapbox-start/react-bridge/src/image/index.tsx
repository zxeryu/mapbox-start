import { map } from "lodash";
import { lazy, ReactNode, Suspense, useMemo } from "react";
import { IImageOpts, Img } from "./Img";
import { useMap } from "../Map";
import React from "react";

export const svgToDataURL = (svg: string): string => {
  try {
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  } catch (e) {
    console.error(e, svg);
    return "";
  }
};

export const NeedIcons = ({ icons, children }: { icons: { [name: string]: IImageOpts }; children?: ReactNode }) => {
  const m = useMap();
  const Loader = useMemo(() => {
    const Loader = ({ children }: { children: ReactNode }) => <>{children}</>;

    return lazy(() => {
      return Promise.all(
        map(icons, (i, name) => Img.fromURL(m, i.svg ? svgToDataURL(i.svg) : i.url || "", i.size, name, i.sdf)),
      ).then(() => {
        return {
          default: Loader,
        };
      });
    });
  }, []);
  return (
    <Suspense fallback={null}>
      <Loader>{children}</Loader>
    </Suspense>
  );
};
