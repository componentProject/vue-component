import { defineStore } from 'pinia'
import { store } from '../index.ts'

/**
 * 系统对象
 * @returns {object} 系统存储对象
 */
const systemStore = defineStore('system', {
  state: () => ({
    /**
     * 主题颜色
     * @type {string}
     */
    themeColor: '#3a77ff',
    /**
     * 布局
     * @type {string}
     */
    layout: 'element',
    /**
     * 系统编码
     * @type {string}
     */
    systemCode: __SYSTEM_CODE__,
  }),
  actions: {
    setSystemCode(systemCode: string) {
      // 将当前的主题颜色设置为传入的颜色
      this.systemCode = systemCode
    },
    /**
     * 设置布局
     * @param {string} layout - 新的布局
     */
    setLayout(layout: string) {
      this.layout = layout
    },
    /**
     * 设置主题颜色
     * @param {string} color - 新的主题颜色
     */
    setTheme(color: string) {
      // 将当前的主题颜色设置为传入的颜色
      this.themeColor = color
    },
  },
})

export function useSystemStore() {
  return systemStore(store)
}
