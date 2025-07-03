# Moluoxixi Vue 组件库

这是一个基于Vue 3和Element Plus的高级组件库，提供了丰富的企业级UI组件。

## 安装

```bash
npm install moluoxixi
# 或
yarn add moluoxixi
# 或
pnpm add moluoxixi
```

## 使用方法

```js
// 全局引入
import { createApp } from 'vue'
import Moluoxixi from 'moluoxixi'
import 'moluoxixi/style.css'

const app = createApp(App)
app.use(Moluoxixi)
app.mount('#app')

// 按需引入
import { Calendar } from 'moluoxixi'
import 'moluoxixi/style.css'
```

## 主要组件

- Calendar - 日历组件
- ConfigForm - 配置化表单
- DateRangePicker - 日期范围选择器
- DraggableTable - 可拖拽表格
- EnterNextTable - 回车跳转下一个单元格的表格
- ExportExcel - Excel导出功能
- MarkdownEditor - Markdown编辑器
- Watermark - 水印组件

## 文档

访问[文档网站](https://github.com/moluoxixi-template/vue-template)获取更多信息和示例。

## 许可证

MIT 