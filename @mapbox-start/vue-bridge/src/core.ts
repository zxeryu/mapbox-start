import { Vue, Component, Prop } from "vue-property-decorator";
import { CreateElement, VNode } from "vue";
@Component
export class Empty extends Vue {
  render(createElement: CreateElement): VNode {
    return createElement("");
  }
}

@Component
export class Provider<T> extends Vue {
  @Prop() value!: T;

  render(createElement: CreateElement): VNode {
    return createElement("div", this.$slots.default);
  }
}
