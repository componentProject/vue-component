# DragModalDialog 可拖拽缩放弹窗

支持拖拽、缩放、遮罩穿透、位置记忆与插槽自定义。

## 基础示例

```vue
<template>
  <DragModalDialog v-model:visible="visible" title="示例弹窗" :draggable="true" :resizable="true">
    <div>这里是弹窗内容</div>
  </DragModalDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visible | 控制显示/隐藏 | boolean | false |
| title | 标题 | string | '提示' |
| content | 文本内容（可用 slot 覆盖） | string | '' |
| width | 宽度 | string \| number | - |
| height | 高度 | string \| number | - |
| size | 预设尺寸 | 'small' \| 'medium' \| 'large' | 'medium' |
| top | 顶部距离 | string \| number | - |
| left | 左侧距离 | string \| number | - |
| draggable | 是否可拖拽 | boolean | false |
| resizable | 是否可缩放 | boolean | false |
| showClose | 是否显示关闭按钮 | boolean | true |
| showFooter | 是否显示底部操作区 | boolean | true |
| showCancel | 是否显示取消按钮 | boolean | true |
| showConfirm | 是否显示确认按钮 | boolean | true |
| cancelText | 取消文案 | string | '取消' |
| confirmText | 确认文案 | string | '确定' |
| confirmDisabled | 确认按钮禁用 | boolean | false |
| mask | 是否显示遮罩 | boolean | true |
| maskClosable | 点击遮罩关闭 | boolean | true |
| zIndex | 层级 | number | 1000 |
| minWidth | 最小宽度(px) | number | 300 |
| minHeight | 最小高度(px) | number | 200 |
| maxWidth | 最大宽度(px) | number | - |
| maxHeight | 最大高度(px) | number | - |
| margin | 边距保护(px) | number | 16 |
| rememberPosition | 位置记忆 | boolean | false |
| positionKey | 位置记忆 Key | string | '' |
| penetrate | 遮罩穿透 | boolean | false |
| teleportTo | Teleport 目标 | string | body |
| destroyOnClose | 关闭销毁内容 | boolean | false |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:visible` | 绑定值更新 | `(visible: boolean) => void` |
| `close` | 点击关闭 | `() => void` |
| `cancel` | 点击取消 | `() => void` |
| `confirm` | 点击确认 | `() => void` |
| `open` | 打开时 | `() => void` |
| `opened` | 打开动画完成 | `() => void` |
| `closed` | 关闭动画完成 | `() => void` |
| `update:top` | 顶部位置更新 | `(top: string | number) => void` |
| `update:left` | 左侧位置更新 | `(left: string | number) => void` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 内容区 |
| `header` | 自定义头部 |
| `header-left` | 头部左侧 |
| `header-right` | 头部右侧 |
| `footer` | 底部操作区 |

### Expose

| 名称 | 说明 |
| --- | --- |
| `savePosition` | 保存当前位置到 localStorage |
| `restorePosition` | 从 localStorage 恢复位置 |
| `clearPosition` | 清除位置记录 |
