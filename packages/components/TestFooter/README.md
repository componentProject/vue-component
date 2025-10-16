# TestFooter 测试页脚组件

## 概述

TestFooter 是一个用于测试的页脚组件，基于 HisFooter 组件设计，但不调用真实接口，使用写死的测试数据。主要用于开发和测试阶段。

## 功能特性

- 🚀 **无接口依赖**: 不调用任何API接口，使用预设的测试数据
- 🎯 **测试专用**: 专门为测试环境设计，避免真实数据干扰
- 🔧 **可配置**: 支持自定义测试数据和显示控制
- 📱 **响应式**: 基于 TsFooter 组件，支持响应式设计

## 基本用法

```vue
<template>
  <TestFooter />
</template>

<script setup>
import TestFooter from '@moluoxixi/components/TestFooter'
</script>
```

## 高级用法

### 自定义测试数据

```vue
<template>
  <TestFooter 
    :custom-data="customTestData"
    :show-test-data="true"
  />
</template>

<script setup>
import TestFooter from '@moluoxixi/components/TestFooter'

const customTestData = {
  '测试字段1': '测试值1',
  '测试字段2': '测试值2',
  '自定义编码': 'CUSTOM001',
}
</script>
```

### 控制显示

```vue
<template>
  <TestFooter :show-test-data="false" />
</template>
```

## API 参考

### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| showTestData | boolean | true | 是否显示测试数据 |
| customData | Record<string, string \| number> | {} | 自定义测试数据 |

### 默认测试数据

组件内置以下测试数据：

- 国家医疗机构个人编码: TEST001234567890
- 国家定点医疗机构编码: HOSPITAL001
- 医保类型: 城镇职工基本医疗保险
- 参保状态: 正常参保
- 个人账户余额: ¥1,234.56
- 最后更新时间: 2024-01-15 10:30:00

### Expose

| 方法/属性 | 类型 | 说明 |
|-----------|------|------|
| items | Array<{ text: string }> | 当前显示的数据项 |
| getTestData | () => void | 重新获取测试数据 |

## 使用场景

- 🧪 **开发测试**: 在开发环境中快速预览页脚效果
- 🔍 **功能验证**: 验证页脚组件的显示逻辑
- 📋 **UI调试**: 调试页脚样式和布局
- 🚀 **快速原型**: 快速搭建原型页面

## 注意事项

1. **仅用于测试**: 此组件仅用于测试环境，不要在生产环境中使用
2. **数据安全**: 测试数据不包含真实敏感信息
3. **性能考虑**: 组件轻量级，适合频繁测试使用

## 与 HisFooter 的区别

| 特性 | HisFooter | TestFooter |
|------|-----------|------------|
| 数据源 | 真实API接口 | 预设测试数据 |
| 使用场景 | 生产环境 | 测试环境 |
| 数据安全 | 真实敏感数据 | 模拟测试数据 |
| 网络依赖 | 需要网络请求 | 无网络依赖 |
| 配置复杂度 | 需要token等参数 | 简单配置 |

## 更新日志

### v1.0.0
- 初始版本发布
- 基于 HisFooter 设计
- 支持自定义测试数据
- 完整的 TypeScript 类型支持
