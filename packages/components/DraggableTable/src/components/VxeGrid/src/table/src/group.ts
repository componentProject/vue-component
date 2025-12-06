// VxeGrid的group组件
import type { Slot } from 'vue'
import type { VxeTableConstructor, VxeTablePrivateMethods } from '../../../types'
import type { XEColumnInstance } from './util'
import { createCommentVNode, defineComponent, h, inject, onMounted, onUnmounted, provide, ref } from 'vue'
// 导入 CSS Modules 样式文件
import cssModules from '../../styles/modules/colgroup.module.scss'
import Cell from './cell'
import { columnProps } from './column'

import { assembleColumn, destroyColumn, watchColumn } from './util'

export default defineComponent({
  name: 'VxeColgroup',
  props: columnProps,
  setup(props, { slots }) {
    const refElem = ref<HTMLDivElement>()
    const $xeTable = inject<(VxeTableConstructor & VxeTablePrivateMethods) | null>('$xeTable', null)
    const $xeParentColgroup = inject<XEColumnInstance | null>('$xeColgroup', null)
    if (!$xeTable) {
      return () => createCommentVNode()
    }
    const columnConfig = Cell.createColumn($xeTable, props)
    const columnSlots: {
      header?: Slot
    } = {}

    if (slots.header) {
      columnSlots.header = slots.header
    }

    columnConfig.slots = columnSlots
    columnConfig.children = []

    watchColumn($xeTable, props, columnConfig)

    onMounted(() => {
      const elem = refElem.value
      if (elem) {
        assembleColumn($xeTable, elem, columnConfig, $xeParentColgroup)
      }
    })

    onUnmounted(() => {
      destroyColumn($xeTable, columnConfig)
    })

    const renderVN = () => {
      return h('div', {
        class: cssModules.root,
        ref: refElem,
      }, slots.default ? slots.default() : [])
    }

    const $xeColgroup = { columnConfig } as XEColumnInstance

    provide('$xeColgroup', $xeColgroup)
    provide('$xeGrid', null)

    return renderVN
  },
})
