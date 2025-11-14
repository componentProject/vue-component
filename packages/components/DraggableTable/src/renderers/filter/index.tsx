// DraggableTable组件主文件
import FilterRenderer from './FilterRenderer.vue'

// // 创建一个显示列表的筛选的筛选渲染器
// VxeUI.renderer.add('filterRenderer', {
//   // 不显示底部按钮，使用自定义的按钮
//   showTableFilterFooter: false,
//   // 自定义筛选模板
//   renderTableFilter(renderOpts, renderParams) {
//     return <FilterRenderer render-opts={renderOpts} render-params={renderParams} />
//   },
//   // 自定义重置数据方法
//   tableFilterResetMethod(params) {
//     const { options } = params
//     options.forEach((option) => {
//       option.data = { vals: [], sVal: '' }
//     })
//   },
//   // 自定义筛选数据方法
//   tableFilterMethod(params) {
//     const { option, row, column } = params
//     const { vals } = option.data
//     const cellValue = row[column.field]
//     return vals.includes(cellValue?.toString())
//   },
// })

export default {
  name: 'filterRenderer',
  render: {
    // 不显示底部按钮，使用自定义的按钮
    showTableFilterFooter: false,
    // 自定义筛选模板
    renderTableFilter(renderOpts, renderParams) {
      return <FilterRenderer render-opts={renderOpts} render-params={renderParams} />
    },
    // 自定义重置数据方法
    tableFilterResetMethod(params) {
      const { options } = params
      options.forEach((option) => {
        option.data = { vals: [], sVal: '' }
      })
    },
    // 自定义筛选数据方法
    tableFilterMethod(params) {
      const { option, row, column } = params
      const { vals } = option.data
      const cellValue = row[column.field]
      return vals.includes(cellValue?.toString())
    },
  },
}
