# ApiDialog 对话框组件

一个基于 Vue 3 的对话框组件，可以通过 API 的方式调用显示对话框。

## 特性

- 支持通过 API 方式调用显示对话框
- 基于 Promise 的调用方式，支持异步/await 操作
- 自动处理对话框的创建和销毁
- 支持传递自定义属性和插槽内容
- 支持在任意组件中使用，不需要提前引入组件
- 可以使用默认对话框或自定义对话框组件

## 安装

```bash
npm install @moluoxixi/api-dialog
# 或者
yarn add @moluoxixi/api-dialog
# 或者
pnpm add @moluoxixi/api-dialog
```

## 使用方法

### 基本用法

```vue
<template>
  <div>
    <el-button @click="showDialog">显示对话框</el-button>
  </div>
</template>

<script setup>
import { createApiDialog } from '@moluoxixi/api-dialog'

// 创建默认API对话框实例
const { show: showDialog } = createApiDialog()

function openDialog() {
  try {
    showDialog({
      props: {
        title: '系统提示',
        width: '400px'
      },
      slots: {
        default: '这是一个通过API调用的对话框'
      }
    }).then(result => {
      console.log('对话框确认返回的数据:', result)
    }).catch(error => {
      console.log('对话框被关闭或取消:', error)
    })
  } catch (error) {
    console.error('发生错误:', error)
  }
}
</script>
```

### 使用自定义对话框组件

```vue
<template>
  <div>
    <el-button @click="showDialog">显示自定义对话框</el-button>
  </div>
</template>

<script setup>
import { createApiDialog } from '@moluoxixi/api-dialog'
import MyDialog from './MyDialog.vue'

// 创建自定义API对话框实例
const { show: showMyDialog } = createApiDialog(MyDialog)

function showDialog() {
  try {
    showMyDialog({
      props: {
        title: '用户信息',
        width: '500px'
      }
    }).then(result => {
      console.log('对话框确认返回的数据:', result)
    }).catch(error => {
      console.log('对话框被关闭或取消:', error)
    })
  } catch (error) {
    console.error('发生错误:', error)
  }
}
</script>
```

### 使用插槽内容

```vue

<template>
  <el-button @click="showDialogWithSlots">带插槽的对话框</el-button>
</template>

<script setup>
  import { h } from 'vue'
  import { createApiDialog } from '@moluoxixi/api-dialog'
  import { ElButton, ElInput } from 'element-plus'
  // 你的dialog组件
  import ComplexDialog from './ComplexDialog.vue'

  const { show } = createApiDialog(ComplexDialog)

  function showDialogWithSlots () {
    try {
      show({
             props: {
               title: '带插槽的对话框',
               width: '500px'
             },
             slots: {
               default: h('div', { class: 'custom-content' }, [
                 h('h3', { style: 'color: #409EFF' }, '自定义内容'),
                 h('p', null, '这是通过API方式传入的插槽内容'),
                 h(ElInput, {
                   modelValue: '',
                   placeholder: '请输入内容',
                   style: 'margin: 10px 0'
                 })
               ]),
               footer: h('div', { class: 'custom-footer' }, [
                 h(ElButton, { onClick: () => {} }, '取消'),
                 h(ElButton, { type: 'primary', onClick: () => {} }, '确定')
               ])
             }
           }).then(result => {
        console.log('结果:', result)
      }).catch(error => {
        console.log('对话框关闭:', error)
      })
    } catch (error) {
      console.error('发生错误:', error)
    }
  }
</script>
```

### 自定义对话框组件示例

对话框组件需要接收 `modelValue` 属性，并通过 `emit` 事件通知对话框的关闭和确认：

```vue
<template>
  <el-dialog v-model="visible" :title="title" @close="handleClose">
    <div class="content">
      <slot>默认内容</slot>
    </div>
    
    <template #footer>
      <slot name="footer">
        <div class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确认</el-button>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '对话框'
  },
  // 其他对话框属性...
})

const emit = defineEmits(['update:modelValue', 'close', 'confirm'])

// 计算属性用于处理v-model
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 导出方法给createApiDialog使用
defineExpose({
  close: () => {
    visible.value = false
  }
})

// 处理关闭
const handleClose = () => {
  emit('close')
}

// 处理取消
const handleCancel = () => {
  visible.value = false
  emit('close')
}

// 处理确认
const handleConfirm = () => {
  // 这里可以处理确认逻辑，例如表单验证等
  const data = { confirmed: true, time: Date.now() }
  emit('confirm', data)
}
</script>
```

## 配置项

### createApiDialog 函数参数

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| DialogComponent | 自定义对话框组件 | Component \| undefined | undefined |

### createApiDialog 返回值

| 返回值 | 说明 | 类型 |
| ----- | ---- | ---- |
| show | 显示对话框的方法 | (options: ApiDialogOptions) => Promise\<any\> |
| close | 关闭当前显示的对话框 | () => void |
| Dialog | 默认对话框组件（仅当未传递自定义组件时返回） | Component |

### ApiDialogOptions 配置

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| props | 传递给对话框组件的 props | Record<string, any> | {} |
| slots | 传递给对话框组件的插槽内容 | { [key: string]: SlotType \| undefined } | {} |
| appContext | Vue 应用上下文，用于插槽内容的正确渲染 | AppContext \| null | null |

### SlotType 类型定义

```typescript
type SlotType = VNode[] | VNode | Component | string | (() => VNode[])
```

## 使用场景

- 需要通过编程方式创建对话框
- 需要在多个地方复用相同的对话框逻辑
- 需要使用Promise处理对话框的确认和取消操作
- 需要动态传递数据给对话框
- 需要在较复杂的交互流程中使用对话框

## 注意事项

- 对话框组件需要接收 `modelValue` 属性以支持 v-model 绑定
- 对话框组件需要触发 `close` 事件用于处理关闭逻辑
- 对话框组件需要触发 `confirm` 事件用于处理确认逻辑并返回数据
- 建议对话框组件通过 `defineExpose` 暴露 `close` 方法，以便在需要时手动关闭对话框
- 使用JSX创建复杂的插槽内容时，需要确保传递了正确的appContext
- 可以通过close方法主动关闭当前显示的对话框

## 内部实现

ApiDialog内部使用了Vue 3的以下特性：
- defineComponent：创建默认对话框组件
- createVNode：创建虚拟节点
- render：将虚拟节点渲染到DOM
- Promise：处理对话框的异步操作

对话框被渲染到一个动态创建的DOM容器中，并在关闭时自动清理。 