import { onBeforeUnmount } from 'vue';

import type { Callback } from '@/types/common.d.ts';

const callbacks: Record<string, Callback<MessageEvent>[]> = {};

// 处理发过来的消息 找到正确的事件名称
function getEventType(e: MessageEvent) {
  if (e.data.code === 'refresh') {
    return 'refresh';
  }
  return e.data.code;
}

function onMessage(e: MessageEvent) {
  if (Object.prototype.toString.call(e.data) === '[object Object]') {
    const events = callbacks[getEventType(e)] || [];
    if (events) {
      events.forEach((cb) => {
        cb(e);
      });
    }
  }
}
window.addEventListener('message', onMessage, false);

export const usePostMessage = () => {
  const postMsg = <T = unknown>(data: T, origin?: Window, target?: string) => {
    origin = origin || window.parent;
    target = target || '*';
    origin.postMessage(data, target);
  };

  let autoOffs: Callback[] = [];

  const offMsg = (name: string, callback: Callback<MessageEvent>) => {
    if (name && callback) {
      const arr = callbacks[name] || [];
      const index = arr.findIndex((item) => item === callback);
      if (index > -1) {
        arr.splice(index, 1);
      }
    }
  };

  const onMsg = (name: string, callback: Callback<MessageEvent>, autoOff = true) => {
    if (name && callback) {
      if (!callbacks[name]) {
        callbacks[name] = [callback];
      } else {
        callbacks[name].push(callback);
      }
      if (autoOff) {
        autoOffs.push(() => {
          offMsg(name, callback);
        });
      }
    }
  };

  onBeforeUnmount(() => {
    autoOffs.forEach((cb) => cb());
    autoOffs = [];
  });

  return {
    postMsg,
    offMsg,
    onMsg,
  };
};
