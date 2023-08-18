const ctx = "@@elTableKeepPositionContext";
/**
 * @name keepPosition
 * @author liqiang
 * @description el-table保持滚动位置 version: 2.15.13
 * @example v-el-table-keep-position
 */
const keepPosition = {
  bind(el, bindings, vNode) {
    const componentInstance = vNode.componentInstance;
    const bodyWrapperEl = componentInstance.$refs.bodyWrapper;
    const scrollFn = () => {
      // 记录上次滚动位置
      el[ctx].scrollTop = bodyWrapperEl.scrollTop;
    };
    // 建立观察者
    const observer = new IntersectionObserver((entries) => {
      // 如果 intersectionRatio 为 0，则目标在视野外，
      // 我们不需要做任何事情。
      if (entries[0].intersectionRatio <= 0) {
        bodyWrapperEl.removeEventListener("scroll", scrollFn);
      } else {
        let id = null;
        const run = () => {
          id = requestAnimationFrame(run);
          const height = bodyWrapperEl.style.getPropertyValue("height");
          if (height) {
            cancelAnimationFrame(id);
            bodyWrapperEl.scrollTop = el[ctx].scrollTop;
            bodyWrapperEl.addEventListener("scroll", scrollFn);
            id = null;
          }
        };
        run();
      }
    });
    // 开始监听
    observer.observe(el);
    el[ctx] = {
      observer,
      scrollTop: 0,
    };
  },
  unbind(el) {
    if (el[ctx]) {
      const { observer } = el[ctx];
      observer.disconnect();
    }
    delete el[ctx];
  },
};
export default keepPosition;
