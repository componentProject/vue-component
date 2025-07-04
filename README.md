# Vue 组件库模板

这是一个基于 Vue 3 + TypeScript + Vite 的组件库开发模板，支持组件独立打包和类型声明生成。

## 项目特性

- 🚀 **Vue 3 + TypeScript** - 使用最新的 Vue 3 Composition API 和 TypeScript
- 📦 **组件独立打包** - 每个组件可以独立打包发布
- 🎯 **类型声明生成** - 自动生成完整的 TypeScript 类型声明
- 🎨 **Element Plus 集成** - 基于 Element Plus 组件库
- 📱 **响应式设计** - 支持移动端和桌面端
- 🔧 **开发工具** - 完整的开发、构建、测试工具链

## 类型声明生成方案

### 最佳实践

本项目采用 `vite-plugin-dts` 的 Vue 模式来生成类型声明，这是目前市面上最稳定可靠的方案：

#### 优势
1. **原生 Vue 支持** - 直接处理 `.vue` 文件的类型声明
2. **自动类型推断** - 自动推断组件的 props、emits、slots 类型
3. **零配置** - 开箱即用，无需复杂配置
4. **高性能** - 基于 Vite 构建，速度快
5. **标准化输出** - 生成符合 TypeScript 标准的类型声明

#### 配置说明

```javascript
dts({
  // 启用 Vue 模式，自动处理 .vue 文件的类型声明
  vue: true,
  // 指定入口文件
  entryRoot: dirname(entry),
  // 输出目录
  outDir,
  // 包含的文件
  include: [`src/components/${comp}/**/*`],
  // 排除的文件
  exclude: [
    '**/*.stories.*',
    '**/*.test.*',
    '**/*.spec.*',
    '**/node_modules/**',
    '**/dist/**',
    '**/temp/**',
  ],
  // 跳过类型检查，提高构建速度
  skipDiagnostics: true,
  // 复制 .d.ts 文件
  copyDtsFiles: true,
  // 清理输出目录
  cleanVueFileName: true,
  // 插入类型声明
  insertTypesEntry: true,
  // 静态导入
  staticImport: true,
  // 排除外部依赖
  excludeExternals: true,
})
```

### 与 vue-tsc 的对比

| 特性 | vite-plugin-dts | vue-tsc |
|------|----------------|---------|
| Vue 文件支持 | ✅ 原生支持 | ✅ 支持但复杂 |
| 配置复杂度 | 简单 | 复杂 |
| 构建速度 | 快 | 慢 |
| 类型质量 | 高 | 高 |
| 维护成本 | 低 | 高 |
| 社区支持 | 活跃 | 一般 |

### 使用建议

1. **优先使用 vite-plugin-dts** - 这是目前的最佳实践
2. **避免混合使用** - 不要同时使用 vue-tsc 和 vite-plugin-dts
3. **保持配置简单** - 避免过度配置，使用默认值即可
4. **定期更新依赖** - 保持 vite-plugin-dts 版本最新

## 组件开发指南

### 组件结构

```
src/components/
├── ComponentName/
│   ├── index.vue          # 组件入口文件
│   ├── README.md          # 组件文档
│   ├── types/
│   │   └── index.ts       # 类型定义
│   └── components/        # 子组件
```

### 类型声明最佳实践

1. **使用 TypeScript** - 所有组件都应该使用 TypeScript
2. **定义 Props 类型** - 明确定义组件的 props 类型
3. **定义 Emits 类型** - 明确定义组件的事件类型
4. **使用泛型** - 合理使用泛型提高组件的灵活性
5. **导出类型** - 导出组件相关的类型定义

### 示例

```vue
<script setup lang="ts">
import type { PropType } from 'vue'

// 定义 props 类型
interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请输入内容',
  disabled: false,
})

// 定义 emits 类型
interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}

const emit = defineEmits<Emits>()
</script>

<template>
  <input
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    @input="emit('update:modelValue', $event.target.value)"
    @change="emit('change', $event.target.value)"
  />
</template>
```

## 构建和发布

### 构建命令

```bash
# 构建所有组件
npm run build:components

# 构建单个组件
npm run build:component -- --name ComponentName
```

### 发布流程

1. **构建组件** - 生成 ES/CJS 模块和类型声明
2. **生成 package.json** - 自动生成每个组件的 package.json
3. **发布到 npm** - 支持独立发布每个组件

### 目录结构

构建后的目录结构：

```
moluoxixi/
├── ComponentName/
│   ├── es/
│   │   ├── index.mjs      # ES 模块
│   │   ├── index.d.ts     # 类型声明
│   │   └── style/
│   │       └── index.css  # 样式文件
│   ├── lib/
│   │   ├── index.cjs      # CommonJS 模块
│   │   └── index.d.ts     # 类型声明
│   ├── package.json       # 包配置
│   └── README.md          # 组件文档
```

## 开发工具

### 推荐工具

- **Vue DevTools** - Vue 开发调试工具
- **TypeScript** - 类型检查和智能提示
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化

### 开发流程

1. **创建组件** - 在 `src/components/` 下创建新组件
2. **编写代码** - 使用 TypeScript 和 Vue 3 Composition API
3. **编写文档** - 在 README.md 中说明组件用法
4. **测试组件** - 确保组件功能正常
5. **构建发布** - 使用构建脚本生成发布包

## 常见问题

### 类型声明生成失败

如果类型声明生成失败，请检查：

1. **组件语法** - 确保组件语法正确
2. **TypeScript 配置** - 检查 tsconfig.json 配置
3. **依赖版本** - 确保 vite-plugin-dts 版本兼容
4. **文件路径** - 确保文件路径正确

### 解决方案

1. **清理缓存** - 删除 `node_modules/.vite` 缓存
2. **重新安装依赖** - 删除 `node_modules` 重新安装
3. **检查配置** - 确保 vite 配置正确
4. **查看日志** - 查看构建日志定位问题

## 贡献指南

1. **Fork 项目** - Fork 本项目到你的仓库
2. **创建分支** - 创建功能分支
3. **编写代码** - 按照项目规范编写代码
4. **提交代码** - 提交你的更改
5. **创建 PR** - 创建 Pull Request

## 许可证

MIT License
