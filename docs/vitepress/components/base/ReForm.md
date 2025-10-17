# ReForm

## 组件示例

基于Element Plus的动态表单组件，支持自定义表单项、校验规则、提交回调等功能。

### 基本使用

:::demo
ReForm/base/index
:::

示例：form表单禁用（`disabled='true'`）
:::demo
ReForm/base/disabled
:::

### 只读展示（适合详情使用）

通过设置 `readonly` 属性为 `true`，可以将表单转换为只读展示模式。

:::demo
ReForm/readonly/index
:::

### 响应网格布局

支持通过 `layout` 属性设置响应网格布局，可选值为 `grid`（默认）和 `flex`; cols 用于设置网格列数（默认24）、btnSpan 用于设置操作按钮网格列数（默认24), items.span 用于设置formItem网格列数（grid默认24，也就是一行；flex默认是6，一行4个）。

- `grid`：网格布局，适用于复杂表单(新增、编辑）。
- `flex`：弹性布局，适用于简单表单（table搜索）。

示例：form表单禁用（`layout='grid'`）
:::demo
ReForm/layout/index
:::

示例：form表单禁用（`layout='flex'` label字段为空时不展示label）
:::demo
ReForm/layout/flex
:::

### 分组表单项

:::demo
ReForm/base/group
:::

### 字段联动/隐藏

设置 `visible` 属性后，可根据条件动态显示或隐藏表单项。

:::demo
ReForm/base/relation
:::

### 自定义slots

示例：自定义labelSlot: "name-label"
:::demo
ReForm/slots/index
:::

示例：自定义 labelSlot: "name-label"
:::demo
ReForm/slots/control
:::



### 事件处理

支持多种事件回调：`change`、`update:modelValue`、`submit`、`cancel`。

:::demo
ReForm/events/index
:::



### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| formRef | ref函数，获取 ElForm 实例 | (form: InstanceType\<typeof ElForm\> \| null) => void | - |
| items | 必填，表单配置项集合 | `Array<ReFormItem>` | [] |
| modelValue | 表单数据 | ReFormModelValue | - |
| layout | 表单布局 | "grid" ｜ "flex" | "grid" |
| cols | 表单网格布局列数 | number | 24 |
| labelWidth | 表单标签宽度 | string | - |
| labelPosition | 表单标签位置 | "left" ｜ "right" ｜ "top" | "right" |
| size | 表单尺寸 | "large" ｜ "default" ｜ "small" | "default" |
| disabled | 表单是否禁用 | boolean | false |
| editable | 表单是否可编辑 | boolean | true |
| scrollToError | 校验失败是否自动定位第一个校验失败字段 | boolean | true |
| autoCollapseInValidate | 校验失败是否自动展开分组，并定位分组内的第一个校验失败字段 | boolean | true |
| ignoreBtnLabel | 是否忽略表单按钮组标签宽度 | boolean | true |
| btnSpan | 表单按钮组网格大小 | number | 1 |
| btnSpanStyle | 表单按钮组内联样式 | string | - |
| submitBtnText | 提交按钮文字内容 | string | "确定" |
| cancelBtnText | 取消按钮文字内容 | string | "取消" |
| 'submitBtnProps' | 提交按钮自定义属性 | `Partial<ButtonProps>` | - |
| cancelBtnProps | 取消按钮自定义属性 | `Partial<ButtonProps>` | - |
| tooltipProps | 表单默认提示语自定义样式 | `Partial<TooltipProps>` | - |
| hideBtns | 隐藏表单按钮组 | boolean | false |
| emptyText | 只读情况下空内容展示占位符 | string | "-" |
| itemWidth | 全局表单项宽度（在flex布局下生效） | "number" ｜ "string" | - |
| colGap | 全局表单项间距 | number | 16 |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change	| 表单控件字段值发生变化时触发	| `(field: string, value: any, model: MaybeRef<ReFormModelValue>) => void` |
| update:modelValue	| 表单数据更新后触发	| `(model: MaybeRef<ReFormModelValue>) => void` |
| submit	| 点击提交按钮触发，只有未自定义 btns 插槽时有效	| `(formData: ReFormModelValue) => void` |
| cancel	| 点击取消按钮触发，只有未自定义 btns 插槽时有效	| `() => void` |

### Slots

| 插槽名 | 说明 | 参数 |
| --- | --- | --- |
| btns	| 自定义表单按钮组，提交和取消需要自定义 | - |
| [field]-label	| 每个表单配置项都自带一个标签插槽，默认按 [field]-label 格式提供，可通过 labelSlot 自定义插槽名 | - |
| [field]-control	| 每个表单配置项都自带一个控件插槽，默认按 [field]-control 格式提供，可通过 slot 自定义插槽名 | - |
<!-- | [field]-group	| 表单分组配置项自带一个分组触发器插槽，默认按 [field]-group 格式提供，可通过 groupSlot 自定义插槽名 | - | -->

### Expose

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| submiting	| 表单提交状态	| boolean |
| reFormRef	| ElForm组件示例	| `InstanceType<typeof ElForm>` |
| formData	| 表单数据对象	| `ShallowRef<Record<string, any>>` |
| formRules	| 表单校验规则集合	| `ShallowRef<Partial<ReFormRules>>` |
| formItems	| 表单配置对象集合	| `ShallowRef<ReFormItem[]>` |
| formVisible	| 表单字段显示状态集合	| `Ref<Record<string, boolean>>` |
| formCollapsed	| 表单分组项展开/折叠状态集合	| `Ref<Record<string, boolean>>` |
| validate	| 同ElForm，校验整个表单	| `(callback: FormValidateCallback) => void` |
| clearValidate	| 同ElForm，清除表单校验状态	| `() => void` |
| resetFields	| 同ElForm，重置表单字段和校验状态	| `(props?: Arrayable\<string\> ｜ undefined) => void` |
| handleSwitchCollapsed	| 切换分组展开/折叠状态	| `(field: string) => void` |
| autoCollapseByErrors	| 如果表单带有分组配置项，可基于校验失败项自动展开分组并定位到第一个错误项	| `(errors?: Record\<string, any\>) => void` |
