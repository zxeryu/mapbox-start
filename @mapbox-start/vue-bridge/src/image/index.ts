import { template, map } from "lodash";
import { Vue, Component, Inject, Prop } from "vue-property-decorator";
import { CreateElement, VNode } from "vue";
import { Map } from "mapbox-gl";
import { Img } from "./Img";

export const tagTemplate = (s: string) => {
  return template(s, {
    interpolate: /{{([\s\S]+?)}}/g,
  });
};

export const svgFor = (svg: string, fill: string) => {
  return tagTemplate(svg)({ fill });
};

export const svgToDataURL = (svg: string): string => {
  try {
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  } catch (e) {
    console.error(e, svg);
    return "";
  }
};

export type IImageOpts = {
  svg?: string;
  url?: string;
  size: number;
  normalize?: boolean;
  sdf?: boolean;
};

@Component
export class NeedIcons extends Vue {
  @Prop() icons!: { [name: string]: IImageOpts };

  @Inject() map!: Map;

  private isAllLoaded = false;

  data(): object {
    return { isAllLoaded: false };
  }

  mounted() {
    Promise.all(
      map(this.icons, (i, name) => {
        return Img.fromURL(this.map, i.svg ? svgToDataURL(i.svg) : i.url || "", i.size, name, i.sdf);
      }),
    ).then(() => {
      this.isAllLoaded = true;
    });
  }

  render(createElement: CreateElement): VNode {
    return createElement("div", this.isAllLoaded ? this.$slots.default : undefined);
  }
}
