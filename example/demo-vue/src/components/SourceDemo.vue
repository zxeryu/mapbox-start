<template>
  <div>
    <CheckControl name="image & raster layer" :default-check="false">
      <spec-source-image
        url="/xhr.jpg"
        :coordinates="[
          [0, -14],
          [12, -14],
          [12, -28],
          [0, -28],
        ]"
      >
        <spec-layer-raster :paint="{ 'raster-opacity': 0.6 }" />
      </spec-source-image>
    </CheckControl>
    <CheckControl name="canvas & raster layer" :default-check="false" :on-change="onCanvasChange">
      <spec-source-canvas
        :canvas="canvas"
        :animate="true"
        :coordinates="[
          [0, -14],
          [15, -14],
          [15, -28],
          [0, -28],
        ]"
      >
        <spec-layer-raster />
      </spec-source-canvas>
    </CheckControl>
    <CheckControl name="raster-dem & hillshade layer" :default-check="false">
      <spec-source-raster-dem url="mapbox://mapbox.terrain-rgb">
        <spec-layer-hill-shade />
      </spec-source-raster-dem>
    </CheckControl>
    <CheckControl name="raster & raster layer" :default-check="false">
      <spec-source-raster
        :tiles="['https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg']"
        :tileSize="256"
        attribution="Map tiles by <a target='_top' rel='noopener' href='http://stamen.com'>Stamen Design</a>, under <a target='_top' rel='noopener' href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>. Data by <a target='_top' rel='noopener' href='http://openstreetmap.org'>OpenStreetMap</a>, under <a target='_top' rel='noopener' href='http://creativecommons.org/licenses/by-sa/3.0'>CC BY SA</a>"
      >
        <spec-layer-raster />
      </spec-source-raster>
    </CheckControl>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import CheckControl from "../CheckControl.vue";

class Circle {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private x: number,
    private y: number,
    private dx: number,
    private dy: number,
    private radius: number,
    private color: string,
  ) {}

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.strokeStyle = this.color;
    this.ctx.stroke();
  }
  update() {
    if (this.x + this.radius > 400 || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }

    if (this.y + this.radius > 400 || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  }
}

@Component({
  components: { CheckControl },
})
export default class SourceDemo extends Vue {
  canvas = document.createElement("canvas");
  ctx: CanvasRenderingContext2D | null = null;
  circles: Circle[] = [];

  handleNumber = 0;

  mounted() {
    this.canvas.width = 400;
    this.canvas.height = 400;
    this.ctx = this.canvas.getContext("2d");
    const radius = 20;
    for (let i = 0; i < 5; i++) {
      const color = "#" + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
      const x = Math.random() * (400 - radius * 2) + radius;
      const y = Math.random() * (400 - radius * 2) + radius;

      const dx = (Math.random() - 0.5) * 2;
      const dy = (Math.random() - 0.5) * 2;

      this.circles.push(new Circle(this.ctx!, x, y, dx, dy, radius, color));
    }
  }

  animate() {
    this.handleNumber = requestAnimationFrame(this.animate);
    this.ctx!.clearRect(0, 0, 400, 400);

    for (let r = 0; r < 5; r++) {
      this.circles[r].update();
    }
  }

  onCanvasChange(state: boolean) {
    if (state) {
      this.animate();
    } else {
      cancelAnimationFrame(this.handleNumber);
    }
  }
}
</script>
