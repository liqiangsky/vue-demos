<!--
 * @Author: 李强
 * @Date: 2024-03-07 10:34:50
 * @LastEditors: 李强
 * @Description: auto-tooltip自动显示
-->
<template>
  <sl-tooltip
    v-bind="{
      offset: 12,
      ...$attrs,
      ...($slots['content'] ? null : content ? { content } : { content: '这是默认内容' }),
      ...(!visible ? { visible: false } : null),
    }"
  >
    <div ref="el">
      <slot></slot>
    </div>
    <template v-if="$slots['content']" #content>
      <slot name="content"></slot>
    </template>
  </sl-tooltip>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import {
  useMutationObserver,
  useResizeObserver,
  type UseMutationObserverReturn,
  type UseResizeObserverReturn,
} from "@vueuse/core";
defineOptions({
  name: "KAutoTooltip",
});
const props = withDefaults(
  defineProps<{
    content?: string;
    targetMark: string;
    resize?: boolean;
    overflowing?: (el: HTMLElement) => boolean;
  }>(),
  {
    resize: false,
    overflowing: (el: HTMLElement) => el.scrollWidth > el.offsetWidth,
  },
);
const el = ref();
const target = ref();
const visible = ref(false);
const stopHandle: {
  resize: UseResizeObserverReturn["stop"];
  mutation: UseMutationObserverReturn["stop"];
} = {
  resize: () => {},
  mutation: () => {},
};
/**
 * @description 更新tooltip显示状态
 */
const updateVisible = () => {
  if (target.value) {
    visible.value = props.overflowing(target.value);
  }
};
/**
 * @description 监听元素大小变化
 */
const isResize = () => {
  if (props.resize) {
    const { stop } = useResizeObserver(target.value, () => {
      updateVisible();
    });
    stopHandle.resize = stop;
  }
};
/**
 * @description 监听元素内容变化
 */
const isMutation = () => {
  const { stop } = useMutationObserver(
    target,
    () => {
      updateVisible();
    },
    {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    },
  );
  stopHandle.mutation = stop;
};
onMounted(() => {
  target.value = el.value.querySelector("[" + props.targetMark + "]");
  if (!target.value) {
    console.warn("未找到指定targetMark的元素");
    return;
  }
  updateVisible();
  isResize();
  isMutation();
});
onUnmounted(() => {
  stopHandle.resize?.();
  stopHandle.mutation?.();
});
</script>
<style scoped lang="scss"></style>
