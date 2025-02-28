export const external = ['vue', 'vue-router', 'element-plus', 'axios', 'moment', 'radash']
const cdnModules = [
  {
    name: 'vue',
    var: 'Vue',
    path: 'https://unpkg.com/vue@3/dist/vue.esm-browser.js',
  },
  {
    name: 'vue-router',
    var: 'VueRouter',
    path: 'https://unpkg.com/vue-router@4/dist/vue-router.global.js',
  },
  {
    name: 'element-plus',
    var: 'ElementPlus',
    path: 'https://unpkg.com/element-plus@2.3.8/dist/index.full.min.js',
    css: 'https://unpkg.com/element-plus@2.3.8/dist/index.css',
  },
  {
    name: 'moment',
    var: 'moment',
    path: 'https://unpkg.com/moment@2.29.4/min/moment.min.js',
  },
  {
    name: 'radash',
    var: 'radash',
    path: 'https://unpkg.com/radash@11.0.0/dist/index.umd.js',
  },
]

export const modules = cdnModules.filter((item) => external.includes(item.name))
