const nodes = [];
let speed = 0;
const ctx = '@@clickoutsideContext';
let down = '';

document.addEventListener('mousedown', (e) => {
  down = e;
});
document.addEventListener('mouseup', (e) => {
  nodes.forEach((n) => {
    n[ctx].handler(down, e);
  });
});

const createHandler = (el, binding) => {
  return (down, up) => {
    const d = el.contains(down.target);
    const u = el.contains(up.target);
    let dd, uu;
    if (binding.arg) {
      dd = binding.arg.contains(down.target);
      uu = binding.arg.contains(up.target);
    }
    if (d || u || dd || uu) return;
    if (!binding.value || !(binding.value instanceof Function)) {
      return;
    }
    binding.value();
  };
};
/**
 * @name clickoutside
 * @author liqiang
 * @description 点击该元素外部区域 vue2 bind,unbind vue3 mounted,beforeUnmount
 * @example v-clickoutside="callback"
 */
const clickoutside = {
  bind(el, binding) {
    const id = ++speed;
    el[ctx] = {
      id,
      handler: createHandler(el, binding),
    };
    nodes.push(el);
  },
  unbind(el) {
    const { id } = el[ctx];
    const index = nodes.findIndex((item) => item.id === id);
    if (index > -1) {
      nodes.splice(index, 1);
    }
  },
};

export default clickoutside;
