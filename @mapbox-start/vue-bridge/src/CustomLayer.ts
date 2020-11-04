import { CustomLayerInterface, Map } from "mapbox-gl";

export type CustomLayerHooks = {
  prerender?: CustomLayerInterface["prerender"];
  render?: CustomLayerInterface["render"];
  destroy?: (map: Map, gl: WebGLRenderingContext) => void;
};

export type TCustomLayerFactory<TArgs extends Readonly<any[]>> = (
  ...args: TArgs
) => (m: Map, gl: WebGLRenderingContext) => CustomLayerHooks;

export const createCustomLayer = <TArgs extends Readonly<any[]>>(
  factory: TCustomLayerFactory<TArgs>,
  renderingMode?: "2d" | "3d",
) => (id: string, ...args: TArgs): CustomLayerInterface => {
  let hooks: CustomLayerHooks = {};

  return {
    id,
    type: "custom",
    renderingMode: renderingMode || "3d",
    onAdd(map: Map, gl: WebGLRenderingContext): void {
      hooks = factory(...args)(map, gl);
    },
    onRemove(map: Map, gl: WebGLRenderingContext): void {
      hooks.destroy && hooks.destroy(map, gl);
      hooks = {};
    },
    prerender(gl: WebGLRenderingContext, matrix: number[]): void {
      hooks.prerender && hooks.prerender(gl, matrix);
    },
    render(gl: WebGLRenderingContext, matrix: number[]): void {
      hooks.render && hooks.render(gl, matrix);
    },
  };
};
