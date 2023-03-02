const ua = navigator.userAgent;

const ios = () => {
  return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
};

export {
  ios
}