<!--
 * @Author: 李强
 * @Date: 2023-07-26 16:43:05
 * @LastEditors: 李强
 * @Description: table-toolbar组件
-->
<template>
  <div class="table-toolbar">
    <div class="table-toolbar-container left">
      <slot name="selection"></slot>
      <slot name="left"></slot>
    </div>
    <div class="table-toolbar-container right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "KTableToolbar",
});
</script>

<style lang="scss" scoped>
.table-toolbar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  &-container {
    display: flex;
    align-items: center;
    font-size: 12px;
    gap: 12px;
  }
}
</style>
