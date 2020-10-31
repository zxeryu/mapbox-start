<template>
  <div>
    <CheckControl name="circle & toggle && event && expression">
      <spec-source-geo-json :data="circlePoints">
        <spec-layer-circle
          :paint="{
            'circle-color': Ex.match(Ex.get('name'), 'black', ['111', 'red'], ['222', 'green'], ['333', 'blue']),
            'circle-radius': 6,
          }"
        >
          <spec-layer-hover-cursor-toggle />
          <spec-layer-event eventName="click" :listener="onCircleClick" />
          <spec-popup v-if="circleItem" :key="circleItem.flag" :lngLat="circleItem.point">
            <div>{{ JSON.stringify(circleItem.props) }}</div>
          </spec-popup>
        </spec-layer-circle>
      </spec-source-geo-json>
    </CheckControl>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { point, featureCollection } from "@turf/turf";
import { Ex } from "@mapbox-start/vue-bridge";
import { get } from "lodash";
import CheckControl from "../CheckControl.vue";

@Component({
  components: { CheckControl },
})
export default class LayerDemo extends Vue {
  Ex = Ex;

  circlePoints = featureCollection([
    point([0, -6], { name: "111" }),
    point([2, -6], { name: "222" }),
    point([4, -6], { name: "333" }),
    point([6, -6], { name: "444" }),
  ]);
  circleItem: { point: [number, number]; props: any; flag: string | number } | undefined = undefined;

  data(): object {
    return { circleItem: undefined };
  }

  onCircleClick(e: any) {
    if (e.features && e.features[0]) {
      console.log("@@@@@@ layer click", e.features[0].properties);
      const point = get(e.features[0].geometry, "coordinates");
      this.circleItem = { point, props: e.features[0].properties, flag: new Date().getTime() };
    }
  }
}
</script>
