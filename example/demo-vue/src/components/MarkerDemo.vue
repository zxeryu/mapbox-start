<template>
  <div>
    <CheckControl name="默认">
      <SpecMarker :original="true" :lngLat="[2, 0]" />
    </CheckControl>
    <CheckControl name="custom">
      <SpecMarker :lngLat="[0, 0]">
        <div style="color: red">custom<br />marker</div>
      </SpecMarker>
    </CheckControl>
    <CheckControl name="with popup">
      <SpecPopup>
        <div style="color: red">popup content</div>
        <SpecMarker :original="true" :lngLat="[4, 0]" color="blue" />
      </SpecPopup>
    </CheckControl>
    <CheckControl name="draggable">
      <SpecMarker :original="true" :lngLat="lngLat" :draggable="true" :onDragEnd="handleDrag" />
    </CheckControl>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import CheckControl from "../CheckControl.vue";
import { SpecMarker, SpecPopup } from "@mapbox-start/vue-bridge";
import { Marker, MapboxEvent } from "mapbox-gl";
@Component({
  components: { CheckControl, SpecMarker, SpecPopup },
})
export default class MarkerDemo extends Vue {
  lngLat: [number, number] = [6, 0];

  handleDrag(marker: Marker, e: MapboxEvent) {
    const ll = marker.getLngLat();
    console.log("@@@@@ drag end e=", e, "lngLat=", ll);
    this.lngLat = [ll.lng, ll.lat];
  }
}
</script>
