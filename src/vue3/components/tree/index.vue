<template>
  <div>
    <TreeItem v-for="node in treeNodes" :key="node.id" :node="node">
      <template
        v-for="slotName in Object.keys(slots)"
        v-slot:[slotName]="slotScope"
        :key="slotName"
      >
        <slot :name="slotName" v-bind="slotScope"></slot>
      </template>
    </TreeItem>
  </div>
</template>
<script setup lang="ts" generic="T extends TreeNodeBase">
import { provide, reactive, ref, useSlots, watch } from 'vue';

import { treeContextKey } from './config.ts';
import TreeItem from './TreeItem.vue';
import type {
  TreeInstance,
  TreeNode,
  TreeNodeBase,
  TreeNodeStoreMeta,
  TreeProvideInject,
} from './types.d.ts';
defineOptions({
  name: 'TreeIndex',
});

const props = withDefaults(
  defineProps<{
    nodes: T[];
    filterCallback?: (data: T, value: string) => boolean;
  }>(),
  {
    filterCallback: () => true,
  },
);

const emits = defineEmits<{
  (e: 'node-click', value: { node: TreeNodeStoreMeta<T>; data: T }): void;
  (e: 'on-update'): void;
}>();
const treeNodes = ref<TreeNode<T>[]>([]);

const filter: TreeInstance<T>['filter'] = (value = '') => {
  function foreach(datas: T[]): TreeNode<T>[] {
    return datas
      .map((data) => {
        const match = props.filterCallback(data, value);
        const children = Array.isArray(data.children) ? foreach(<T[]>data.children) : [];
        if (match || children.length > 0) {
          return {
            id: data.id,
            data: data,
            children, // 保留匹配的子树
          };
        }
        return null;
      })
      .filter(Boolean) as TreeNode<T>[];
  }
  treeNodes.value = foreach(props.nodes);
};

const getNodeMeta: TreeInstance<T>['getNodeMeta'] = (id) => {
  return treeStore.get(id);
};

function eachNodeMeta(
  node: TreeNodeStoreMeta<T> | undefined | null,
  cb: (node: TreeNodeStoreMeta<T>) => void,
) {
  if (node) {
    cb(node);
    if (node.parent?.level !== 0) {
      eachNodeMeta(node.parent, cb);
    }
  }
}

const nodeToggle: TreeInstance<T>['nodeToggle'] = (node) => {
  if (node) {
    node.isExpand = !node.isExpand;
  }
};

const nodeHighlight: TreeInstance<T>['nodeHighlight'] = (id: string, isPath = false) => {
  for (const key of treeStore.keys()) {
    const nodeMeta = getNodeMeta(key);
    if (nodeMeta) {
      nodeMeta.isActive = false;
    }
  }
  if (!id) {
    return;
  }
  const node = getNodeMeta(id);
  if (!node) {
    return;
  }
  if (isPath) {
    eachNodeMeta(node, (item) => {
      item.isActive = true;
    });
  } else {
    node.isActive = true;
  }
};

const nodeClick = (node: TreeNodeStoreMeta<T>, data: T) => {
  emits('node-click', { node, data });
};

provide<TreeProvideInject<T>>(treeContextKey, {
  getNodeMeta,
  nodeClick,
});

// 定义插槽类型
const slots = useSlots();
const rootNode = {
  id: '0',
  data: {
    id: '__root__',
    children: [],
  },
  parent: null,
  level: 0,
  isExpand: true,
  isActive: true,
};
const map = new Map();
map.set(rootNode.data.id, rootNode);

const treeStore: Map<string, TreeNodeStoreMeta<T>> = reactive(map);
let id = 0;

watch(
  () => flattenIds(props.nodes),
  () => {
    updateTreeStore(props.nodes);
    filter('');
    emits('on-update');
  },
  { immediate: true },
);

function flattenIds(nodes: T[]): string[] {
  const ids: string[] = [];
  const walk = (arr: T[]) => {
    arr.forEach((node) => {
      ids.push(node.id);
      if (node.children?.length) {
        walk(<T[]>node.children);
      }
    });
  };
  walk(nodes);
  return ids;
}

function updateTreeStore(nodes: T[]) {
  const ids = new Set([rootNode.data.id]);
  const root = treeStore.get(rootNode.data.id)!;
  root.data.children = nodes;

  function walk(arr: T[], parent: TreeNodeStoreMeta<T>) {
    arr.forEach((item) => {
      ids.add(item.id);
      let meta = treeStore.get(item.id);
      if (!meta) {
        meta = {
          id: `${++id}`,
          data: item,
          parent,
          level: parent.level + 1,
          isExpand: false,
          isActive: false,
        };
        treeStore.set(item.id, meta);
      }
      if (item.children?.length) {
        walk(<T[]>item.children, meta);
      }
    });
  }

  walk(nodes, treeStore.get(rootNode.data.id)!);

  for (const key of treeStore.keys()) {
    if (!ids.has(key)) {
      treeStore.delete(key);
    }
  }
}

defineExpose({
  filter,
  nodeToggle,
  nodeHighlight,
  getNodeMeta,
});
</script>
<style scoped lang="scss"></style>
