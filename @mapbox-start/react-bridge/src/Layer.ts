import { Source } from "./Source";
import { v4 as uuid } from "uuid";
import { Map, Layer as ILayer } from "mapbox-gl";
import { pickBy, identity } from "lodash";

export class Layer {
  static from(source: Source<any>, sourceLayer?: string): Layer {
    return new Layer(source, undefined, sourceLayer ? { "source-layer": sourceLayer } : {});
  }

  private m: Map | undefined;
  constructor(private source: Source<any>, public id = `${source.id}:${uuid()}`, private spec: Omit<ILayer, "id">) {}

  named(id?: string) {
    return new Layer(this.source, id, this.spec);
  }

  clone(spec: Omit<ILayer, "id" | "source-layer" | "source">) {
    return new Layer(this.source, this.id, {
      ...this.spec,
      ...pickBy(spec, identity),
    });
  }

  get(): ILayer | null {
    if (!this.m) {
      return null;
    }
    return this.m.getLayer(this.id);
  }

  toSpec(): ILayer {
    if (this.spec && this.spec.type) {
      if (this.spec.type === "background") {
        return {
          ...this.spec,
          id: this.id,
        };
      }
      return {
        ...this.spec,
        id: this.id,
        source: this.source.id,
      };
    }
    // default, in general no use
    return {
      id: this.id,
      source: this.source.id,
    };
  }

  addTo(m: Map, before?: string) {
    this.source.addTo(m);
    if (before) {
      const beforeLayer = m.getLayer(before);
      if (!beforeLayer) {
        console.warn(`layer ${before} is not added`);
        before = undefined;
      }
    }
    if (m.getLayer(this.id)) {
      m.removeLayer(this.id);
      this.m = m.addLayer(this.toSpec(), before);
      return this;
    }
    this.m = m.addLayer(this.toSpec(), before);
    return this;
  }

  remove() {
    if (!this.m) {
      return;
    }
    this.m.removeLayer(this.id);
    this.source.remove();

    this.m = undefined;
  }
}
