import { Component, Prop, Provide, Ref, Vue } from "vue-property-decorator";
import M, { Map, FitBoundsOptions, LngLatBoundsLike, LngLatLike, TransformRequestFunction, Style } from "mapbox-gl";
import { CreateElement, VNode } from "vue";
import { get } from "lodash";
import { Provider } from "./core";

let mapFromUser: typeof M | undefined;

export const setMapboxGL = (m: typeof M) => (mapFromUser = m);
export const MapboxGL: typeof M = window.mapboxgl || mapFromUser;

@Component
class MapOptionProps extends Vue {
  //from mapbox
  @Prop() antialias?: boolean;
  @Prop() attributionControl?: boolean;
  @Prop() bearing?: number;
  @Prop() bearingSnap?: number;
  @Prop() bounds?: LngLatBoundsLike;
  @Prop() boxZoom?: boolean;
  @Prop() center?: LngLatLike;
  @Prop() clickTolerance?: number;
  @Prop() collectResourceTiming?: boolean;
  @Prop() crossSourceCollisions?: boolean;
  @Prop() customAttribution?: string | string[];
  @Prop() dragPan?: boolean;
  @Prop() dragRotate?: boolean;
  @Prop() doubleClickZoom?: boolean;
  @Prop() hash?: boolean | string;
  @Prop() fadeDuration?: number;
  @Prop() failIfMajorPerformanceCaveat?: boolean;
  @Prop() fitBoundsOptions?: FitBoundsOptions;
  @Prop() interactive?: boolean;
  @Prop() keyboard?: boolean;
  @Prop() locale?: { [key: string]: string };
  @Prop() localIdeographFontFamily?: string;
  @Prop() logoPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  @Prop() maxBounds?: LngLatBoundsLike;
  @Prop() maxPitch?: number;
  @Prop() maxZoom?: number;
  @Prop() minPitch?: number;
  @Prop() minZoom?: number;
  @Prop() preserveDrawingBuffer?: boolean;
  @Prop() pitch?: number;
  @Prop() pitchWithRotate?: boolean;
  @Prop() refreshExpiredTiles?: boolean;
  @Prop() renderWorldCopies?: boolean;
  @Prop() scrollZoom?: boolean;
  @Prop() mapStyle?: Style | string;
  @Prop() trackResize?: boolean;
  @Prop() transformRequest?: TransformRequestFunction;
  @Prop() touchZoomRotate?: boolean;
  @Prop() touchPitch?: boolean;
  @Prop() zoom?: number;
  @Prop() maxTileCacheSize?: number;
  @Prop() accessToken?: string;
  //
}

@Component
class MapProvide extends Provider<Map> {
  @Provide("map") p: Map = get(this.$options.propsData, "value");

  render(createElement: CreateElement): VNode {
    return createElement("div", this.$slots.default);
  }
}

@Component
export class SpecMap extends MapOptionProps {
  @Ref("mapDiv") mapDiv!: HTMLDivElement;

  private map: Map | undefined;
  private isMapLoaded!: boolean;

  data(): object {
    return {
      map: undefined,
      isMapLoaded: false,
    };
  }

  mounted() {
    if (this.mapDiv && !this.map) {
      this.map = new MapboxGL.Map({ ...this.$options.propsData, container: this.mapDiv, style: this.mapStyle });
      this.map.once("load", () => {
        this.isMapLoaded = true;
      });
    }
  }

  render(createElement: CreateElement): VNode {
    return createElement(
      "div",
      { ref: "mapDiv" },
      this.map && this.isMapLoaded
        ? [
            createElement(
              MapProvide,
              {
                props: {
                  value: this.map,
                },
              },
              this.$slots.default,
            ),
          ]
        : undefined,
    );
  }
}
