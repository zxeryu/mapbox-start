<template>
  <div>
    <CheckControl name="circle & toggle && event && expression">
      <SpecSourceGeoJSON :data="circlePoints">
        <SpecLayerCircle
          :paint="{
            'circle-color': Ex.match(Ex.get('name'), 'black', ['111', 'red'], ['222', 'green'], ['333', 'blue']),
            'circle-radius': 6,
          }"
        >
          <SpecLayerHoverCursorToggle />
          <SpecLayerEvent eventName="click" :listener="onCircleClick" />
          <SpecPopup v-if="circleItem" :key="circleItem.flag" :lngLat="circleItem.point">
            <div>{{ JSON.stringify(circleItem.props) }}</div>
          </SpecPopup>
        </SpecLayerCircle>
      </SpecSourceGeoJSON>
    </CheckControl>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import CheckControl from "../CheckControl.vue";
import { point, featureCollection } from "@turf/turf";
import {
  SpecSourceGeoJSON,
  SpecLayerCircle,
  SpecLayerHoverCursorToggle,
  SpecLayerEvent,
  SpecPopup,
  Ex,
} from "@mapbox-start/vue-bridge";
import { get } from "lodash";

@Component({
  components: {
    CheckControl,
    SpecSourceGeoJSON,
    SpecLayerCircle,
    SpecLayerHoverCursorToggle,
    SpecLayerEvent,
    SpecPopup,
  },
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
