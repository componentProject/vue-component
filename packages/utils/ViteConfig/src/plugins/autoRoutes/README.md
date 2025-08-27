# Auto Routes Plugin

这是一个Vite插件，用于自动生成Vue路由配置。

## 功能特性

- 自动扫描指定目录下的Vue文件，生成路由配置
- 支持嵌套路由，根据目录结构自动生成层级关系
- 支持热更新，当文件变化时自动更新路由
- 使用虚拟模块，无需额外文件生成
- 完全基于TypeScript，提供完整的类型定义和类型检查
- 路由生成逻辑分离到独立文件，便于维护和扩展

## 项目结构

- `index.ts`: 主插件文件，处理虚拟模块加载
- `routeGenerator.ts`: 包含路由生成的核心逻辑，使用TypeScript编写，提供类型安全
- `routeGenerator.d.ts`: 路由生成器的类型声明文件
- `index.d.ts`: 插件和虚拟模块的类型声明文件

## 使用方法

### 1. 在vite.config.ts中引入插件

```ts
import autoRoutes from './plugins/autoRoutes'

export default defineConfig({
  plugins: [
    // 其他插件...
    autoRoutes({
      routeConfig: {
        views: 'src/views/**/index.vue',
        examples: 'src/examples/**/index.vue',
        // 可以添加更多的路由配置，key为路由前缀，value为glob匹配规则
      },
    }),
  ],
  // 其他配置...
})
```

### 2. 在路由文件中使用虚拟模块

```ts
import autoRoutes from 'virtual:auto-routes'
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'layout',
    component: () => import('./layout.vue'),
    children: autoRoutes,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
```

## 配置说明

插件接收一个配置对象，其中：

- `routeConfig`: 路由配置对象
  - 键(key)：作为路由的前缀
  - 值(value)：作为glob匹配规则，必须基于根目录
- `virtualModuleId`: 可选，自定义虚拟模块ID，默认为 'virtual:auto-routes'

## 类型说明

插件提供了完整的TypeScript类型定义：

- `RouteModule`: 路由模块的类型定义
- `Component`: 组件的类型定义
- `FilesMap`: 文件映射对象的类型定义
- `AutoRoutesPluginConfig`: 插件配置的类型定义

## 实现原理

插件通过以下步骤工作：

1. 将路由生成逻辑使用TypeScript编写，提供类型安全
2. 在插件加载时，读取路由生成器文件的内容作为字符串
3. 处理字符串内容，移除TypeScript特有的类型注解，确保在运行时不会出现语法错误
4. 当虚拟模块被请求时，将处理后的路由生成逻辑与动态配置组合成完整的代码
5. 返回生成的代码作为虚拟模块的内容

这种方式使得路由生成逻辑既可以享受TypeScript带来的类型安全，又能在运行时作为JavaScript代码执行。

## 注意事项

- glob匹配规则必须基于项目根目录
- 虚拟模块导出的是JS，不包含TS类型声明
- 路径处理逻辑：从src后面一位到倒数第二位作为路径
- 组件名称取自组件的name属性或路径的最后一部分
