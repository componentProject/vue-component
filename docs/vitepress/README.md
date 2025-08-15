# Moluoxixi Vue组件库 - 文档项目

这是 Moluoxixi Vue组件库的文档项目，基于 VitePress 构建。

## 🚀 快速开始

### 安装依赖

```bash
cd .docs
pnpm install
```

### 启动开发服务器

```bash
pnpm run dev
```

### 构建文档

```bash
pnpm run build
```

### 预览构建结果

```bash
pnpm run preview
```

## 📁 项目结构

```
.docs/
├── .vitepress/          # VitePress 配置
│   ├── config.ts        # 主配置文件
│   ├── utils/           # 工具函数
│   │   └── generateSidebar.ts  # 自动生成侧边栏
│   ├── scripts/         # 脚本文件
│   │   └── generateComponentDocs.ts  # 生成组件文档
│   └── theme/           # 主题配置
├── components/          # 组件文档
│   ├── index.md         # 组件总览
│   ├── ConfigTable.md   # 配置化表格文档
│   ├── ConfigForm.md    # 配置化表单文档
│   └── ...              # 其他组件文档
├── guide/              # 指南文档
│   ├── index.md        # 简介
│   ├── installation.md # 安装指南
│   ├── quickstart.md   # 快速开始
│   ├── resolver.md     # 按需引入
│   └── changelog.md    # 更新日志
├── public/             # 静态资源
├── index.md            # 文档首页
├── package.json        # 项目配置
└── tsconfig.json       # TypeScript 配置
```

## ✨ 特性

### 自动化功能

1. **自动生成侧边栏** - 通过扫描 `packages/components` 目录自动生成组件导航
2. **自动生成组件文档** - 为每个组件自动生成基础文档模板
3. **智能分类** - 根据组件名称自动分类到不同的组件类别

### 配置特点

- 🔄 **动态配置** - 基于文件系统自动生成导航和侧边栏
- 🎨 **主题定制** - 支持深色模式和主题自定义
- 📱 **响应式设计** - 完美适配各种设备
- 🔍 **本地搜索** - 内置搜索功能
- 📖 **代码高亮** - 支持多种语言的代码高亮

## 🛠️ 维护指南

### 添加新组件文档

1. 在 `packages/components` 中添加新组件
2. 重启开发服务器，侧边栏会自动更新
3. 在 `.docs/components/` 中创建对应的 `.md` 文件
4. 或者运行脚本自动生成文档模板：

```bash
tsx .vitepress/scripts/generateComponentDocs.ts
```

### 更新组件分类

编辑 `.docs/.vitepress/utils/generateSidebar.ts` 中的 `categorizeComponent` 函数：

```ts
function categorizeComponent(name: string): string {
  const basicComponents = ['Icon', 'Watermark', 'Splitter']
  const formComponents = ['Select', 'DateRangePicker', 'ConfigForm']
  // ... 其他分类
  
  if (basicComponents.includes(name)) return '基础组件'
  if (formComponents.includes(name)) return '表单组件'
  // ... 其他判断逻辑
  
  return '其他组件'
}
```

### 自定义主题

主题配置位于 `.docs/.vitepress/theme/` 目录下，可以：

- 修改 `index.ts` 添加全局组件或插件
- 在 `styles/` 目录下添加自定义样式
- 创建自定义组件

## 📝 文档编写规范

### 组件文档模板

每个组件文档应包含以下部分：

```markdown
# 组件名称

组件描述

## 基础用法

基础使用示例

## API

### Props
### Events  
### Slots
### Expose

### 源码

源码链接
```

### Markdown 增强

支持以下 Markdown 增强功能：

- 代码组 (`::: code-group`)
- 提示框 (`::: tip`, `::: warning`, `::: danger`)
- 代码高亮行号
- Vue 组件演示

## 🚀 部署

### GitHub Pages

1. 配置 `.docs/.vitepress/config.ts` 中的 `base` 选项
2. 运行 `pnpm run build` 构建文档
3. 将 `.docs/.vitepress/dist` 目录部署到 GitHub Pages

### Vercel/Netlify

1. 连接 GitHub 仓库
2. 设置构建命令：`cd .docs && pnpm install && pnpm run build`
3. 设置输出目录：`.docs/.vitepress/dist`

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进文档！

### 贡献指南

1. Fork 仓库
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源。