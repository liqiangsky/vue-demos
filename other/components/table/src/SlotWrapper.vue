<!--
 * @Author: 李强
 * @Date: 2023-07-26 16:43:05
 * @LastEditors: 李强
 * @Description: slot-wrapper组件 包裹插槽
-->
<template>
  <slot></slot>
</template>
<script lang="ts" setup>
defineOptions({
  name: "KSlotWrapper",
});
</script>
