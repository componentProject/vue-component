import { Helpers } from './Helpers'
import {
  useCursor,
  useDesigner,
  useDragon,
  usePrefix,
  useSelection,
  useTree,
  useValidNodeOffsetRect,
} from '../../hooks'
import { ResizeHandler } from './ResizeHandler'
import { observer } from '@formily/reactive-vue'
import type { TreeNode } from '@designable/core'
import { defineComponent } from 'vue-demi'
import { composeExport } from '@moluoxixi/element/src/__builtins__'
import type { CSSProperties } from '@vue/runtime-dom'
import { toRef } from '@vue/runtime-dom'
import { isNum } from '@designable/shared'
import { TranslateHandler } from './TranslateHandler'

export interface ISelectionBoxProps {
  node: TreeNode
  showHelpers: boolean
}

export const SelectionBox = defineComponent({
  name: 'SelectionBox',
  inheritAttrs: false,
  props: ['node', 'showHelpers'],
  setup(props, { attrs }) {
    const designerRef = useDesigner()
    const prefixRef = usePrefix('aux-selection-box')
    const innerPrefixRef = usePrefix('aux-selection-box-inner')
    const nodeRectRef = useValidNodeOffsetRect(toRef(props, 'node'))

    return () => {
      const innerPrefix = innerPrefixRef.value
      const designer = designerRef.value
      const nodeRect = nodeRectRef.value
      const createSelectionStyle = () => {
        const baseStyle: CSSProperties = {
          position: 'absolute',
          top: 0,
          left: 0,
          boxSizing: 'border-box',
          zIndex: 4,
        }
        if (nodeRect) {
          baseStyle.transform = `perspective(1px) translate3d(${nodeRect.x}px,${nodeRect.y}px,0)`
          baseStyle.height = isNum(nodeRect.height)
            ? `${nodeRect.height}px`
            : nodeRect.height
          baseStyle.width = isNum(nodeRect.width)
            ? `${nodeRect.width}px`
            : nodeRect.width
        }
        return baseStyle
      }
      if (!nodeRect)
        return null

      if (!nodeRect.width || !nodeRect.height)
        return null
      const selectionId = {}
      if (designer.props?.nodeSelectionIdAttrName) {
        selectionId[designer.props.nodeSelectionIdAttrName] = props.node.id
      }
      return (
        <div {...selectionId} class={prefixRef.value} style={createSelectionStyle()}>
          <div class={innerPrefix}></div>
          <ResizeHandler node={props.node} />
          <TranslateHandler node={props.node} />
          {props.showHelpers && (
            <Helpers
              {...attrs}
              key={JSON.stringify(nodeRect.toJSON())}
              node={props.node}
              nodeRect={nodeRect}
            />
          )}
        </div>
      )
    }
  },
})

const SelectionComponent = observer(
  defineComponent({
    name: 'Selection',
    setup() {
      const selectionRef = useSelection()
      const treeRef = useTree()
      const cursorRef = useCursor()
      const viewportDragonRef = useDragon()
      return () => {
        if (
          cursorRef.value.status !== 'NORMAL'
          && viewportDragonRef.value.touchNode
        ) {
          return null
        }
        return (
          <>
            {selectionRef.value.selected.map((id) => {
              const node = treeRef.value.findById(id)
              if (!node)
                return null
              if (node.hidden)
                return null
              return (
                <SelectionBox
                  {...{
                    key: id,
                    node,
                    showHelpers: selectionRef.value.selected.length === 1,
                  }}
                  key={id}
                />
              )
            })}
          </>
        )
      }
    },
  }),
)

export const Selection = composeExport(SelectionComponent, {
  displayName: 'Selection',
})
