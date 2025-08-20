# ConfigForm

## 组件示例

配置化表单组件，通过配置项快速生成表单，支持多种内置组件类型、自定义渲染、插槽、验证规则等功能。

### 基础用法

最简单的配置化表单示例。

:::demo
ConfigForm/base/basic
:::

### 综合示例

展示 ConfigForm 完整功能的综合示例，包含多种组件类型、验证规则、布局配置等。

:::demo
ConfigForm/base/comprehensive
:::

### 表单选项配置（formOptions）

#### 标签宽度（labelWidth）

设置表单标签的宽度。

:::demo
ConfigForm/formOptions/labelWidth
:::

#### 标签位置（labelPosition）

设置表单标签的位置，支持 `left`、`right`、`top`。

:::demo
ConfigForm/formOptions/labelPosition
:::

#### 表单尺寸（size）

设置表单组件的尺寸，支持 `large`、`default`、`small`。

:::demo
ConfigForm/formOptions/size
:::

#### 禁用状态（disabled）

设置整个表单为禁用状态。

:::demo
ConfigForm/formOptions/disabled
:::

### 表单验证（validation）

#### 必填验证（required）

通过 `formOptions.required` 为所有字段自动添加必填验证。

:::demo
ConfigForm/validation/required
:::

#### 自定义验证规则（rules）

通过 `formOptions.rules` 设置自定义验证规则。

:::demo
ConfigForm/validation/customRules
:::

### 组件类型（components）

#### 输入框（input）

支持普通输入框、多行文本、密码输入等类型。

:::demo
ConfigForm/components/input
:::

#### 选择器（select）

支持单选、多选等选择器配置。

:::demo
ConfigForm/components/select
:::

#### 单选组（radioGroup）

单选按钮组配置。

:::demo
ConfigForm/components/radioGroup
:::

#### 复选组（checkboxGroup）

复选框组配置。

:::demo
ConfigForm/components/checkboxGroup
:::

#### 日期选择器（datePicker）

日期和时间选择器配置。

:::demo
ConfigForm/components/datePicker
:::

#### 开关（switch）

开关组件配置。

:::demo
ConfigForm/components/switch
:::

#### 滑块（slider）

滑块组件配置，支持单值和范围选择。

:::demo
ConfigForm/components/slider
:::

#### 评分（rate）

评分组件配置。

:::demo
ConfigForm/components/rate
:::

### 行配置（rows）

#### 多行布局（multipleRows）

配置多行表单布局。

:::demo
ConfigForm/rows/multipleRows
:::

#### 条件显示（hiddenRow）

通过 `hidden` 属性控制行的显示和隐藏。

:::demo
ConfigForm/rows/hiddenRow
:::

#### 自定义渲染（customRender）

通过 `render` 函数自定义行内容。

:::demo
ConfigForm/rows/customRender
:::

### 布局配置（layout）

#### 列配置（colConfig）

通过 `colConfig` 设置每个字段的列宽。

:::demo
ConfigForm/layout/colConfig
:::

#### 间距配置（gutter）

通过 `gutter` 设置行内元素的间距。

:::demo
ConfigForm/layout/gutter
:::

### 事件（events）

#### 更新事件（update:rows）

监听 `rows` 数据的更新事件。

:::demo
ConfigForm/events/updateRows
:::

### 暴露方法（expose）

#### 表单验证（validate）

通过 `validate` 方法验证表单。

:::demo
ConfigForm/expose/validate
:::

#### 设置组件配置（setConfigByProp）

通过 `setConfigByProp` 动态设置组件配置。

:::demo
ConfigForm/expose/setConfigByProp
:::

#### 设置列配置（setColConfigByProp）

通过 `setColConfigByProp` 动态设置列布局配置。

:::demo
ConfigForm/expose/setColConfigByProp
:::

#### 获取引用（getRef）

通过 `getRef` 获取组件内部引用。

:::demo
ConfigForm/expose/getRef
:::

### 插槽（slots）

#### 自定义插槽（renderSlot）

通过 `renderSlot` 使用自定义插槽渲染字段。

