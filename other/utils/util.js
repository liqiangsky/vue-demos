/**
 * 遍历树形数据
 * @param {Object|undefined} parent 父节点
 * @param {Array} data 源数据
 * @param {Function} cb 每条数据处理回调
 * @param {String} key 子节点字段名
 */
const foreachTree = (parent = undefined, data, cb, key = 'children') => {
  data.forEach((item) => {
    if (cb) {
      cb(item, parent);
    }
    if (item[key] && item[key].length > 0) {
      foreachTree(item, item[key], cb, key);
    }
  });
};

export { foreachTree };
