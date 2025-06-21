# Vue低代码编辑器组件

> **注意：** 当前所有组件文件都添加了 `.test` 后缀，表示这些文件还未正式启用，处于测试开发阶段。在正式启用前，请勿直接引用这些组件。

## 项目结构

每个文件仅存描述注释，其余内容都不要
src/components/lowCodeEditor/
ComponentPanel/ # 左侧组件面板
ComponentCategory/ # 组件分类
ComponentSearch/ # 组件搜索
─ DraggableComponent/ # 可拖拽组件
ComponentPreview/ # 组件预览
EditorCanvas/ # 中间编辑区域
GridCanvas/ # 网格画布
ComponentContainer/ # 组件容器
DragHelper/ # 拖拽辅助
SelectionManager/ # 选择管理
AlignmentGuides/ # 对齐辅助
ContextMenu/ # 右键菜单
CanvasToolbar/ # 画布工具栏
PropertyPanel/ # 右侧属性编辑面板
PropertyForm/ # 属性表单
StyleEditor/ # 样式编辑器
EventEditor/ # 事件编辑器
DataBindingPanel/ # 数据绑定面板
TemplateManager/ # 模板管理
Renderer/ # 组件渲染器
ComponentRenderer/ # 组件渲染核心
ContainerRenderer/ # 容器渲染
ChartRenderer/ # 图表渲染
FormRenderer/ # 表单渲染
DataManager/ # 数据管理
DataModeler/ # 数据模型设计
ApiConfigurator/ # API配置
MockDataGenerator/ # Mock数据生成
DataTransformer/ # 数据转换
types/ # 类型定义
component.ts # 组件类型
schema.ts # Schema类型
editor.ts # 编辑器类型
data.ts # 数据类型
constants/ # 常量定义
hooks/ # 自定义hooks
useDrag.ts # 拖拽hook
useComponentRenderer.ts # 渲染hook
usePropertyEditor.ts # 属性编辑hook
useHistory.ts # 历史记录hook
utils/ # 工具函数
schemaUtils.ts # Schema工具
styleUtils.ts # 样式工具
eventUtils.ts # 事件工具
exportUtils.ts # 导出工具
stores/ # Pinia状态管理
components.ts # 组件store
editor.ts # 编辑器store
history.ts # 历史记录store
data.ts # 数据store
settings.ts # 设置store
services/ # 服务
renderService.ts # 渲染服务
exportService.ts # 导出服务
importService.ts # 导入服务
historyService.ts # 历史记录服务
