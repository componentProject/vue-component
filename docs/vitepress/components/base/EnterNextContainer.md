# EnterNextContainer

回车自动跳转容器组件，让用户可以通过按回车键在表单输入框之间快速跳转。

## 组件示例

### 基础用法

示例：容器内按 Enter 键顺序聚焦下一个输入/选择控件

:::demo
EnterNextContainer/base
:::

### Props

示例：通过 `virtualRef` 监听外部容器而非自身
:::demo
EnterNextContainer/virtualRef
:::

## API

### Props

| 参数 | 说明                                            | 类型 | 默认值 |
| --- |-----------------------------------------------| --- | --- |
| virtualRef | 外部元素引用，当提供时，将监控该元素而不是容器内部                     | ComponentPublicInstance \| ComponentInternalInstance \| HTMLElement \| null | null |
| focusNum | 默认聚焦第几个元素                                     | Number \| undefined | - |
| autoNext | 与`focusNum`配合使用，同时开启，`focusNum`将变为聚焦第几个未禁用的元素 | Boolean | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| noNextInput | 当用户在最后一个输入元素上按下Enter键，或者只有一个输入元素时触发 | ^[Function]`(element: HTMLElement) => void` |
| noSelectValue | 当select下拉框没有选中值时但按了回车触发 | ^[Function]`(element: HTMLElement) => void` |

### Slots

| 插槽名 | 说明                             |
| --- |--------------------------------|
| default | 默认插槽，用于传递需要监听的`input/select`元素 |

### Expose

该组件没有暴露任何方法或属性。
