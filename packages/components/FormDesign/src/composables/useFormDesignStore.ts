import { inject } from 'vue'
import type { FormDesignStore } from '../store'
import { FormDesignStoreKey } from '../store'

/**
 * 使用 FormDesign Store 的 composable
 * 在子组件中通过此函数获取 Store 实例
 */
export function useFormDesignStore(): FormDesignStore {
  const store = inject<FormDesignStore>(FormDesignStoreKey)
  if (!store) {
    throw new Error('useFormDesignStore must be used within FormDesign component')
  }
  return store
}
