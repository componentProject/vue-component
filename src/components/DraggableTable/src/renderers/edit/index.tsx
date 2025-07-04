import { VxeUI } from 'vxe-table'
import EditRenderer from './EditRenderer.tsx'

// 创建一个编辑渲染器
VxeUI.renderer.add('editRenderer', {
  // 自定义编辑模板
  renderTableEdit(renderOpts, renderParams) {
    return <EditRenderer render-opts={renderOpts} render-params={renderParams} />
  },
})
