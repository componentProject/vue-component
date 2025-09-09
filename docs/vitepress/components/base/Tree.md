# Tree

## 组件示例

树形组件，内部使用TreeV2，支持扁平/嵌套数据、行内操作按钮、自定义图标、级联高亮、连线样式与缩进等，高度跟随父元素高度，无法自定义。

### 基础

基本用法：传入嵌套数据，显示名称字段。

:::demo
Tree/base/basic
:::

### 数据（data）

自定义子节点字段名：通过 `childrenField` 指定。

:::demo
Tree/data/childrenField
:::

扁平数据自动构建：同时提供 `rowField` 与 `parentField` 时自动构建树结构。

:::demo
Tree/data/row-parent
:::

自定义显示字段：通过 `labelField` 指定展示文本字段。

:::demo
Tree/data/labelField
:::

### 展示交互（showType）

默认展示：按钮常显。

:::demo
Tree/display/showType-default
:::

悬浮展示：仅鼠标悬浮时显示按钮。

:::demo
Tree/display/showType-hover
:::

点击展示：点击某一行显示其按钮，再次点击收起。

:::demo
Tree/display/showType-click
:::

### 布局与样式（indent/showLine/showRowLine）

缩进间距：通过 `indent` 控制层级缩进（像素）。

:::demo
Tree/layout/indent
:::

父子连线：显示左侧父子连接虚线。

:::demo
Tree/layout/showLine
:::

行内连线：显示每一行右侧延伸虚线。

:::demo
Tree/layout/showRowLine
:::

### 图标（childIcon/parentIcon/icon）

子节点图标：为叶子节点设置图标。

:::demo
Tree/icons/childIcon
:::

父节点图标：为非叶子节点设置图标。

:::demo
Tree/icons/parentIcon
:::

函数图标：根据行数据返回不同图标。

:::demo
Tree/icons/icon-function
:::

### 行内按钮（buttons）

内置类型按钮：`add`\|`edit`\|`delete`，自动匹配图标，可设置 `tooltip` 与 `event`。

:::demo
Tree/buttons/types
:::

自定义图标按钮：通过 `icon` 传入组件或字符串图标。

:::demo
Tree/buttons/customIcon
:::

插槽（字符串）按钮：在按钮区域渲染具名插槽内容。

:::demo
Tree/buttons/slotString
:::

插槽（函数）按钮：通过函数返回自定义 vnode。

:::demo
Tree/buttons/slotFunction
:::

### 级联选择（levelSelect）

级联高亮：点击节点高亮自身与所有子孙；再次点击取消，`change` 返回当前所有高亮的行数组。

:::demo
Tree/levelSelect/levelSelect
:::

### 事件（node-click/change）

节点点击事件：返回节点数据、内部节点信息与鼠标事件。

:::demo
Tree/events/node-click
:::

## API

### Props

| 参数            | 说明 | 类型                                                                                                                                                                                                  | 默认值 |
|---------------| --- |-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| --- |
| data          | 树数据（扁平或嵌套） | `any[]`                                                                                                                                                                                             | `[]` |
| childrenField | 子节点字段名 | `string`                                                                                                                                                                                            | `'children'` |
| rowField      | 行主键字段名 | `string`                                                                                                                                                                                            | `'id'` |
| parentField   | 父主键字段名（与 `rowField` 同用时将忽略 `childrenField` 并自动构建树） | `string`                                                                                                                                                                                            | `''` |
| labelField    | 显示文本字段名 | `string`                                                                                                                                                                                            | `'label'` |
| childIcon     | 叶子节点图标 | `Component` \| `string`                                                                                                                                                                             | `undefined` |
| parentIcon    | 非叶子节点图标 | `Component` \| `string`                                                                                                                                                                             | `undefined` |
| icon          | 根据行数据返回图标 | ^[Function]`(row: any) => Component                                                                                                                                                                 | string` | `undefined` |
| showType      | 行按钮展示方式 | `'hover'` \| `'click'` \| `'default'`                                                                                                                                                               | `'default'` |
| buttons       | 为每一行返回按钮数组 | ^[Function]`(row: any) => { btnType?: 'add'\|'edit' \|'delete'; slot?: string\| ((...args:any[])=>any); icon?: Component \| string; event?: (data?: any, node?: any) => void; tooltip?: string}[]}` | `undefined` |
| indent        | 每级缩进像素 | `number`                                                                                                                                                                                            | `16` |
| showLine      | 是否显示左侧父子连接线 | `boolean`                                                                                                                                                                                           | `false` |
| showRowLine   | 是否显示每一行右侧延伸线 | `boolean`                                                                                                                                                                                           | `false` |
| levelSelect   | 是否开启级联高亮与 `change` 事件 | `boolean`                                                                                                                                                                                           | `false` |


### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| node-click | 点击节点行触发 | ^[Function]`(data: any, node: any, evt: MouseEvent) => void` |
| change | 级联高亮变化时触发（仅 `levelSelect=true`） | ^[Function]`(rows: any[]) => void` |

### Slots

| 名称 | 说明 | 作用域 |
| --- | --- | --- |
| default | 整行自定义渲染（替换默认行内容） | `{ node, data }` |
| label | 标签文本渲染（默认展示 `data[labelField]`） | `{ node, data }` |
| \[动态\] | 与 `buttons` 中 `slot` 对应的具名插槽，渲染到按钮区域 | `{ node, data }` |

### Expose

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| getTree | 获取内部 `ElTreeV2` 实例 | ^[Function]`() => any` |


