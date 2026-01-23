// FormDesign组件主文件
import type { Ref } from 'vue'
import { ref } from 'vue'
import flex from '../utils/_'
import vm from '../utils/vm'

/**
 * FormDesign Store
 * 管理 FormDesign 组件所需的工具和状态
 * 通过 provide/inject 在组件树中共享
 */
export class FormDesignStore {
  // 事件总线
  public readonly $EventBus = vm

  // 工具函数
  public readonly $Flex = flex

  // 表单组件映射
  public readonly $formcomponents: Ref<Record<string, any>> = ref({})

  // 注册表单组件
  public registerFormComponents(components: Record<string, any>) {
    this.$formcomponents.value = { ...this.$formcomponents.value, ...components }
  }

  // 清理 Store（组件销毁时调用）
  public cleanup() {
    // 清除所有事件监听
    this.$EventBus.all.clear()
    // 清空表单组件映射
    this.$formcomponents.value = {}
  }

  // 包装 jsonToForm 方法，使用 Store 中的 formcomponents
  public jsonToForm(item: any) {
    return this.$Flex.jsonToForm(item, this.$formcomponents.value)
  }
}

// Store 的注入 key
export const FormDesignStoreKey = Symbol('FormDesignStore')
