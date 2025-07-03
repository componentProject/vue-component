# Tabs 标签页组件

## 组件简介
Tabs 组件用于在同一容器内切换不同的内容区域，支持动态添加、关闭、切换等功能。

## 用法
```vue
<Tabs :tabs="tabList" v-model="activeTab" />
```

## Props
| 属性名 | 类型 | 说明 |
| ------ | ---- | ---- |
| tabs | Array | 标签页列表 |
| modelValue | String/Number | 当前激活的标签页 |
| closable | Boolean | 是否可关闭标签 |

## 说明
- 支持自定义标签内容和操作按钮。
- 适合多页面切换、内容分区等场景。 