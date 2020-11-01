import Vue from "vue";
import App from "./App.vue";
import {
  MapboxGL,
  SpecMap,
  SpecPopup,
  SpecMarker,
  SpecSourceGeoJSON,
  SpecLayerCircle,
  SpecLayerHoverCursorToggle,
  SpecLayerEvent,
  SpecLayerSymbol,
  SpecLayerFill,
  SpecLayerLine,
  SpecLayerFillExtrusion,
  NeedIcons,
} from "@mapbox-start/vue-bridge";

MapboxGL.accessToken = "pk.eyJ1IjoiZXJ5dSIsImEiOiJjazZybDNjbHEwNWY1M2Vtcnl3c3dqemNoIn0.GKMcdxRq_GrdMFmoUCXvYQ";

// Vue.use(SpecMap);
Vue.component("SpecMap", SpecMap);
Vue.component("SpecPopup", SpecPopup);
Vue.component("SpecMarker", SpecMarker);
Vue.component("SpecSourceGeoJson", SpecSourceGeoJSON);
Vue.component("SpecLayerCircle", SpecLayerCircle);
Vue.component("SpecLayerHoverCursorToggle", SpecLayerHoverCursorToggle);
Vue.component("SpecLayerEvent", SpecLayerEvent);
Vue.component("SpecLayerSymbol", SpecLayerSymbol);
Vue.component("SpecLayerFill", SpecLayerFill);
Vue.component("SpecLayerLine", SpecLayerLine);
Vue.component("SpecLayerFillExtrusion", SpecLayerFillExtrusion);
Vue.component("NeedIcons", NeedIcons);

new Vue({
  render: (h) => h(App),
}).$mount("#root");
