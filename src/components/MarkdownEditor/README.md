# MarkdownEditor Markdown编辑器组件

## 组件简介
MarkdownEditor 是一个支持实时预览、语法高亮、扩展插件的 Markdown 编辑器组件。

## 用法
```vue
<MarkdownEditor v-model="content" />
```

## Props
| 属性名 | 类型 | 说明 |
| ------ | ---- | ---- |
| modelValue | String | Markdown 内容，支持 v-model |
| height | String/Number | 编辑器高度 |
| preview | Boolean | 是否显示实时预览 |

## 说明
- 支持自定义工具栏、主题和扩展。
- 适合博客、文档、评论等场景。 