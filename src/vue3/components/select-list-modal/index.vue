<template>
  <el-dialog
    class="dialog"
    v-model="show"
    :title="defaultOptions.title"
    width="580"
    :before-close="cancel"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :append-to-body="true"
  >
    <el-space :size="12">
      <div class="card-wrapper">
        <span>待选列表</span>
        <div class="card">
          <el-input v-model.trim="waitedSearchText" placeholder="搜索" clearable>
            <template #prefix>
              <i class="iconfont icon-ic-search"></i>
            </template>
          </el-input>
          <div class="list">
            <div class="list-header">
              <el-checkbox
                class="checkbox-item"
                v-model="isCheckAll"
                :indeterminate="isIndeterminate"
                >全部（{{ list.length }}）</el-checkbox
              >
            </div>
            <el-scrollbar style="height: calc(100% - var(--list-select-item-height))">
              <el-checkbox-group v-model="checkedList">
                <RecycleScroller
                  key="1"
                  class="scroller"
                  :items="waitedList"
                  :item-size="32"
                  key-field="id"
                  v-slot="{ item }"
                >
                  <el-checkbox
                    class="checkbox-item"
                    :label="item.label"
                    :value="item"
                  ></el-checkbox>
                </RecycleScroller>
              </el-checkbox-group>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <div class="card-wrapper">
        <span>已选列表</span>
        <div class="card">
          <el-input v-model="selectedSearchText" placeholder="搜索" clearable>
            <template #prefix>
              <i class="iconfont icon-ic-search"></i>
            </template>
          </el-input>
          <div class="list">
            <div class="list-header selected">
              当前已选（{{ checkedList.length }}）
              <el-button type="primary" link @click="selectedClear(selectedSearchText)">
                {{ selectedSearchText ? '筛选清空' : '清空' }}</el-button
              >
            </div>
            <div class="list-content">
              <el-scrollbar class="scrollbar" v-if="selectedList.length > 0">
                <RecycleScroller
                  key="2"
                  class="scroller"
                  :items="selectedList"
                  :item-size="32"
                  key-field="id"
                  v-slot="{ item }"
                >
                  <div class="selected-item">
                    <div class="ellipsis">{{ item.label }}</div>
                    <i class="iconfont icon-ic_cha" @click="removeSelected(item)"></i>
                  </div>
                </RecycleScroller>
              </el-scrollbar>
              <el-empty
                class="data-empty"
                v-else-if="selectedSearchText && selectedList.length === 0"
                description="暂无数据"
              >
                <template #image>
                  <svg class="icon svg-icon" aria-hidden="true">
                    <use xlink:href="#icon-zanwushuju"></use>
                  </svg>
                </template>
              </el-empty>
              <div class="no-select-empty" v-else>请在左侧选择</div>
            </div>
          </div>
        </div>
      </div>
    </el-space>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm" :disabled="checkedList.length === 0"
          >确定</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" generic="T">
import { computed, ref } from 'vue';
import { RecycleScroller } from 'vue-virtual-scroller';

import type { ListItem, Options } from './types.d.ts';

const waitedSearchText = ref('');
const selectedSearchText = ref('');
const checkedList = ref<ListItem<T>[]>([]);
const list = ref<ListItem<T>[]>([]);
const waitedList = computed(() => {
  if (!waitedSearchText.value) {
    return list.value;
  }
  return list.value.filter((item) => item.label.includes(waitedSearchText.value));
});
const selectedList = computed(() => {
  if (!selectedSearchText.value) {
    return checkedList.value;
  }
  return checkedList.value.filter((item) => item.label.includes(selectedSearchText.value));
});
const isCheckAll = computed({
  get() {
    const list = checkedList.value.filter((item) => item.label.includes(waitedSearchText.value));
    return waitedList.value.length === list.length && list.length > 0;
  },
  set(value: boolean) {
    if (value) {
      const arr = waitedList.value.filter((item) => {
        return checkedList.value.indexOf(item) === -1;
      });
      checkedList.value = [...checkedList.value, ...arr];
    } else {
      waitedList.value.forEach((item) => {
        const index = checkedList.value.indexOf(item);
        checkedList.value.splice(index, 1);
      });
      checkedList.value = [...checkedList.value];
    }
  },
});
const isIndeterminate = computed(() => {
  const list = checkedList.value.filter((item) => item.label.includes(waitedSearchText.value));
  return waitedList.value.length !== list.length && list.length !== 0;
});
const removeSelected = (listItem: ListItem<T>) => {
  const index = checkedList.value.findIndex((item) => Object.is(item, listItem));
  checkedList.value.splice(index, 1);
  checkedList.value = [...checkedList.value];
};
const selectedClear = (value: string) => {
  if (value) {
    checkedList.value = checkedList.value.filter((item) => {
      return !item.label.includes(value);
    });
  } else {
    checkedList.value = [];
  }
};

const defaultOptions = ref<Options<T>>({
  title: '选择',
});

const confirm = async () => {
  if (defaultOptions.value.onConfirm) {
    await defaultOptions.value.onConfirm?.(checkedList.value.map((item) => item.value) as T[]);
  }
  done();
};
const cancel = async () => {
  if (defaultOptions.value.onCancel) {
    await defaultOptions.value.onCancel?.();
  }
  done();
};

const show = ref<boolean>(false);
const open = async (options: Options<T> = {}) => {
  defaultOptions.value = options;
  if (options.options) {
    list.value = (await options.options?.()) || [];
    const selected: string[] = (await options.selected?.()) || [];
    checkedList.value = list.value.filter((item) => selected.includes(item.id));
  }
  show.value = true;
};
const done = () => {
  show.value = false;
  waitedSearchText.value = '';
  selectedSearchText.value = '';
};

defineExpose({
  open,
});
</script>

<style lang="scss" scoped>
.card-wrapper {
  font-size: 12px;
  .card {
    width: 260px;
    height: 470px;
    border-radius: 4px;
    background: #fff;
    border: 1px solid #e6e7eb;
    padding: 16px 16px 0;
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    .icon-search {
      font-size: 16px;
    }
    .list {
      flex: 1;
      height: 0;
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      --list-select-item-height: 32px;
      .list-header {
        height: var(--list-select-item-height);
        background: #f2f3f7;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &.selected {
          padding: 0 12px;
        }
      }
      .list-content {
        height: calc(100% - var(--list-select-item-height));
        .data-empty {
          height: 100%;
          --el-empty-description-margin-top: 12px;
          :deep(.el-empty__image) {
            width: 60px;
            height: 60px;
          }
          :deep(.el-empty__description) {
            p {
              font-size: var(--font-size-sm);
            }
            color: #666;
          }
        }
        .no-select-empty {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-sm);
          color: var(--color-gray);
        }
        .scrollbar {
          height: 100%;
        }
      }
      .checkbox-item {
        margin: 0;
        width: 100%;
        height: var(--list-select-item-height);
        padding: 0 12px;
        :deep(.el-checkbox__label) {
          color: var(--el-checkbox-text-color);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .selected-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: var(--list-select-item-height);
        padding: 0 12px;
        .icon-ic_cha {
          font-size: 16px;
          color: #b7babf;
          cursor: pointer;
        }
      }
    }
  }
  .scroller {
    width: 100%;
    height: 100%;
  }
}
</style>
