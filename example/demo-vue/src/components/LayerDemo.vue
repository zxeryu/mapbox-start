<template>
  <div>
    <CheckControl name="circle & toggle && event && expression">
      <spec-source-geo-json :data="circlePoints">
        <spec-layer-circle
          :paint="{
            'circle-color': Ex.match(Ex.get('name'), 'black', ['111', 'red'], ['222', 'green'], ['333', 'blue']),
            'circle-radius': Ex.interpolate(Ex.linear(), Ex.zoom(), [3, 6], [12, 24]),
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
    <CheckControl name="symbol & icon svg">
      <need-icons :icons="symbolIcons">
        <spec-source-geo-json :data="symbolPoints">
          <spec-layer-symbol
            :layout="{
              'icon-image': Ex.case(
                'uav',
                [Ex.eq(Ex.get('name'), '222'), 'car'],
                [Ex.eq(Ex.get('name'), '444'), 'car'],
              ),
              'icon-allow-overlap': true,
            }"
            :paint="{
              'icon-color': Ex.case('black', [Ex.eq(Ex.get('name'), '444'), 'red']),
            }"
          />
        </spec-source-geo-json>
      </need-icons>
    </CheckControl>
    <CheckControl name="symbol & icon url">
      <need-icons
        :icons="{
          icon: {
            size: 30,
            url: '/custom_marker.png',
            sdf: false,
          },
        }"
      >
        <spec-source-geo-json :data="symbolIconPoints">
          <spec-layer-symbol :layout="{ 'icon-image': 'icon' }" />
        </spec-source-geo-json>
      </need-icons>
    </CheckControl>
    <CheckControl name="fill" :default-check="false">
      <spec-source-geo-json :data="fillData">
        <spec-layer-fill
          :paint="{
            'fill-color': 'red',
            'fill-opacity': 0.3,
          }"
        />
      </spec-source-geo-json>
    </CheckControl>
    <CheckControl name="fill-extrusion" :default-check="false">
      <spec-source-geo-json :data="fillExtrusionData">
        <spec-layer-fill-extrusion
          :paint="{
            'fill-extrusion-color': 'red',
            'fill-extrusion-opacity': 0.6,
            'fill-extrusion-height': Ex.get('height'),
          }"
        />
      </spec-source-geo-json>
    </CheckControl>
    <CheckControl name="fill-extrusion 2" :default-check="false" :on-change="onFillExtrusion2Change">
      <spec-source-geo-json data="https://docs.mapbox.com/mapbox-gl-js/assets/indoor-3d-map.geojson">
        <spec-layer-fill-extrusion
          :paint="{
            'fill-extrusion-color': Ex.get('color'),
            'fill-extrusion-height': Ex.get('height'),
            'fill-extrusion-base': Ex.get('base_height'),
            'fill-extrusion-opacity': 0.5,
          }"
        />
      </spec-source-geo-json>
    </CheckControl>
    <CheckControl name="line" :default-check="false">
      <spec-source-geo-json :data="lineData">
        <spec-layer-line
          :paint="{
            'line-width': 2,
            'line-color': 'red',
            'line-dasharray': [2, 2],
          }"
        />
      </spec-source-geo-json>
    </CheckControl>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from "vue-property-decorator";
import { point, featureCollection, circle, lineString, lineToPolygon } from "@turf/turf";
import { Ex, IImageOpts } from "@mapbox-start/vue-bridge";
import { get } from "lodash";
import CheckControl from "../CheckControl.vue";
import { Map } from "mapbox-gl";

