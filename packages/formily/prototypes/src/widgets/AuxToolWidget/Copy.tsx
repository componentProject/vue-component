import { useOperation, usePrefix } from '../../hooks'
import { IconWidget } from '../IconWidget'
import { defineComponent } from 'vue-demi'
import { useStyle } from '../../shared'
import { composeExport } from '@moluoxixi/element/src/__builtins__'

// export interface ICopyProps {
//   node: TreeNode
//   style?: React.CSSProperties
// }

const CopyComponent = defineComponent({
  name: 'CopyComponent',
  props: ['node'],
  setup(props) {
    const operationRef = useOperation()
    const prefixRef = usePrefix('aux-copy')
    const style = useStyle()
    return () => {
      if (props.node === props.node.root)
        return null
      return (
        <button
          class={prefixRef.value}
          style={style}
          onClick={() => {
            operationRef.value.cloneNodes([props.node])
          }}
        >
          <IconWidget infer="Clone" />
        </button>
      )
    }
  },
})

export const Copy = composeExport(CopyComponent, { displayName: 'Copy' })
