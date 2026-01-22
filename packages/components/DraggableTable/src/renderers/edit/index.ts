import { h } from 'vue'
import EditRenderer from './EditRenderer.vue'

// // 创建一个编辑渲染器
// VxeUI.renderer.add('editRenderer', {
//   // 自定义编辑模板
//   renderTableEdit(renderOpts, renderParams) {
//     return <EditRenderer render-opts={renderOpts} render-params={renderParams} />
//   },
// })
export default {
  name: 'editRenderer',
  render: {
    // 自定义编辑模板

    renderTableEdit(renderOpts: any, renderParams: any) {
      return h(EditRenderer, {
        renderOpts,
        renderParams,
      })
    },
  },
}
