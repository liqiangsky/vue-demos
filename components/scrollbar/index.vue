<template>
  <div
    class="scrollbar"
    :style="{ height: scrollBar.height }"
    @mouseover="show = true"
    @mouseout="show = false"
  >
    <!-- 滚动容器 -->
    <div
      ref="scrollWarp"
      class="scroll_warp"
      v-scroll-direction="scroll"
      :style="scrollWarpStyle"
    >
      <div ref="scrollView" class="scroll_view">
        <slot></slot>
      </div>
    </div>
    <!-- 纵向滚动条 -->
    <div
      ref="vertical"
      class="vertical"
      :class="{ show: show && vertical.proportion !== 1 }"
      :style="{ height: scrollBar.height }"
      @click="scrollTrack"
      @touchstart="touchstartY"
      @touchmove="touchmoveY"
    >
      <div
        ref="verticalthumb"
        class="vertical_thumb"
        @click.stop
        @dragstart.stop.prevent
        :style="verticalthumbStyle"
      ></div>
    </div>
    <!-- 横向滚动条 -->
    <div
      ref="horizontal"
      class="horizontal"
      :class="{ show: show && horizontal.proportion !== 1 }"
      :style="{ width: scrollBar.width }"
      @click="scrollTrack"
      @touchstart="touchstartX"
      @touchmove="touchmoveX"
    >
      <div
        ref="horizontalthumb"
        class="horizontal_thumb"
        @click.stop
        @dragstart.stop.prevent
        :style="horizontalthumbStyle"
      ></div>
    </div>
  </div>
