## ✨ 特性

- 🔥 **最新技术栈**：Vue3 + TypeScript + Vite4 + Element Plus
- 📦 **开箱即用**：丰富的业务组件，覆盖大部分使用场景
- 🛠️ **按需引入**：支持tree-shaking，按需加载，减小包体积
- 🎨 **主题定制**：支持主题定制，满足个性化需求
- 📖 **TypeScript**：完整的类型定义文件
- 📱 **响应式**：支持响应式设计
- ⚡ **高性能**：优化组件性能，提升用户体验

## 📦 安装

```bash
# npm
npm install @moluoxixi/想用的组件名小写

# yarn  
yarn add @moluoxixi/想用的组件名小写

# pnpm
pnpm add @moluoxixi/想用的组件名小写
```

## 🔨 使用

```ts
// main.ts
import 组件名 from '@moluoxixi/想用的组件名小写'
```

示例：新壳子子应用使用
```ts
// main.ts
import App from './App.vue'
import * as vue from 'vue'
let app


async function render(props) {
  app = createApp(App)
  //组件库全局引入(主应用下发方式)
  await props.fn?.globalComponents?.(vue, app)
  //组件库全局引入(window挂载方式)
  await window?.$globalLoad?.(vue, app)
}

```