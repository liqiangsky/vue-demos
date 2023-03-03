const nodes = [];
var speed = 0;
const ctx = '@@clickoutsideContext';
var down = '';

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
    binding.value();
  };
};

export const vClickoutside = {
  mounted(el, binding) {
    console.log('mounted');
    const id = ++speed;
    el[ctx] = {
      id,
      handler: createHandler(el, binding),
    };
    nodes.push(el);
  },
  beforeUnmount(el) {
    console.log('beforeUnmount');
    const { id } = el[ctx];
    const index = nodes.findIndex((item) => item.id === id);
    nodes.splice(index, 1);
  },
};
