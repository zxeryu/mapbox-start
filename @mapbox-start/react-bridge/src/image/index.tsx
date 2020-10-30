import { map, template } from "lodash";
import { lazy, ReactNode, Suspense, useMemo } from "react";
import { Img } from "./Img";
import { useMap } from "../Map";
import React from "react";

export const tagTemplate = (s: string) => {
  return template(s, {
    interpolate: /{{([\s\S]+?)}}/g,
  });
};

export const svgFor = (svg: string, fill: string) => {
  return tagTemplate(svg)({ fill });
};

export const svgToDataURL = (svg: string): string => {
  try {
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  } catch (e) {
    console.error(e, svg);
    return "";
  }
};

export type IImageOpts = {
  svg?: string;
  url?: string;
  size: number;
  normalize?: boolean;
  sdf?: boolean;
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
