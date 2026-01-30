/**
 * EnterNextContainer 组件的 Emits 类型定义
 */
export interface emitsType {
  (e: 'noNextInput', element: HTMLElement): void // 当找不到下一个输入元素时触发
  (e: 'noSelectValue', element: HTMLElement): void // 当select为空时触发
}
