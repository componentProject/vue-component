import { VxeUI } from 'vxe-pc-ui'
import CellRenderer from './CellRenderer.vue'

// 创建一个默认渲染器
VxeUI.renderer.add('cellRenderer', {
  // 自定义默认模板
  renderTableDefault(renderOpts, renderParams) {
    return <CellRenderer render-opts={renderOpts} render-params={renderParams} />
  },
})
