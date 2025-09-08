import { NodeActionsWidget } from '@moluoxixi/element-prototypes'
import type { CSSProperties, VNode } from '@vue/runtime-dom'
import { defineComponent } from 'vue-demi'
import type { PropType } from 'vue'

export interface ITemplateAction {
  title: VNode
  tooltip?: VNode
  icon?: string | VNode
  onClick: () => void
}

export interface ILoadTemplateProps {
  className?: string
  style?: CSSProperties
  actions?: ITemplateAction[]
}

export const LoadTemplate = defineComponent({
  props: { actions: Array as PropType<Array<ITemplateAction>> },
  setup(props) {
    return () => {
      return (
        <NodeActionsWidget>
          {props.actions?.map((action, key) => {
            return (
              <NodeActionsWidget.Action
                {...action}
                key={key}
                onClick={action.onClick}
              />
            )
          })}
        </NodeActionsWidget>
      )
    }
  },
})
