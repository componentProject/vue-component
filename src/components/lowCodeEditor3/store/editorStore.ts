/**
 * 低代码编辑器状态管理
 * 使用 Pinia 管理组件数据、选中状态和历史记录
 */
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash-es';
import type { ComponentData, HistoryItem, EditorState } from '../types';
import { getComponentDefinition } from '../constants/components';

/**
 * 低代码编辑器状态管理
 */
export const useEditorStore = defineStore('lowCodeEditor', {
  /**
   * 状态定义
   */
  state: (): EditorState => ({
    components: [],
    selectedId: null,
    hoveredId: null,
    history: [],
    historyIndex: -1,
    clipboardData: null,
    canvasSize: {
      width: 1200,
      height: 800,
    },
    showGrid: true,
    snapToGrid: true,
    gridSize: 10,
    zoom: 1,
  }),

  /**
   * 计算属性
   */
  getters: {
    /**
     * 获取选中的组件
     */
    selectedComponent: (state) => {
      try {
        return state.components.find((comp) => comp.id === state.selectedId) || null;
      } catch (error) {
        console.error(`获取选中组件失败: ${error}`);
        return null;
      }
    },

    /**
     * 获取悬停的组件
     */
    hoveredComponent: (state) => {
      try {
        return state.components.find((comp) => comp.id === state.hoveredId) || null;
      } catch (error) {
        console.error(`获取悬停组件失败: ${error}`);
        return null;
      }
    },

    /**
     * 是否可以撤销
     */
    canUndo: (state) => {
      return state.historyIndex > 0;
    },

    /**
     * 是否可以重做
     */
    canRedo: (state) => {
      return state.historyIndex < state.history.length - 1;
    },

    /**
     * 获取画布上所有组件的扁平列表
     */
    allComponentsFlat: (state) => {
      const result: ComponentData[] = [];
      
      /**
       * 递归扁平化组件树
       */
      const flattenComponents = (components: ComponentData[]) => {
        try {
          components.forEach((comp) => {
            result.push(comp);
            if (comp.children && comp.children.length > 0) {
              flattenComponents(comp.children);
            }
          });
        } catch (error) {
          console.error(`扁平化组件失败: ${error}`);
        }
      };

      flattenComponents(state.components);
      return result;
    },
  },

  /**
   * 操作方法
   */
  actions: {
    /**
     * 添加组件
     */
    addComponent(type: string, position: { x: number; y: number }) {
      try {
        const definition = getComponentDefinition(type);
        if (!definition) {
          console.error(`找不到组件定义: ${type}`);
          return;
        }

        const id = uuidv4();
        const newComponent: ComponentData = {
          id,
          type,
          name: definition.name,
          props: cloneDeep(definition.defaultProps),
          style: {
            width: 200,
            height: 100,
            left: position.x,
            top: position.y,
            zIndex: this.components.length + 1,
          },
          children: [],
        };

        // 添加组件并保存历史记录
        this.components.push(newComponent);
        this.selectedId = id;
        this.saveHistory();
        
        return id;
      } catch (error) {
        console.error(`添加组件失败: ${error}`);
      }
    },

    /**
     * 更新组件
     */
    updateComponent(id: string, updates: Partial<ComponentData>) {
      try {
        const component = this.components.find((comp) => comp.id === id);
        if (!component) {
          console.error(`找不到要更新的组件: ${id}`);
          return;
        }

        // 更新组件属性
        Object.assign(component, updates);
        this.saveHistory();
      } catch (error) {
        console.error(`更新组件失败: ${error}`);
      }
    },

    /**
     * 更新组件属性
     */
    updateComponentProps(id: string, props: Record<string, any>) {
      try {
        const component = this.components.find((comp) => comp.id === id);
        if (!component) {
          console.error(`找不到要更新属性的组件: ${id}`);
          return;
        }

        // 更新组件属性
        component.props = { ...component.props, ...props };
        this.saveHistory();
      } catch (error) {
        console.error(`更新组件属性失败: ${error}`);
      }
    },

    /**
     * 更新组件样式
     */
    updateComponentStyle(id: string, style: Partial<ComponentData['style']>) {
      try {
        const component = this.components.find((comp) => comp.id === id);
        if (!component) {
          console.error(`找不到要更新样式的组件: ${id}`);
          return;
        }

        // 更新组件样式
        component.style = { ...component.style, ...style };
        this.saveHistory();
      } catch (error) {
        console.error(`更新组件样式失败: ${error}`);
      }
    },

    /**
     * 删除组件
     */
    deleteComponent(id: string) {
      try {
        const index = this.components.findIndex((comp) => comp.id === id);
        if (index === -1) {
          console.error(`找不到要删除的组件: ${id}`);
          return;
        }

        // 删除组件并更新选中状态
        this.components.splice(index, 1);
        if (this.selectedId === id) {
          this.selectedId = null;
        }
        this.saveHistory();
      } catch (error) {
        console.error(`删除组件失败: ${error}`);
      }
    },

    /**
     * 选中组件
     */
    selectComponent(id: string | null) {
      try {
        this.selectedId = id;
      } catch (error) {
        console.error(`选择组件失败: ${error}`);
      }
    },

    /**
     * 悬停组件
     */
    hoverComponent(id: string | null) {
      try {
        this.hoveredId = id;
      } catch (error) {
        console.error(`悬停组件失败: ${error}`);
      }
    },

    /**
     * 复制组件
     */
    copyComponent(id: string) {
      try {
        const component = this.components.find((comp) => comp.id === id);
        if (!component) {
          console.error(`找不到要复制的组件: ${id}`);
          return;
        }

        // 复制组件到剪贴板
        this.clipboardData = cloneDeep(component);
      } catch (error) {
        console.error(`复制组件失败: ${error}`);
      }
    },

    /**
     * 粘贴组件
     */
    pasteComponent() {
      try {
        if (!this.clipboardData) {
          console.error('剪贴板为空，无法粘贴');
          return;
        }

        // 创建新组件，并调整位置
        const newComponent = cloneDeep(this.clipboardData);
        newComponent.id = uuidv4();
        newComponent.style.left += 20;
        newComponent.style.top += 20;
        newComponent.style.zIndex = this.components.length + 1;

        this.components.push(newComponent);
        this.selectedId = newComponent.id;
        this.saveHistory();
        
        return newComponent.id;
      } catch (error) {
        console.error(`粘贴组件失败: ${error}`);
      }
    },

    /**
     * 保存编辑历史
     */
    saveHistory() {
      try {
        // 移除当前状态之后的历史记录
        if (this.historyIndex < this.history.length - 1) {
          this.history.splice(this.historyIndex + 1);
        }

        // 添加新的历史记录
        const historyItem: HistoryItem = {
          components: cloneDeep(this.components),
          selectedId: this.selectedId,
        };

        this.history.push(historyItem);
        this.historyIndex = this.history.length - 1;

        // 控制历史记录最大数量，防止内存泄漏
        if (this.history.length > 50) {
          this.history.shift();
          this.historyIndex--;
        }
      } catch (error) {
        console.error(`保存历史记录失败: ${error}`);
      }
    },

    /**
     * 撤销操作
     */
    undo() {
      try {
        if (!this.canUndo) {
          return;
        }

        this.historyIndex--;
        const historyItem = this.history[this.historyIndex];
        this.components = cloneDeep(historyItem.components);
        this.selectedId = historyItem.selectedId;
      } catch (error) {
        console.error(`撤销操作失败: ${error}`);
      }
    },

    /**
     * 重做操作
     */
    redo() {
      try {
        if (!this.canRedo) {
          return;
        }

        this.historyIndex++;
        const historyItem = this.history[this.historyIndex];
        this.components = cloneDeep(historyItem.components);
        this.selectedId = historyItem.selectedId;
      } catch (error) {
        console.error(`重做操作失败: ${error}`);
      }
    },

    /**
     * 设置画布大小
     */
    setCanvasSize(width: number, height: number) {
      try {
        this.canvasSize = { width, height };
      } catch (error) {
        console.error(`设置画布大小失败: ${error}`);
      }
    },

    /**
     * 设置缩放比例
     */
    setZoom(zoom: number) {
      try {
        // 限制缩放范围
        this.zoom = Math.max(0.1, Math.min(2, zoom));
      } catch (error) {
        console.error(`设置缩放比例失败: ${error}`);
      }
    },

    /**
     * 切换网格显示
     */
    toggleGrid() {
      try {
        this.showGrid = !this.showGrid;
      } catch (error) {
        console.error(`切换网格显示失败: ${error}`);
      }
    },

    /**
     * 切换网格对齐
     */
    toggleSnapToGrid() {
      try {
        this.snapToGrid = !this.snapToGrid;
      } catch (error) {
        console.error(`切换网格对齐失败: ${error}`);
      }
    },

    /**
     * 导入组件 JSON
     */
    importFromJSON(schemaJson: string) {
      try {
        const schema = JSON.parse(schemaJson);
        if (!schema || !Array.isArray(schema.components)) {
          throw new Error('无效的 JSON 数据');
        }

        this.components = schema.components;
        if (schema.canvasSize) {
          this.canvasSize = schema.canvasSize;
        }

        this.selectedId = null;
        this.saveHistory();
      } catch (error) {
        console.error(`从 JSON 导入失败: ${error}`);
      }
    },

    /**
     * 导出组件为 JSON
     */
    exportToJSON() {
      try {
        const schema = {
          components: this.components,
          canvasSize: this.canvasSize,
        };
        return JSON.stringify(schema, null, 2);
      } catch (error) {
        console.error(`导出 JSON 失败: ${error}`);
        return '';
      }
    },

    /**
     * 初始化编辑器状态
     */
    init(config: { components?: ComponentData[]; canvasSize?: { width: number; height: number } }) {
      try {
        if (config.components) {
          this.components = cloneDeep(config.components);
        }
        if (config.canvasSize) {
          this.canvasSize = config.canvasSize;
        }
        this.saveHistory();
      } catch (error) {
        console.error(`初始化编辑器状态失败: ${error}`);
      }
    },

    /**
     * 清空画布
     */
    clearCanvas() {
      try {
        this.components = [];
        this.selectedId = null;
        this.hoveredId = null;
        this.saveHistory();
      } catch (error) {
        console.error(`清空画布失败: ${error}`);
      }
    },
  },
}); 