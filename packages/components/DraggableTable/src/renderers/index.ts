import cellRenderer from './cell/index.tsx'
import editRenderer from './edit/index.tsx'
import filterRenderer from './filter/index.tsx'
// // DraggableTable组件主文件
// import './filter/index.tsx'
// import './edit/index.tsx'
// import './cell/index.tsx'

export default function installFn(VxeUI: any) {
  VxeUI.renderer.add(filterRenderer.name, filterRenderer.render)
  VxeUI.renderer.add(editRenderer.name, editRenderer.render)
  VxeUI.renderer.add(cellRenderer.name, cellRenderer.render)
}
