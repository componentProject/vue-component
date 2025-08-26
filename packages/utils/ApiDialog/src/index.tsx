import type { AppContext, Component, VNode } from 'vue'
import { createVNode, defineComponent, render } from 'vue'
import { ElButton, ElDialog } from 'element-plus'

// 插槽类型定义
export type SlotType = VNode[] | VNode | Component | string | (() => VNode[])

// Dialog 配置项
export interface ApiDialogOptions {
  props?: Record<string, any>
  slots?: {
    default?: SlotType
    [key: string]: SlotType | undefined
  }
  appContext?: AppContext | null
}

// createApiDialog 工具函数
export function createApiDialog(DialogComponent?: Component) {
  let container: HTMLDivElement | null = null
  let vnode: VNode | null = null
  let isOpen = false
  let currentReject: ((reason?: any) => void) | null = null

  // 如果没有传递Dialog组件，创建一个基于el-dialog的默认组件
  const DefaultDialog = defineComponent({
    name: 'DefaultApiDialog',
    props: {
      modelValue: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: '对话框',
      },
      width: {
        type: [String, Number],
        default: '50%',
      },
    },
    emits: ['close', 'confirm', 'update:modelValue'],
    setup(props, { slots, emit }) {
      const handleClose = () => {
        emit('close')
        emit('update:modelValue', false)
      }

      const handleConfirm = (data: any) => {
        emit('confirm', data)
        emit('update:modelValue', false)
      }

      return () => (
        <ElDialog
          modelValue={props.modelValue}
          title={props.title}
          width={props.width}
          onUpdate:modelValue={(val: boolean) => {
            emit('update:modelValue', val)
            if (!val) {
              handleClose()
            }
          }}
          v-slots={{
            default: () => slots.default?.(),
            header: slots.header,
            footer: slots.footer || (() => (
              <div class="dialog-footer">
                <ElButton
                  onClick={() => handleClose()}
                >
                  取消
                </ElButton>
                <ElButton
                  type="primary"
                  onClick={() => handleConfirm({})}
                >
                  确定
                </ElButton>
              </div>
            )),
          }}
        />
      )
    },
  })

  // 使用传入的组件或默认组件
  const FinalDialogComponent = DialogComponent || DefaultDialog

  // 创建容器
  function createContainer() {
    const el = document.createElement('div')
    document.body.appendChild(el)
    return el
  }

  // 显示 Dialog
  function show(options: ApiDialogOptions = {}): Promise<any> {
    if (isOpen) {
      // 如果已打开，先关闭再打开新的
      close()
    }
    container = createContainer()
    const { props = {}, slots = {}, appContext } = options

    return new Promise((resolve, reject) => {
      currentReject = reject
      vnode = createVNode(
        FinalDialogComponent,
        {
          ...props,
          modelValue: true,
          // 监听关闭事件
          onClose: () => {
            reject(new Error('对话框已关闭'))
            cleanup()
          },
          // 监听确认事件（如有）
          onConfirm: (data: any) => {
            resolve(data)
            cleanup()
          },
        },
        slots,
      )
      if (appContext) {
        vnode.appContext = appContext
      }
      render(vnode, container!) // 非空断言，确保 container 不为 null
      isOpen = true
    })
  }

  // 关闭并销毁 Dialog
  function close() {
    if (isOpen && vnode && container) {
      // 触发关闭事件
      if (vnode.component && vnode.component.exposed && typeof vnode.component.exposed.close === 'function') {
        vnode.component.exposed.close()
      }
      // 主动 reject
      if (currentReject) {
        currentReject(new Error('对话框被主动关闭'))
        currentReject = null
      }
      cleanup()
    }
  }

  // 清理 DOM 和状态
  function cleanup() {
    if (container) {
      render(null, container)
      container.remove()
      container = null
    }
    vnode = null
    isOpen = false
  }

  // 如果没有传递Dialog组件，返回包含Dialog组件的对象
  if (!DialogComponent) {
    return {
      Dialog: DefaultDialog,
      show,
      close,
    }
  }

  // 如果传递了Dialog组件，保持原有返回格式
  return {
    show,
    close,
  }
}

export default createApiDialog
