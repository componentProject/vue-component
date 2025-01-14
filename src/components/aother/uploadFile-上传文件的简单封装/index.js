import wgUploadFile from './src/main'
/* istanbul ignore next */
wgUploadFile.install = function (Vue) {
  Vue.component(wgUploadFile.name, wgUploadFile)
}

export default wgUploadFile
