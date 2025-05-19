# 低代码编辑器Plus组件

这是一个基于Vue3的低代码编辑器组件，允许用户通过拖拽方式快速构建页面，无需编写代码。

## 功能特点

- **组件面板**：直接展示Element Plus的真实组件和图表组件
- **拖拽编辑**：支持组件的拖拽放置与组件嵌套
- **磁吸对齐**：自动对齐功能，使布局更加整齐
- **属性编辑**：实时调整组件属性并预览效果
- **JSON导入导出**：保存和恢复页面配置

## 技术栈

- Vue 3 Composition API
- TypeScript
- Tailwind CSS
- Element Plus
- ECharts 和 AntV/G2
- Pinia 状态管理

## 组件结构

低代码编辑器由以下主要部分组成：

1. **ComponentPanel**：左侧组件面板，展示可用组件
2. **ComponentRenderer**：中间编辑区域，用于组件拖拽和布局
3. **ComponentPropertyPanel**：右侧属性编辑面板，用于调整组件属性

## 使用方法

```vue
<template>
  <LowCodeEditor />
</template>

<script setup>
import LowCodeEditor from '@/components/lowCodeEditor/index.vue'
</script>
```

## 组件交互

### 拖拽组件

从左侧组件面板拖拽组件到中间编辑区域即可添加组件。

### 组件嵌套规则

- el-col组件只能放在el-row中
- 基础组件和图表组件只能放在布局组件中
- el-row宽度默认100%
- el-container宽高默认100%

### 编辑组件属性

点击选中组件后，在右侧属性面板可以编辑组件的属性、样式和事件。

### 保存和导出

支持将页面配置导出为JSON Schema，也可以从JSON Schema导入页面配置。

## 开发者指南

### 添加新组件

要添加新组件，需要在`constants/components.ts`文件中的相应分类数组中添加组件定义。

### 自定义组件规则

在组件定义中的`rules`属性中添加嵌套规则，控制组件的嵌套行为。

### 扩展图表类型

在`constants/components.ts`的`CHART_COMPONENTS`数组中添加新的图表类型，并在`ComponentItem.vue`中添加相应的预览配置。 