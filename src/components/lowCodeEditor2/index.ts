import LowCodeEditor from './LowCodeEditor.vue';
import type { 
  ComponentDefinition, 
  CanvasComponent, 
  EditorState, 
  PageSchema 
} from './types';
import { useEditorStore } from './store/editorStore';

/**
 * 导出低代码编辑器组件和相关类型
 */
export { 
  LowCodeEditor,
  useEditorStore,
};

/**
 * 导出类型定义
 */
export type {
  ComponentDefinition,
  CanvasComponent,
  EditorState,
  PageSchema
}; 