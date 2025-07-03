# Select 选择器组件

## 组件简介
Select 组件用于从下拉列表中选择一个或多个选项，支持搜索、分组、多选等功能。

## 用法
```vue
<Select v-model="value" :options="options" />
```

## Props
| 属性名 | 类型 | 说明 |
| ------ | ---- | ---- |
| modelValue | String/Number/Array | 绑定值，支持单选和多选 |
| options | Array | 选项列表 |
| multiple | Boolean | 是否多选 |
| filterable | Boolean | 是否可搜索 |

## 说明
- 支持自定义选项渲染。
- 适合表单、筛选等场景。 