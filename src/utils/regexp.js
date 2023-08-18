import { userAgent } from './global.js';

const ios = () => !!userAgent().match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

export { ios };
