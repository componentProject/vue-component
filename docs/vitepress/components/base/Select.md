# Select

包装自 Element Plus 的下拉选择器，增强筛选、禁用规则、远程选项与多选标签显示能力。

## 组件示例

### 可清空（clearable）

示例：开启清空按钮
::::demo
Select/props/clearable
::::

### 可筛选（filterable）

示例：开启本地筛选，自动匹配 `label/value/pyCode/wbCode`
::::demo
Select/props/filterable
::::

### 多选折叠（collapseTags/collapseTagsTooltip）

示例：多选并折叠为 Tag，悬浮显示全部
::::demo
Select/props/collapseTags
::::

### Tag 类型（tagType）

示例：将多选 Tag 样式设为 `success`
::::demo
Select/props/tagType
::::

### Teleport（teleported）

示例：不将下拉弹层 Teleport 到 body
::::demo
Select/props/teleported
::::

### 禁用项（disabledValues/disabledLabels）

示例：通过值或标签禁用特定选项
::::demo
Select/props/disabled
::::

### 自定义禁用回调（disabledHandler）

示例：自定义规则禁用（演示：禁用以 w 开头）
::::demo
Select/props/disabledHandler
::::

### 下拉加载更多（enableLoadMore、hasMore、loading）

示例：enableLoadMore开启加载更多，hasMore是否还有待加载数据， loading加载中
::::demo
Select/props/loadMore
::::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `tagType` | Tag 类型 | `'success'` \| `'info'` \| `'warning'` \| `'danger'` | `'primary'` |
| `teleported` | 是否 Teleport 到 body | Boolean | `true` |
| `clearable` | 是否可清空 | Boolean | `true` |
| `filterable` | 是否可筛选 | Boolean | `true` |
| `filterMethod` | 自定义筛选方法 | ^[Function]`(keyword: string) => void` | - |
| `collapseTagsTooltip` | 折叠时是否显示 Tooltip | Boolean | `true` |
| `collapseTags` | 多选时是否折叠 Tag | Boolean | `true` |
| `label` | 选项显示字段名 | String | `'label'` |
| `value` | 选项值字段名 | String | `'value'` |
| `disabledValues` | 禁用的值列表 | Array | `[]` |
| `disabledLabels` | 禁用的标签列表 | Array | `[]` |
| `disabledHandler` | 自定义禁用回调 | ^[Function]`({ label: string, value: any, data?: any }) => boolean` | - |
| `options` | 本地选项数据 | Array | `[]` |
| `filterFields` | 参与本地筛选的字段名集合 | Array | `[]` |
| `serverProps` | 远程数据配置 | ^[Object]`objType` | - |
| `enableLoadMore` | 开启加载更多 | Boolean | `false` |
| `hasMore` | 是否还有更多数据 | Boolean | `false` |
| `loading` | 加载中状态 | Boolean | `false` |

### v-model

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| `modelValue` | 选中值 | any |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `change` | 选项变化 | ^[Function]`(value: any) => void` |

### Slots

该组件无自定义插槽。

### Expose

该组件未暴露额外方法。
