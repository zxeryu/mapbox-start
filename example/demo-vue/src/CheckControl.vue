<template>
  <div style="cursor: pointer; display: flex; align-items: center" @click="handleClick">
    <input type="checkbox" :checked="checked" />
    &nbsp;&nbsp;
    {{ name }}
    <slot v-if="checked"></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
@Component
export default class CheckControl extends Vue {
  @Prop() name!: string;
  @Prop({ default: true }) defaultCheck?: boolean;
  @Prop() onChange?: (state: boolean) => void;

  private checked: boolean = false;

  mounted() {
    this.checked = !!this.defaultCheck;
  }

  handleClick() {
    this.checked = !this.checked;
    this.onChange && this.onChange(this.checked);
  }
}
</script>

<style scoped></style>
