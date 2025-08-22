import 'highlight.js/styles/atom-one-light.css';
import '../assets/iconfont/iconfont.css';
import './markdown-it-vue/markdown-it.css';
import { syncAllEmrData, syncSelectedData } from './emrAgent/js/syncToEmr';
import AIAgent from '../AIAgent.vue';
// 组件集合
const components = {
    AIAgent,
};
const EmrUtils = {
    syncAllEmrData,
    syncSelectedData
}
// Vue 插件安装函数
const install = (Vue) => {
    Object.keys(components).forEach(name => {
        Vue.component(name, components[name]);
    });
};

export default {
    AIAgent,
    install
};

export {
    AIAgent,
    EmrUtils
}

