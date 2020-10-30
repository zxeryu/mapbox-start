import { Component, Prop, Vue } from "vue-property-decorator";
import { FitBoundsOptions, LngLatBoundsLike, LngLatLike, TransformRequestFunction, Style } from "mapbox-gl";

@Component
class SpecMapProps extends Vue {
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
  @Prop() style?: Style | string;
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
export class SpecMap extends SpecMapProps {}
