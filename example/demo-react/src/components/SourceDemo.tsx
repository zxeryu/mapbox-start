import {
  SpecSourceImage,
  SpecLayerRaster,
  SpecSourceCanvas,
  SpecSourceRasterDem,
  SpecLayerHillShade,
  SpecSourceRaster,
  SpecSourceVector,
  SpecLayerFill,
} from "@mapbox-start/react-bridge";
import React, { useCallback, useEffect, useMemo } from "react";
import { CheckControl } from "../MapDemo";

const SourceImage = () => {
  return (
    <SpecSourceImage
      url={"/xhr.jpg"}
      coordinates={[
        [0, -14],
        [12, -14],
        [12, -28],
        [0, -28],
      ]}>
      <SpecLayerRaster paint={{ "raster-opacity": 0.6 }} />
    </SpecSourceImage>
  );
};

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

const SourceCanvas = () => {
  const { canvas, ctx, circles } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d")!;
    const circles = [];
    const radius = 20;
    for (let i = 0; i < 5; i++) {
      const color = "#" + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
      const x = Math.random() * (400 - radius * 2) + radius;
      const y = Math.random() * (400 - radius * 2) + radius;

      const dx = (Math.random() - 0.5) * 2;
      const dy = (Math.random() - 0.5) * 2;

      circles.push(new Circle(ctx, x, y, dx, dy, radius, color));
    }
    return {
      canvas,
      ctx,
      circles,
    };
  }, []);

  const animate = useCallback(() => {
    requestAnimationFrame(animate);
    ctx!.clearRect(0, 0, 400, 400);

    for (let r = 0; r < 5; r++) {
      circles[r].update();
    }
  }, []);

  useEffect(() => {
    animate();
  }, []);

  return (
    <SpecSourceCanvas
      coordinates={[
        [0, -14],
        [15, -14],
        [15, -28],
        [0, -28],
      ]}
      canvas={canvas}
      animate={true}>
      <SpecLayerRaster />
    </SpecSourceCanvas>
  );
};

const SourceRasterDem = () => {
  return (
    <SpecSourceRasterDem url={"mapbox://mapbox.terrain-rgb"}>
      <SpecLayerHillShade />
    </SpecSourceRasterDem>
  );
};

const SourceRaster = () => {
  return (
    <SpecSourceRaster
      tiles={["https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg"]}
      tileSize={256}
      attribution={
        'Map tiles by <a target="_top" rel="noopener" href="http://stamen.com">Stamen Design</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
      }>
      <SpecLayerRaster />
    </SpecSourceRaster>
  );
};

export const SourceVector = () => {
  return (
    <SpecSourceVector url={"mapbox://mapbox.660ui7x6"}>
      <SpecLayerFill
        sourceLayer={"state_county_population_2014_cen"}
        paint={{
          "fill-opacity": 0.75,
          "fill-color": [
            "interpolate",
            ["linear"],
            ["get", "population"],
            0,
            "#F2F12D",
            500000,
            "#EED322",
            750000,
            "#E6B71E",
            1000000,
            "#DA9C20",
            2500000,
            "#CA8323",
            5000000,
            "#B86B25",
            7500000,
            "#A25626",
            10000000,
            "#8B4225",
            25000000,
            "#723122",
          ],
        }}
      />
    </SpecSourceVector>
  );
};

export const SourceDemo = () => {
  return (
    <>
      <CheckControl name={"image & raster layer"} defaultCheck={false}>
        <SourceImage />
      </CheckControl>
      <CheckControl name={"canvas & raster layer"} defaultCheck={false}>
        <SourceCanvas />
      </CheckControl>
      <CheckControl name={"raster-dem & hillshade layer"} defaultCheck={false}>
        <SourceRasterDem />
      </CheckControl>
      <CheckControl name={"raster & raster layer"} defaultCheck={false}>
        <SourceRaster />
      </CheckControl>
      <CheckControl name={"vector & fill layer"} defaultCheck={false}>
        <SourceVector />
      </CheckControl>
    </>
  );
};
