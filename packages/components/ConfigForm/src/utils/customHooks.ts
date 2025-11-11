import type { ComponentInternalInstance } from 'vue'
import { getCurrentInstance, inject, watch } from 'vue'
import { FormDesignStoreKey } from '@moluoxixi/components/FormDesign/src/store'
import type { FormDesignStore } from '@moluoxixi/components/FormDesign/src/store'

/**
 * 获取 $Flex 工具函数
 * 从 FormDesignStore 获取，必须在使用 FormDesign 组件树内使用
 */
function getFlex() {
  const store = inject<FormDesignStore>(FormDesignStoreKey)
  if (!store) {
    throw new Error('getFlex must be used within FormDesign component tree')
  }
  return store.$Flex
}

function useWatch(props: any) {
  const vm = getCurrentInstance() as ComponentInternalInstance
  // 预览模式下才有效
  if (!props.data.fieldName && !props.item.controlItems) {
    watch(
      () => props.data[props.item.data.fieldName],
      (val, oldVal) => {
        if (props.item.data.action && props.item.data.action.onChange) {
          const $Flex = getFlex()
          if ($Flex) {
            $Flex.funcExec(props.item.data.action.onChange, vm.proxy, [val, oldVal, props.data])
          }
        }
        vm.emit('change')
      },
      {
        deep: true,
      },
    )
  }
}

export { getFlex, useWatch }
