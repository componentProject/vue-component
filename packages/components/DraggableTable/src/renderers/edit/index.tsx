import EditRenderer from './EditRenderer.vue'

export default {
  name: 'editRenderer',
  render: {

    renderTableEdit(renderOpts: any, renderParams: any) {
      return <EditRenderer render-opts={renderOpts} render-params={renderParams} />
    },
  },
}
