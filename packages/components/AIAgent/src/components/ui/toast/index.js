import { createApp } from 'vue';
import ToastComponent from './Toast.vue';

let toastInstance = null;
let mountNode = null;
let app = null;

const createToast = () => {
    if (toastInstance) return toastInstance;

    // 创建挂载节点
    mountNode = document.createElement('div');
    const el = document.querySelector('#trasen-ai-agent-floating-panel');
    el && el.appendChild(mountNode);
    // 创建Vue 3应用实例
    app = createApp(ToastComponent);
    toastInstance = app.mount(mountNode);

    return toastInstance;
};

export const $toast = (message, options = {}) => {
    const instance = createToast();
    instance.show(message, options);
};

export function copyValue(val) {
    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard 向剪贴板写文本
        $toast('复制成功', {
            type: 'success'
        });
        return navigator.clipboard.writeText(val);
    } else {
        // 创建text area
        const textArea = document.createElement('textarea');
        textArea.value = val;
        // 使text area不在viewport，同时设置不可见
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        $toast('复制成功', {
            type: 'success'
        });
        return new Promise((res, rej) => {
            // 执行复制命令并移除文本框
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
        });
    }
}
