# DateRangePicker

## 组件示例

日期范围选择器组件，支持选择日期/日期范围，统一格式化与默认值处理，提供快捷选项与禁用规则。

### 类型（type）

date：单日期；change 返回单个字符串，v-model 始终为字符串数组

:::demo
DateRangePicker/type/type-date
:::

datetime：单日期时间；同date

:::demo
DateRangePicker/type/type-datetime
:::

daterange：日期范围；change 返回字符串数组，v-model 始终为字符串数组

:::demo
DateRangePicker/type/type-daterange
:::

datetimerange：日期时间范围；同daterange

:::demo
DateRangePicker/type/type-datetimerange
:::

### 显示格式（format）

影响输入框显示格式，不影响绑定值格式：

- 不传 `format`：`type` 为 datetime/datetimerange 时显示 `YYYY-MM-DD HH:mm:ss`，否则 `YYYY-MM-DD`
- 传入 `format`：按传入格式展示

示例：显示为 `YYYY/MM/DD`

:::demo
DateRangePicker/format/format
:::

### 绑定值格式（valueFormat）

控制 v-model 返回的字符串格式（对显示无影响）。

示例：v-model 返回 `YYYY-MM-DD`

:::demo
DateRangePicker/valueFormat/valueFormat
:::

### 占位符（placeholder）

仅单值类型使用（`date`、`datetime`）。

示例：单日期占位符

:::demo
DateRangePicker/placeholder/placeholder
:::

### 范围占位与分隔符（startPlaceholder/endPlaceholder/rangeSeparator）

仅范围类型使用（`daterange`、`datetimerange`）。

示例：开始/结束占位与分隔符“至”

:::demo
DateRangePicker/rangePlaceholder/rangePlaceholder
:::

### 输出格式（outputFormat）

控制内部格式化的起止时间格式（与输入框显示无关）。

- 当 `type` 为 `date/daterange` 未指定 `outputFormat` 时，默认补齐为 `['YYYY-MM-DD 00:00:00','YYYY-MM-DD 23:59:59']`
- 当 `type` 为 `datetime/datetimerange` 未指定 `outputFormat` 时，默认 `['YYYY-MM-DD HH:mm:ss','YYYY-MM-DD HH:mm:ss']`
- 若需要始终返回带时分秒的字符串（例如“当前时间的格式”），请传入 `outputFormat="YYYY-MM-DD HH:mm:ss"`

示例：通过 `outputFormat` 返回带时分秒

:::demo
DateRangePicker/outputFormat/outputFormat
:::

### 默认今天（defaultToday）

在初始值为空时，自动返回今天的范围。

示例：空值时默认返回今天

:::demo
DateRangePicker/defaultToday/defaultToday
:::

### 日期范围（dateRange, dateRangeType, dateRangeBaseDate）

- 数字正数：今天到未来 n 单位
- 数字负数：过去 n 单位到今天
- 数组 [n,m]：过去 n 单位到未来 m 单位
- `dateRangeType`：偏移单位，默认 day（亦可 week/month/year 等）
- `dateRangeBaseDate`：偏移的基准日期，默认当前日期

示例：`dateRange=7`
:::demo
DateRangePicker/dateRange/number-positive
:::

示例：`dateRange=-7`
:::demo
DateRangePicker/dateRange/number-negative
:::

示例：`dateRange=[-7,7]`
:::demo
DateRangePicker/dateRange/array
:::

示例：`dateRange=-1` 且 `dateRangeType=week`
:::demo
DateRangePicker/dateRange/dateRangeType
:::

示例：`dateRange=-7` 且 `dateRangeBaseDate=昨天`
:::demo
DateRangePicker/dateRange/dateRangeBaseDate
:::

### 禁用（minDate/maxDate/disabledDateRange）

支持设置最小/最大可选日期，或以区间形式传入 `[minDate, maxDate]`。这也会影响 `datetimeDisableTypes` 的边界计算。

示例：`minDate=今天`
:::demo
DateRangePicker/disable/minDate
:::

示例：`maxDate=今天`
:::demo
DateRangePicker/disable/maxDate
:::

示例：`disabledDateRange=[今天, 未来7天]`
:::demo
DateRangePicker/disable/disabledDateRange
:::

### 时间粒度禁用（datetimeDisableTypes）

仅对 `datetime` / `datetimerange` 生效。与 `minDate`/`maxDate` 或 `disabledDateRange` 配合使用时：

