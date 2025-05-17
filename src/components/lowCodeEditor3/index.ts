/**
 * 低代码编辑器模块导出文件
 */
import LowCodeEditor from './LowCodeEditor.vue';
import { ALL_COMPONENTS, getComponentDefinition } from './constants/components';
import type { ComponentData, ComponentDefinition, LowCodeEditorConfig, EditorSchema } from './types';

/**
 * 导出主组件
 */
export { LowCodeEditor };

/**
 * 导出类型
 */
export type { ComponentData, ComponentDefinition, LowCodeEditorConfig, EditorSchema };

/**
 * 导出常量
 */
export { ALL_COMPONENTS, getComponentDefinition };

/**
 * 默认导出主组件
 */
export default LowCodeEditor; 