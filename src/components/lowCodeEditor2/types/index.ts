/**
 * 基础组件定义
 * 定义低代码编辑器中可使用的组件结构
 */
export interface ComponentDefinition {
  /**
   * 组件唯一标识符
   */
  id: string;
  
  /**
   * 组件显示名称
   */
  name: string;
  
  /**
   * 组件类型/分类
   */
  type: 'basic' | 'layout' | 'chart';
  
  /**
   * 组件图标（Element Plus）
   */
  icon: string;
  
  /**
   * 组件默认属性
   */
  defaultProps: Record<string, any>;
  
  /**
   * 组件配置模式
   */
  propsSchema: PropSchema[];
  
  /**
   * 组件渲染函数
   */
  component: any;
  
  /**
   * 是否允许包含子组件（布局组件需要）
   */
  allowChildren?: boolean;
  
  /**
   * 允许的子组件类型（限制容器内可放置的组件）
   */
  allowedChildTypes?: Array<'basic' | 'layout' | 'chart'>;
  
  /**
   * 组件初始大小
   */
  initialSize?: {
    width: number;
    height: number;
  };
}

/**
 * 属性模式定义
 * 定义属性在编辑器中的渲染方式
 */
export interface PropSchema {
  /**
   * 属性名称
   */
  name: string;
  
  /**
   * 属性标签
   */
  label: string;
  
  /**
   * 属性类型
   */
  type: 'string' | 'number' | 'boolean' | 'select' | 'color' | 'slider' | 'date' | 'array' | 'object' | 'icon' | 'event';
  
  /**
   * 默认值
   */
  default?: any;
  
  /**
   * 选择类型的选项
   */
  options?: Array<{ label: string; value: any }>;
  
  /**
   * 数字/滑块类型的最小值
   */
  min?: number;
  
  /**
   * 数字/滑块类型的最大值
   */
  max?: number;
  
  /**
   * 属性分组（用于组织属性）
   */
  group?: 'basic' | 'style' | 'advanced' | 'event' | 'data';
  
  /**
   * 条件显示表达式
   */
  visibleIf?: {
    field: string;
    value: any;
  };
  
  /**
   * 自定义验证规则
   */
  validator?: (value: any) => boolean | string;
}

/**
 * 画布上的组件实例
 */
export interface CanvasComponent {
  /**
   * 实例唯一ID
   */
  id: string;
  
  /**
   * 组件定义ID引用
   */
  componentId: string;
  
  /**
   * 组件属性
   */
  props: Record<string, any>;
  
  /**
   * 组件样式
   */
  style: {
    top: number;
    left: number;
    width: number;
    height: number;
    zIndex: number;
    [key: string]: any;
  };
  
  /**
   * 子组件（用于容器组件）
   */
  children?: CanvasComponent[];
  
  /**
   * 父组件ID（用于组件树）
   */
  parentId?: string | null;
  
  /**
   * 组件事件绑定
   */
  events?: Record<string, string>;
  
  /**
   * 数据源配置
   */
  dataSource?: {
    type: 'static' | 'api' | 'variable';
    value?: any;
    apiUrl?: string;
    variableName?: string;
    refreshInterval?: number;
  };
}

/**
 * 编辑器状态表示
 */
export interface EditorState {
  /**
   * 所有可用组件定义
   */
  componentDefinitions: ComponentDefinition[];
  
  /**
   * 画布上的组件
   */
  canvasComponents: CanvasComponent[];
  
  /**
   * 当前选中的组件ID
   */
  selectedComponentIds: string[];
  
  /**
   * 画布配置
   */
  canvas: {
    width: number;
    height: number;
    scale: number;
    showGrid: boolean;
    snapToGrid: boolean;
    gridSize: number;
    background: string;
  };
  
  /**
   * 历史记录（用于撤销/重做）
   */
  history: {
    past: EditorStateSnapshot[];
    future: EditorStateSnapshot[];
    maxLength: number;
  };
  
  /**
   * 当前操作模式
   */
  mode: 'edit' | 'preview';
}

/**
 * 编辑器状态快照（用于历史记录）
 */
export type EditorStateSnapshot = Omit<EditorState, 'history'>;

/**
 * 页面导出/导入的JSON模式
 */
export interface PageSchema {
  /**
   * 页面名称
   */
  name: string;
  
  /**
   * 页面描述
   */
  description?: string;
  
  /**
   * 画布组件
   */
  components: CanvasComponent[];
  
  /**
   * 画布配置
   */
  canvas: {
    width: number;
    height: number;
    background: string;
  };
  
  /**
   * 版本号
   */
  version: string;
  
  /**
   * 创建时间
   */
  createdAt: string;
  
  /**
   * 最后修改时间
   */
  updatedAt: string;
}

/**
 * 图表组件配置
 */
export interface ChartComponentConfig {
  /**
   * 图表类型
   */
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'radar' | 'funnel';
  
  /**
   * 数据配置
   */
  dataConfig: {
    /**
     * 数据源类型
     */
    sourceType: 'static' | 'api' | 'variable';
    
    /**
     * 静态数据
     */
    staticData?: any[];
    
    /**
     * API地址
     */
    apiUrl?: string;
    
    /**
     * 变量名称
     */
    variableName?: string;
    
    /**
     * 数据映射
     */
    mapping: {
      x?: string;
      y?: string;
      series?: string;
      value?: string;
    };
  };
  
  /**
   * 图表选项
   */
  options: Record<string, any>;
}

/**
 * 组件对齐指南线
 */
export interface AlignmentGuide {
  /**
   * 指南线位置
   */
  position: number;
  
  /**
   * 指南线类型（水平/垂直）
   */
  type: 'horizontal' | 'vertical';
  
  /**
   * 指南线颜色
   */
  color: string;
}

/**
 * 网格配置
 */
export interface GridConfig {
  /**
   * 是否启用网格
   */
  enabled: boolean;
  
  /**
   * 网格大小
   */
  size: number;
  
  /**
   * 网格颜色
   */
  color: string;
  
  /**
   * 网格线宽度
   */
  lineWidth: number;
}

/**
 * 拖拽事件参数
 */
export interface DragEventParams {
  /**
   * 组件ID
   */
  componentId: string;
  
  /**
   * 起始位置
   */
  startPosition: { x: number; y: number };
  
  /**
   * 当前位置
   */
  currentPosition: { x: number; y: number };
  
  /**
   * 偏移量
   */
  offset: { x: number; y: number };
  
  /**
   * 原生事件对象
   */
  event: MouseEvent | TouchEvent;
}

/**
 * 调整大小事件参数
 */
export interface ResizeEventParams {
  /**
   * 组件ID
   */
  componentId: string;
  
  /**
   * 起始尺寸
   */
  startSize: { width: number; height: number };
  
  /**
   * 当前尺寸
   */
  currentSize: { width: number; height: number };
  
  /**
   * 原生事件对象
   */
  event: MouseEvent | TouchEvent;
  
  /**
   * 调整方向
   */
  direction: 'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * 快捷键配置
 */
export interface KeyboardShortcut {
  /**
   * 按键组合（如 'ctrl+c'）
   */
  key: string;
  
  /**
   * 执行的操作
   */
  action: () => void;
  
  /**
   * 操作描述
   */
  description: string;
}

/**
 * 画布缩放级别配置
 */
export interface ZoomLevel {
  /**
   * 缩放值
   */
  value: number;
  
  /**
   * 显示标签
   */
  label: string;
} 