import { userAgent } from './global';

const ios = () => !!userAgent().match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

export { ios };
