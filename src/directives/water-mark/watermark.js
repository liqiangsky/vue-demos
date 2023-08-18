import { devicePixelRatio } from "../../utils/global";

const defaultFontConfig = {
  fontColor: "rgba(153, 153, 153, 0.5)",
  fontFamily: "Microsoft YaHei",
  fontSize: 12,
  fontWeight: "400",
  fontStyle: "normal",
};

const defaultConfig = {
  width: 190,
  height: 150,
  rotate: -20,
  text: "默认水印",
  ...defaultFontConfig,
  formatter: null,
};

const watermarkUrl = (config) => {
  const scale = 2;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const { width, height } = { width: config.width, height: config.height };
  canvas.width = width * scale;
  canvas.height = height * scale;
  ctx.scale(scale, scale);
  canvas.style.width = width / devicePixelRatio() + "px";
  canvas.style.height = height / devicePixelRatio() + "px";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.translate(width / 2, height / 2);
  ctx.rotate((config.rotate * Math.PI) / 180);
  ctx.translate(-width / 2, -height / 2);
  let textTotalHeight = 0;
  const realText = config.text.split("\n");
  const formatter = Object.prototype.toString.call(config.formatter) === "[object Function]" ? config.formatter : null;
  const { fontColor, fontFamily, fontSize, fontWeight, fontStyle } = config;
  const globalFontConfig = {
    fontColor,
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
  };
  const textConfig = realText.reduce((result, str, index) => {
    let curConfig = null;
    if (formatter) {
      const cfg = formatter(str, index);
      curConfig = {
        ...defaultFontConfig,
        ...(Object.prototype.toString.call(cfg) === "[object Object]" ? cfg : globalFontConfig),
      };
    } else {
      curConfig = globalFontConfig;
    }
    result[index] = curConfig;
    textTotalHeight += curConfig.fontSize;
    return result;
  }, {});
  let y = (height - textTotalHeight) / 2;
  realText.forEach((str, index) => {
    const curConfig = textConfig[index];
    const font = `${curConfig.fontWeight} ${curConfig.fontStyle} ${curConfig.fontSize}px ${curConfig.fontFamily}`;
    ctx.font = font;
    ctx.fillStyle = curConfig.fontColor;
    const text = ctx.measureText(str);
    const x = width / 2 - text.width / 2;
    ctx.fillText(str, x, y);
    y += curConfig.fontSize;
  });
  return canvas.toDataURL("image/png");
};
const watermarkDom = () => {
  const div = document.createElement("div");
  div.setAttribute("watermark", "");
  div.classList.add("watermark");
  div.style.width = "100%";
  div.style.height = "100%";
  div.style.position = "fixed";
  div.style.pointerEvents = "none";
  return div;
};
const render = (el, url, width, height) => {
  el.style.display = "block";
  el.style.backgroundImage = `url(${url})`;
  el.style.backgroundSize = `${width}px ${height}px`;
};
const isNumber = (value, defaultValue) => {
  return isNaN(value) ? defaultValue : value;
};
const beforeConfig = (config) => {
  const newConfig = {};
  newConfig.width = isNumber(config.width, defaultConfig.width);
  newConfig.height = isNumber(config.height, defaultConfig.height);
  newConfig.rotate = isNumber(config.rotate, defaultConfig.rotate);
  newConfig.fontSize = isNumber(config.fontSize, defaultConfig.fontSize);
  return newConfig;
};
/**
 * @name watermark
 * @author liqiang
 * @description 自定义水印
 * @example v-watermark:[?config]="Boolean"
 */
const watermark = {
  update(el, binding) {
    const show = binding.value || false;
    const watermark = el.querySelector("[watermark]");
    if (show) {
      const arg = Object.prototype.toString.call(binding.arg) === "[object Object]" ? binding.arg : {};
      let config = { ...defaultConfig, ...arg };
      config = { ...config, ...beforeConfig(config) };
      const url = watermarkUrl(config);
      if (!watermark) {
        const watermark = watermarkDom();
        render(watermark, url, config.width, config.height);
        el.appendChild(watermark);
        return;
      }
      render(watermark, url, config.width, config.height);
    } else {
      if (watermark) {
        watermark.style.display = "none";
      }
    }
  },
  unbind(el) {
    const watermark = el.querySelector("[watermark]");
    if (watermark) {
      el.removeChild(watermark);
    }
  },
};
export default watermark;
