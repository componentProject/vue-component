export const external = [
  'vue',
  'vue-router',
  'element-plus',
  '@element-plus/icons-vue',
  'lodash',
  'moment',
  'radash',
]

function getCdnModule(name: string, varName?: string, path?: string, css?: string) {
  return {
    name,
    var: varName || name,
    path,
    css,
  }
}

export const modules = [
  getCdnModule('vue', 'Vue', 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'),
  getCdnModule(
    'vue-router',
    'VueRouter',
    'https://unpkg.com/vue-router@4/dist/vue-router.global.js',
  ),
  getCdnModule('lodash', '_', 'https://unpkg.com/lodash@4.17.21/lodash.min.js'),
  getCdnModule(
    'element-plus',
    'ElementPlus',
    'https://unpkg.com/element-plus@2.10.1/dist/index.full.min.js',
    'https://unpkg.com/element-plus@2.10.1/dist/index.css',
  ),
  getCdnModule(
    '@element-plus/icons-vue',
    'ElementPlusIconsVue',
    'https://unpkg.com/@element-plus/icons-vue@2.3.1/dist/index.iife.min.js',
  ),
  getCdnModule('moment', 'moment', 'https://unpkg.com/moment@2.30.1/min/moment.min.js'),
  getCdnModule('radash', 'radash', 'https://unpkg.com/radash@12.1.0/dist/index.umd.js'),
]