- 当选择起始面板时，依据最小边界禁用更小的小时/分钟/秒
- 当选择结束面板时，依据最大边界禁用更大的小时/分钟/秒
- 当仅有单侧边界时，则仅对相应一侧生效

示例：禁用 10:00:00 之前与 18:00:00 之后的小时
:::demo
DateRangePicker/datetimeDisableTypes/hours
:::

示例：禁用 10:30 之前与 10:45 之后的分钟
:::demo
DateRangePicker/datetimeDisableTypes/minutes
:::

示例：禁用 10:30:10 之前与 10:30:50 之后的秒
:::demo
DateRangePicker/datetimeDisableTypes/seconds
:::

### 快捷项（shortcuts）

- 传入 `true`：启用内置“今天/三天/一周/一个月”
- 传入数组：自定义快捷项，形如 `{ text, value: () => [start, end] }`

示例：内置快捷项
:::demo
DateRangePicker/shortcuts/shortcuts
:::

示例：自定义快捷项
:::demo
DateRangePicker/shortcuts/custom
:::

### 事件（change）

用户确认选择时触发：单值类型返回字符串；范围类型返回字符串数组。

示例：展示 change 返回值
:::demo
DateRangePicker/events/change
:::

### 暴露方法（focus/blur）

通过 ref 获取组件实例，可调用 `focus`/`blur`。

示例：调用组件暴露方法
:::demo
DateRangePicker/expose/focus
:::

## API

### Props

| 参数                   | 说明                                                                                                                                | 类型                                             | 默认值                           |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------|-------------------------------|
| modelValue           | 绑定值                                                                                                                               | Array                                          | []                            |
| type                 | 日期选择类型                                                                                                                            | String                                         | 'date'                        |
| format               | 显示在输入框中的格式                                                                                                                        | String                                         | null                          |
| valueFormat          | 绑定值的格式（对显示无效）                                                                                                                     | String                                         | 'YYYY-MM-DD HH:mm:ss'         |
| outputFormat         | 控制内部格式化的起止时间格式                                                                                                                    | String \| String[]                             | 根据 type 自动推断                  |
| placeholder          | 非范围选择时的占位内容                                                                                                                       | String                                         | '请选择日期'                       |
| startPlaceholder     | 范围选择时开始日期的占位内容                                                                                                                    | String                                         | '开始日期'                        |
| endPlaceholder       | 范围选择时结束日期的占位内容                                                                                                                    | String                                         | '结束日期'                        |
| rangeSeparator       | 范围分隔符                                                                                                                             | String                                         | '至'                           |
| defaultToday         | 当无选定值时是否默认返回今天的日期范围                                                                                                               | Boolean                                        | true                          |
| dateRange            | 日期范围配置，数字或 [n,m]                                                                                                                  | Number \| Number[] \| null                     | null                          |
| dateRangeType        | 日期范围类型                                                                                                                            | ^[String]`Moment.unitOfTime.DurationConstructor` | 'day'                         |
| dateRangeBaseDate    | 日期范围的基准日期，日期字符串或moment对象                                                                                                          | String \| Object                               | 当前日期                          |
| minDate              | 最小可选日期                                                                                                                            | String \| Object                               | null                          |
| maxDate              | 最大可选日期                                                                                                                            | String \| Object                               | null                          |
| disabledDateRange    | 禁用日期范围配置。支持三种形式：<br/>1) `[minDate, maxDate]`：限制在区间内；<br/>2) `minDate`：仅最小值；<br/>3) `maxDate`：仅最大值。优先级高于 `minDate`/`maxDate` 单独配置。 | Array                                          | null                          |
| datetimeDisableTypes | datetime 的时分秒禁用规则                                                                                                                 | ^[Array]`hours \| minutes \| seconds`                                     | ['hours','minutes','seconds'] |
| shortcuts            | 是否显示快速选择，或自定义快捷项                                                                                                                  | Boolean \| Array                               | false                         |

### Events

| 事件名               | 说明          | 回调参数                                             |
|-------------------|-------------|--------------------------------------------------|
| update:modelValue | 绑定值更新       | ^[Function]`(value: string[] \| string) => void` |
| change            | 用户确认选定的值时触发 | ^[Function]`(value: string[]\| string) => void`  |

### Slots

该组件不提供插槽。

### Expose

| 名称    | 说明           | 类型                      |
|-------|--------------|-------------------------|
| focus | 使 input 获取焦点 | ^[Function]`() => void` |
| blur  | 使 input 失去焦点 | ^[Function]`() => void` |

