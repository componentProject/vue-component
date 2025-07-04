<script lang="jsx">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WlTableColumn',
  props: {
    column: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  render() {
    const { column } = this.$props
    const { render, slots, ...attrs } = column
    const scopedSlots = {}
    if (render) {
      scopedSlots.default = (scope) => render.bind(this)(scope)
    }

    return [<el-table-column v-slots={slots} {...attrs} />]
  },
})
</script>

<style scoped lang="scss"></style>
