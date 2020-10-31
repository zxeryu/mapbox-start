import { Component, Prop, Inject } from "vue-property-decorator";
import { Empty } from "./core";
import { Map, MapboxGeoJSONFeature, MapLayerEventType, MapLayerMouseEvent } from "mapbox-gl";
import { Layer } from "./Layer";
import { Dictionary, forEach } from "lodash";

@Component
export class SpecEvent extends Empty {
  @Prop() eventName!: string;
  @Prop() listener!: (ev: any) => void;

  @Inject() map!: Map;

  mounted() {
    this.map.on(this.eventName, this.listener);
  }

  beforeDestroy() {
    this.map.off(this.eventName, this.listener);
  }
}

@Component
export class SpecLayerEvent extends Empty {
  @Prop() eventName!: keyof MapLayerEventType;
  @Prop() listener?: (ev: any) => void;

  @Inject() map!: Map;
  @Inject() layer!: Layer;

  mounted() {
    this.map.on(this.eventName, this.layer.id, this.handleEvent);
  }

  beforeDestroy() {
    this.map.off(this.eventName, this.layer.id, this.handleEvent);
  }

  handleEvent(ev: any) {
    this.listener && this.listener(ev);
  }
}

@Component
export class SpecLayerHoverCursorToggle extends Empty {
  @Inject() map!: Map;
  @Inject() layer!: Layer;

  private hoveredFeatures: Dictionary<MapboxGeoJSONFeature> = {};

  mounted() {
    this.map.on("mouseenter", this.layer.id, this.handleEnter);
    this.map.on("mouseleave", this.layer.id, this.handleLeave);
  }

  beforeDestroy() {
    this.map.off("mouseenter", this.handleEnter);
    this.map.off("mouseleave", this.handleLeave);
  }

  handleEnter(e: MapLayerMouseEvent) {
    const m = e.target;
    m.getCanvas().style.cursor = "pointer";
    forEach(e.features, (f) => {
      if (f.id) {
        this.hoveredFeatures[f.id] = f;
        m.setFeatureState(f, { hover: true });
      }
    });
  }

  handleLeave(e: MapLayerMouseEvent) {
    const m = e.target;
    m.getCanvas().style.cursor = "";
    forEach(this.hoveredFeatures, (f, id) => {
      delete this.hoveredFeatures[id];
      m.setFeatureState(f, { hover: false });
    });
  }
}
