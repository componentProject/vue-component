import { VxePager, VxeTooltip } from 'vxe-pc-ui'
import cellRenderer from './cell'
import editRenderer from './edit'
import filterRenderer from './filter'

export default function installFn(VxeUI: any) {
  VxeUI.component(VxeTooltip)
  VxeUI.component(VxePager)
  VxeUI.renderer.add(filterRenderer.name, filterRenderer.render)
  VxeUI.renderer.add(editRenderer.name, editRenderer.render)
  VxeUI.renderer.add(cellRenderer.name, cellRenderer.render)
}