const svgCar = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M7.5,8.16667372 L7.5,4.76384628 C7.5,3.47503517 9.23439775,2 12,2 C14.7656023,2 16.5,3.47503517 16.5,4.76384628 L16.5,8.16666667 L17.1581139,8.38603796 C17.362285,8.45409498 17.5,8.64516441 17.5,8.86037961 L17.5,9.5 L16.5,9.16666667 L16.5,18 C16.5,18.4910921 16.3333333,19.4910921 16,21 C15.5,22 13,22 12,22 C11,22 8.5,22 8,21 C7.66666667,19.486978 7.5,18.486978 7.5,18 L7.5,9.16666667 L6.5,9.5 L6.5,8.86037961 C6.5,8.64516441 6.63771505,8.45409498 6.84188612,8.38603796 L7.5,8.16666667 L7.5,8.16667372 Z M8.5,7.5 L9,10.5 C10.9473319,9.85088936 13.0526681,9.85088936 15,10.5 L15.5,7.5 C13.2649717,6.54213072 10.7350283,6.54213072 8.5,7.5 Z M9,19 L9,20.5 C10.9863007,20.8310501 13.0136993,20.8310501 15,20.5 L15,19 C13.0136993,19.3310501 10.9863007,19.3310501 9,19 Z"/>
</svg>
`;
const svgUav = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g  transform="translate(-365 -602)">
        <rect  fill="none" opacity="0.2" width="24" height="24" transform="translate(365 602)"/>
        <circle  fill="{{ fill }}" cx="3.5" cy="3.5" r="3.5" transform="translate(366 603)"/>
        <circle  fill="{{ fill }}" cx="3.5" cy="3.5" r="3.5" transform="translate(366 618)"/>
        <circle  fill="{{ fill }}" cx="3.5" cy="3.5" r="3.5" transform="translate(381 603)"/>
        <circle  fill="{{ fill }}" cx="3.5" cy="3.5" r="3.5" transform="translate(381 618)"/>
        <path  fill="{{ fillSkeleton }}" d="M153.213,154.412c.08.087.276.31.316.349l.053.053a1.158,1.158,0,0,0,1.581.06,1.132,1.132,0,0,0,0-1.484,3.284,3.284,0,0,0-.31-.3l-.063-.07c-1.122-1.025-4.723-4.533-4.659-6.58v-.556c0-2.063,3.548-5.518,4.659-6.533l.087-.073c.067-.053.27-.256.31-.3a1.138,1.138,0,0,0,0-1.484,1.158,1.158,0,0,0-1.581.063.12.12,0,0,0-.033.033l-.02.02c-.04.04-.236.263-.316.349-1.108,1.155-4.3,4.4-6.324,4.55h-.832c-2.07-.08-5.445-3.561-6.453-4.659l-.073-.087c-.053-.067-.256-.27-.3-.31a1.138,1.138,0,0,0-1.484,0,1.158,1.158,0,0,0,.05,1.618.117.117,0,0,0,.033.033l.02.02c.04.04.263.236.349.316,1.142,1.048,4.257,4.11,4.55,6.137a6.909,6.909,0,0,1-.027,1.385c-.433,2.02-3.408,4.952-4.506,5.991-.087.08-.31.276-.333.316l-.053.053a1.158,1.158,0,0,0-.063,1.581,1.132,1.132,0,0,0,1.484,0,3.281,3.281,0,0,0,.3-.31l.073-.087c.982-1.055,4.22-4.4,6.3-4.63a10.215,10.215,0,0,1,1.022,0c2.024.2,5.189,3.4,6.257,4.55Z" transform="translate(230.539 467.827)"/>
        <circle  fill="#fff" cx="2" cy="2" r="2" transform="translate(375 612)"/>
    </g>
</svg>
`;

const icons: { [_: string]: IImageOpts } = {
  uav: {
    size: 20,
    svg: svgUav,
    sdf: true,
  },
  car: {
    size: 30,
    svg: svgCar,
    sdf: true,
  },
};

@Component({
  components: { CheckControl },
})
export default class LayerDemo extends Vue {
  @Inject() map!: Map;

  Ex = Ex;

  circlePoints = featureCollection([
    point([0, -6], { name: "111" }),
    point([2, -6], { name: "222" }),
    point([4, -6], { name: "333" }),
    point([6, -6], { name: "444" }),
  ]);
  circleItem: { point: [number, number]; props: any; flag: string | number } | undefined = undefined;

  symbolPoints = featureCollection([
    point([0, -8], { name: "111" }),
    point([2, -8], { name: "222" }),
    point([4, -8], { name: "333" }),
    point([6, -8], { name: "444" }),
  ]);
  symbolIcons = icons;

  symbolIconPoints = featureCollection([point([0, -10], { name: "111" }), point([2, -10], { name: "222" })]);

  fillData = circle([0, -11], 1000);

  fillExtrusionData = featureCollection([
    circle([0, -12], 30, { properties: { height: 200000 } }),
    circle([2, -12], 30, { properties: { height: 400000 } }),
    circle([4, -12], 30, { properties: { height: 800000 } }),
  ]);

  lineData = lineToPolygon(
    lineString([
      [0, 0],
      [8, 0],
      [8, -12],
      [0, -12],
      [0, 0],
    ]),
  );

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

  onFillExtrusion2Change(state: boolean) {
    if (state) {
      this.map.flyTo({ center: [-87.61694, 41.86625], zoom: 15.99, animate: true });
    } else {
      this.map.flyTo({ center: [0, 0], zoom: 3 });
    }
  }
}
</script>
