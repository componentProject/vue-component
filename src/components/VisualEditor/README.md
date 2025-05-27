# Visual Low Code Editor (VisualEditor)

这是一个基于 Vue 3 Composition API 和 TypeScript 开发的可视化低代码编辑器模块。

## 目标

提供一套可扩展的组件和工具，用于构建用户友好的、可视化的Web应用程序搭建平台。

## 当前目录结构 (src/components/VisualEditor/)

-   `src/`: 模块的核心源代码。
    -   `EditorRoot.vue`: 编辑器的主入口Vue组件。
    -   `EditorRoot.stories.tsx`: Storybook的配置文件，用于展示和测试 `EditorRoot.vue`。
    -   `assets/`: 存放静态资源，如图片、图标等。
    -   `components/`: 存放编辑器特有的UI组件。
        -   `core/`: 编辑器核心功能组件。
            -   `EditorCanvas/`: 可视化编辑画布，用于拖拽、排列和配置组件。
            -   `Renderer/`: 组件渲染器，负责将页面描述（schema）渲染成实际的Vue组件。
        -   `panels/`: 编辑器的各种功能面板。
            -   `ComponentPanel/`: 展示可用物料组件的列表面板。
            -   `PropertyPanel/`: 用于配置选中组件属性的面板。
        -   `widgets/`: 基础物料组件（例如按钮、文本框、图片等），可以被拖拽到画布上。
    -   `composables/`: (原 `hooks/`) 存放Vue Composition API的可复用逻辑函数。
    -   `constants/`: 存放模块中使用的常量定义。
    -   `core_logic/`: 存放编辑器核心业务逻辑和数据管理。
        -   `DataManager/`: 管理编辑器的数据模型、API配置、页面schema等。
    -   `router/`: 如果编辑器内部需要复杂的页面导航，则存放Vue Router的配置。
    -   `services/`: 存放与后端API交互的服务，或处理复杂的前端业务逻辑（如导入导出、历史记录等）。
    -   `store/`: (原 `stores/`) 存放Pinia状态管理的相关文件，用于管理编辑器的全局状态。
    -   `types/`: 存放TypeScript的类型定义文件。
    -   `utils/`: 存放通用的工具函数。
    -   `views/`: 存放更大型的、组合了多个组件的"视图"或"页面"级别的组件。
-   `README.md`: 当前这个说明文件。

## 如何使用

(待补充：这里将来会详细说明如何集成和使用这个编辑器模块)

## 主要技术栈

-   Vue 3 (Composition API, `<script setup>`)
-   TypeScript
-   Pinia (状态管理)
-   TailwindCSS (CSS框架 - 假设)
-   pnpm (包管理 - 假设)

## 后续规划

-   完善基础物料组件库。
-   实现组件的拖拽、缩放、对齐等交互功能。
-   实现属性编辑器的动态生成。
-   支持数据绑定和事件绑定。
-   集成版本控制和历史记录功能。
-   优化性能和用户体验。 