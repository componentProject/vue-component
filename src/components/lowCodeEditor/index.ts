import LowCodeEditor from './LowCodeEditor.vue';
import { useEditorStore } from './store/editor';
import type { ComponentDefinition, CanvasComponent, EditorState } from './types';

/**
 * Export the low-code editor component and its store
 */
export {
  LowCodeEditor,
  useEditorStore
};

// Export types
export type {
  ComponentDefinition,
  CanvasComponent,
  EditorState
};

export default LowCodeEditor; 