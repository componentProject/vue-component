# Tabs

增强的标签页组件，基于Element Plus Tabs封装，支持更多功能特性。

## 组件示例

### 基础用法

示例：最小配置，基于 `tabList` 动态生成面板
:::demo
Tabs/base
:::

### Props

示例：懒加载（lazy=true，仅首次切换时渲染）
:::demo
Tabs/props/lazy
:::

示例：通过 show(item) 动态控制某个标签是否展示
:::demo
Tabs/props/showFn
:::

示例：自定义插槽名（使用 item.slot；若未设置则回退为 label）
:::demo
Tabs/props/slotName
:::

### Events

示例：切换回调（tabChange）
:::demo
Tabs/events/tabChange
:::

## API

### Props

| 参数 | 说明                          | 类型                                                                                                              | 默认值                                                                    |
| --- |-----------------------------|-----------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| v-model | 绑定值，选中选项卡的name              | String                                                                                                          | '1'                                                                    |
| tabList | 标签页列表配置,item等同于ElTabPane的属性 | ^[Array]`{ label: string; name: string\| number; slot?: string; lazy?: boolean; show?: (item: any) => boolean}` | [] |

#### TabItem 接口

| 参数 | 说明                           | 类型 | 默认值 |
| --- |------------------------------| --- | --- |
| id | 标签页唯一标识符，同时也是`el-tabs`绑定的值   | String | - |
| label | 标签页标题                        | String | - |
| slot | 自定义插槽名称，不传则使用`label`的值作为默认插槽 | String | - |
| lazy | 是否延迟渲染                       | Boolean | false |
| show | 控制标签页是否显示的函数                 | ^[Function]`(item: any) => boolean` | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| tabChange | tab被选中时触发 | ^[Function]`(name: string) => void` |

### Slots

| 插槽名 | 说明                                                                     |
| --- |------------------------------------------------------------------------|
| [slot\|label] | 标签页内容，插槽名称为tabList中item的slot属性值或label属性值（当 `slot` 未设置时使用 `label` 作为插槽名） |

### Expose

该组件没有暴露任何方法或属性。
