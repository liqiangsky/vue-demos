/*
 * @Description:
 * @Author: yc
 * @Date: 2025-08-01 09:50:48
 * @LastEditTime: 2025-08-04 14:06:33
 * @LastEditors: yc
 */
/*
 * @Description:
 * @Author: yc
 * @Date: 2025-08-01 09:50:48
 * @LastEditTime: 2025-08-04 14:05:11
 * @LastEditors: yc
 */
export interface OptionItem<T = string> {
  label: string;
  value: T;
}
// 工具类型支持索引签名
export type CompatibleParams<T> = { [K in keyof T]: T[K] } & { [key: string]: unknown }; // 普通对象，加索引签名

export type Callback<T = void> = [T] extends [void] | [undefined]
  ? () => void | Promise<void>
  : (value: T) => void | Promise<void>;
