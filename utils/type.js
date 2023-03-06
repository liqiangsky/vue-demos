/**
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString#%E7%A4%BA%E4%BE%8B
 * example:
 * const myDate = new Date();
 * Object.prototype.toString.call(myDate); // [object Date]
 * myDate[Symbol.toStringTag] = 'myDate';
 * Object.prototype.toString.call(myDate); // [object myDate]
 *
 * Date.prototype[Symbol.toStringTag] = 'prototype polluted';
 * Object.prototype.toString.call(new Date()); // [object prototype polluted]
 */
const toString = Object.prototype.toString;

const isObject = (target) => toString.call(target) === '[object Object]';
const isArray = (target) => toString.call(target) === '[object Array]';
const isNumber = (target) => toString.call(target) === '[object Number]';
const isString = (target) => toString.call(target) === '[object String]';
const isBoolean = (target) => toString.call(target) === '[object Boolean]';
const isFunction = (target) => toString.call(target) === '[object Function]';
const isUndefined = (target) => toString.call(target) === '[object Undefined]';
const isNull = (target) => toString.call(target) === '[object Null]';
const isDate = (target) => toString.call(target) === '[object Date]';
const isRegexp = (target) => toString.call(target) === '[object RegExp]';
const isError = (target) => toString.call(target) === '[object Error]';
const isSymbol = (target) => toString.call(target) === '[object Symbol]';
const isArguments = (target) => toString.call(target) === '[object Arguments]';
const isMath = (target) => toString.call(target) === '[object Math]';
const isWindow = (target) => toString.call(target) === '[object Window]';
const isJson = (target) => toString.call(target) === '[object JSON]';
const isReflect = (target) => toString.call(target) === '[object Reflect]';

export default {
  isObject,
  isArray,
  isNumber,
  isString,
  isBoolean,
  isFunction,
  isUndefined,
  isNull,
  isDate,
  isRegexp,
  isError,
  isSymbol,
  isArguments,
  isMath,
  isWindow,
  isJson,
  isReflect,
};
