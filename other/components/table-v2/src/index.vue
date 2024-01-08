<!--
 * @Author: 李强
 * @Date: 2023-11-12 21:46:05
 * @LastEditors: 李强
 * @Description: table-v2组件
-->
<template>
  <template v-if="props.width && props.height">
    <K-table-v2-wrapper ref="tableV2WrapperRef" v-bind="{ ...$attrs, ...props }">
      <template v-for="(slot, slotName) in $slots" :key="slotName" v-slot:[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps || {}"></slot>
      </template>
    </K-table-v2-wrapper>
  </template>
  <template v-else>
    <sl-auto-resizer>
      <template #default="{ width, height }">
        <K-table-v2-wrapper ref="tableV2WrapperRef" v-bind="{ ...$attrs, ...props }" :width="width" :height="height">
          <template v-for="(slot, slotName) in $slots" :key="slotName" v-slot:[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps || {}"></slot>
          </template>
        </K-table-v2-wrapper>
      </template>
    </sl-auto-resizer>
  </template>
</template>
<script setup lang="ts">
import { getCurrentInstance, ref, onMounted } from "vue";
import KTableV2Wrapper from "./Wrapper.vue";
import type { TableV2Props } from "@kotler/types/table-v2";
defineOptions({
  name: "KTableV2",
});
// const props = defineProps<TableV2Props>();
const props = defineProps<{
  width?: TableV2Props["width"];
  height?: TableV2Props["height"];
  data: TableV2Props["data"];
  columns: TableV2Props["columns"];
}>();
const instance = getCurrentInstance();
const tableV2WrapperRef = ref();
/**
 * @description 设置暴露属性、方法
 */
const setExposed = () => {
  if (instance && instance.exposed !== null) {
    // 得到组件暴露出的所有方法和属性
    const entries = Object.entries(tableV2WrapperRef.value?.$.exposed || {});
    for (const [key, value] of entries) {
      instance.exposed[key] = value;
    }
  }
};
defineExpose({
  ...instance?.exposed,
});
onMounted(() => {
  setExposed();
});
</script>
<style scoped lang="scss"></style>
