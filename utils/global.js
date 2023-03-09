const devicePixelRatio = () => window.devicePixelRatio;
const userAgent = () => window.navigator.userAgent;
const platform = () => window.navigator.platform;
const maxTouchPoints = () => window.navigator.maxTouchPoints;
const requestAnimationFrame = (callback) => {
  const fn =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  return fn(callback);
};
const cancelAnimationFrame = (requestID) => {
  const fn = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
  fn(requestID);
};

export { devicePixelRatio, userAgent, platform, maxTouchPoints, requestAnimationFrame, cancelAnimationFrame };
