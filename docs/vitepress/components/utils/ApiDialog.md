# ApiDialog

## 组件示例

本页为工具类封装，无可视化 Demo。请参考下方 API 说明与使用示例。

## API

### 函数

- createApiDialog(DialogComponent?: Component):
  - 当未传入自定义组件时，返回 `{ Dialog, show, close }`
  - 当传入自定义组件时，返回 `{ show, close }`

### 类型

- ApiDialogOptions
  - `props?`: 传入对话框组件的 props
  - `slots?`: 传入对话框组件的插槽（支持 `default`/`header`/`footer`）
  - `appContext?`: 传入应用上下文（在外部使用时可确保插槽正确渲染）
- SlotType: `VNode[] | VNode | Component | string | (() => VNode[])`

### 默认对话框（未传 DialogComponent）

- Props：
  - `modelValue`: boolean（v-model）
  - `title`: string（标题）
  - `width`: string | number（宽度）
- Emits：
  - `update:modelValue`、`close`、`confirm`
- Slots：
  - `default` / `header` / `footer`（`footer` 默认提供 确定/取消 按钮）

### 使用示例

```ts
import { createApiDialog } from '@moluoxixi/apidialog'

// 1) 默认对话框
const { show } = createApiDialog()
show({
  props: { title: '标题', width: '30%' },
  slots: { default: '内容' },
}).then((res) => {
  console.log('确认', res)
}).catch((err) => {
  console.log('关闭', err)
})

// 2) 自定义对话框
import MyDialog from './MyDialog.vue'
const { show: showMy } = createApiDialog(MyDialog)
showMy({ props: { title: '自定义' } })
```

