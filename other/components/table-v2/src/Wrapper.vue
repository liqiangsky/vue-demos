<!--
 * @Author: 李强
 * @Date: 2023-11-12 21:46:05
 * @LastEditors: 李强
 * @Description: table-v2-wrapper组件
-->
<template>
  <sl-table-v2
    ref="tableV2Ref"
    class="table-v2"
    v-bind="$attrs"
    :width="props.width"
    :height="props.height"
    :data="props.data"
    :columns="columns"
  >
    <template #empty="slotProps">
      <slot name="empty" v-bind="slotProps || {}">
        <sl-empty class="table-empty" description="暂无数据" :image-size="58">
          <template #image>
            <k-icon type="quesheng" class="empty-icon"></k-icon>
          </template>
        </sl-empty>
      </slot>
    </template>
    <template #cell="slotProps" v-if="!$slots['cell']">
      <slot :name="slotProps.column.dataKey + 'Cell'" v-bind="slotProps"></slot>
    </template>
    <template #header-cell="slotProps" v-if="!$slots['header-cell']">
      <slot :name="slotProps.column.dataKey + 'HeaderCell'" v-bind="slotProps">
        {{ slotProps.column.title }}
      </slot>
    </template>
    <template v-for="(slot, slotName) in $slots" :key="slotName" v-slot:[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps || {}"></slot>
    </template>
  </sl-table-v2>
</template>
<script setup lang="ts">
import { computed, getCurrentInstance, h, isVNode, onMounted, ref, resolveComponent, useSlots } from "vue";
import { formatMoney, formatToFixed } from "@kotler/utils";
import type { TableV2Props } from "@kotler/types/table-v2";
import type { TableInstance } from "@sl-design/sl-ui";
defineOptions({
  name: "KTableV2Wrapper",
});
const props = defineProps<{
  width: TableV2Props["width"];
  height: TableV2Props["height"];
  data: TableV2Props["data"];
  columns: TableV2Props["columns"];
}>();
const slots = useSlots();
const instance = getCurrentInstance();
const tableV2Ref = ref<TableInstance>();
/**
 * @description 表格宽度是否超出
 */
const visibleDisabled = ref(false);
/**
 * @description 表格的其他辅助信息
 */
const columnConfig = computed(() => {
  const { columns } = props;
  return columns.reduce(
    (result, item) => {
      if (item.width) {
        result.useWidthTotal += item.width;
      } else {
        result.unUseWidthNums++;
      }
      return result;
    },
    { useWidthTotal: 0, unUseWidthNums: 0 },
  );
});
/**
 * @description 自动宽度
 */
const autoWidth = computed(() => (props.width - columnConfig.value.useWidthTotal) / columnConfig.value.unUseWidthNums);
/**
 * @description 随机key
 */
const randomKey = () => Math.random().toString(36).substring(2);
/**
 * @description 鼠标移入
 * @param e
 */
const onmouseenter = e => {
  const { scrollWidth, clientWidth } = e.target;
  visibleDisabled.value = scrollWidth > clientWidth;
};
/**
 * @description 默认单元格有溢出提示
 * @param value
 */
const cellEllipsis = value => {
  return () =>
    h(
      "div",
      {
        class: "cell-ellipsis",
        onVnodeMounted(vNode) {
          vNode.el?.addEventListener("mouseenter", onmouseenter);
        },
        onVnodeUnmounted(vNode) {
          vNode.el?.removeEventListener("mouseenter", onmouseenter);
        },
      },
      value,
    );
};
/**
 * @description 自定义单元格渲染
 * @param column
 */
const cellRenderer = column => {
  if (slots["cell"] || slots[`${column.dataKey}Cell`]) {
    return void 0;
  }
  return cellProps => {
    let value = column.cellRenderer ? column.cellRenderer(cellProps) : cellProps.cellData;
    if (isVNode(value)) {
      return value;
    }
    value = formatter(cellProps, value);
    return h(
      resolveComponent("SlTooltip"),
      {
        placement: "top",
        disabled: !visibleDisabled.value,
        content: `${value}`,
      },
      cellEllipsis(value),
    );
  };
};
/**
 * @description 自定义头部渲染
 * @param column
 */
const headerCellRenderer = column => {
  if (slots["header-cell"] || slots[`${column.dataKey}HeaderCell`]) {
    return void 0;
  }
  return cellProps => {
    return column.headerCellRenderer ? column.headerCellRenderer(cellProps) : cellProps.column.title;
  };
};
/**
 * @description 处理表格列数据
 */
const columns = computed(() => {
  const { columns } = props;
  return columns.map(column => {
    return {
      ...column,
      key: column.key || randomKey(),
      width: column.width || autoWidth.value,
      cellRenderer: cellRenderer(column),
      headerCellRenderer: headerCellRenderer(column),
    };
  });
});
/**
 * @description 格式化序号
 * @param cellProps
 * @param value
 */
const formatIndexValue = (cellProps, value) => {
  if (cellProps.column?.dataKey === "index") {
    return cellProps.rowIndex + 1;
  }
  return value;
};
/**
 * @description 非法数据单元格填充内容
 * @param cellProps
 * @param value
 */
const formatVoidValue = (cellProps, value) => {
  if ((Array.isArray(value) && value.length === 0) || (!value && Number(value) !== 0)) {
    return "-";
  }
  return value;
};
/**
 * @description 格式化金额
 * @param cellProps
 * @param value
 */
const formatMoneyValue = (cellProps, value) => {
  if (cellProps.column.class?.includes("money")) {
    return formatMoney(formatToFixed(value));
  }
  return value;
};
/**
 * @description 格式化单元格内容
 * @param cellProps
 * @param cellValue
 */
const formatter = (cellProps, cellValue) => {
  cellValue = formatIndexValue(cellProps, cellValue);
  cellValue = formatVoidValue(cellProps, cellValue);
  if (cellValue === "-") {
    return cellValue;
  }
  cellValue = formatMoneyValue(cellProps, cellValue);
  return cellValue;
};
/**
 * @description 设置暴露属性、方法
 */
const setExposed = () => {
  if (instance && instance.exposed !== null) {
    // 得到组件暴露出的所有方法和属性
    const entries = Object.entries(tableV2Ref.value?.$.exposed || {});
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

<style scoped lang="scss">
.table-v2 {
  :deep(.sl-table-v2__header) {
    width: 100% !important;
  }
  :deep(.cell-ellipsis) {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  :deep(.sl-table-v2__empty) {
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 0;
  }
}
</style>
