import { Vue, Component, Inject, Ref } from "vue-property-decorator";
import { IControl, Map } from "mapbox-gl";
import { CreateElement, VNode } from "vue";

type TPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";

@Component
class Controls extends Vue {
  protected position?: TPosition;

  @Ref("controlDiv") controlDiv!: HTMLDivElement;
  @Inject() map!: Map;

  private ctrl: IControl | undefined;

  mounted() {
    this.controlDiv.classList.add("mapboxgl-ctrl", "mapboxgl-ctrl-row");
    this.ctrl = {
      onAdd: (): HTMLElement => {
        return this.controlDiv;
      },
      onRemove: (): void => {
        if (this.controlDiv.parentNode) {
          this.controlDiv.parentNode.removeChild(this.controlDiv);
        }
      },
    };
    this.map.addControl(this.ctrl, this.position);
  }

  beforeDestroy() {
    this.map && this.ctrl && this.map.removeControl(this.ctrl);
  }

  render(createElement: CreateElement): VNode {
    return createElement("div", { ref: "controlDiv" }, this.$slots.default);
  }
}

@Component
export class TopLeftContainer extends Controls {
  position: TPosition = "top-left";
}

@Component
export class TopRightContainer extends Controls {
  position: TPosition = "top-right";
}

@Component
export class BottomLeftContainer extends Controls {
  position: TPosition = "bottom-left";
}

@Component
export class BottomRightContainer extends Controls {
  position: TPosition = "bottom-right";
}
