<!--
 * @Author: 李强
 * @Date: 2023-07-26 16:43:05
 * @LastEditors: 李强
 * @Description: table-column组件
-->
<template>
  <sl-table-column v-bind="{ ...column, formatter }">
    <template #default v-if="column?.columns?.length">
      <k-table-column
        v-for="(columnColumn, index) in column?.columns"
        :key="columnColumn?.prop || index"
        :column="columnColumn"
      >
        <template v-for="slot in Object.keys($slots)" :key="slot" v-slot:[slot]="slotProps">
          <slot :name="slot" v-bind="slotProps || {}"></slot>
        </template>
      </k-table-column>
    </template>
    <template v-else-if="$slots[<string>(column.prop || column.label)]" #default="slotProps">
      <!-- 解决表格无数据时造成该插槽内的组件加载 -->
      <K-slot-wrapper>
        <slot :name="column.prop || column.label" v-bind="slotProps || {}"></slot>
      </K-slot-wrapper>
    </template>
    <template v-if="$slots[`${<string>(column.prop || column.label)}Header`]" #header="slotProps">
      <K-slot-wrapper>
        <slot :name="`${column.prop || column.label}Header`" v-bind="slotProps || {}"></slot>
      </K-slot-wrapper>
    </template>
  </sl-table-column>
</template>
<script setup lang="ts">
import { isVNode } from "vue";
import type { TableColumn } from "@kotler/types/table";
import type { TableColumnCtx } from "@sl-design/sl-ui";
import KSlotWrapper from "./SlotWrapper.vue";
import { formatMoney, formatToFixed } from "@kotler/utils";
import isNull from "lodash-es/isNull";

defineOptions({
  name: "KTableColumn",
});

const props = defineProps<{
  column: TableColumn;
}>();
/**
 * @description 非法数据单元格填充内容
 * @param column
 * @param value
 */
const formatVoidValue = (column, value) => {
  if ((Array.isArray(value) && value.length === 0) || isNull(value) || (!value && Number(value) !== 0)) {
    return "-";
  }
  return value;
};
/**
 * @description 格式化金额
 * @param column
 * @param value
 */
const formatMoneyValue = (column, value) => {
  if (column.className?.includes("money")) {
    return formatMoney(formatToFixed(value));
  }
  return value;
};
/**
 * @description 格式化单元格内容
 * @param row
 * @param column
 * @param cellValue
 * @param index
 */
const formatter = (row, column, cellValue, index) => {
  cellValue = props.column.formatter
    ? (<TableColumnCtx<any>>props.column).formatter(row, column, cellValue, index)
    : cellValue;
  if (isVNode(cellValue)) {
    return cellValue;
  }
  cellValue = formatVoidValue(column, cellValue);
  if (cellValue === "-") {
    return cellValue;
  }
  cellValue = formatMoneyValue(column, cellValue);
  return cellValue;
};
</script>

<style scoped></style>