</template>
<script>
import debounce from "lodash/debounce";
import scrollbarWidth from "../../utils/scrollbar-width";
import ScrollDirection from "../../directives/scroll-direction";
export default {
  name: "LScrollbar",
  data() {
    return {
      gutter: 0,
      width: 0,
      height: 0,
      show: false,
      vertical: {
        size: 0,
        proportion: 0,
        translate: 0,
      },
      horizontal: {
        size: 0,
        proportion: 0,
        translate: 0,
      },
      position: {
        x: 0,
        y: 0,
      },
      touch: {
        x: 0,
        y: 0,
      },
      mouseXLock: true,
      mouseYLock: true,
      resizeObserver: null,
    };
  },
  computed: {
    scrollWarpStyle() {
      const { gutter } = this;
      return {
        marginBottom: `-${gutter}px`,
        marginRight: `-${gutter}px`,
      };
    },
    scrollBar() {
      const { width, height } = this;
      return {
        width: `${width}px`,
        height: `${height}px`,
      };
    },
    verticalthumbStyle() {
      const { size, translate } = this.vertical;
      return {
        height: `${size}%`,
        transform: `translateY(${translate}%)`,
      };
    },
    horizontalthumbStyle() {
      const { size, translate } = this.horizontal;
      return {
        width: `${size}%`,
        transform: `translateX(${translate}%)`,
      };
    },
    realVerticalSize() {
      return (this.vertical.size / 100) * this.height;
    },
    realHorizontalSize() {
      return (this.horizontal.size / 100) * this.width;
    },
    scrollWarp() {
      return this.$refs.scrollWarp;
    },
    scrollView() {
      return this.$refs.scrollView;
    },
  },
  mounted() {
    this.gutter = scrollbarWidth();
    this.update();
    this.updateResizeObserve();
    document.addEventListener("mousedown", this.mousedown, true);
    document.addEventListener("mouseup", this.mouseup, true);
    window.addEventListener("resize", this.resize, true);
  },
  methods: {
    /**
     * 点击滚动轨道
     * @argument {Event} e click事件对象
     */
    scrollTrack(e) {
      const { offsetY, offsetX } = e;
      if (e.target === this.$refs.vertical) {
        const y =
          this.vertical.proportion * (offsetY - this.realVerticalSize / 2);
        const detailY = y > this.scrollWarp.scrollTop ? 100 : -100;
        this.scrollWarp.scrollTop = y;
        this.scroll({ detailY });
      }
      if (e.target === this.$refs.horizontal) {
        const x =
          this.vertical.proportion * (offsetX - this.realHorizontalSize / 2);
        const detailX = x > this.scrollWarp.scrollLeft ? 100 : -100;
        this.scrollWarp.scrollLeft = x;
        this.scroll({ detailX });
      }
    },
    /**
     * 滚动事件
     *  @argument {Event} ee 滚动方向对象
     */
    scroll(ee) {
      this.show = true;
      this.update();
      this.$emit("direction", ee);
      this.$emit("scroll", ee, this.scrollWarp);
      this.scrollEnd(ee);
    },
    /**
     * 更新滚动容器大小
     */
    updateScrollbar() {
      const { clientWidth, clientHeight } = this.$el;
      this.width = clientWidth;
      this.height = clientHeight;
    },
    /**
     * 更新滚动容器大小变化
     */
    updateResizeObserve() {
      this.resizeObserver = new ResizeObserver((entries) => {
        this.update();
      });
      this.resizeObserver?.observe(this.scrollView);
    },
    /**
     * 更新滚动条滑块
     */
    updateThumb() {
      this.updateThumbProportion();
      this.updateThumbSize();
      this.updateThumbTranslate();
    },
    /**
     * 更新滚动条比例
     */
    updateThumbProportion() {
      const { scrollHeight, scrollWidth, clientHeight, clientWidth } =
        this.scrollWarp;
      this.vertical.proportion = scrollHeight / clientHeight;
      this.horizontal.proportion = scrollWidth / clientWidth;
    },
    /**
     * 更新滚动条滑块大小
     */
    updateThumbSize() {
      const { scrollHeight, scrollWidth, clientHeight, clientWidth } =
        this.scrollWarp;
      this.vertical.size = (clientHeight / scrollHeight) * 100;
      this.horizontal.size = (clientWidth / scrollWidth) * 100;
    },
    /**
     * 更新滚动条滑块位置
     */
    updateThumbTranslate() {
      const { scrollTop, scrollLeft } = this.scrollWarp;
      this.vertical.translate = (scrollTop / this.height) * 100;
      this.horizontal.translate = (scrollLeft / this.width) * 100;
    },
    /**
     * 滚动结束事件
     * @argument {Event} ee 滚动方向对象
     */
    scrollEnd: debounce(function (ee) {
      this.$emit("scorllend", ee);
      if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        this.show = false;
      }
    }, 200),
    /**
     * 横向滚动滑块触摸开始
     * @argument {Event} e touchstart事件对象
     */
    touchstartX(e) {
      this.position.x = this.scrollWarp.scrollLeft;
      this.touch.x = e.touches[0]?.clientX;
    },
    /**
     * 横向滚动滑块触摸移动中
     * @argument {Event} e touchmove事件对象
     */
    touchmoveX(e) {
      if (e.target !== this.$refs.horizontalthumb) {
        return;
      }
      const moveX = e.touches[0]?.clientX - this.touch.x;
      const x = this.horizontal.proportion * moveX;
      this.scrollWarp.scrollLeft = this.position.x + x;
      const detailX = moveX > 0 ? 100 : -100;
      this.scroll({ detailX });
    },
    /**
     * 纵向滚动滑块触摸开始
     * @argument {Event} e touchstart事件对象
     */
    touchstartY(e) {
      this.position.y = this.scrollWarp.scrollTop;
      this.touch.y = e.touches[0]?.clientY;
    },
    /**
     * 纵向滚动滑块触摸移动中
     * @argument {Event} e touchmove事件对象
     */
    touchmoveY(e) {
      if (e.target !== this.$refs.verticalthumb) {
        return;
      }
      const moveY = e.touches[0]?.clientY - this.touch.y;
      const y = this.vertical.proportion * moveY;
      this.scrollWarp.scrollTop = this.position.y + y;
      const detailY = moveY > 0 ? 100 : -100;
      this.scroll({ detailY });
    },
    /**
     * 鼠标按下
     * @argument {Event} e mousedown事件对象
     */
    mousedown(e) {
      if (e.target === this.$refs.verticalthumb) {
        this.position.y = this.scrollWarp.scrollTop;
        this.touch.y = e.clientY;
        this.mouseYLock = false;
      }
      if (e.target === this.$refs.horizontalthumb) {
        this.position.x = this.scrollWarp.scrollLeft;
        this.touch.x = e.clientX;
        this.mouseXLock = false;
      }
      document.addEventListener("mousemove", this.mousemove, false);
    },
    /**
     * 鼠标移动
     * @argument {Event} e mousemove事件对象
     */
    mousemove(e) {
      if (!this.mouseXLock) {
        const moveX = e.clientX - this.touch.x;
        const x = this.horizontal.proportion * moveX;
        this.scrollWarp.scrollLeft = this.position.x + x;
      }
      if (!this.mouseYLock) {
        const moveY = e.clientY - this.touch.y;
        const y = this.vertical.proportion * moveY;
        this.scrollWarp.scrollTop = this.position.y + y;
      }
    },
    /**
     * 鼠标抬起
     * @argument {Event} e mouseup事件对象
     */
    mouseup() {
      this.mouseXLock = true;
      this.mouseYLock = true;
      document.removeEventListener("mousemove", this.mousemove, true);
    },
    /**
     * 窗口大小变化
     */
    resize() {
      this.update();
    },
    /**
     * 更新滚动相关参数
     */
    update() {
      this.updateScrollbar();
      this.updateThumb();
    },
  },
  destroyed() {
    this.resizeObserver?.unobserve(this.scrollView);
    document.removeEventListener("mousedown", this.mousedown, true);
    document.removeEventListener("mouseup", this.mouseup, true);
    window.removeEventListener("resize", this.resize, true);
  },
  directives: {
    ScrollDirection,
  },
};
</script>
<style lang="less" scoped>
.scrollbar {
  height: 100%;
  position: relative;
  .scroll_warp {
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
      width: 0;
      display: none;
    }
    /**
    * 兼容火狐滚动条隐藏
    */
    scrollbar-color: transparent transparent;
    scrollbar-width: none;
  }
  .vertical {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 6px;
    height: inherit;
    opacity: 0;
    transition: opacity 0.34s ease-out;
    &.show {
      opacity: 1;
    }
    &_thumb {
      width: inherit;
      height: 0;
      background-color: rgba(144, 147, 153, 0.3);
      border-radius: 4px;
      &:hover {
        cursor: pointer;
        background-color: rgba(144, 147, 153, 0.5);
      }
    }
  }
  .horizontal {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    width: inherit;
    height: 6px;
    opacity: 0;
    transition: opacity 0.34s ease-out;
    &.show {
      opacity: 1;
    }
    &_thumb {
      width: 0;
      height: inherit;
      background-color: rgba(144, 147, 153, 0.3);
      border-radius: 4px;
      &:hover {
        cursor: pointer;
        background-color: rgba(144, 147, 153, 0.5);
      }
    }
  }
}
</style>
