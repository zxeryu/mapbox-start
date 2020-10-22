import React, { createContext, ReactNode, useContext, useEffect, useMemo } from "react";
import { useMap } from "../Map";
import { MapSourceOptions, Source } from "../Source";

const SpecSourceContext = createContext<{ source: Source<keyof MapSourceOptions> }>({} as any);

export const useSpecSource = () => useContext(SpecSourceContext).source;

interface ISource {
  children: ReactNode;
  id?: string;
}

export const SpecSourceVector = ({ children, id, ...opts }: ISource & MapSourceOptions["vector"]) => {
  const map = useMap();
  const source = useMemo(() => Source.from("vector", opts).named(id).addTo(map), []);

  useEffect(() => {
    return () => {
      source && source.remove();
    };
  }, []);
  return (
    <SpecSourceContext.Provider key={source.id} value={{ source }}>
      {children}
    </SpecSourceContext.Provider>
  );
};

export const SpecSourceGeoJson = ({ children, id, ...opts }: ISource & MapSourceOptions["geojson"]) => {
  const map = useMap();
  const source = useMemo(() => Source.from("geojson", opts).named(id).addTo(map), []);
  useEffect(() => {
    return () => {
      source && source.remove();
    };
  }, []);
  useEffect(() => {
    const s = source.get();
    if (s && opts.data) {
      s.setData(opts.data);
    }
  }, [opts.data]);

  return (
    <SpecSourceContext.Provider key={source.id} value={{ source }}>
      {children}
    </SpecSourceContext.Provider>
  );
};

export const SpecSourceImage = ({ children, id, ...opts }: ISource & MapSourceOptions["image"]) => {
  const map = useMap();
  const source = useMemo(() => Source.from("image", opts).named(id).addTo(map), []);
  useEffect(() => {
    return () => {
      source && source.remove();
    };
  }, []);
  return (
    <SpecSourceContext.Provider key={source.id} value={{ source }}>
      {children}
    </SpecSourceContext.Provider>
  );
};

export const SpecSourceCanvas = ({ children, id, ...opts }: ISource & MapSourceOptions["canvas"]) => {
  const map = useMap();
  const source = useMemo(() => Source.from("canvas", opts).named(id).addTo(map), []);
  useEffect(() => {
    return () => {
      source && source.remove();
    };
  }, []);
  return (
    <SpecSourceContext.Provider key={source.id} value={{ source }}>
      {children}
    </SpecSourceContext.Provider>
  );
};
