# Vue 组件库

这是一个基于 Vue 3 和 Element Plus 的组件库，提供了丰富的业务组件和工具函数。

## 组件列表

### 表单组件

- **TsSelect** - 选择器组件，支持静态数据和动态请求
- **TsCheckbox** - 多选框组件，支持静态数据和动态请求
- **TsRadio** - 单选框组件，支持静态数据和动态请求
- **ReForm** - 动态表单组件
- **ConfigFrom** - 配置表单组件

### 数据展示组件

- **DraggableTable** - 可拖拽表格组件
- **PopoverTableSelect** - 弹出表格选择器
- **Tree** - 树形组件
- **Tabs** - 标签页组件

### 业务组件

- **DateRangePicker** - 日期范围选择器
- **ExportExcel** - Excel 导出组件
- **ImportExcel** - Excel 导入组件
- **DragModalDialog** - 可拖拽模态框
- **EnterNextContainer** - 回车下一步容器
- **TsButton** - 按钮组件
- **TsFooter** - 页脚组件

### 工具组件

- **KeepAllAlive** - 保持所有组件活跃状态
- **Splitter** - 分割器组件
- **Title** - 标题组件

## 安装使用

```bash
npm install @moluoxixi/components
```

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import Components from '@moluoxixi/components'

const app = createApp(App)
app.use(Components)
```

## 按需引入

```typescript
import { TsCheckbox, TsRadio, TsSelect } from '@moluoxixi/components'

// 在组件中使用
export default {
  components: {
    TsSelect,
    TsCheckbox,
    TsRadio
  }
}
```

## Hooks

组件库还提供了一些可复用的 hooks：

- **useOptions** - 用于处理 options 获取逻辑的 hook，支持静态数据和动态请求

```typescript
import { useOptions } from '@moluoxixi/components'

const { options, isLoading, error } = useOptions({
  options: props.options,
  requestUrl: props.requestUrl,
  requestParams: props.requestParams
})
```

## 开发指南

### 组件开发规范

1. 所有组件都应该支持 TypeScript
2. 使用 Vue 3 Composition API
3. 遵循 Element Plus 的设计规范
4. 提供完整的 API 文档和示例
5. 支持静态数据和动态请求两种数据源

### 目录结构

```
packages/components/
├── _hooks/           # 可复用的 hooks
├── TsSelect/         # 选择器组件
├── TsCheckbox/       # 多选框组件
├── TsRadio/          # 单选框组件
├── ...               # 其他组件
└── index.ts          # 主入口文件
```

## 更新日志

### v1.0.0

- 新增 TsSelect 选择器组件
- 新增 TsCheckbox 多选框组件
- 新增 TsRadio 单选框组件
- 新增 useOptions hook
- 支持静态数据和动态请求
- 完整的 TypeScript 类型支持
