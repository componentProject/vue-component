import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { nanoid } from 'nanoid';
import type { 
  EditorState, 
  CanvasComponent, 
  ComponentDefinition, 
  EditorStateSnapshot, 
  PageSchema 
} from '../types';
import { ALL_COMPONENTS } from '../constants/components';

/**
 * 低代码编辑器状态管理
 * 使用Pinia进行状态管理，包含组件的增删改查和画布操作
 */
export const useEditorStore = defineStore('lowCodeEditor2', () => {
  /**
   * 编辑器状态
   */
  const state = ref<EditorState>({
    componentDefinitions: ALL_COMPONENTS,
    canvasComponents: [],
    selectedComponentIds: [],
    canvas: {
      width: 1200,
      height: 800,
      scale: 1,
      showGrid: true,
      snapToGrid: true,
      gridSize: 10,
      background: '#f5f5f5',
    },
    history: {
      past: [],
      future: [],
      maxLength: 20,
    },
    mode: 'edit',
  });

  /**
   * 添加历史记录快照
   * 用于实现撤销/重做功能
   */
  const addHistorySnapshot = () => {
    try {
      // 创建当前状态的快照（不包括history属性）
      const snapshot: EditorStateSnapshot = {
        componentDefinitions: state.value.componentDefinitions,
        canvasComponents: JSON.parse(JSON.stringify(state.value.canvasComponents)),
        selectedComponentIds: [...state.value.selectedComponentIds],
        canvas: { ...state.value.canvas },
        mode: state.value.mode,
      };

      // 添加到历史记录
      state.value.history.past.push(snapshot);

      // 清空future记录（因为进行了新操作）
      state.value.history.future = [];

      // 如果历史记录超过最大长度，则移除最早的记录
      if (state.value.history.past.length > state.value.history.maxLength) {
        state.value.history.past.shift();
      }
    } catch (error) {
      console.error('添加历史记录快照失败:', error);
    }
  };

  /**
   * 撤销操作
   * 回到上一个历史状态
   */
  const undo = () => {
    try {
      if (state.value.history.past.length === 0) {
        return;
      }

      // 保存当前状态到future用于重做
      const currentSnapshot: EditorStateSnapshot = {
        componentDefinitions: state.value.componentDefinitions,
        canvasComponents: JSON.parse(JSON.stringify(state.value.canvasComponents)),
        selectedComponentIds: [...state.value.selectedComponentIds],
        canvas: { ...state.value.canvas },
        mode: state.value.mode,
      };
      state.value.history.future.push(currentSnapshot);

      // 获取上一个状态
      const previousSnapshot = state.value.history.past.pop();
      if (previousSnapshot) {
        // 恢复到上一个状态
        state.value.canvasComponents = previousSnapshot.canvasComponents;
        state.value.selectedComponentIds = previousSnapshot.selectedComponentIds;
        state.value.canvas = previousSnapshot.canvas;
        state.value.mode = previousSnapshot.mode;
      }
    } catch (error) {
      console.error('撤销操作失败:', error);
    }
  };

  /**
   * 重做操作
   * 恢复到下一个历史状态
   */
  const redo = () => {
    try {
      if (state.value.history.future.length === 0) {
        return;
      }

      // 保存当前状态到past用于撤销
      const currentSnapshot: EditorStateSnapshot = {
        componentDefinitions: state.value.componentDefinitions,
        canvasComponents: JSON.parse(JSON.stringify(state.value.canvasComponents)),
        selectedComponentIds: [...state.value.selectedComponentIds],
        canvas: { ...state.value.canvas },
        mode: state.value.mode,
      };
      state.value.history.past.push(currentSnapshot);

      // 获取下一个状态
      const nextSnapshot = state.value.history.future.pop();
      if (nextSnapshot) {
        // 恢复到下一个状态
        state.value.canvasComponents = nextSnapshot.canvasComponents;
        state.value.selectedComponentIds = nextSnapshot.selectedComponentIds;
        state.value.canvas = nextSnapshot.canvas;
        state.value.mode = nextSnapshot.mode;
      }
    } catch (error) {
      console.error('重做操作失败:', error);
    }
  };

  /**
   * 获取组件定义
   */
  const getComponentDefinition = (id: string): ComponentDefinition | undefined => {
    try {
      return state.value.componentDefinitions.find(comp => comp.id === id);
    } catch (error) {
      console.error('获取组件定义失败:', error);
      return undefined;
    }
  };

  /**
   * 添加画布组件
   * 在画布上添加新组件
   */
  const addCanvasComponent = (
    componentId: string, 
    position: { left: number; top: number }, 
    parentId?: string
  ) => {
    try {
      const componentDef = getComponentDefinition(componentId);
      if (!componentDef) {
        console.error(`未找到组件定义: ${componentId}`);
        return null;
      }

      // 创建组件实例
      const id = nanoid();
      const newComponent: CanvasComponent = {
        id,
        componentId,
        props: { ...componentDef.defaultProps },
        style: {
          top: position.top,
          left: position.left,
          width: componentDef.initialSize?.width || 100,
          height: componentDef.initialSize?.height || 40,
          zIndex: state.value.canvasComponents.length + 1,
        },
        parentId: parentId || null,
      };

      // 如果是布局组件，添加空的children数组
      if (componentDef.allowChildren) {
        newComponent.children = [];
      }

      if (parentId) {
        // 添加到父组件的children中
        const parentIndex = state.value.canvasComponents.findIndex(c => c.id === parentId);
        if (parentIndex !== -1) {
          // 安全检查：确保父组件有children数组
          if (!state.value.canvasComponents[parentIndex].children) {
            state.value.canvasComponents[parentIndex].children = [];
          }
          
          // 防止对null引用，先确认children存在
          const parentChildren = state.value.canvasComponents[parentIndex].children;
          if (parentChildren) {
            parentChildren.push(newComponent);
          } else {
            // 如果children数组仍然不存在，添加到根级别
            console.warn(`父组件 ${parentId} 的children数组无法访问，组件将添加到根级别`);
            state.value.canvasComponents.push(newComponent);
          }
        } else {
          // 如果找不到父组件，则添加到根级别
          console.warn(`未找到父组件 ${parentId}，组件将添加到根级别`);
          state.value.canvasComponents.push(newComponent);
        }
      } else {
        // 添加到根级别
        state.value.canvasComponents.push(newComponent);
      }

      // 选中新添加的组件
      state.value.selectedComponentIds = [id];

      // 添加历史记录
      addHistorySnapshot();
      
      return newComponent;
    } catch (error) {
      console.error('添加画布组件失败:', error);
      return null;
    }
  };

  /**
   * 查找组件（递归搜索）
   */
  const findComponent = (
    id: string, 
    components: CanvasComponent[] = state.value.canvasComponents
  ): { component: CanvasComponent | null; parent: CanvasComponent | null; index: number } => {
    try {
      for (let i = 0; i < components.length; i++) {
        if (components[i].id === id) {
          return {
            component: components[i],
            parent: null,
            index: i,
          };
        }

        if (components[i].children?.length) {
          const result = findComponent(id, components[i].children);
          if (result.component) {
            return {
              ...result,
              parent: result.parent || components[i],
            };
          }
        }
      }
    } catch (error) {
      console.error('查找组件失败:', error);
    }

    return { component: null, parent: null, index: -1 };
  };

  /**
   * 更新组件属性
   */
  const updateComponentProps = (id: string, props: Record<string, any>) => {
    try {
      const { component } = findComponent(id);
      if (component) {
        component.props = { ...component.props, ...props };
        addHistorySnapshot();
      }
    } catch (error) {
      console.error('更新组件属性失败:', error);
    }
  };

  /**
   * 更新组件样式
   */
  const updateComponentStyle = (id: string, style: Partial<CanvasComponent['style']>) => {
    try {
      const { component } = findComponent(id);
      if (component) {
        component.style = { ...component.style, ...style };
        addHistorySnapshot();
      }
    } catch (error) {
      console.error('更新组件样式失败:', error);
    }
  };

  /**
   * 选择组件
   */
  const selectComponent = (id: string | null, isMultiSelect = false) => {
    try {
      if (id === undefined) return; // 防止undefined传入
      
      if (!id) {
        // 安全地清空选择
        try {
          state.value.selectedComponentIds = [];
        } catch (error) {
          console.error('清空组件选择失败:', error);
        }
        return;
      }

      // 检查组件是否存在
      const { component } = findComponent(id);
      if (!component) {
        console.warn(`尝试选择不存在的组件: ${id}`);
        return;
      }

      if (isMultiSelect) {
        // 多选模式
        if (state.value.selectedComponentIds.includes(id)) {
          // 如果已经选中，则取消选中
          try {
            state.value.selectedComponentIds = state.value.selectedComponentIds.filter(
              selectedId => selectedId !== id
            );
          } catch (error) {
            console.error('取消选择组件失败:', error);
          }
        } else {
          // 添加到选中列表
          try {
            state.value.selectedComponentIds.push(id);
          } catch (error) {
            console.error('添加组件到选中列表失败:', error);
          }
        }
      } else {
        // 单选模式
        try {
          state.value.selectedComponentIds = [id];
        } catch (error) {
          console.error('设置选中组件失败:', error);
        }
      }
    } catch (error) {
      console.error('选择组件失败:', error);
      // 出现异常时尝试清空选择，避免不一致状态
      try {
        state.value.selectedComponentIds = [];
      } catch (secondaryError) {
        console.error('尝试清空选择失败:', secondaryError);
      }
    }
  };

  /**
   * 移动组件位置
   */
  const moveComponent = (id: string, position: { left: number; top: number }) => {
    try {
      const { component } = findComponent(id);
      if (component) {
        component.style.left = position.left;
        component.style.top = position.top;
        addHistorySnapshot();
      }
    } catch (error) {
      console.error('移动组件位置失败:', error);
    }
  };

  /**
   * 调整组件大小
   */
  const resizeComponent = (id: string, size: { width: number; height: number }) => {
    try {
      const { component } = findComponent(id);
      if (component) {
        component.style.width = size.width;
        component.style.height = size.height;
        addHistorySnapshot();
      }
    } catch (error) {
      console.error('调整组件大小失败:', error);
    }
  };

  /**
   * 删除组件
   */
  const deleteComponent = (id: string) => {
    try {
      const { component, parent, index } = findComponent(id);
      if (!component) return;

      if (parent && parent.children) {
        // 从父组件的children中删除
        parent.children.splice(index, 1);
      } else {
        // 从根级别删除
        state.value.canvasComponents.splice(index, 1);
      }

      // 如果当前组件在选中列表中，则从选中列表中移除
      if (state.value.selectedComponentIds.includes(id)) {
        state.value.selectedComponentIds = state.value.selectedComponentIds.filter(
          selectedId => selectedId !== id
        );
      }

      addHistorySnapshot();
    } catch (error) {
      console.error('删除组件失败:', error);
    }
  };

  /**
   * 导出页面配置为JSON
   */
  const exportSchema = (): PageSchema => {
    try {
      const now = new Date().toISOString();
      return {
        name: '低代码页面',
        description: '使用lowCodeEditor2生成的页面',
        components: JSON.parse(JSON.stringify(state.value.canvasComponents)),
        canvas: {
          width: state.value.canvas.width,
          height: state.value.canvas.height,
          background: state.value.canvas.background,
        },
        version: '1.0.0',
        createdAt: now,
        updatedAt: now,
      };
    } catch (error) {
      console.error('导出页面配置失败:', error);
      return {
        name: '导出失败',
        components: [],
        canvas: { width: 0, height: 0, background: '#fff' },
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  };

  /**
   * 导入页面配置
   */
  const importSchema = (schema: PageSchema) => {
    try {
      state.value.canvasComponents = schema.components;
      state.value.canvas.width = schema.canvas.width;
      state.value.canvas.height = schema.canvas.height;
      state.value.canvas.background = schema.canvas.background;
      state.value.selectedComponentIds = [];
      addHistorySnapshot();
    } catch (error) {
      console.error('导入页面配置失败:', error);
    }
  };

  /**
   * 清空画布
   */
  const clearCanvas = () => {
    try {
      state.value.canvasComponents = [];
      state.value.selectedComponentIds = [];
      addHistorySnapshot();
    } catch (error) {
      console.error('清空画布失败:', error);
    }
  };

  /**
   * 设置编辑器模式
   */
  const setEditorMode = (mode: 'edit' | 'preview') => {
    try {
      state.value.mode = mode;
    } catch (error) {
      console.error('设置编辑器模式失败:', error);
    }
  };

  /**
   * 设置画布配置
   */
  const setCanvasConfig = (config: Partial<EditorState['canvas']>) => {
    try {
      state.value.canvas = { ...state.value.canvas, ...config };
      addHistorySnapshot();
    } catch (error) {
      console.error('设置画布配置失败:', error);
    }
  };

  /**
   * 更新组件数据源
   */
  const updateComponentDataSource = (id: string, dataSource: Partial<NonNullable<CanvasComponent['dataSource']>>) => {
    try {
      const { component } = findComponent(id);
      if (component) {
        if (!component.dataSource) {
          component.dataSource = {
            type: 'static',
            ...dataSource
          };
        } else {
          component.dataSource = {
            ...component.dataSource,
            ...dataSource
          };
        }
        addHistorySnapshot();
      }
    } catch (error) {
      console.error('更新组件数据源失败:', error);
    }
  };

  /**
   * 更新组件事件
   */
  const updateComponentEvent = (id: string, eventName: string, handler: string) => {
    try {
      const { component } = findComponent(id);
      if (component) {
        if (!component.events) {
          component.events = {};
        }
        component.events[eventName] = handler;
        addHistorySnapshot();
      }
    } catch (error) {
      console.error('更新组件事件失败:', error);
    }
  };

  /**
   * 复制组件
   */
  const copyComponent = (id: string) => {
    try {
      const { component } = findComponent(id);
      if (!component) return null;

      // 创建深拷贝
      const clonedComponent: CanvasComponent = JSON.parse(JSON.stringify(component));
      
      // 生成新ID
      clonedComponent.id = nanoid();
      
      // 调整位置，避免重叠
      clonedComponent.style.left += 20;
      clonedComponent.style.top += 20;
      
      // 递归更新子组件ID
      const updateChildrenIds = (children: CanvasComponent[] | undefined) => {
        if (!children) return;
        
        children.forEach(child => {
          child.id = nanoid();
          child.parentId = clonedComponent.id;
          updateChildrenIds(child.children);
        });
      };
      
      updateChildrenIds(clonedComponent.children);
      
      // 添加到相同层级
      if (component.parentId) {
        const { parent } = findComponent(component.parentId);
        if (parent && parent.children) {
          parent.children.push(clonedComponent);
        } else {
          state.value.canvasComponents.push(clonedComponent);
        }
      } else {
        state.value.canvasComponents.push(clonedComponent);
      }
      
      // 选中新组件
      state.value.selectedComponentIds = [clonedComponent.id];
      
      // 添加历史记录
      addHistorySnapshot();
      
      return clonedComponent;
    } catch (error) {
      console.error('复制组件失败:', error);
      return null;
    }
  };

  /**
   * 计算当前选中的组件
   */
  const selectedComponents = computed(() => {
    try {
      return state.value.selectedComponentIds.map(id => {
        const { component } = findComponent(id);
        return component;
      }).filter(Boolean) as CanvasComponent[];
    } catch (error) {
      console.error('获取选中组件失败:', error);
      return [];
    }
  });

  /**
   * 计算当前选中的第一个组件
   */
  const selectedComponent = computed(() => {
    return selectedComponents.value[0] || null;
  });

  /**
   * 计算当前选中组件的定义
   */
  const selectedComponentDefinition = computed(() => {
    if (!selectedComponent.value) return null;
    return getComponentDefinition(selectedComponent.value.componentId);
  });

  /**
   * 调整组件层级
   */
  const adjustComponentLayer = (id: string, action: 'up' | 'down' | 'top' | 'bottom') => {
    try {
      const { component, parent, index } = findComponent(id);
      if (!component) return;
      
      // 获取当前组件所在的数组
      const componentArray = parent ? parent.children! : state.value.canvasComponents;
      
      // 根据操作调整zIndex
      switch (action) {
        case 'up':
          if (index < componentArray.length - 1) {
            // 交换当前组件和上一层组件的zIndex
            const temp = componentArray[index].style.zIndex;
            componentArray[index].style.zIndex = componentArray[index + 1].style.zIndex;
            componentArray[index + 1].style.zIndex = temp;
            
            // 调整数组位置
            [componentArray[index], componentArray[index + 1]] = 
              [componentArray[index + 1], componentArray[index]];
          }
          break;
          
        case 'down':
          if (index > 0) {
            // 交换当前组件和下一层组件的zIndex
            const temp = componentArray[index].style.zIndex;
            componentArray[index].style.zIndex = componentArray[index - 1].style.zIndex;
            componentArray[index - 1].style.zIndex = temp;
            
            // 调整数组位置
            [componentArray[index], componentArray[index - 1]] = 
              [componentArray[index - 1], componentArray[index]];
          }
          break;
          
        case 'top':
          // 移到最顶层
          componentArray.splice(index, 1);
          componentArray.push(component);
          
          // 重新分配zIndex
          componentArray.forEach((comp, idx) => {
            comp.style.zIndex = idx + 1;
          });
          break;
          
        case 'bottom':
          // 移到最底层
          componentArray.splice(index, 1);
          componentArray.unshift(component);
          
          // 重新分配zIndex
          componentArray.forEach((comp, idx) => {
            comp.style.zIndex = idx + 1;
          });
          break;
      }
      
      addHistorySnapshot();
    } catch (error) {
      console.error('调整组件层级失败:', error);
    }
  };

  return {
    state,
    addCanvasComponent,
    updateComponentProps,
    updateComponentStyle,
    selectComponent,
    moveComponent,
    resizeComponent,
    deleteComponent,
    findComponent,
    exportSchema,
    importSchema,
    clearCanvas,
    undo,
    redo,
    setEditorMode,
    setCanvasConfig,
    updateComponentDataSource,
    updateComponentEvent,
    copyComponent,
    adjustComponentLayer,
    selectedComponents,
    selectedComponent,
    selectedComponentDefinition,
  };
}); 