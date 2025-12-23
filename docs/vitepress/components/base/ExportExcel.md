# ExportExcel

## 样式说明

### 默认样式

- **表头**：加粗字体、浅灰色背景（#F3F4F6）、水平居中对齐
- **内容单元格**：正常字体、白色背景、根据列配置的 `align` 属性对齐（默认左对齐）
- **边框**：所有单元格均有浅灰色细线边框（#aaaaaa）
- **自动换行**：单元格内容自动换行

### 自定义样式

组件的样式是固定的，目前不支持通过 props 自定义样式。如果需要定制样式，可以修改组件源码中的样式函数：

- `getBaseStyle`：基础样式，包含对齐方式、边框等
- `getHeaderStyle`：表头样式，继承基础样式并添加字体加粗和背景色
- `getContentStyle`：内容单元格样式，直接使用基础样式
- `getMergeStyle`：合并单元格样式，继承基础样式并添加边框

## 组件示例

导出 Excel/CSV 的通用按钮组件。通过 `columns` 与 `tableData` 组织导出数据，支持自定义列头键名与字段键名优先级（`titles`/
`fields`），并可配置导出类型、自动列宽、空数据导出策略等。

### 基本用法（columns/tableData）

最常见：`columns` 使用 `prop/label`，`tableData` 为数组对象。

:::demo
ExportExcel/base/basic
:::

### 嵌套字段（a.b 访问）

列字段支持点路径（如 `info.age`）。

:::demo
ExportExcel/nested/nested
:::

### 标题与字段键名优先级（titles/fields 默认）

当列项使用 `title/field` 键时，无需额外配置，组件默认会按优先级匹配。

:::demo
ExportExcel/titles/default
:::

### 自定义标题与字段键名（titles/fields 自定义）

当后端返回的列配置键名为其它名称（如 `text/key`），可通过 `:titles` 与 `:fields` 自定义优先级。

:::demo
ExportExcel/titles/custom-keys
:::

### 导出文件名（fileName）

配置导出文件名前缀，实际文件名会追加时间戳。

:::demo
ExportExcel/fileName/fileName
:::

### 按钮文本（buttonText）

当不使用插槽时，可用 `buttonText` 指定按钮文字。

:::demo
ExportExcel/buttonText/buttonText
:::

### 自定义按钮内容（默认插槽）

通过默认插槽自定义按钮内部内容。

:::demo
ExportExcel/slots/default
:::

### 透传按钮属性（$attrs）

支持透传属性至内部 `ElButton`（如 `type`、`size`、`icon`）。

:::demo
ExportExcel/attrs/buttonProps
:::

### 导出类型（exportType）

支持 `xlsx` 与 `csv` 两种类型。

:::demo
ExportExcel/exportType/csv
:::

### 空数据导出策略（allowEmptyExport）

- 当 `true`：允许空数据导出，仅导出表头，并给出提示
- 当 `false`：无数据时按钮禁用

允许空数据导出：
:::demo
ExportExcel/allowEmptyExport/true
:::

禁止空数据导出：
:::demo
ExportExcel/allowEmptyExport/false
:::

### 自定义空数据提示（emptyMessage）

当 `allowEmptyExport=false` 且以编程方式触发导出时，会显示该提示。由于无数据时按钮被禁用，本示例仅展示禁用态与自定义文案设置。

:::demo
ExportExcel/emptyMessage/custom
:::

### 列级导出格式化（columns.formatter）

列配置支持 \`formatter(row, column, rowIndex)\`，仅影响导出值（不影响表格展示）。

:::demo
ExportExcel/formatter/formatter
:::

### 单元格对齐方式（columns.align）

列配置支持 `align` 属性，可设置单元格内容的水平对齐方式：
- `left`：左对齐（默认）
- `center`：居中对齐
- `right`：右对齐

:::demo
ExportExcel/align/align
:::

### 单元格合并（spanMethod）

支持通过 `spanMethod` 配置单元格合并，用法同 Element Plus Table 的 `spanMethod`。

:::demo
ExportExcel/spanMethod/spanMethod
:::

## API


### Props

| 参数               | 说明                                        | 类型              | 默认值                 |
|------------------|-------------------------------------------|-----------------|---------------------|
| tableData        | 表格数据源                                     | `Array<object>` | —                   |
| columns          | 列配置数组，根据`fields`, `titles`匹配`columns`中的字段 | `Array<object>` | —                   |
| titles           | 从 `columns` 中提取列头文本的键名优先级                 | string[]        | `['title','label']` |
| fields           | 从 `columns` 中提取字段键名的优先级                   | string[]        | `['field','prop']`  |
| fileName         | 导出文件名前缀（自动追加时间戳）                          | string          | `导出数据`              |
| buttonText       | 按钮文本（未使用插槽时生效）                            | string          | `导出`                |
| exportType       | 导出类型                                      | `xlsx` \| `csv` | `xlsx`              |
| allowEmptyExport | 是否允许空数据导出                                 | boolean         | true                |
| emptyMessage     | 禁止空导出时的提示文案                               | string          | '暂无数据可导出'           |
| spanMethod       | 单元格合并方法，同 Element Plus Table 的 spanMethod | Function        | —                   |

### Events

该组件不触发事件。

### Slots

| 名称      | 说明      |
|---------|---------|
| default | 自定义按钮内容 |

### Expose

该组件未暴露实例方法。



