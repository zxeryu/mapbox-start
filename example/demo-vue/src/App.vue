<template>
  <div>
    <spec-map mapStyle="mapbox://styles/mapbox/streets-v11" style="width: 100%; height: 100vh">
      <TopLeftContainer>
        <div
          style="background-color: rgba(0, 0, 0, 0.5); width: 22vw; padding: 0.5em 1em; color: rgba(255, 255, 255, 0.9)"
        >
          <h2 style="margin-top: 1em">Marker</h2>
          <MarkerDemo />
          <h2 style="margin-top: 1em">Layer</h2>
          <LayerDemo />
          <h2 style="margin-top: 1em">Source</h2>
          <SourceDemo />
          <h2 style="margin-top: 1em">Control</h2>
          <ControlDemo />
          <h2 style="margin-top: 1em">Some Api</h2>
          <ApiDemo />
        </div>
      </TopLeftContainer>
    </spec-map>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { TopLeftContainer } from "@mapbox-start/vue-bridge";
import MarkerDemo from "./components/MarkerDemo.vue";
import LayerDemo from "./components/LayerDemo.vue";
import SourceDemo from "./components/SourceDemo.vue";
import ControlDemo from "./components/ControlDemo.vue";
import ApiDemo from "./components/ApiDemo.vue";

@Component({
  components: {
    ApiDemo,
    ControlDemo,
    SourceDemo,
    LayerDemo,
    MarkerDemo,
    TopLeftContainer,
  },
})
export default class App extends Vue {}
</script>
