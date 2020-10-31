<template>
  <div>
    <CheckControl name="默认">
      <spec-marker :original="true" :lngLat="[2, 0]" />
    </CheckControl>
    <CheckControl name="custom">
      <spec-marker :lngLat="[0, 0]">
        <div style="color: red">custom<br />marker</div>
      </spec-marker>
    </CheckControl>
    <CheckControl name="with popup">
      <spec-popup>
        <div style="color: red">popup content</div>
        <spec-marker :original="true" :lngLat="[4, 0]" color="blue" />
      </spec-popup>
    </CheckControl>
    <CheckControl name="draggable">
      <spec-marker :original="true" :lngLat="lngLat" :draggable="true" :onDragEnd="handleDrag" />
    </CheckControl>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import CheckControl from "../CheckControl.vue";
import { Marker, MapboxEvent } from "mapbox-gl";
@Component({
  components: { CheckControl },
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
