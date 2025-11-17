# DesignForm

可视化表单设计器组件，用于快速构建和配置复杂表单，支持拖拽排序和实时预览。

## 组件示例

### 基础用法

示例：创建一个空的表单设计器
:::demo
DesignForm/basic/index
:::

### 加载已有表单配置

示例：通过initialFormConfig属性加载已有的表单设计
:::demo
DesignForm/loadConfig/index
:::

### 保存表单配置

示例：通过ref获取保存设计结果
:::demo
DesignForm/saveConfig/index
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `initialFormConfig` | 初始表单配置对象 | ^[Object]`FormConfig \| null` | `null` |


### Expose

| 方法名 | 说明 | 参数 | 返回值 |
|--------|------|------|--------|
| `getFinalFormConfig` | 获取最终的表单配置 | - | ^[String]`string \| null` |


## 支持组件列表

| 组件类型 | 中文名称 | 描述 |
|----------|----------|------|
| `elInput` | 输入框 | 单行文本输入 |
| `eltextarea` | 多行输入框 | 多行文本输入 |
| `elinputnumber` | 数字输入框 | 数值类型输入 |
| `tsselect` | 下拉框 | 选项选择器 |
| `tscheckbox` | 多选框 | 多选组件 |
| `tsradio` | 单选框 | 单选组件 |

## 使用注意事项

1. 表单项的`field`属性必须唯一，避免数据冲突
2. 使用自定义组件前需要确保组件已全局注册
3. 对于复杂数据结构，注意序列化和反序列化的兼容性处理
4. 表单设计器需要适当的布局空间以展示三个面板