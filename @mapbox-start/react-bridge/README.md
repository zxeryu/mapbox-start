# `react-bridge`

> mapbox-gl react bridge

## Necessary

```
1. <script src="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.js"></script>
   <link href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css" rel="stylesheet" />
2. "react": "16.8+","uuid": "8.x","lodash": "4.x"
```

## Install

```shell script
yarn add @mapbox-start/react-bridge
```

## Usage

```jsx
import {
  SpecMap,
  SpecMarker,
  SpecPopup,
  SpecSourceGeoJSON,
  SpecLayerSymbol,
  SpecLayerEvent,
} from "@mapbox-start/vue-bridge";

//marker popup
<SpecMap {...props}>
  <SpecMarker />
  <SpecPopup />
</SpecMap>;

//source  layer
<SpecSourceGeoJSON>
  <SpecLayerSymbol>
    <SpecLayerEvent />
  </SpecLayerSymbol>
</SpecSourceGeoJSON>;
```

[详细 demo](https://github.com/zxeryu/mapbox-start/tree/main/example/demo-react)
