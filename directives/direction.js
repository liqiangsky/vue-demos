import { ios } from '../utils/regexp';
import { platform, maxTouchPoints } from '../utils/global';

const ctx = '@@directionContext';

const iosPhone = () => {
  return (platform() === 'MacIntel' && maxTouchPoints() > 1) || ios();
};

const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;
const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

const iosPlatform = (el, cb) => {
  let direction = null;
  let moveingX = false;
  let moveingY = false;
  const context = el[ctx];
  context.id = null;
  const oldScrollData = {
    x: Date.now(),
    y: Date.now(),
  };
  const point = {
    start: {
      x: 0,
      y: 0,
    },
    end: {
      x: 0,
      y: 0,
    },
  };
  const getXY = (e) => {
    const p = e.touches[0];
    if (p) {
      const x = p?.pageX;
      const y = p?.pageY;
      return { x, y };
    } else {
      return {};
    }
  };
  // 方向
  const getDirection = (point) => {
    const e = {};
    if (point.end.x > point.start.x) {
      // 向左
      e.detailX = -100;
    }
    if (point.end.x < point.start.x) {
      // 向右
      e.detailX = 100;
    }
    if (point.end.y > point.start.y) {
      // 向上
      e.detailY = -100;
    }
    if (point.end.y < point.start.y) {
      // 向下
      e.detailY = 100;
    }
    return e;
  };
  const scrolling = () => {
    const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = el;
    if (oldScrollData.x !== scrollLeft) {
      moveingX = true;
      oldScrollData.x = scrollLeft;
      // console.warn('running x');
      cb(direction);
    } else {
      if (moveingX) {
        // console.warn('stoping x');
        moveingX = false;
        // 解决ios滑动时橡皮泥效果
        const maxX = scrollWidth - clientWidth;
        if (scrollLeft === maxX) {
          el.scrollLeft = maxX - 1;
        }
        if (scrollLeft === 0) {
          el.scrollLeft = 1;
        }
      }
    }
    if (oldScrollData.y !== scrollTop) {
      moveingY = true;
      oldScrollData.y = scrollTop;
      // console.warn('running y');
      cb(direction);
    } else {
      if (moveingY) {
        // console.warn('stoping y');
        moveingY = false;
        // 解决ios滑动时橡皮泥效果
        const maxY = scrollHeight - clientHeight;
        if (scrollTop === maxY) {
          el.scrollTop = maxY - 1;
        }
        if (scrollTop === 0) {
          el.scrollTop = 1;
        }
      }
    }
    context.id = requestAnimationFrame(scrolling);
  };
  const touchstart = (e) => {
    point.start = { ...point.start, ...getXY(e) };
  };
  const touchend = (e) => {
    point.end = { ...point.end, ...getXY(e) };
    direction = getDirection(point);
  };
  const touchMove = (e) => {
    point.end = { ...point.end, ...getXY(e) };
    direction = getDirection(point);
    if (moveingX || moveingY) {
      return;
    }
    const { scrollHeight, scrollWidth, clientHeight, clientWidth, scrollTop, scrollLeft } = el;
    const minX = 0;
    const maxX = scrollWidth - clientWidth;
    const minY = 0;
    const maxY = scrollHeight - clientHeight;
    const x = scrollLeft === minX || scrollLeft === maxX;
    const y = scrollTop === minY || scrollTop === maxY;
    if (x && y) {
      return;
    }
    if (!x) {
      moveingX = true;
    }
    if (!y) {
      moveingY = true;
    }
    cancelAnimationFrame(context.id);
    context.id = requestAnimationFrame(scrolling);
  };
  el.addEventListener('touchstart', touchstart);
  el.addEventListener('touchmove', touchMove);
  el.addEventListener('touchend', touchend);
  context.event = {
    touchstart,
    touchMove,
    touchend,
  };
};
const defaultPlatform = (el, cb) => {
  const context = el[ctx];
  const point = {
    start: {
      x: 0,
      y: 0,
    },
    end: {
      x: 0,
      y: 0,
    },
  };
  const getXY = (el) => {
    const { scrollTop, scrollLeft } = el;
    const x = scrollLeft;
    const y = scrollTop;
    return { x, y };
  };
  // 方向
  const getDirection = (point) => {
    const e = {};
    if (point.end.x > point.start.x) {
      // 向右
      e.detailX = 100;
    }
    if (point.end.x < point.start.x) {
      // 向左
      e.detailX = -100;
    }
    if (point.end.y > point.start.y) {
      // 向下
      e.detailY = 100;
    }
    if (point.end.y < point.start.y) {
      // 向上
      e.detailY = -100;
    }
    return e;
  };
  const scroll = (e) => {
    point.end = { ...point.end, ...getXY(el) };
    const direction = getDirection(point);
    point.start = { ...point.start, ...getXY(el) };
    cb(direction);
  };
  el.addEventListener('scroll', scroll);
  context.event = {
    scroll,
  };
};
/**
 * @name direction
 * @author liqiang
 * @description 判断滚动向上向下向左向右, 请将该指令放在滚动元素上
 * @example v-direction="callback"
 */
const direction = {
  bind(el, binding) {
    const { value } = binding;
    if (!value || !(value instanceof Function)) {
      return;
    }
    el[ctx] = {};
    if (iosPhone()) {
      iosPlatform(el, value);
    } else {
      defaultPlatform(el, value);
    }
  },
  unbind(el) {
    const context = el[ctx];
    if (context) {
      if (iosPhone()) {
        el.removeEventListener('touchstart', context.event.touchstart);
        el.removeEventListener('touchmove', context.event.touchMove);
        el.removeEventListener('touchend', context.event.touchend);
      } else {
        el.removeEventListener('scroll', context.event.scroll);
      }
      cancelAnimationFrame(context.id);
    }
  },
};

export default direction;
