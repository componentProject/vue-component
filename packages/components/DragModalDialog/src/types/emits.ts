/**
 * DragModalDialog 组件的 Emits 类型定义
 */
export interface emitsType {
  (e: 'update:visible', visible: boolean): void
  (e: 'update:left', left: string | number): void
  (e: 'update:top', top: string | number): void
  (e: 'update:width', width: string | number): void
  (e: 'update:height', height: string | number): void
  (e: 'open'): void
  (e: 'opened'): void
  (e: 'close'): void
  (e: 'closed'): void
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'beforeClose', done: () => void): void
}
