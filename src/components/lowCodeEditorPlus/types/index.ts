/**
 * Type definitions for the low-code editor component
 */

// Component type representing all available components in the palette
export interface ComponentDefinition {
  id: string;
  type: string;
  category: 'basic' | 'layout' | 'chart' | 'custom';
  name: string;
  icon?: string;
  defaultProps?: Record<string, any>;
  defaultStyle?: Record<string, any>;
  defaultEvents?: Record<string, any>;
  children?: ComponentInstance[];
}

// Instance of a component placed on the canvas
export interface ComponentInstance {
  id: string;
  type: string;
  name: string;
  props: Record<string, any>;
  style: Record<string, any>;
  events: Record<string, any>;
  children?: ComponentInstance[];
  parentId?: string;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  locked?: boolean;
}

// Editor state
export interface EditorState {
  components: ComponentInstance[];
  selectedComponentId: string | null;
  clipboard: ComponentInstance | null;
  history: {
    past: EditorSnapshot[];
    future: EditorSnapshot[];
  };
  canvasSize: {
    width: number;
    height: number;
  };
  viewMode: 'desktop' | 'tablet' | 'mobile';
  zoom: number;
}

// Snapshot of editor state for undo/redo
export interface EditorSnapshot {
  components: ComponentInstance[];
  selectedComponentId: string | null;
}

// Schema format for import/export
export interface EditorSchema {
  version: string;
  components: ComponentInstance[];
  canvasSize: {
    width: number;
    height: number;
  };
} 