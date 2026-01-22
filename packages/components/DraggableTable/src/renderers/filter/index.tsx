import FilterRenderer from './FilterRenderer.vue'

export default {
  name: 'filterRenderer',
  render: {

    showTableFilterFooter: false,

    renderTableFilter(renderOpts: any, renderParams: any) {
      return <FilterRenderer render-opts={renderOpts} render-params={renderParams} />
    },

    tableFilterResetMethod(params: any) {
      const { options } = params
      options.forEach((option: any) => {
        option.data = { vals: [], sVal: '' }
      })
    },

    tableFilterMethod(params: any) {
      const { option, row, column } = params
      const { vals } = option.data
      const cellValue = row[column.field]
      return vals.includes(cellValue?.toString())
    },
  },
}
