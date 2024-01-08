<!--
 * @Author: 李强
 * @Date: 2023-07-26 16:43:05
 * @LastEditors: 耿振 1016203347@qq.com
 * @Description: table组件
-->
<template>
  <div class="table" :class="{ 'modal-table': props.mode === 'modal' }">
    <k-table-toolbar v-if="props.toolbar" v-bind="typeof props.toolbar === 'boolean' ? {} : props.toolbar">
      <template #selection>
        <slot name="select">
          <div v-if="isSelect">
            <span>已选：{{ selectionList?.length }}</span>
            <span v-if="props.pagination">/{{ (props.pagination as PaginationProps).total }}</span>
          </div>
        </slot>
      </template>
      <template #left>
        <slot name="toolbarLeft"></slot>
      </template>
      <template #right>
        <slot name="toolbarRight"></slot>
      </template>
    </k-table-toolbar>
    <sl-table ref="tableRef" v-bind="{ ...defaultTableProps, ...props.table }" style="margin-bottom: 3px">
      <k-table-column
        v-for="(column, index) in props.table?.columns"
        :key="column?.prop || index"
        v-bind="column"
        :column="column"
      >
        <template v-for="slot in tableColumnSlots" :key="slot" v-slot:[slot]="slotProps">
          <slot :name="slot" v-bind="slotProps || {}"></slot>
        </template>
      </k-table-column>
      <template #empty="slotProps">
        <slot name="empty" v-bind="slotProps || {}">
          <sl-empty class="table-empty" description="暂无数据" :image-size="58">
            <template #image>
              <k-icon type="quesheng" class="empty-icon"></k-icon>
            </template>
          </sl-empty>
        </slot>
      </template>
      <template v-if="$slots['append']" #append="slotProps">
        <slot name="append" v-bind="slotProps || {}"></slot>
      </template>
    </sl-table>
    <template v-if="Object.keys(props.pagination).length > 0">
      <k-page-footer class="pagination-page" v-if="props.mode === 'page'">
        <k-pagination :mode="props.mode" background :pagination="<PaginationProps>props.pagination" />
      </k-page-footer>
      <k-pagination
        class="pagination-modal"
        v-else-if="props.mode === 'modal'"
        :mode="props.mode"
        background
        :pagination="<PaginationProps>props.pagination"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
// import type { TableInstance } from "element-plus";
import type { TableInstance } from "@sl-design/sl-ui";
import type { TableProps } from "@kotler/types/table";
import type { PaginationProps } from "@kotler/types/pagination";
import type { UseIntersectionObserverReturn } from "@vueuse/core";
import { computed, getCurrentInstance, onMounted, onUnmounted, ref, useSlots } from "vue";
import { useCurrentElement, useIntersectionObserver } from "@vueuse/core";
import KTableColumn from "./Column.vue";
import KTableToolbar from "./ToolBar.vue";
defineOptions({
  name: "KTable",
});
const props = withDefaults(defineProps<TableProps>(), {
  mode: "page",
  toolbar: true,
});
const slots = useSlots();
const ele = useCurrentElement();
const instance = getCurrentInstance();
const dynamicHeight = ref<number>(0);
const tableRef = ref<TableInstance>();
let intersectionObserverStop: UseIntersectionObserverReturn["stop"];
/**
 * @description 过滤出tableColumn的插槽
 */
const tableColumnSlots = computed(() => {
  return Object.keys(slots).filter(item => !["empty", "append", "toolbarLeft", "toolbarRight"].includes(item));
});
/**
 * @description 计算表格动态高度
 */
const getTableDynamicHeight = computed(() =>
  props.mode === "modal" ? "auto" : `calc(100vh - ${dynamicHeight.value}px)`,
);
/**
 * @description 选中的数据
 */
const selectionList = computed<any[]>(() => {
  return tableRef.value?.getSelectionRows() || [];
});
/**
 * @description 是否可以勾选
 */
const isSelect = computed(() => props.table.columns?.[0]?.type === "selection");
/**
 * @description 根据路径查找值
 * @param data
 * @param path
 */
const getPathValue = (data, path: string[]) => {
  const pathArr = [...path];
  const key = pathArr.shift();
  if (key) {
    if (pathArr.length > 0) {
      return getPathValue(data[key], pathArr);
    }
    return data[key];
  }
  return data;
};
/**
 * @description 设置表格选中样式
 * @param row
 */
const getTableCellStyle = ({ row }) => {
  if (isSelect.value) {
    const rowKey = props.table?.rowKey;
    let cb: (row?: any) => any = () => {};
    if (rowKey) {
      if (typeof rowKey === "string") {
        const path = (rowKey || "").split(".");
        cb = row => getPathValue(row, path);
      } else {
        cb = rowKey;
      }
    }
    return selectionList.value.find(record => (rowKey ? cb(record) === cb(row) : record === row))
      ? {
          backgroundColor: "var(--kotler-components-Table-cell-active-backgroundColor)",
        }
      : {};
  }
  return {};
};
/**
 * @description 表格的高度
 */
const getTableHeight = computed(() => {
  if (props.mode !== "modal" && !props.table.height && !props.table.maxHeight) {
    return {
      height: getTableDynamicHeight,
    };
  } else if (props.table.height) {
    return {
      height: props.table.height,
    };
  } else if (props.table.maxHeight) {
    return {
      maxHeight: props.table.maxHeight,
    };
  }
  return { height: "auto" };
});
/**
 * @description 设置动态高度
 */
const setDynamicHeight = () => {
  const tableHeader = ele.value.getElementsByClassName("sl-table__header-wrapper")[0];
  // 获取tableHeader顶部距离窗口顶部的高度
  const tableHeaderTop = tableHeader.getBoundingClientRect().top;
  dynamicHeight.value = tableHeaderTop + 63;
};
/**
 * @description 默认table属性
 */
const defaultTableProps = ref({
  showOverflowTooltip: true,
  headerCellStyle: {
    backgroundColor: "var(--kotler-components-Table-header-cell-backgroundColor)",
  },
  cellStyle: getTableCellStyle,
  ...getTableHeight.value,
});
/**
 * @description 设置表格高度
 */
const setHeight = () => {
  // 不传height和maxHeight自动计算高度
  if (props.mode !== "modal" && !props.table.height && !props.table.maxHeight) {
    const { stop } = useIntersectionObserver(tableRef.value?.$el, ([{ isIntersecting }]) => {
      if (isIntersecting) {
        setDynamicHeight();
        window.addEventListener("resize", setDynamicHeight);
      } else {
        window.removeEventListener("resize", setDynamicHeight);
      }
    });
    intersectionObserverStop = stop;
  }
};
/**
 * @description 设置暴露属性、方法
 */
const setExposed = () => {
  if (instance && instance.exposed !== null) {
    // 得到组件暴露出的所有方法和属性
    const entries = Object.entries(tableRef.value?.$.exposed || {});
    for (const [key, value] of entries) {
      instance.exposed[key] = value;
    }
  }
};
defineExpose({
  ...instance?.exposed,
  selection: selectionList,
});
onMounted(() => {
  setExposed();
  setHeight();
});
onUnmounted(() => {
  intersectionObserverStop?.();
});
</script>
<style lang="scss" scoped>
.table {
  .pagination-page {
    display: flex;
  }
  .pagination-modal {
    margin-top: 13px;
  }
}
.modal-table {
  :deep(.sl-table__empty-block) {
    min-height: 200px;
  }
}
</style>
