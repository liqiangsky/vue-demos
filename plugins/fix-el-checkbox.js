import { foreachTree } from "../utils/util";
// 这里可能ios的el-checkbox勾选有问题或者只是ipad有问题
// 目前只测试了ipad
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', () => {
    const classNames = ['el-checkbox__input', 'el-checkbox__label'];
    const targetNode = document.body;
    const config = {childList: true, subtree: true};
    const callback = function (mutationsList) {
    // Use traditional 'for loops' for IE 11
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          foreachTree(undefined, mutation.addedNodes, (item) => {
            const isElCheckbox = classNames.some((name) => item.className.includes(name));
            if (item.nodeName === 'SPAN' && isElCheckbox) {
              // https://developer.mozilla.org/zh-CN/docs/Web/CSS/pointer-events
              item.style['pointer-events'] = 'none';
            }
          },
          'childNodes');
        }
      }
    };
    // https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }, false);
}
