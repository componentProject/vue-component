# DragModalDialog

## 组件示例

可拖拽可缩放弹窗组件，支持自定义标题、内容、宽度、高度、是否可拖拽、是否可缩放、是否可穿透、点击遮罩关闭弹窗等功能。

### 基本使用

:::demo
DragModalDialog/base/index
:::

### 尺寸设置

支持通过 `size` 属性设置预设尺寸，或通过 `width`/`height` 自定义尺寸。

预设尺寸：
- `small`: 400px
- `medium`: 520px (默认)
- `large`: 720px

:::demo
DragModalDialog/size/small
:::

:::demo
DragModalDialog/size/medium
:::

:::demo
DragModalDialog/size/large
:::

### 拖拽功能

开启 `draggable` 属性后，可通过标题栏拖拽移动对话框位置。

:::demo
DragModalDialog/drag/draggable
:::

### 缩放功能

开启 `resizable` 属性后，显示8方向调整手柄，可自由调整对话框大小。

:::demo
DragModalDialog/resize/resizable
:::

### 遮罩层穿透

开启 `penetrate` 属性后，遮罩层允许事件穿透，点击可触发下方元素。

:::demo
DragModalDialog/penetrate/penetrate
:::

### 自定义尺寸和位置

支持通过 `width`、`height`、`top`、`left` 属性精确控制对话框的尺寸和位置，支持像素值和百分比。

:::demo
DragModalDialog/position/custom-position
:::

### 自定义头部内容

支持通过插槽自定义头部内容：
- `header`: 完全自定义整个头部
- `header-left`: 自定义头部左侧内容
- `header-right`: 自定义头部右侧内容

:::demo
DragModalDialog/slots/header-slots
:::

### 底部操作区

支持自定义底部操作区内容，通过 `footer` 插槽实现。

:::demo
DragModalDialog/slots/footer-slot
:::

### 事件处理

支持多种事件回调：`close`、`cancel`、`confirm`、`open`、`opened`、`closed`。

:::demo
DragModalDialog/events/event-handling
:::

### 位置记忆

开启 `rememberPosition` 和 `positionKey` 后，可记住对话框的位置和大小。

:::demo
DragModalDialog/position/remember-position
:::


### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visible | 控制对话框显示/隐藏 | boolean | false |
| title | 对话框标题 | string | '提示' |
| content | 对话框内容文本 | string | '' |
| width | 对话框宽度，支持数字(px)或字符串(如'50%') | string \| number | - |
| height | 对话框高度，支持数字(px)或字符串(如'50%') | string \| number | - |
| size | 预设尺寸：small/medium/large | 'small' \| 'medium' \| 'large' | 'medium' |
| top | 对话框顶部距离，支持数字(px)或字符串(如'50%') | string \| number | - |
| left | 对话框左侧距离，支持数字(px)或字符串(如'50%') | string \| number | - |
| draggable | 是否可拖拽移动 | boolean | false |
| resizable | 是否可调整大小 | boolean | false |
| showClose | 是否显示关闭按钮 | boolean | true |
| showFooter | 是否显示底部操作区 | boolean | true |
| showCancel | 是否显示取消按钮 | boolean | true |
| showConfirm | 是否显示确认按钮 | boolean | true |
| cancelText | 取消按钮文本 | string | '取消' |
| confirmText | 确认按钮文本 | string | '确定' |
| confirmDisabled | 是否禁用确认按钮 | boolean | false |
| mask | 是否显示遮罩层 | boolean | true |
| maskClosable | 点击遮罩层是否可关闭 | boolean | true |
| zIndex | 对话框层级 | number | 1000 |
| minWidth | 最小宽度限制(px) | number | 300 |
| minHeight | 最小高度限制(px) | number | 200 |
| maxWidth | 最大宽度限制(px) | number | - |
| maxHeight | 最大高度限制(px) | number | - |
| margin | 边距保护值(px) | number | 16 |
| rememberPosition | 是否启用位置记忆功能 | boolean | false |
| positionKey | 位置记忆的唯一标识符 | string | '' |
| penetrate | 是否允许遮罩层穿透 | boolean | false |
| teleportTo | 指定弹窗挂载的目标元素，可以是 CSS 选择器字符串或 DOM 元素 | string | 默认挂载到 body |
### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:visible | 绑定值更新 | (visible: boolean) => void |
| close | 对话框关闭时触发 | () => void |
| cancel | 点击取消按钮时触发 | () => void |
| confirm | 点击确认按钮时触发 | () => void |
| open | 对话框打开时触发 | () => void |
| opened | 对话框打开动画完成后触发 | () => void |
| closed | 对话框关闭动画完成后触发 | () => void |
| update:top | 对话框位置更新(top) | (top: string \| number) => void |
| update:left | 对话框位置更新(left) | (left: string \| number) => void |

### Slots

| 插槽名 | 说明 | 参数 |
| --- | --- | --- |
| default | 对话框内容区域 | - |
| header | 完全自定义头部内容 | '{ close: () => void, title: string }' |
| header-left | 自定义头部左侧内容 | '{ title: string }' |
| header-right | 自定义头部右侧内容 | '{ close: () => void }' |
| footer | 自定义底部操作区 | - |

### Expose

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| savePosition | 手动保存当前位置到localStorage | () => void |
| restorePosition | 从localStorage恢复位置 | () => void |
| clearPosition | 清除localStorage中的位置记录 | () => void |