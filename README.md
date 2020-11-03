基于 mapbox-gl 的 react, vue 桥接库.

> 提供 react、vue 的组件式写法

## Usage

### react-bridge

```jsx
import { SpecMap, SpecMarker, SpecPopup } from "@mapbox-start/react-bridge";

<SpecMap {...props}>
  <SpecMarker />
  <SpecPopup />
</SpecMap>;
```

[详细 demo](https://github.com/zxeryu/mapbox-start/tree/main/example/demo-react)

### vue-bridge

```jsx
import { SpecMap, SpecMarker, SpecPopup } from "@mapbox-start/vue-bridge";

<SpecMap {...props}>
  <SpecMarker />
  <SpecPopup />
</SpecMap>;
```

[详细 demo](https://github.com/zxeryu/mapbox-start/tree/main/example/demo-vue)

## Demo

```shell script
$ git clone https://github.com/zxeryu/mapbox-start.git
$ cd mapbox-start
$ yarn install
//react demo
$yarn start
//vue demo
$yarn start-v
```
