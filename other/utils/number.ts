/*
 * @Author: 李强
 * @Date: 2023-10-31 17:55:06
 * @LastEditors: 李强
 * @Description: 数字相关工具函数
 */
/**
 * @description 格式化金额
 * @param num
 * @param split
 */
export const formatMoney = (num, split = ",") => {
  if (num === null || isNaN(Number(num))) {
    return num;
  }
  num = (num || 0).toString();
  const parts = num.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, split);
  return parts[1] !== "" ? parts.join(".") : parts[0];
};
/**
 * @description 保留小数位数
 * @param num
 * @param length
 */
export const formatToFixed = (num, length = 2) => {
  if (num === null || isNaN(Number(num))) {
    return num;
  }
  const parts = (num || 0).toString().split(".");
  parts[1] = (parts[1] || "").padEnd(length, "0").substring(0, length);
  return parts[1] !== "" ? parts.join(".") : parts[0];
};
