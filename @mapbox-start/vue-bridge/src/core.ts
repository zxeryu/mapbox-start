import { Vue, Component } from "vue-property-decorator";
import { CreateElement, VNode } from "vue";
@Component
export class Empty extends Vue {
  render(createElement: CreateElement): VNode {
    return createElement("");
  }
}
