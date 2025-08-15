# Vue Template Components

这是一个基于 Vue 3 + TypeScript 的组件库，封装了多个实用的组件，方便在 Vue 项目中使用。

## 安装

```bash
npm install vue-template-components
# 或
yarn add vue-template-components
# 或
pnpm add vue-template-components
```

## 使用

### 全局注册

```js
import { createApp } from 'vue'
import App from './App.vue'
import VueTemplateComponents from 'vue-template-components'
import 'vue-template-components/dist/style.css'

const app = createApp(App)
app.use(VueTemplateComponents)
app.mount('#app')
```

### 按需引入

```vue
<template>
  <Calendar />
  <DraggableTable :data="tableData" :columns="columns" />
</template>

<script setup>
import { Calendar, DraggableTable } from 'vue-template-components'
import 'vue-template-components/dist/style.css'
</script>
```

## 组件列表

组件库包含以下组件：

- Calendar - 日历组件
- ConfigForm - 配置化表单
- ConfigProvider - 配置提供者
- DateRangePicker - 日期范围选择器
- DraggableTable - 可拖拽表格
- EnterNextContainer - 可按 Enter 切换下一个输入框的容器
- EnterNextTable - 可按 Enter 切换下一个输入框的表格
- EnterNextDragTable - 可拖拽且可按 Enter 切换下一个输入框的表格
- ExportExcel - Excel 导出工具
- Icon - 图标组件
- IntersectObserver - 交叉观察器
- KeepAllAlive - 保持所有组件存活
- MarkdownEditor - Markdown 编辑器
- PopoverTableSelect - 弹出表格选择器
- Select - 选择器
- Tabs - 标签页
- Watermark - 水印组件

## 开发与贡献

1. 克隆仓库
   ```bash
   git clone https://github.com/yourusername/vue-template-components.git
   cd vue-template-components
   ```

2. 安装依赖
   ```bash
   pnpm install
   ```

3. 启动开发服务器
   ```bash
   pnpm dev
   ```

4. 构建组件库
   ```bash
   pnpm build:component
   ```

## License

MIT 