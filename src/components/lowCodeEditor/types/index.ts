/**
 * Base component type definition
 * Defines the structure of components that can be used in the low-code editor
 */
export interface ComponentDefinition {
  /**
   * Unique identifier for the component
   */
  id: string;
  
  /**
   * Component name for display
   */
  name: string;
  
  /**
   * Component type/category
   */
  type: 'basic' | 'layout' | 'chart';
  
  /**
   * Component icon from Element Plus
   */
  icon: string;
  
  /**
   * Default props for the component
   */
  defaultProps: Record<string, any>;
  
  /**
   * Component configuration schema
   */
  propsSchema: PropSchema[];
  
  /**
   * Component render function
   */
  component: any;
}

/**
 * Property schema definition
 * Defines how a property should be rendered in the editor
 */
export interface PropSchema {
  /**
   * Property name
   */
  name: string;
  
  /**
   * Property label
   */
  label: string;
  
  /**
   * Property type
   */
  type: 'string' | 'number' | 'boolean' | 'select' | 'color' | 'slider' | 'date';
  
  /**
   * Default value
   */
  default?: any;
  
  /**
   * Options for select type
   */
  options?: Array<{ label: string; value: any }>;
  
  /**
   * Min value for number/slider type
   */
  min?: number;
  
  /**
   * Max value for number/slider type
   */
  max?: number;
  
  /**
   * Group for organizing properties
   */
  group?: string;
}

/**
 * Component instance on the canvas
 */
export interface CanvasComponent {
  /**
   * Unique instance ID
   */
  id: string;
  
  /**
   * Reference to component definition ID
   */
  componentId: string;
  
  /**
   * Component properties
   */
  props: Record<string, any>;
  
  /**
   * Component style
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
   * Child components (for container components)
   */
  children?: CanvasComponent[];
}

/**
 * Editor state representation
 */
export interface EditorState {
  /**
   * All available component definitions
   */
  componentDefinitions: ComponentDefinition[];
  
  /**
   * Components on the canvas
   */
  canvasComponents: CanvasComponent[];
  
  /**
   * Currently selected component ID
   */
  selectedComponentId: string | null;
  
  /**
   * Canvas configuration
   */
  canvas: {
    width: number;
    height: number;
    scale: number;
    showGrid: boolean;
  };
  
  /**
   * History for undo/redo
   */
  history: {
    past: EditorStateSnapshot[];
    future: EditorStateSnapshot[];
  };
}

/**
 * Editor state snapshot for history
 */
export type EditorStateSnapshot = Omit<EditorState, 'history'>;

/**
 * JSON schema for page export/import
 */
export interface PageSchema {
  /**
   * Page name
   */
  name: string;
  
  /**
   * Page description
   */
  description?: string;
  
  /**
   * Canvas components
   */
  components: CanvasComponent[];
  
  /**
   * Canvas configuration
   */
  canvas: {
    width: number;
    height: number;
  };
  
  /**
   * Schema version
   */
  version: string;
} 