# TsExpandable 折叠组件

一个支持默认展示指定行数，点击展开后展示全部内容的折叠组件。

## 功能特性

- 支持设置默认展示的行数
- 点击展开/收起按钮切换显示状态
- 自动检测内容高度，仅在内容超过指定行数时显示展开按钮
- 支持自定义展开/收起按钮文本
- 支持自定义行高
- 支持自定义展开按钮样式（插槽）
- 支持事件监听（展开/收起状态变化）
- 完整的 TypeScript 类型支持

## 基础用法

```vue
<template>
  <TsExpandable :rows="3">
    <div>
      <p>这是第一行内容。</p>
      <p>这是第二行内容。</p>
      <p>这是第三行内容。</p>
      <p>这是第四行内容，超过3行会显示展开按钮。</p>
      <p>这是第五行内容。</p>
    </div>
  </TsExpandable>
</template>

<script setup>
import { TsExpandable } from '@moluoxixi/components'
</script>
```

## 自定义行数

```vue
<template>
  <TsExpandable :rows="2">
    <div>
      <p>这是第一行内容。</p>
      <p>这是第二行内容。</p>
      <p>这是第三行内容，超过2行会显示展开按钮。</p>
    </div>
  </TsExpandable>
</template>
```

## 自定义按钮文本

```vue
<template>
  <TsExpandable
    :rows="3"
    expand-text="查看更多"
    collapse-text="收起"
  >
    <div>
      <p>内容...</p>
    </div>
  </TsExpandable>
</template>
```

## 默认展开

```vue
<template>
  <TsExpandable
    :rows="3"
    :default-expanded="true"
  >
    <div>
      <p>内容...</p>
    </div>
  </TsExpandable>
</template>
```

## 自定义行高

```vue
<template>
  <TsExpandable
    :rows="3"
    :line-height="32"
  >
    <div>
      <p style="line-height: 32px;">
        内容...
      </p>
    </div>
  </TsExpandable>
</template>
```

## 非文本内容（重要说明）

**组件要求内容区域的每一行高度必须是固定的**（由 `lineHeight` 参数指定）。

如果传入的内容不是文本，请确保：

- 每个子元素的高度与 `lineHeight` 保持一致
- 或者每个子元素的高度是 `lineHeight` 的整数倍

```vue
<template>
  <!-- 示例1：列表项，每个项高度为 24px（与 lineHeight 一致） -->
  <TsExpandable :rows="3" :line-height="24">
    <ul>
      <li
        v-for="i in 10"
        :key="i"
        style="height: 24px; line-height: 24px;"
      >
        列表项 {{ i }}
      </li>
    </ul>
  </TsExpandable>

  <!-- 示例2：卡片列表，每个卡片高度为 48px（lineHeight 的 2 倍） -->
  <TsExpandable :rows="2" :line-height="24">
    <div>
      <div
        v-for="i in 5"
        :key="i"
        style="height: 48px; margin-bottom: 0;"
      >
        卡片 {{ i }}
      </div>
    </div>
  </TsExpandable>
</template>
```

## 按钮位置

```vue
<template>
  <!-- 按钮在右边（默认） -->
  <TsExpandable :rows="3" toggle-position="right">
    <div>
      <p>内容...</p>
    </div>
  </TsExpandable>

  <!-- 按钮在左边 -->
  <TsExpandable :rows="3" toggle-position="left">
    <div>
      <p>内容...</p>
    </div>
  </TsExpandable>
</template>
```

## 自定义展开按钮

```vue
<template>
  <TsExpandable :rows="3">
    <div>
      <p>内容...</p>
    </div>
    <template #toggle="{ expanded, toggle }">
      <el-button
        type="primary"
        size="small"
        @click="toggle"
      >
        {{ expanded ? '收起' : '展开' }}
      </el-button>
    </template>
  </TsExpandable>
</template>
```

## 事件监听

```vue
<template>
  <TsExpandable
    :rows="3"
    @change="handleChange"
    @expand="handleExpand"
    @collapse="handleCollapse"
  >
    <div>
      <p>内容...</p>
    </div>
  </TsExpandable>
</template>

<script setup>
import { TsExpandable } from '@moluoxixi/components'

function handleChange(expanded) {
  console.log('状态改变:', expanded)
}

function handleExpand() {
  console.log('已展开')
}

function handleCollapse() {
  console.log('已收起')
}
</script>
```

## API

### Props

| 参数            | 说明                                                                                                                       | 类型                  | 默认值    |
| --------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------- | --------- |
| rows            | 默认展示的行数                                                                                                             | `number`              | `3`       |
| defaultExpanded | 是否默认展开                                                                                                               | `boolean`             | `false`   |
| expandText      | 展开按钮的文本                                                                                                             | `string`              | `'展开'`  |
| collapseText    | 收起按钮的文本                                                                                                             | `string`              | `'收起'`  |
| lineHeight      | 行高（px），用于计算高度。**重要：内容区域的每一行高度必须是固定的，每个子元素的高度应与 lineHeight 保持一致或是其整数倍** | `number`              | `24`      |
| showToggle      | 是否显示展开/收起按钮                                                                                                      | `boolean`             | `true`    |
| togglePosition  | 展开/收起按钮的位置                                                                                                        | `'left' \| 'right'`   | `'right'` |
| class           | 自定义样式类名                                                                                                             | `string`              | `''`      |
| style           | 自定义样式                                                                                                                 | `Record<string, any>` | `{}`      |

### Events

| 事件名   | 说明                    | 回调参数              |
| -------- | ----------------------- | --------------------- |
| change   | 展开/收起状态改变时触发 | `(expanded: boolean)` |
| expand   | 展开时触发              | -                     |
| collapse | 收起时触发              | -                     |

### 插槽

| 插槽名  | 说明                             | 作用域参数                                  |
| ------- | -------------------------------- | ------------------------------------------- |
| default | 默认插槽，用于放置需要折叠的内容 | -                                           |
| toggle  | 自定义展开/收起按钮插槽          | `{ expanded: boolean, toggle: () => void }` |

## 注意事项

1. **重要：组件要求内容区域的每一行高度必须是固定的**（由 `lineHeight` 参数指定）
   - 如果传入的内容不是文本，请确保每个子元素的高度与 `lineHeight` 保持一致
   - 或者每个子元素的高度是 `lineHeight` 的整数倍（例如：lineHeight=24px，子元素可以是 24px、48px、72px 等）
   - 如果子元素高度不一致，可能会导致计算不准确

2. 组件会自动检测内容高度，仅在内容超过指定行数时显示展开按钮

3. 组件使用 CSS 的 `max-height` 和 `overflow: hidden` 实现折叠效果

4. 展开/收起动画使用 CSS 过渡效果，时长为 0.3s

5. 组件会自动监听内容变化，动态更新是否需要显示展开按钮

6. 内容区域的 `line-height` 会被自动设置为与 `lineHeight` 一致，确保每行高度固定
