/**
 * scroll-direction 指令
 * @author liqiang
 * @description 判断滚动向上向下向左向右
 * @example 请将该指令放在滚动元素上
 */
const scrollDirection = {
  bind(el, binding) {
    const { value } = binding;
    if (!value || !(value instanceof Function)) {
      return;
    }
    let x = 0;
    let y = 0;
    el['@@scroll-direction'] = function (e) {
      const ee = {};
      const { scrollTop, scrollLeft } = e.target;
      if (scrollLeft > x) {
        // 向左滚动
        ee.detailX = 100;
      } else if (scrollLeft < x) {
        // 向右滚动
        ee.detailX = -100;
      }
      if (scrollTop > y) {
        // 向下滚动
        ee.detailY = 100;
      } else if (scrollTop < y) {
        // 向上滚动
        ee.detailY = -100;
      }
      x = scrollLeft;
      y = scrollTop;
      // ee 滚动方向
      value(e, ee);
    }
    const f = el['@@scroll-direction'];
    if (f) {
      el.addEventListener('scroll', f);
    }
  },
  unbind(el) {
    const f = el['@@scroll-direction'];
    if (f) {
      el.removeEventListener('scroll', f);
    }
  }
};

export default scrollDirection;
