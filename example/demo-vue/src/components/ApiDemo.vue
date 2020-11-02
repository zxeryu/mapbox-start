<template>
  <div>
    <CheckControl name="flyTo" :default-check="false" :on-change="onFlyToChange" />
    <CheckControl name="fitBounds" :default-check="false" :on-change="onFitBoundsChange" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from "vue-property-decorator";
import CheckControl from "../CheckControl.vue";
import { Map } from "mapbox-gl";
@Component({
  components: { CheckControl },
})
export default class ApiDemo extends Vue {
  @Inject() map!: Map;

  onFlyToChange(state: boolean) {
    if (state) {
      this.map.flyTo({ center: [-87.61694, 41.86625], zoom: 10 });
    } else {
      this.map.flyTo({ center: [0, 0], zoom: 3 });
    }
  }

  onFitBoundsChange(state: boolean) {
    if (state) {
      this.map.fitBounds([
        [32.958984, -5.353521],
        [43.50585, 5.615985],
      ]);
    } else {
      this.map.flyTo({ center: [0, 0], zoom: 3 });
    }
  }
}
</script>
