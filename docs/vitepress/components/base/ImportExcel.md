# ImportExcel

## 组件示例

Excel/CSV 导入组件。点击按钮选择文件后，组件会将首行表头与传入的 `columns` 做映射，输出结构化数组，并通过 `success` 事件返回。所有示例均使用 `ConfigTable` 或 `DraggableTable` 展示导入结果数据。

### 基础（columns/titles/fields 默认）

最简单用法：`columns` 提供列头与字段，使用默认优先级 `titles=['title','label']` 和 `fields=['field','prop']`。

:::demo
ImportExcel/base/basic
:::

使用 `DraggableTable` 展示结果。

:::demo
ImportExcel/base/draggable
:::

### 按钮内容（默认插槽）

通过默认插槽自定义按钮文案或内容。

:::demo
ImportExcel/slots/default
:::

### 按钮属性（$attrs 透传）

通过 `$attrs` 传给内部 `ElButton`，如 `type`、`size`、`disabled` 等。

:::demo
ImportExcel/attrs/buttonProps
:::

### 表头匹配优先级（titles）

控制列头在 `columns` 中读取哪个键。默认从 `title` 读取，不存在时读 `label`。可通过传入 `titles` 覆盖。

:::demo
ImportExcel/titles/priority
:::

一个字段支持多个表头名（数组），任意一个表头都能匹配到同一字段。

:::demo
ImportExcel/titles/array-headers
:::

### 字段键匹配优先级（fields）

控制字段键在 `columns` 中读取哪个键。默认从 `field` 读取，不存在时读 `prop`。可通过传入 `fields` 覆盖。

:::demo
ImportExcel/fields/priority
:::

当为同一表头配置多个字段键（数组）时，仅第一个键会生效（其余将被忽略）。

:::demo
ImportExcel/fields/array-keys
:::

### 事件（success/error）

导入成功：返回数组数据；导入失败：返回错误。

:::demo
ImportExcel/events/success
:::

监听失败事件。

:::demo
ImportExcel/events/error
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `columns` | 列配置数组。每项可提供表头名键与字段键，用于匹配与映射 | Array | - |
| `titles` | 从 `columns` 每项读取表头名时的键名优先级（按序尝试） | Array | `['title','label']` |
| `fields` | 从 `columns` 每项读取字段键时的键名优先级（按序尝试） | Array | `['field','prop']` |

列配置（`columns` 中每一项）示例：

| 键 | 说明 | 类型 | 示例 |
| --- | --- | --- | --- |
| `title` \| `label` | 表头名（可为字符串或字符串数组） | String\|String[] | `title: '姓名'`，或 `title: ['年龄','岁数']` |
| `field` \| `prop` | 输出对象的字段键（可为字符串或字符串数组） | String\|String[] | `field: 'age'`，或 `prop: 'name'` |

### Events

| 事件名 | 说明 | 回调参数                                    |
| --- | --- |-----------------------------------------|
| `success` | 导入成功，返回解析后的数据数组 | ^[Function]`(tableData: any[]) => void` |
| `error` | 导入失败或读取异常 | ^[Function]`(err: any) => void`         |

### Slots

| 插槽名 | 说明 | 作用域参数 |
| --- | --- | --- |
| `default` | 按钮内容插槽 | - |

### 其他

- 按钮属性通过 `$attrs` 透传至内部 `ElButton`。
- 接受的文件类型：`.xlsx`、`.xls`、`.csv`。


