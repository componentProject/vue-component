import CellRenderer from './CellRenderer.vue'

export default {
  name: 'cellRenderer',
  render: {

    renderTableDefault(renderOpts: any, renderParams: any) {
      return <CellRenderer render-opts={renderOpts} render-params={renderParams} />
    },
  },
}
