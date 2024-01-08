# Table API

---

| 属性名     | 说明                           | 类型                    | 默认值 |
| ---------- | ------------------------------ | ----------------------- | ------ |
| mode       | 模式(页面级别、弹窗级别)       | `TableProps<T>['mode']` | page   |
| toolbar    | 工具条                         | `boolean`               | true   |
| table      | 参考ElementPlus-Table组件      | `TableType<T>`          |        |
| pagination | 参考ElementPlus-Pagination组件 | `PaginationType`        |        |

## 🦄 Usage

---

### Table 事件

> 🎩 参考ElementPlus-Table组件事件

```ts
import { reactive } from "vue";
const table = reactive({
  // ...
  // 所有事件以on开头
  onSelect: (selection, row) => {
    // do something...
  },
  onSelectAll: selection => {
    // do something...
  },
});
```

### Table 方法

> 🎩 参考ElementPlus-Table组件方法

```vue
<template>
  <k-table ref="tableRef" ... />
</template>
```

```ts
import KTable from "@kotler/components/table/index.vue";
import type { TableInstance } from "@kotler/types/table";
import { ref } from "vue";
const tableRef = ref<TableInstance>();
// 调用table方法
const clearSelection = () => {
  tableRef.value?.clearSelection();
};
```

### Table 插槽

```vue
<template>
  <k-table ...>
    <!-- 工具条两个插槽: toolbarLeft、toolbarRight -->
    <template #toolbarLeft> do something... </template>
    <template #toolbarRight> do something... </template>
    <!-- 自定义列插槽名根据columns配置中的prop属性来定义插槽名称 -->
    <template #date="{ row, column, $index }"> do something... </template>
    <!-- 自定义列表头插槽名根据当前列的prop + Header -->
    <template #dateHeader="{ column, $index }"> do something... </template>
    <!-- 表格自带的两个插槽: append、empty -->
    <template #append> do something... </template>
    <!-- 空状态插槽，已默认一般不需要写-->
    <template #empty> do something... </template>
  </k-table>
</template>
```

### Table 多级表头

```ts
import { reactive } from "vue";
const table = reactive({
  data: [
    {
      date: "2016-05-03",
      name: "Tom",
      address: "No. 189, Grove St, Los Angeles",
    },
  ],
  columns: [
    // column的属性参考ElementPlus-Table组件的table-column属性
    {
      prop: "date",
      label: "Date",
    },
    {
      prop: "DeliverInfo",
      label: "Deliver Info",
      // 多级表头嵌套columns即可
      columns: [
        {
          prop: "name",
          label: "Name",
        },
        {
          prop: "address",
          label: "Address",
        },
      ],
    },
  ],
});
```

### Table 勾选高亮

```vue
<template>
  <k-table :table="table"></k-table>
</template>
```

```ts
import { reactive } from "vue";
import KTable from "@kotler/components/table/index.vue";
const tableProsp = reactive({
  data: [
    //...
  ],
  columns: [
    {
      type: "selection", // 支持勾选 设置该值勾选即可高亮
    },
    //...
  ],
});
```

### 关于Table高度

> 🧱 [混用height和maxHeight属性有bug](https://github.com/element-plus/element-plus/issues/13152)

```vue
<template>
  <k-table :table="table" />
</template>
```

```ts
import { reactive } from "vue";
import KTable from "@kotler/components/table/index.vue";
// table的高度默认自动计算，如果需要自定义高请使用height属性，尽量不使用maxHeight。
// table组件默认内部已计算高度
const table = reactive({
  height: 400,
  // ...
});
```

### Table组件跨页勾选

> 🎩 [参考ElementPlus-Table组件table-column属性(reserve-selection)](https://element-plus.org/zh-CN/component/table.html#table-column-%E5%B1%9E%E6%80%A7)

```vue
<template>
  <k-table :table="table" />
</template>
```

```ts
import { reactive } from "vue";
import KTable from "@kotler/components/table/index.vue";
const table = reactive({
  rowKey: "key", // 行的key 唯一 也可传路径 如：data.id
  data: [],
  columns: [
    {
      type: "selection", // 支持勾选
      reserveSelection: true, // 设置该值时 row-key必传
    },
    {
      prop: "date",
      label: "Date",
    },
  ],
  // ...
});
```

### 获取已选数据

```vue
<template>
  <k-table ref="tableRef" ... />
</template>
```

```ts
import KTable from "@kotler/components/table/index.vue";
import type { TableInstance } from "@kotler/types/table";
import { ref } from "vue";
const tableRef = ref<TableInstance>();
console.log(tableRef.value?.selection.value); // 推荐使用
// console.log(tableRef.value?.getSelectionRows()); //与上面相同
```

### 基础示例

```vue
<template>
  <k-table :table="table" :pagination="pagination">
    <template #dateHeader="{ column, $index }">
      {{ column }}
    </template>
    <template #action="{ row, column, $index }">
      <sl-button size="small" type="danger" @click="handleDelete($index, row)">Delete</sl-button>
    </template>
  </k-table>
</template>
```

```ts
import { reactive } from "vue";
import KTable from "@kotler/components/table/index.vue";
const table = reactive({
  data: [
    {
      date: "2016-05-03",
      name: "Tom",
      address: "No. 189, Grove St, Los Angeles",
      value: 100,
    },
    {
      date: "2016-05-03",
      name: "Tom",
      address: "No. 189, Grove St, Los Angeles",
      value: 3000,
    },
    {
      date: "2016-05-03",
      name: "Tom",
      address: "No. 189, Grove St, Los Angeles",
      value: 10.52,
    },
    // ...
  ],
  columns: [
    {
      fixed: "left", // 固定列
      type: "selection", // 支持勾选
    },
    {
      fixed: "left",
      type: "index", // 序号
      label: "序号",
    },
    {
      prop: "date",
      label: "Date",
      labelClassName: "required-asterisk", // 表头前加*
    },
    {
      prop: "name",
      label: "Name",
      sortable: true, // 排序
    },
    {
      prop: "address",
      label: "Address",
    },
    {
      prop: "value",
      label: "money",
      className: "money", // 如果是金额类的 className包含money即可 默认靠右，金额格式化，千分位分隔符，保留两位小数 eg: 2000 => 2,000.00
    },
    {
      fixed: "right",
      prop: "action",
      label: "操作",
      width: 172,
    },
  ],
});
const pagination = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 10,
  onCurrentPageChange: val => {
    // do something...
  },
  onPageSizeChange: val => {
    if (pagination.currentPage !== 1) {
      pagination.currentPage = 1; // 注意：这里修改不会触发onCurrentPageChange事件
    }
    // do something...
  },
});
const handleDelete = (index, row) => {
  table.data.splice(index, 1);
};
```
