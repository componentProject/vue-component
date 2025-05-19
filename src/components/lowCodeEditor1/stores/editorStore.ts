/**
 * 编辑器状态管理
 * 使用Pinia管理低代码编辑器的状态
 */
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import type { Component, EditorState, SchemaExport } from '../types';
import { logInfo, logError } from '../utils/logger';

/**
 * 编辑器状态存储
 */
export const useEditorStore = defineStore('lowCodeEditor', {
  state: (): EditorState => ({
    components: [],
    selectedComponentId: null,
    clipboard: null,
    history: {
      past: [],
      future: []
    }
  }),

  getters: {
    /**
     * 获取选中的组件
     * @returns 选中的组件对象，如果没有选中则返回null
     */
    selectedComponent(): Component | null {
      try {
        if (!this.selectedComponentId) return null;
        return this.findComponentById(this.components, this.selectedComponentId);
      } catch (error) {
        logError('Failed to get selected component', error);
        return null;
      }
    },
    
    /**
     * 是否可以撤销操作
     */
    canUndo(): boolean {
      return this.history.past.length > 0;
    },
    
    /**
     * 是否可以重做操作
     */
    canRedo(): boolean {
      return this.history.future.length > 0;
    }
  },

  actions: {
    /**
     * 添加组件
     * @param component 要添加的组件
     * @param parentId 父组件ID
     * @param slot 要添加到的插槽名称
     */
    addComponent(component: Partial<Component>, parentId?: string, slot?: string) {
      try {
        // 保存当前状态到历史记录
        this.saveToHistory();
        
        const newComponent: Component = {
          id: component.id || uuidv4(),
          type: component.type!,
          props: component.props || {},
          style: component.style || {},
          children: component.children || [],
          parentId: parentId || undefined
        };
        
        if (parentId) {
          this.addComponentToParent(this.components, newComponent, parentId, slot);
        } else {
          this.components.push(newComponent);
        }
        
        logInfo('Component added', { componentId: newComponent.id, type: newComponent.type });
      } catch (error) {
        logError('Failed to add component', error);
      }
    },
    
    /**
     * 将组件添加到父组件中
     * @param componentList 组件列表
     * @param component 要添加的组件
     * @param parentId 父组件ID
     * @param slot 插槽名称
     * @returns 是否添加成功
     */
    addComponentToParent(
      componentList: Component[],
      component: Component,
      parentId: string,
      slot?: string
    ): boolean {
      try {
        for (const item of componentList) {
          if (item.id === parentId) {
            if (slot) {
              // 添加到指定插槽
              if (!item.slots) {
                item.slots = {};
              }
              if (!item.slots[slot]) {
                item.slots[slot] = [];
              }
              item.slots[slot].push(component);
            } else {
              // 添加到子组件列表
              if (!item.children) {
                item.children = [];
              }
              item.children.push(component);
            }
            return true;
          }
          
          // 递归检查子组件
          if (item.children && item.children.length > 0) {
            const added = this.addComponentToParent(item.children, component, parentId, slot);
            if (added) return true;
          }
          
          // 递归检查插槽中的组件
          if (item.slots) {
            for (const slotName in item.slots) {
              const added = this.addComponentToParent(item.slots[slotName], component, parentId, slot);
              if (added) return true;
            }
          }
        }
        return false;
      } catch (error) {
        logError('Failed to add component to parent', error);
        return false;
      }
    },
    
    /**
     * 删除组件
     * @param componentId 要删除的组件ID
     */
    removeComponent(componentId: string) {
      try {
        // 保存当前状态到历史记录
        this.saveToHistory();
        
        const removeFromList = (list: Component[]): boolean => {
          const index = list.findIndex(item => item.id === componentId);
          if (index >= 0) {
            list.splice(index, 1);
            return true;
          }
          
          // 递归检查子组件
          for (const component of list) {
            if (component.children && component.children.length > 0) {
              const removed = removeFromList(component.children);
              if (removed) return true;
            }
            
            // 检查插槽中的组件
            if (component.slots) {
              for (const slotName in component.slots) {
                const removed = removeFromList(component.slots[slotName]);
                if (removed) return true;
              }
            }
          }
          
          return false;
        };
        
        // 从组件树中删除组件
        const removed = removeFromList(this.components);
        
        // 如果删除的是当前选中的组件，清除选中状态
        if (this.selectedComponentId === componentId) {
          this.selectedComponentId = null;
        }
        
        logInfo('Component removed', { componentId, success: removed });
      } catch (error) {
        logError('Failed to remove component', error);
      }
    },
    
    /**
     * 更新组件属性
     * @param property 属性名
     * @param value 属性值
     */
    updateComponentProperty(property: string, value: any) {
      try {
        if (!this.selectedComponentId) return;
        
        // 保存当前状态到历史记录
        this.saveToHistory();
        
        const updateComponentProps = (componentList: Component[]): boolean => {
          for (const component of componentList) {
            if (component.id === this.selectedComponentId) {
              // 根据属性路径判断应该更新props还是style
              if (property.startsWith('style.')) {
                const styleProp = property.substring(6);
                if (!component.style) component.style = {};
                component.style[styleProp] = value;
              } else {
                component.props[property] = value;
              }
              return true;
            }
            
            // 递归检查子组件
            if (component.children && component.children.length > 0) {
              const updated = updateComponentProps(component.children);
              if (updated) return true;
            }
            
            // 递归检查插槽中的组件
            if (component.slots) {
              for (const slotName in component.slots) {
                const updated = updateComponentProps(component.slots[slotName]);
                if (updated) return true;
              }
            }
          }
          return false;
        };
        
        const updated = updateComponentProps(this.components);
        logInfo('Component property updated', { 
          componentId: this.selectedComponentId, 
          property, 
          value,
          success: updated
        });
      } catch (error) {
        logError('Failed to update component property', error);
      }
    },
    
    /**
     * 选择组件
     * @param componentId 组件ID
     */
    selectComponent(componentId: string) {
      try {
        this.selectedComponentId = componentId;
        logInfo('Component selected', { componentId });
      } catch (error) {
        logError('Failed to select component', error);
      }
    },
    
    /**
     * 取消选择组件
     */
    deselectComponent() {
      try {
        this.selectedComponentId = null;
        logInfo('Component deselected');
      } catch (error) {
        logError('Failed to deselect component', error);
      }
    },
    
    /**
     * 更新组件列表
     * @param components 新的组件列表
     */
    updateComponents(components: Component[]) {
      try {
        // 保存当前状态到历史记录
        this.saveToHistory();
        
        this.components = [...components];
        logInfo('Components updated');
      } catch (error) {
        logError('Failed to update components', error);
      }
    },
    
    /**
     * 复制当前选中的组件
     */
    copySelectedComponent() {
      try {
        if (!this.selectedComponent) return;
        
        // 深拷贝选中的组件
        this.clipboard = JSON.parse(JSON.stringify(this.selectedComponent));
        logInfo('Component copied to clipboard', { componentId: this.selectedComponentId });
      } catch (error) {
        logError('Failed to copy component', error);
      }
    },
    
    /**
     * 粘贴剪贴板中的组件
     * @param parentId 目标父组件ID
     * @param slot 目标插槽名称
     */
    pasteComponent(parentId?: string, slot?: string) {
      try {
        if (!this.clipboard) return;
        
        // 保存当前状态到历史记录
        this.saveToHistory();
        
        // 创建组件副本并生成新ID
        const generateNewIds = (component: Component): Component => {
          const newComponent = { ...component, id: uuidv4() };
          
          if (newComponent.children) {
            newComponent.children = newComponent.children.map(child => generateNewIds(child));
          }
          
          if (newComponent.slots) {
            const newSlots: Record<string, Component[]> = {};
            for (const slotName in newComponent.slots) {
              newSlots[slotName] = newComponent.slots[slotName].map(item => generateNewIds(item));
            }
            newComponent.slots = newSlots;
          }
          
          return newComponent;
        };
        
        const componentCopy = generateNewIds(this.clipboard);
        
        // 添加到指定位置
        if (parentId) {
          this.addComponentToParent(this.components, componentCopy, parentId, slot);
        } else {
          this.components.push(componentCopy);
        }
        
        logInfo('Component pasted', { 
          fromComponentId: this.clipboard.id,
          newComponentId: componentCopy.id
        });
      } catch (error) {
        logError('Failed to paste component', error);
      }
    },
    
    /**
     * 保存当前状态到历史记录
     */
    saveToHistory() {
      try {
        // 深拷贝当前组件状态
        const currentState = JSON.parse(JSON.stringify(this.components));
        
        // 添加到历史记录
        this.history.past.push(currentState);
        
        // 清空未来历史
        this.history.future = [];
        
        // 限制历史记录长度
        if (this.history.past.length > 50) {
          this.history.past.shift();
        }
      } catch (error) {
        logError('Failed to save to history', error);
      }
    },
    
    /**
     * 撤销操作
     */
    undo() {
      try {
        if (this.history.past.length === 0) return;
        
        // 获取上一个状态
        const previousState = this.history.past.pop()!;
        
        // 保存当前状态到未来历史
        const currentState = JSON.parse(JSON.stringify(this.components));
        this.history.future.push(currentState);
        
        // 恢复上一个状态
        this.components = previousState;
        
        logInfo('Undo operation performed');
      } catch (error) {
        logError('Failed to undo operation', error);
      }
    },
    
    /**
     * 重做操作
     */
    redo() {
      try {
        if (this.history.future.length === 0) return;
        
        // 获取下一个状态
        const nextState = this.history.future.pop()!;
        
        // 保存当前状态到历史记录
        const currentState = JSON.parse(JSON.stringify(this.components));
        this.history.past.push(currentState);
        
        // 恢复下一个状态
        this.components = nextState;
        
        logInfo('Redo operation performed');
      } catch (error) {
        logError('Failed to redo operation', error);
      }
    },
    
    /**
     * 导出当前页面配置为JSON Schema
     * @returns 页面配置Schema
     */
    exportSchema(): SchemaExport {
      try {
        const schema: SchemaExport = {
          version: '1.0',
          components: JSON.parse(JSON.stringify(this.components)),
          metadata: {
            exportTime: new Date().toISOString(),
            componentCount: this.countComponents(this.components)
          }
        };
        
        logInfo('Schema exported', { componentCount: schema.metadata!.componentCount });
        return schema;
      } catch (error) {
        logError('Failed to export schema', error);
        return {
          version: '1.0',
          components: []
        };
      }
    },
    
    /**
     * 从JSON Schema导入页面配置
     * @param schema JSON Schema配置
     */
    importSchema(schema: SchemaExport) {
      try {
        if (!schema || !schema.components) {
          throw new Error('Invalid schema format');
        }
        
        // 保存当前状态到历史记录
        this.saveToHistory();
        
        // 导入组件
        this.components = JSON.parse(JSON.stringify(schema.components));
        this.selectedComponentId = null;
        
        logInfo('Schema imported', { 
          version: schema.version,
          componentCount: this.countComponents(this.components)
        });
      } catch (error) {
        logError('Failed to import schema', error);
      }
    },
    
    /**
     * 查找指定ID的组件
     * @param componentList 组件列表
     * @param componentId 组件ID
     * @returns 找到的组件，如果未找到则返回null
     */
    findComponentById(componentList: Component[], componentId: string): Component | null {
      try {
        for (const component of componentList) {
          if (component.id === componentId) {
            return component;
          }
          
          // 递归检查子组件
          if (component.children && component.children.length > 0) {
            const found = this.findComponentById(component.children, componentId);
            if (found) return found;
          }
          
          // 递归检查插槽中的组件
          if (component.slots) {
            for (const slotName in component.slots) {
              const found = this.findComponentById(component.slots[slotName], componentId);
              if (found) return found;
            }
          }
        }
        
        return null;
      } catch (error) {
        logError('Failed to find component by ID', error);
        return null;
      }
    },
    
    /**
     * 计算组件总数
     * @param componentList 组件列表
     * @returns 组件总数
     */
    countComponents(componentList: Component[]): number {
      try {
        let count = componentList.length;
        
        for (const component of componentList) {
          // 计算子组件数量
          if (component.children && component.children.length > 0) {
            count += this.countComponents(component.children);
          }
          
          // 计算插槽中的组件数量
          if (component.slots) {
            for (const slotName in component.slots) {
              count += this.countComponents(component.slots[slotName]);
            }
          }
        }
        
        return count;
      } catch (error) {
        logError('Failed to count components', error);
        return 0;
      }
    }
  }
}); 