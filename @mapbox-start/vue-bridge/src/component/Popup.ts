import { Vue, Component, Prop, Inject, Ref, Provide } from "vue-property-decorator";
import { Anchor, LngLatLike, Map, PointLike, Popup } from "mapbox-gl";
import { pick } from "lodash";
import { MapboxGL } from "../Map";
import { CreateElement, VNode } from "vue";
import { get } from "lodash";

@Component
class PopupProvide extends Vue {
  @Prop() popup!: Popup;

  @Provide("popup") p: Popup = get(this.$options.propsData, "popup");

  render(createElement: CreateElement): VNode {
    return createElement("div", this.$slots.default);
  }
}

@Component
export class SpecPopup extends Vue {
  //options
  @Prop() closeButton?: boolean;
  @Prop() closeOnClick?: boolean;
  @Prop() closeOnMove?: boolean;
  @Prop() anchor?: Anchor;
  @Prop() offset?: number | PointLike | { [key: string]: PointLike };
  @Prop() className?: string;
  @Prop() maxWidth?: string;
  //other
  @Prop() lngLat?: LngLatLike;
  @Prop() onClose?: () => void;
  @Prop() onOpen?: () => void;

  @Inject() map!: Map;

  @Ref("popupDiv") popupDiv!: HTMLDivElement;

  private popup: Popup | undefined;

  mounted() {
    this.popup = new MapboxGL.Popup(
      pick(this.$options.propsData, [
        "closeButton",
        "closeOnClick",
        "closeOnMove",
        "anchor",
        "offset",
        "className",
        "maxWidth",
      ]),
    );
    this.popup.setDOMContent(this.popupDiv);
    this.lngLat && this.popup.setLngLat(this.lngLat);
    this.popup.addTo(this.map);

    this.popup.on("close", this.handleClose);
    this.popup.on("open", this.handleOpen);
  }

  beforeDestroy() {
    if (this.popup) {
      this.popup.remove();
      this.popup.off("close", this.handleClose);
      this.popup.off("open", this.handleOpen);
    }
  }

  handleClose() {
    this.onClose && this.onClose();
  }
  handleOpen() {
    this.onOpen && this.onOpen();
  }

  render(createElement: CreateElement): VNode {
    return createElement("div", { ref: "popupDiv" }, [createElement(PopupProvide, this.$slots.default)]);
  }
}
