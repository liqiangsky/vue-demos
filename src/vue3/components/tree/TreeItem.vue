<template>
  <div
    v-if="treeNode"
    class="tree-node"
    :class="{ active: treeNode.isActive }"
    :style="{ paddingLeft: `calc(${treeNode.level} * var(--indent-size, 12px))` }"
    @click="nodeClick"
  >
    <slot :node="treeNode" :data="props.node.data"></slot>
  </div>
  <div
    class="tree-node-content"
    v-if="props.node.children && props.node.children.length > 0 && treeNode"
    v-show="treeNode.isExpand"
  >
    <TreeItem v-for="node in props.node.children" :key="node.id" :node="node">
      <template
        v-for="slotName in Object.keys(slots)"
        v-slot:[slotName]="slotScope: TreeNodeScope<T>"
        :key="slotName"
      >
        <slot :name="slotName" v-bind="slotScope"></slot>
      </template>
    </TreeItem>
  </div>
</template>
<script setup lang="ts" generic="T extends TreeNodeBase">
import { computed, inject, useSlots } from 'vue';

import { treeContextKey } from './config.ts';
import type { TreeNode, TreeNodeBase, TreeNodeScope, TreeProvideInject } from './types.d.ts';

defineOptions({
  name: 'TreeItem',
});

const props = defineProps<{
  node: TreeNode<T>;
}>();

const context = inject<TreeProvideInject<T>>(treeContextKey);
if (!context) {
  throw new Error('no injected');
}
// 定义插槽类型
const slots = useSlots();

const treeNode = computed(() => {
  return context.getNodeMeta(props.node.data.id);
});

const nodeClick = () => {
  context.nodeClick(treeNode.value!, props.node.data);
};
</script>
<style scoped lang="scss">
.tree-node {
  --height: var(--nodeHeight, 36px);
  font-weight: 400;
  font-size: var(--font-size-sm);
  height: var(--height);
  line-height: var(--height);
  background-color: #fff;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  &.active {
    font-weight: 700;
    color: #2878ff;
    background-color: rgba(40, 120, 255, 0.1);
  }
}
.tree-node-content {
  overflow: hidden;
}
</style>
