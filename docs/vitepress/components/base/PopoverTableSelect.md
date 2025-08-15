# PopoverTableSelect

弹出表格选择器组件，支持在弹出层中显示表格数据进行选择。

## 组件示例

### 外观与触发（popType）

示例：外部输入框作为触发器（popType='default'，virtualRef 指向输入框）
:::demo
PopoverTableSelect/props/popType-default
:::

示例：内置输入框作为触发器（popType='input'）
:::demo
PopoverTableSelect/props/popType-input
:::

### 关闭弹窗的方式（selectTrigger）

示例：单击选中关闭
:::demo
PopoverTableSelect/props/trigger-select-click
:::

示例：双击选中关闭
:::demo
PopoverTableSelect/props/trigger-select-dblclick
:::

### 连续展示（successiveShowType）

示例：按回车后继续展示（successiveShowType='enter')
:::demo
PopoverTableSelect/props/successiveShowType-enter
:::

示例：输入时实时展示（successiveShowType='input')
:::demo
PopoverTableSelect/props/successiveShowType-input
:::

### 插槽（slots）

示例：默认插槽在表格上方自定义区域
:::demo
PopoverTableSelect/slots/default
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 控制弹出层显示状态 | Boolean | false |
| debounce | 防抖延迟时间（毫秒） | Number | 0 |
| throttle | 节流延迟时间（毫秒） | Number | 300 |
| options | 防抖/节流配置 | DebounceSettingsLeading \| ThrottleSettingsLeading | {} |
| popType | 弹出类型 | 'default' \| 'input' | 'default' |
| placeholder | 占位文本 | String | '点击或按下方向键试试' |
| inputProps | 输入框属性配置 | InputProps | {} |
| inputValue | 输入框的值 | String | '' |
| virtualRef | 虚拟引用元素 | ComponentPublicInstance \| ComponentInternalInstance \| InputInstance \| HTMLElement \| null | null |
| successiveShowType | 连续显示触发类型 | 'enter' \| 'select' \| 'input' | '' |

#### 透传给内部 Popover 与 DraggableTable 的关键 Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| placement | Popover 弹出位置 | String | 'bottom' |
| trigger | 触发方式 | 'click' \| 'focus' \| 'hover' \| 'contextmenu' | 'hover' |
| title | 弹出标题 | String | '' |
| effect | 主题 | 'dark' \| 'light' | 'light' |
| content | 主体内容（可被插槽覆盖） | String | '' |
| disabled | 是否禁用 | Boolean | false |
| offset | 偏移量 | Number | 12 |
| transition | 动画 | String | 'el-fade-in-linear' |
| showArrow | 是否显示箭头 | Boolean | true |
| popperOptions | Popper.js 配置 | Object | { modifiers: [{ name: 'computeStyles', options: { gpuAcceleration: false } }] } |
| popperClass | 自定义 class | String | '' |
| popperStyle | 自定义样式 | String\|Object | '' |
| showAfter | 显示延迟 | Number | 0 |
| hideAfter | 隐藏延迟 | Number | 200 |
| autoClose | 自动关闭延时 | Number | 0 |
| tabindex | tabindex | Number | undefined |
| teleported | Teleport 到 body | Boolean | true |
| persistent | 是否持久化 | Boolean | true |
| width | 弹窗宽度 | String\|Number | 400 |
| height | 表格高度 | String\|Number | 300 |
| id | 传给 DraggableTable 的唯一标识 | String | 'popoverTableSelect' |
| columns | vxe-grid 列配置 | Array\<ColumnType\> | [] |
| data | 表格数据 | Array | [] |

### Events

| 事件名    | 说明           | 回调参数 |
|--------|--------------| --- |
| focus  | 输入框获得焦点时触发   | - |
| input  | 输入框输入时触发     | ^[Function]`(value: string) => void` |
| blur   | 输入框失去焦点时触发   | - |
| select | 选中指定行时触发        | ^[Function]`(selectedRow: any) => void` |
| enter  | 按下回车键或选择行时触发 | ^[Function]`(selectedRow: any) => void` |

### Slots

| 插槽名 | 说明                       | 作用域参数 |
| --- |--------------------------| --- |
| default | 表格上面的默认插槽                | - |
| [动态插槽] | 透传给内部 DraggableTable 的插槽 | 参考 [DraggableTable 的 Slots](../table/DraggableTable.md#slots) |

### Expose

该组件没有暴露任何方法或属性。
