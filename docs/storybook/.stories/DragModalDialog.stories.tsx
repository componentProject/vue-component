// noinspection JSUnusedGlobalSymbols

import { ref } from 'vue'
import DragModalDialog from '@moluoxixi/components/DragModalDialog'
import type { Meta, StoryFn } from '@storybook/vue3'

const meta: Meta<typeof DragModalDialog> = {
  title: 'DragModalDialog',
  component: DragModalDialog,
  tags: ['autodocs'],
  argTypes: {
    visible: {
      control: 'boolean',
    },
    title: {
      control: 'text',
    },
    width: {
      control: 'text',
    },
    height: {
      control: 'text',
    },
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
    },
    draggable: {
      control: 'boolean',
    },
    resizable: {
      control: 'boolean',
    },
    mask: {
      control: 'boolean',
    },
    maskClosable: {
      control: 'boolean',
    },
    penetrate: {
      control: 'boolean',
    },
    showClose: {
      control: 'boolean',
    },
    showFooter: {
      control: 'boolean',
    },
    showCancel: {
      control: 'boolean',
    },
    showConfirm: {
      control: 'boolean',
    },
    cancelText: {
      control: 'text',
    },
    confirmText: {
      control: 'text',
    },
    top: {
      control: 'text',
    },
    left: {
      control: 'text',
    },
  },
  args: {
    visible: true,
    title: '拖拽对话框示例',
    size: 'medium',
    draggable: true,
    resizable: true,
    mask: true,
    maskClosable: true,
    penetrate: false,
    showClose: true,
    showFooter: true,
    showCancel: true,
    showConfirm: true,
    cancelText: '取消',
    confirmText: '确定',
  },
}
export default meta

const Template: StoryFn = args => ({
  components: { DragModalDialog },
  setup() {
    const visible = ref(args.visible)

    const handleConfirm = () => {
      console.log('确认操作')
      visible.value = false
    }

    const handleCancel = () => {
      console.log('取消操作')
      visible.value = false
    }

    const handleClose = () => {
      console.log('关闭对话框')
      visible.value = false
    }

    return {
      ...args,
      visible,
      handleConfirm,
      handleCancel,
      handleClose,
    }
  },
  template: `
    <div>
      <button @click="visible = true" style="margin-bottom: 20px;">打开对话框</button>
      <DragModalDialog
        v-bind="args"
        v-model:visible="visible"
        @confirm="handleConfirm"
        @cancel="handleCancel"
        @close="handleClose"
      >
        <p>这是一个可拖拽和可调整大小的对话框示例。</p>
        <p>你可以拖拽标题栏移动对话框，也可以拖拽边缘调整大小。</p>
      </DragModalDialog>
    </div>
  `,
})

export const 基础示例 = Template.bind({})
基础示例.args = {
  visible: false,
  title: '基础拖拽对话框',
}

export const 可调整大小 = Template.bind({})
可调整大小.args = {
  visible: false,
  title: '可调整大小的对话框',
  resizable: true,
  width: 500,
  height: 400,
}

export const 遮罩层穿透 = Template.bind({})
遮罩层穿透.args = {
  visible: false,
  title: '遮罩层穿透示例',
  penetrate: true,
  maskClosable: false,
}

export const 自定义尺寸和位置 = Template.bind({})
自定义尺寸和位置.args = {
  visible: false,
  title: '自定义尺寸和位置',
  width: '60%',
  height: '70%',
  top: '10%',
  left: '20%',
  draggable: true,
  resizable: true,
}

// JSX写法示例
export function JSX示例(args) {
  return {
    setup() {
      const visible = ref(false)

      return () => (
        <div>
          <button onClick={() => visible.value = true} style="margin-bottom: 20px;">
            打开JSX对话框
          </button>
          <DragModalDialog
            v-model:visible={visible.value}
            title="JSX示例对话框"
            draggable={true}
            resizable={true}
            width={600}
            height={500}
            v-slots={{
              default: () => (
                <div>
                  <h3>使用JSX渲染的内容</h3>
                  <p>这是一个使用JSX语法编写的对话框示例。</p>
                </div>
              ),
              footer: () => (
                <div>
                  <button onClick={() => visible.value = false}>关闭</button>
                </div>
              ),
            }}
          />
        </div>
      )
    },
  }
}
