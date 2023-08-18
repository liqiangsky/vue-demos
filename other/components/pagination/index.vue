<template>
  <div
    class="pagination"
    v-if="!(hideOnSinglePage && current === 1 && maxPage === 1)"
  >
    <!-- 左 -->
    <div
      v-if="isShow('prev')"
      class="pagination-item opt"
      :class="{ disabled: current === 1 }"
      @click.stop="handleCurrentChange(getPrevValue, 'prev-click')"
    >
      <template v-if="prevText">{{ prevText }}</template>
      <template v-else>
        <i class="el-icon-arrow-left"></i>
      </template>
    </div>
    <template v-if="isShow('pager')">
      <div
        class="pagination-item"
        :class="{ active: current === 1 }"
        @click.stop="handleCurrentChange(1)"
      >
        1
      </div>
      <!-- 左前 -->
      <div
        class="pagination-item"
        v-if="renderPaginations[0] - 1 > 1"
        @mouseenter.stop="mouseenter('left')"
        @mouseleave.stop="mouseleave"
        @click.stop="handleCurrentChange(getLeftValue)"
      >
        <i
          :class="mouse === 'left' ? 'el-icon-d-arrow-left' : 'el-icon-more'"
        ></i>
      </div>
      <div
        class="pagination-item"
        :class="{ active: current === item }"
        v-for="item in renderPaginations"
        :key="item"
        @click.stop="handleCurrentChange(item)"
      >
        {{ item }}
      </div>
      <!-- 右前 -->
      <div
        class="pagination-item"
        v-if="maxPage - renderPaginations[renderPaginations.length - 1] > 1"
        @mouseenter.stop="mouseenter('right')"
        @mouseleave.stop="mouseleave"
        @click.stop="handleCurrentChange(getRightValue)"
      >
        <i
          :class="mouse === 'right' ? 'el-icon-d-arrow-right' : 'el-icon-more'"
        ></i>
      </div>
      <div
        class="pagination-item"
        v-if="maxPage !== 1"
        :class="{ active: current === maxPage }"
        @click.stop="handleCurrentChange(maxPage)"
      >
        {{ maxPage }}
      </div>
    </template>
    <!-- 右 -->
    <div
      v-if="isShow('next')"
      class="pagination-item opt"
      :class="{ disabled: current === maxPage }"
      @click.stop="handleCurrentChange(getNextValue, 'next-click')"
    >
      <template v-if="nextText">{{ nextText }}</template>
      <template v-else>
        <i class="el-icon-arrow-right"></i>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  name: "LPagination",
  props: {
    value: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 0,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    pagerCount: {
      type: Number,
      default: 7,
    },
    layout: {
      type: String,
      default: "prev,pager,next",
    },
    prevText: {
      type: String,
      default: "",
    },
    nextText: {
      type: String,
      default: "",
    },
    hideOnSinglePage: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    Layout() {
      return this.layout.split(",");
    },
    // 中间区展示的个数
    pagerCountCenter() {
      return this.pagercount - 2;
    },
    // 最大页码
    maxPage() {
      return Math.ceil(this.total / this.pageSize) || 1;
    },
    // 前
    getPrevValue() {
      const currentPage = this.current - 1;
      return currentPage < 1 ? 1 : currentPage;
    },
    // 后
    getNextValue() {
      const currentPage = this.current + 1;
      return currentPage > this.maxPage ? this.maxPage : currentPage;
    },
    // 左近
    getLeftValue() {
      const currentPage = this.current - this.pagerCountCenter;
      return currentPage < 1 ? 1 : currentPage;
    },
    // 右进
    getRightValue() {
      const currentPage = this.current + this.pagerCountCenter;
      return currentPage > this.maxPage ? this.maxPage : currentPage;
    },
    // 中间区渲染
    renderPaginations() {
      // 如果中间的个数小于展示的个数那么全部展示 否则按pagerCountCenter展示
      if (this.paginations.length <= this.pagerCountCenter) {
        return this.paginations;
      }
      if (this.current === 1) {
        return this.paginations.slice(0, this.pagerCountCenter);
      }
      if (this.current === this.maxPage) {
        return this.paginations.slice(-this.pagerCountCenter);
      }
      const index = this.current - 2;
      // 当前索引位置的前后应该展示几个
      const num = (this.pagerCountCenter - 1) / 2;
      // 开始的最大索引
      const max = this.paginations.length - this.pagerCountCenter;
      // 开始索引
      const start =
        index - num <= 0 ? 0 : index - num >= max ? max : index - num;
      // 结束
      const end = start + this.pagerCountCenter;
      return this.paginations.slice(start, end);
    },
  },
  watch: {
    value(newVal) {
      this.current = newVal > this.maxPage ? this.maxPage : newVal;
    },
    current(newVal) {
      this.$emit("input", newVal);
      this.$emit("current-change", newVal);
    },
    pagerCount: {
      handler(newVal) {
        this.pagercount =
          newVal >= 5 && newVal <= 21 && newVal % 2 !== 0 ? newVal : 7;
        this.init();
      },
      immediate: true,
    },
    pageSize() {
      this.init();
    },
    total: {
      handler() {
        this.init();
      },
      immediate: true,
    },
  },
  data() {
    return {
      pagercount: this.pagerCount,
      mouse: "",
      current: this.value,
      paginations: [],
    };
  },
  methods: {
    isShow(value) {
      return this.Layout.some((item) => item === value);
    },
    init() {
      const current = this.current;
      this.current = 1;
      this.paginations = [];
      for (let i = this.current; i < this.maxPage - 1; i++) {
        this.paginations.push(i + 1);
      }
      this.current = current > this.maxPage ? this.maxPage : current;
    },
    handleCurrentChange(v, eventName) {
      this.current = v;
      eventName && this.$emit(eventName, v);
    },
    mouseenter(v) {
      this.mouse = v;
    },
    mouseleave() {
      this.mouse = "";
    },
  },
};
</script>
<style scoped>
.pagination {
  display: inline-flex;
}
.pagination-item.active {
  background: #409eff;
  color: #fff;
}
.pagination-item {
  min-width: 30px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  background: #e3e3e3;
  color: #303133;
  cursor: pointer;
  border-radius: 2px;
  height: 28px;
  padding: 0 4px;
  font-size: 14px;
  box-sizing: border-box;
  margin: 0 5px;
  user-select: none;
}
.pagination-item:not(.disabled, .opt):hover {
  background: #409eff;
  color: #fff;
}

.pagination-item.disabled {
  cursor: not-allowed;
  color: #c0c4cc;
}
</style>