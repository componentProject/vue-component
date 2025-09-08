# ImportExcel 导入组件

基于 element-plus 与 xlsx 的 Excel/CSV 导入按钮。点击按钮选择本地文件并解析为对象数组。

## 基础示例

```vue
<template>
  <ImportExcel :columns="columns" @success="onSuccess" />
</template>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 列配置数组 | `Array<{ label?: string|string[]; title?: string|string[]; prop?: string|string[]; field?: string|string[] }>` | 必填 |
| titles | 列头读取键优先级 | `string[]` | `['title','label']` |
| fields | 字段键读取优先级 | `string[]` | `['field','prop']` |
| tableData | 与导出组件接口保持一致（不直接使用） | any[] | `[]` |

## Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| success | 解析成功 | `(rows: any[]) => void` |
| error | 解析失败 | `(err: any) => void` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 自定义按钮内容 |

## 说明与规则

- 表头→字段映射：当 header 与 key 等长按索引对应；header 多值映射同一 key；key 多值时取第一个
- 仅保留数组写法；通过 `titles/fields` 控制优先级

## Expose

无。

## 支持的文件类型

`.xlsx`、`.xls`、`.csv`

