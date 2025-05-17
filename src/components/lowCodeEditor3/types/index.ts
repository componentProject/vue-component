/**
 * 低代码编辑器类型定义文件
 * 包含组件定义、画布组件、编辑器状态等接口
 */

/**
 * 组件基础属性接口
 */
export interface ComponentProps {
  id: string;
  type: string;
  name: string;
  [key: string]: any;
}

/**
 * 组件定义接口
 */
export interface ComponentDefinition {
  type: string;
  name: string;
  icon?: string;
  category: 'basic' | 'layout' | 'chart';
  defaultProps: Record<string, any>;
  propSchema: PropSchema[];
  isContainer?: boolean;
  allowedChildren?: string[];
  validateChildren?: (children: ComponentData[]) => boolean;
}

/**
 * 属性模式接口
 */
export interface PropSchema {
  name: string;
  label: string;
  type: 'text' | 'number' | 'color' | 'select' | 'switch' | 'slider' | 'radio' | 'datePicker';
  default?: any;
  options?: Array<{
    label: string;
    value: any;
  }>;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  validator?: (value: any) => boolean;
}

/**
 * 组件数据接口
 */
export interface ComponentData {
  id: string;
  type: string;
  name: string;
  props: Record<string, any>;
  children?: ComponentData[];
  parent?: string;
  style: {
    width: number;
    height: number;
    left: number;
    top: number;
    zIndex: number;
    [key: string]: any;
  };
}

/**
 * 画布组件接口
 */
export interface CanvasComponent extends ComponentData {
  selected: boolean;
  hovered: boolean;
}

/**
 * 历史记录操作接口
 */
export interface HistoryItem {
  components: ComponentData[];
  selectedId: string | null;
}

/**
 * 编辑器状态接口
 */
export interface EditorState {
  components: ComponentData[];
  selectedId: string | null;
  hoveredId: string | null;
  history: HistoryItem[];
  historyIndex: number;
  clipboardData: ComponentData | null;
  canvasSize: {
    width: number;
    height: number;
  };
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  zoom: number;
}

/**
 * 低代码编辑器配置接口
 */
export interface LowCodeEditorConfig {
  initialComponents?: ComponentData[];
  customComponents?: ComponentDefinition[];
  canvasSize?: {
    width: number;
    height: number;
  };
}

/**
 * 拖拽事件接口
 */
export interface DragEvent {
  clientX: number;
  clientY: number;
  target: HTMLElement;
  preventDefault: () => void;
  stopPropagation: () => void;
}

/**
 * JSON模式导入/导出接口
 */
export interface EditorSchema {
  components: ComponentData[];
  canvasSize: {
    width: number;
    height: number;
  };
} 