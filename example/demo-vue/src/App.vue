<template>
  <div>
    <SpecMap mapStyle="mapbox://styles/mapbox/streets-v11" style="width: 100%; height: 100vh">
      <TopLeftContainer>
        <div
          style="background-color: rgba(0, 0, 0, 0.5); width: 22vw; padding: 0.5em 1em; color: rgba(255, 255, 255, 0.9)"
        >
          <h2 style="margin-top: 1em">Marker</h2>
          <MarkerDemo />
          <h2 style="margin-top: 1em">Layer</h2>
          <LayerDemo />
        </div>
      </TopLeftContainer>
    </SpecMap>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { MapboxGL, SpecMap, TopLeftContainer } from "@mapbox-start/vue-bridge";
import MarkerDemo from "./components/MarkerDemo.vue";
import LayerDemo from "./components/LayerDemo.vue";

MapboxGL.accessToken = "pk.eyJ1IjoiZXJ5dSIsImEiOiJjazZybDNjbHEwNWY1M2Vtcnl3c3dqemNoIn0.GKMcdxRq_GrdMFmoUCXvYQ";

@Component({
  components: {
    LayerDemo,
    SpecMap,
    MarkerDemo,
    TopLeftContainer,
  },
})
export default class App extends Vue {}
</script>
