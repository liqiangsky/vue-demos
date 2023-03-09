import Vue from 'vue';
import { isBoolean } from '../utils/type';

const ctx = '@@canvasloadingContext';

const renderLoading = (canvas, { w, h }) => {
  const cctx = canvas.getContext('2d');
  canvas[ctx] = {
    id: null,
  };
  canvas.width = w * 2;
  canvas.height = h * 2;
  const x = canvas.width / 2;
  const y = canvas.height / 2;
  let start = 0;
  let end = 0;
  let angle = 0;
  cctx.strokeStyle = '#409eff';
  cctx.lineWidth = '3';
  cctx.lineCap = 'round';
  cctx.scale(2, 2);
  const render = () => {
    cctx.setTransform();
    cctx.clearRect(0, 0, canvas.width, canvas.height);
    cctx.translate(x, y);
    cctx.rotate((angle * Math.PI) / 180);
    cctx.translate(-x, -y);
    cctx.beginPath();
    cctx.arc(x, y, 38, start * Math.PI, end * Math.PI);
    cctx.stroke();
    if (angle >= 360) {
      angle = 0;
    } else {
      angle += 2.5;
    }
    if (end > 0.5 && end < 1.5) {
      const val = end + 0.06;
      end = Number(val.toFixed(2));
    } else if (end !== 2) {
      let val = end + 0.02;
      if (val > 2) {
        val = 2;
      }
      end = Number(val.toFixed(2));
    }
    if (start < 0.5) {
      const val = start + 0.01;
      start = Number(val.toFixed(2));
    } else if (start !== 2) {
      let val = start + 0.04;
      if (val > 2) {
        val = 2;
      }
      start = Number(val.toFixed(2));
    }
    if (start === 2 && end === 2) {
      start = 0;
      end = 0;
    }
    canvas[ctx].id = requestAnimationFrame(render);
  };
  canvas[ctx].id = requestAnimationFrame(render);
};

const showLoading = (el) => {
  Vue.nextTick(() => {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('canvas-loading', '');
    const w = el.clientWidth;
    const h = el.clientHeight;
    canvas.setAttribute('style', `width: ${w}px; height: ${h}px; position: absolute; top: 0; left: 0;`);
    el.appendChild(canvas);
    renderLoading(canvas, { w, h });
  });
};

const closeLoading = (el) => {
  const canvas = el.querySelector('[canvas-loading]');
  if (canvas) {
    const { id } = canvas[ctx];
    cancelAnimationFrame(id);
    el.removeChild(canvas);
  }
};

/**
 * @name canvasloading
 * @author liqiang
 * @description canvasloading仿elementui
 * @example v-canvasloading="Boolean"
 */
const canvasloading = {
  update(el, binding) {
    const value = isBoolean(binding.value) ? binding.value : false;
    if (value) {
      showLoading(el);
    } else {
      closeLoading(el);
    }
  },
  unbind(el) {
    closeLoading(el);
  },
};
export default canvasloading;