:::demo
ConfigForm/slots/renderSlot
:::

#### 默认插槽（defaultSlot）

使用默认插槽完全自定义表单内容。

:::demo
ConfigForm/slots/defaultSlot
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| formOptions | `el-form` 的配置项，包含 `model`、`rules`、`labelWidth` 等 | `formOptionsConfig` | `{}` |
| rows | 行配置数组，每行包含多个表单项配置 | `rowConfig[]` | `[]` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:rows | 当 `rows` 数据更新时触发 | ^[Function]`(rows: rowConfig[]) => void` |

### Slots

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| default | 自定义表单内容，会替换所有配置的表单项 | - |
| [slotName] | 自定义字段插槽，通过 `renderSlot` 指定 | `{ model: FormModelProps, formItem: FormItemConfig, cellValue: any }` |

### Expose

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| setConfigByProp | 根据 `prop` 设置组件配置 | ^[Function]`(prop: string, value: any, key?: string \| boolean) => void` |
| setColConfigByProp | 根据 `prop` 设置列配置 | ^[Function]`(prop: string, value: any, key?: keyof ColProps) => void` |
| setFormItemByProp | 根据 `prop` 设置表单项配置 | ^[Function]`(prop: string, value: any, key?: string) => void` |
| validate | 验证表单 | ^[Function]`(callback?: Function) => Promise<boolean>` |
| getRef | 获取组件内部引用 | ^[Function]`(key: string) => any` |

## 类型定义

### formOptionsConfig

```typescript
interface formOptionsConfig extends FormProps {
  rules?: FormRuleProps
  model?: FormModelProps
  required?: boolean // 是否为所有字段自动添加必填验证
  [key: string]: any
}
```

### rowConfig

```typescript
interface rowConfig extends RowProps {
  hidden?: boolean | ((params?: any) => boolean) // 是否隐藏该行
  render?: (scope?: Record<string, unknown>) => VNode | any // 自定义渲染函数
  formItems?: FormItemConfig[] // 表单项配置数组
  [key: string]: any
}
```

### FormItemConfig

```typescript
interface FormItemConfig extends FormItemProps {
  type?: string // 内置组件类型，如 'input'、'select' 等
  colConfig?: ColProps // 列配置，用于 el-col
  renderSlot?: string // 自定义插槽名称
  tooltipConfig?: ElTooltipProps // tooltip 配置
  popoverConfig?: PopoverProps // popover 配置
  popconfirmConfig?: PopconfirmProps // popconfirm 配置
  render?: (scope?: Record<string, unknown>) => VNode | any // 自定义渲染函数
  slots?: Record<string, (scope: Record<string, unknown>) => VNode> // 组件插槽配置
  message?: string // 验证失败消息
  config?: configType // 组件配置
  prop?: string // 字段属性名
  [key: string]: any
}
```

### configType

```typescript
interface configType {
  show?: false // 是否显示
  event?: { [key: string]: any } // 事件配置
  buttonType?: string // 按钮类型
  text?: string // 文本内容
  slots?: { [key: string]: any } // 插槽配置
  options?: any[] // 选项数据（用于 select、radio-group 等）
  [key: string]: any
}
```

## 内置组件类型

ConfigForm 支持以下内置组件类型：

### 输入类组件
- `input` - 输入框
- `input-number` - 数字输入框
- `autocomplete` - 自动完成输入框

### 选择类组件
- `select` - 选择器
- `cascader` - 级联选择器
- `cascader-panel` - 级联面板

### 单选/多选组件
- `radio` - 单选框
- `radio-group` - 单选组
- `checkbox` - 复选框
- `checkbox-group` - 复选组

### 日期时间组件
- `date-picker` - 日期选择器
- `time-picker` - 时间选择器
- `time-select` - 时间选择

### 其他组件
- `switch` - 开关
- `slider` - 滑块
- `rate` - 评分
- `color-picker` - 颜色选择器
- `transfer` - 穿梭框
- `upload` - 文件上传
- `tree` - 树形控件

每个组件类型都有对应的 `config` 配置项，具体配置请参考 Element Plus 相应组件的 API 文档。
