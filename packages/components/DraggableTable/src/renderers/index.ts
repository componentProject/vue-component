import { VxePager, VxeTooltip } from 'vxe-pc-ui'
import cellRenderer from './cell'
import editRenderer from './edit'
import filterRenderer from './filter'
// // DraggableTable组件主文件
// import './filter/index.tsx'
// import './edit/index.tsx'
// import './cell/index.tsx'

export default function installFn(VxeUI: any) {
  VxeUI.component(VxePager)
  VxeUI.component(VxeTooltip)
  VxeUI.renderer.add(filterRenderer.name, filterRenderer.render)
  VxeUI.renderer.add(editRenderer.name, editRenderer.render)
  VxeUI.renderer.add(cellRenderer.name, cellRenderer.render)
}
