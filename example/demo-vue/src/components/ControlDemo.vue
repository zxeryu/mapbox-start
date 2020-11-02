<template>
  <div>
    <CheckControl name="fullscreen" :default-check="false" :on-change="onFullscreenChange" />
    <CheckControl name="navigation" :default-check="false" :on-change="onNavigationChange" />
    <CheckControl name="custom" :default-check="false">
      <TopRightContainer>
        <div style="color: red; font-size: 2em">custom content</div>
      </TopRightContainer>
    </CheckControl>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from "vue-property-decorator";
import { Map, FullscreenControl, NavigationControl } from "mapbox-gl";
import CheckControl from "../CheckControl.vue";
import { MapboxGL, TopRightContainer } from "@mapbox-start/vue-bridge";
@Component({
  components: { CheckControl, TopRightContainer },
})
export default class ControlDemo extends Vue {
  @Inject() map!: Map;

  private fsc: FullscreenControl | undefined;
  private nc: NavigationControl | undefined;

  mounted(): void {
    this.fsc = new MapboxGL.FullscreenControl();
    this.nc = new MapboxGL.NavigationControl();
  }

  onFullscreenChange(state: boolean) {
    if (state) {
      this.map.addControl(this.fsc!);
    } else {
      this.map.removeControl(this.fsc!);
    }
  }

  onNavigationChange(state: boolean) {
    if (state) {
      this.map.addControl(this.nc!, "bottom-right");
    } else {
      this.map.removeControl(this.nc!);
    }
  }
}
</script>
