# DraggableTable

可拖拽表格组件，基于[VXE-Grid4.7](https://vxetable.cn/#/grid/api),[EnterNextContainer](../base/EnterNextContainer.md)封装，支持行列拖拽、编辑、过滤等功能。

## 组件示例

### 分页（showPagination）

示例：开启分页（showPagination=true）
:::demo
DraggableTable/base/index
:::

### 编辑（editable / editAutoFocus）

示例：开启编辑（editable=true）
:::demo
DraggableTable/edit/editable
:::

示例：关闭编辑模式自动聚焦（editAutoFocus=false）
:::demo
DraggableTable/edit/editAutoFocus
:::

### 过滤（filterable / filterType / filterLayout）

示例：开启过滤（filterable=true）
:::demo
DraggableTable/filter/filterable
:::

示例：过滤类型（filterType='full'，匹配全量表格数据）
filterType='full'，匹配全量表格数据
filterType='filter'，匹配当前表格数据
:::demo
DraggableTable/filter/filterType
:::

示例：过滤布局（filterLayout=['input','checkbox','select']）
:::demo
DraggableTable/filter/filterLayout
:::

### 排序（sortable）

示例：启用全局排序（sortable=true）
:::demo
DraggableTable/sort/sortable
:::


### 回车下一个

示例：容器类型为行（containerType='row'）
:::demo
DraggableTable/props/containerType-row
:::

示例：容器类型为整表（containerType='table'）
:::demo
DraggableTable/props/containerType-table
:::

示例：无下一个输入控件（noNextInput）
:::demo
DraggableTable/events/noNextInput
:::

### 存储（saveType / saveHotKeys / getConfig / setConfig / customColumns / id+pageId+userId）

示例：使用浏览器本地存储保存个性化列配置（saveType='local'）
:::demo
DraggableTable/storage/saveType-local
:::

示例：通过回调接入服务端存储（saveType='server' + getConfig/setConfig）
:::demo
DraggableTable/storage/saveType-server
:::

示例：自定义个性化弹窗热键（saveHotKeys=['shift','k']）
:::demo
DraggableTable/storage/saveHotKeys-custom
:::

示例：自定义个性化弹窗的列集合（customColumns）
:::demo
DraggableTable/storage/customColumns
:::

示例：不同 userId 下独立保存（结合 id+pageId+userId）
:::demo
DraggableTable/storage/identity
:::

### 插槽（动态命名插槽与内置前缀插槽）

示例：默认（字段）插槽
:::demo
DraggableTable/slots/defaultSlot
:::

示例：表头插槽（header-name）
:::demo
DraggableTable/slots/headerSlot
:::

示例：编辑插槽（edit-name）
:::demo
DraggableTable/slots/editSlot
:::

示例：过滤插槽（filter-name）
:::demo
DraggableTable/slots/filterSlot
:::

### 事件

示例：行拖拽完成（rowDragend）
:::demo
DraggableTable/events/rowDragend
:::

示例：列拖拽完成（columnDragend）
:::demo
DraggableTable/events/columnDragend
:::

示例：列宽变化（resizableChange）
:::demo
DraggableTable/events/resizableChange
:::

示例：复选框（checkboxChange / checkboxAll）
:::demo
DraggableTable/events/checkbox
:::

### 暴露方法（getTable）

示例：通过 ref 获取 VXE 表格实例
:::demo
DraggableTable/expose/getTable
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 是否必填 |
| --- | --- | --- | --- | --- |
| v-model | 表格数据 | Array | [] | 是 |
| columns | 列配置数组 | Array\<ColumnType\> | [] | 是 |
| id | 表格唯一ID，用于自定义列配置存储识别 | String | - | 是 |
| pageId | 分页唯一ID，用于自定义列配置存储识别 | String | - | 是 |
| userId | 用户唯一ID，用于自定义列配置存储识别 | String | - | 是 |
| dragable | 是否启用拖拽（行列都启用） | Boolean | false | 否 |
| resizable | 是否允许列宽拖拽 | Boolean | true | 否 |
| editable | 是否允许编辑 | Boolean | false | 否 |
| sortable | 是否启用排序 | Boolean | false | 否 |
| rowdragable | 是否启用行拖拽 | Boolean | false | 否 |
| columndragable | 是否启用列拖拽 | Boolean | false | 否 |
| dragType | 拖拽模式（'vxe'|'draggable'） | String | 'vxe' | 否 |
| rowDisabledClass | 需要禁用拖拽的行 `class` | String | '' | 否 |
| rowDragDisabledMethod | 行拖拽禁用方法 | ^[Function]`Function` | - | 否 |
| rowDragEndMethod | 行拖拽结束回调方法 | ^[Function]`Function` | - | 否 |
| rowDragConfig | 行拖拽配置对象 | Object | {} | 否 |
| columnDragDisabledMethod | 列拖拽禁用方法 | ^[Function]`Function` | - | 否 |
| columnDragEndMethod | 列拖拽结束回调方法 | ^[Function]`Function` | - | 否 |
| columnDragConfig | 列拖拽配置对象 | Object | {} | 否 |
| rowId | 行的唯一标识字段 | String | '_X_ROW_KEY' | 否 |
| rowConfig | 行配置对象 | Object | {} | 否 |
| columnConfig | 列配置对象 | Object | {} | 否 |
| virtualXConfig | 列虚拟滚动配置 | Object | {} | 否 |
| virtualYConfig | 行虚拟滚动配置 | Object | {} | 否 |
| menuConfigColumn | 右键菜单是否允许配置列显隐 | Boolean | true | 否 |
| menuConfig | 右键菜单配置 | Object | {} | 否 |
| sortable | 是否启用排序 | Boolean | false | 否 |
| sortConfig | 排序配置 | Object | {} | 否 |
| customConfig | VXE 自定义配置 | Object | {} | 否 |
| mouseConfig | 鼠标相关配置 | Object | {} | 否 |
| pagerConfig | 分页配置 | Object | 见默认值 | 否 |
| showPagination | 是否显示分页 | Boolean | false | 否 |
| allowSelectNextInEmpty | 在空值时是否允许选择下一输入 | Boolean | false | 否 |
| containerType | 回车容器类型（'row'|'table'） | String | 'row' | 否 |
| saveType | 列配置存储类型（'local'|'server'） | String | 'server' | 否 |
| saveHotKeys | 打开个性化列配置弹窗的按键组合 | String[] | `['shift','alt','ctrl','f12']` | 否 |
| getConfig | 自定义获取列配置方法 | ^[Function]`(config: customConfigType) => Promise<ColumnType[]>` | - | 否 |
| setConfig | 自定义保存列配置方法 | ^[Function]`(config: customConfigType, columns: ColumnType[]) => Promise<any>` | - | 否 |
| customColumns | 自定义个性化列配置弹窗的列集合 | `Array<ColumnType>` | 见源代码默认值 | 否 |
| isConfiguration | 自定义个性化列配置弹窗是否显示统一配置 | Boolean | false | 否 |
| ...attrs | 其他属性透传给[vxe-grid](https://vxetable.cn/#/grid/api) | - | - |

### columns 配置

| 参数           | 说明 | 类型 | 默认值 |
|--------------| --- | --- | --- |
| field        | 字段名，对应数据中的key | String | - |
| title        | 列标题 | String | - |
| width        | 列宽度 | Number/String | - |
| minWidth     | 最小列宽度 | Number/String | - |
| fixed        | 列固定位置，可选值: 'left', 'right' | String | - |
| sortable     | 是否可排序 | Boolean | false |
| align        | 对齐方式，可选值: 'left', 'center', 'right' | String | 'left' |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:tableData | 表格数据更新事件 | ^[Function]`(newData: any[]) => void` |
| columnDragend | 列拖拽完成事件 | ^[Function]`(params: ColumnDragendParams) => void` |
| rowDragend | 行拖拽完成事件 | ^[Function]`(params: RowDragendParams) => void` |
| resizableChange | 列宽变化事件 | ^[Function]`(params: ResizableChangeParams) => void` |
| checkboxChange | 复选框变化事件 | ^[Function]`(params: CheckboxChangeParams) => void` |
| checkboxAll | 复选框全选事件 | ^[Function]`(params: CheckboxAllParams) => void` |
| sizeChange | 分页尺寸变化事件 | ^[Function]`(size: number) => void` |
| pageChange | 分页页码变化事件 | ^[Function]`(page: number) => void` |
| currentChange | 当前行变化事件 | ^[Function]`(rowIndex: number) => void` |
| update:pagination | 分页双向绑定事件 | ^[Function]`(page: number) => void` |
| headerContextMenu | 表头右键菜单显示 | ^[Function]`(cell: HTMLElement) => void` |
| headerCellMenu | 表头单元格右键（含 cell 信息） | ^[Function]`(params: HeaderCellMenuParams & { cell?: HTMLElement }) => void` |
| noNextInput | 行内无下一个可聚焦输入时触发 | ^[Function]`(params: NoNextInputParams) => void` |
| noSelectValue | select 下拉为空时触发 | ^[Function]`(params: NoSelectValueParams) => void` |
| toggleTreeExpand | 树形展开切换时触发 | ^[Function]`(params: VxeTableDefines.ToggleRowExpandEventParams) => void` |

### Slots

> 组件支持动态插槽，会自动根据列配置和插槽名称进行匹配。插槽名称遵循 `${type}-${field}` 的命名规则。

| 插槽名                 | 说明                | 参数         |
| ------------------- | ----------------- | ---------- |
| loading             | 自定义加载状态内容         | params     |
| `${field}`          | 列默认插槽，field为列字段名  | slotParams |
| `header-${field}`   | 列表头插槽，field为列字段名  | slotParams |
| `footer-${field}`   | 列底部插槽，field为列字段名  | slotParams |
| `title-${field}`    | 列标题插槽，field为列字段名  | slotParams |
| `checkbox-${field}` | 复选框插槽，field为列字段名  | slotParams |
| `radio-${field}`    | 单选框插槽，field为列字段名  | slotParams |
| `content-${field}`  | 展开内容插槽，field为列字段名 | slotParams |
| `filter-${field}`   | 筛选器插槽，field为列字段名  | slotParams |
| `edit-${field}`     | 编辑器插槽，field为列字段名  | slotParams |
| `valid-${field}`    | 验证插槽，field为列字段名   | slotParams |

### Expose

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| getTable | 获取VXE-Grid实例，可调用VXE-Grid的所有方法 | ^[Function]`() => VxeGridInstance` |

