/**
 * 组件类型定义文件
 * 定义低代码编辑器中使用的类型接口
 */

/**
 * 组件类型枚举
 * 定义支持的组件类型分类
 */
export enum ComponentCategory {
  BASIC = 'basic',
  LAYOUT = 'layout',
  CHART = 'chart'
}

/**
 * 组件定义接口
 * 描述每个可用组件的元数据
 */
export interface ComponentDefinition {
  type: string;                // 组件类型标识
  category: ComponentCategory; // 组件分类
  name: string;                // 组件显示名称
  icon?: string;               // 组件图标
  defaultProps?: Record<string, any>; // 组件默认属性
  slots?: ComponentSlot[];     // 组件插槽配置
  isContainer?: boolean;       // 是否为容器组件
  rules?: ComponentRules;      // 组件嵌套规则
}

/**
 * 组件插槽定义
 */
export interface ComponentSlot {
  name: string;                // 插槽名称
  allowedComponents?: string[]; // 允许放置的组件类型
}

/**
 * 组件规则定义
 */
export interface ComponentRules {
  allowedParentComponents?: string[]; // 允许作为父组件的组件类型
  requiredParentComponents?: string[]; // 必须拥有的父组件类型
  maxChildren?: number;       // 最大子组件数量
}

/**
 * 页面中的组件实例
 */
export interface Component {
  id: string;                  // 组件唯一ID
  type: string;                // 组件类型
  props: Record<string, any>;  // 组件属性
  style?: Record<string, any>; // 组件样式
  children?: Component[];      // 子组件
  parentId?: string;           // 父组件ID
  slots?: Record<string, Component[]>; // 各插槽中的组件
}

/**
 * 拖拽组件事件数据
 */
export interface DragComponentEvent {
  componentType: string;       // 被拖拽的组件类型
  componentData?: ComponentDefinition; // 组件定义数据
}

/**
 * 位置信息
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * 尺寸信息
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * 组件选择状态
 */
export interface SelectionState {
  componentId: string | null;
  isSelected: boolean;
}

/**
 * 编辑器状态
 */
export interface EditorState {
  components: Component[];
  selectedComponentId: string | null;
  clipboard: Component | null;
  history: {
    past: Component[][],
    future: Component[][]
  };
}

/**
 * JSON Schema导出格式
 */
export interface SchemaExport {
  version: string;
  components: Component[];
  metadata?: Record<string, any>;
} 