import { Vue, Component, Prop, Inject, Ref, Provide, Watch } from "vue-property-decorator";
import { CreateElement, VNode } from "vue";
import { Alignment, Anchor, PointLike, Marker, LngLatLike, MapboxEvent, Map, Popup } from "mapbox-gl";
import { MapboxGL } from "../Map";
import { pick, get } from "lodash";
import { Provider } from "../core";

const MarkerOptionKeys = ["offset", "anchor", "draggable", "rotation", "rotationAlignment", "pitchAlignment", "scale"];

@Component
class MarkerProvide extends Provider<Marker> {
  @Provide("marker") p: Marker = get(this.$options.propsData, "value");
}

@Component
export class SpecMarker extends Vue {
  //options
  @Prop() offset?: PointLike;
  @Prop() anchor?: Anchor;
  @Prop() draggable?: boolean;
  @Prop() rotation?: number;
  @Prop() rotationAlignment?: Alignment;
  @Prop() pitchAlignment?: Alignment;
  @Prop() scale?: number;
  //other
  @Prop() lngLat!: LngLatLike;
  @Prop() original?: boolean;
  @Prop() onDrag?: (marker: Marker, e: MapboxEvent) => void;
  @Prop() onDragStart?: (marker: Marker, e: MapboxEvent) => void;
  @Prop() onDragEnd?: (marker: Marker, e: MapboxEvent) => void;

  @Inject() map!: Map;
  @Inject() popup!: Popup;

  @Ref("markerDiv") markerDiv!: HTMLDivElement;

  private marker: Marker | undefined;

  mounted() {
    if (this.original) {
      this.marker = new MapboxGL.Marker(pick(this.$options.propsData, MarkerOptionKeys));
    } else {
      this.marker = new MapboxGL.Marker(this.markerDiv, pick(this.$options.propsData, MarkerOptionKeys));
    }
    if (this.lngLat) {
      this.marker.setLngLat(this.lngLat);
    }
    this.marker.on("drag", this.handleDrag);
    this.marker.on("dragstart", this.handleDragStart);
    this.marker.on("dragend", this.handleDragEnd);

    this.popup && this.marker.setPopup(this.popup);

    this.marker.addTo(this.map);
  }

  beforeDestroy() {
    if (this.marker) {
      this.marker.off("drag", this.handleDrag);
      this.marker.off("dragstart", this.handleDragStart);
      this.marker.off("dragend", this.handleDragEnd);
      this.marker.remove();
    }
  }

  @Watch("lngLat")
  handleLngLatChange() {
    this.marker && this.marker.setLngLat(this.lngLat);
  }

  handleDrag(e: MapboxEvent) {
    this.onDrag && this.onDrag(this.marker!, e);
  }
  handleDragStart(e: MapboxEvent) {
    this.onDragStart && this.onDragStart(this.marker!, e);
  }
  handleDragEnd(e: MapboxEvent) {
    this.onDragEnd && this.onDragEnd(this.marker!, e);
  }

  render(createElement: CreateElement): VNode {
    return createElement("div", { ref: "markerDiv" }, [
      createElement(
        MarkerProvide,
        {
          props: {
            value: this.marker,
          },
        },
        this.$slots.default,
      ),
    ]);
  }
}
