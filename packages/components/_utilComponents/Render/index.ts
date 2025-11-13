// _utilComponents入口文件
import { defineComponent } from 'vue'

export default defineComponent<{ render: () => any }>({
  name: 'WlRender',
  props: { render: { type: Function as unknown as () => () => any, required: true } },
  setup: (props: any) => () => props.render(),
})
