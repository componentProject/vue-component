import { DroppableWidget } from '@moluoxixi/element-prototypes'
import './styles.less'
import { defineComponent } from 'vue-demi'
import type { VNode } from 'vue'

export const Container = defineComponent({
  name: 'DnContainer',
  setup(props, { slots }) {
    return () => {
      return <DroppableWidget v-slots={slots}></DroppableWidget>
    }
  },
})

export function withContainer(Target: VNode) {
  return defineComponent({
    setup(props, { attrs, slots }) {
      return () => {
        return (
          <DroppableWidget>
            <Target {...attrs} v-slots={slots} />
          </DroppableWidget>
        )
      }
    },
  })
}
