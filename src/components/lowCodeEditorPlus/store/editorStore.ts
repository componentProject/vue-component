/**
 * Editor state management using Pinia
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import type { ComponentInstance, EditorState, EditorSchema, EditorSnapshot } from '../types';

export const useEditorStore = defineStore('lowCodeEditorPlus', () => {
  /**
   * State management for the editor
   */
  const state = ref<EditorState>({
    components: [],
    selectedComponentId: null,
    clipboard: null,
    history: {
      past: [],
      future: [],
    },
    canvasSize: {
      width: 1280,
      height: 800,
    },
    viewMode: 'desktop',
    zoom: 1,
  });

  /**
   * Create a snapshot of the current state for undo/redo
   */
  const createSnapshot = (): EditorSnapshot => {
    return {
      components: JSON.parse(JSON.stringify(state.value.components)),
      selectedComponentId: state.value.selectedComponentId,
    };
  };

  /**
   * Save the current state to history before making changes
   */
  const saveToHistory = () => {
    try {
      state.value.history.past.push(createSnapshot());
      state.value.history.future = [];
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  /**
   * Get the currently selected component
   */
  const selectedComponent = computed(() => {
    if (!state.value.selectedComponentId) return null;
    
    // Recursively search for the component with the given ID
    const findComponent = (components: ComponentInstance[], id: string): ComponentInstance | null => {
      for (const component of components) {
        if (component.id === id) return component;
        if (component.children?.length) {
          const found = findComponent(component.children, id);
          if (found) return found;
        }
      }
      return null;
    };
    
    return findComponent(state.value.components, state.value.selectedComponentId);
  });

  /**
   * Add a new component to the canvas
   */
  const addComponent = (component: Omit<ComponentInstance, 'id'>, parentId?: string) => {
    try {
      saveToHistory();
      
      const newComponent: ComponentInstance = {
        ...component,
        id: uuidv4(),
        parentId,
      };

      if (parentId) {
        // Add as a child to parent component
        const addToParent = (components: ComponentInstance[]) => {
          for (const comp of components) {
            if (comp.id === parentId) {
              if (!comp.children) comp.children = [];
              comp.children.push(newComponent);
              return true;
            }
            if (comp.children?.length) {
              if (addToParent(comp.children)) return true;
            }
          }
          return false;
        };

        addToParent(state.value.components);
      } else {
        // Add to root level
        state.value.components.push(newComponent);
      }
      
      state.value.selectedComponentId = newComponent.id;
    } catch (error) {
      console.error('Error adding component:', error);
    }
  };

  /**
   * Remove a component from the canvas
   */
  const removeComponent = (id: string) => {
    try {
      saveToHistory();
      
      const removeById = (components: ComponentInstance[]) => {
        const index = components.findIndex(c => c.id === id);
        
        if (index !== -1) {
          components.splice(index, 1);
          return true;
        }
        
        for (const component of components) {
          if (component.children?.length) {
            if (removeById(component.children)) return true;
          }
        }
        
        return false;
      };
      
      removeById(state.value.components);
      state.value.selectedComponentId = null;
    } catch (error) {
      console.error('Error removing component:', error);
    }
  };

  /**
   * Update a component's properties
   */
  const updateComponent = (id: string, updates: Partial<ComponentInstance>) => {
    try {
      saveToHistory();
      
      const updateById = (components: ComponentInstance[]) => {
        for (const component of components) {
          if (component.id === id) {
            Object.assign(component, updates);
            return true;
          }
          
          if (component.children?.length) {
            if (updateById(component.children)) return true;
          }
        }
        
        return false;
      };
      
      updateById(state.value.components);
    } catch (error) {
      console.error('Error updating component:', error);
    }
  };

  /**
   * Select a component by ID
   */
  const selectComponent = (id: string | null) => {
    state.value.selectedComponentId = id;
  };

  /**
   * Copy the selected component to clipboard
   */
  const copyComponent = () => {
    if (!state.value.selectedComponentId) return;
    
    const component = selectedComponent.value;
    if (component) {
      state.value.clipboard = JSON.parse(JSON.stringify(component));
    }
  };

  /**
   * Paste the component from clipboard
   */
  const pasteComponent = (parentId?: string) => {
    if (!state.value.clipboard) return;
    
    try {
      saveToHistory();
      
      const cloned = JSON.parse(JSON.stringify(state.value.clipboard));
      
      // Recursively generate new IDs
      const generateNewIds = (component: ComponentInstance): ComponentInstance => {
        const newComponent = {
          ...component,
          id: uuidv4(),
        };
        
        if (newComponent.children?.length) {
          newComponent.children = newComponent.children.map(child => generateNewIds(child));
        }
        
        return newComponent;
      };
      
      const newComponent = generateNewIds(cloned);
      
      if (parentId) {
        // Add as a child to parent component
        const addToParent = (components: ComponentInstance[]) => {
          for (const comp of components) {
            if (comp.id === parentId) {
              if (!comp.children) comp.children = [];
              comp.children.push(newComponent);
              return true;
            }
            if (comp.children?.length) {
              if (addToParent(comp.children)) return true;
            }
          }
          return false;
        };

        addToParent(state.value.components);
      } else {
        // Add to root level
        state.value.components.push(newComponent);
      }
      
      state.value.selectedComponentId = newComponent.id;
    } catch (error) {
      console.error('Error pasting component:', error);
    }
  };

  /**
   * Undo the last action
   */
  const undo = () => {
    try {
      if (state.value.history.past.length === 0) return;
      
      const current = createSnapshot();
      const previous = state.value.history.past.pop();
      
      if (previous) {
        state.value.history.future.push(current);
        state.value.components = previous.components;
        state.value.selectedComponentId = previous.selectedComponentId;
      }
    } catch (error) {
      console.error('Error during undo operation:', error);
    }
  };

  /**
   * Redo the last undone action
   */
  const redo = () => {
    try {
      if (state.value.history.future.length === 0) return;
      
      const current = createSnapshot();
      const next = state.value.history.future.pop();
      
      if (next) {
        state.value.history.past.push(current);
        state.value.components = next.components;
        state.value.selectedComponentId = next.selectedComponentId;
      }
    } catch (error) {
      console.error('Error during redo operation:', error);
    }
  };

  /**
   * Export the current state as a JSON schema
   */
  const exportSchema = (): EditorSchema => {
    return {
      version: '1.0.0',
      components: JSON.parse(JSON.stringify(state.value.components)),
      canvasSize: state.value.canvasSize,
    };
  };

  /**
   * Import a JSON schema into the editor
   */
  const importSchema = (schema: EditorSchema) => {
    try {
      saveToHistory();
      
      state.value.components = schema.components;
      state.value.canvasSize = schema.canvasSize;
      state.value.selectedComponentId = null;
    } catch (error) {
      console.error('Error importing schema:', error);
    }
  };

  /**
   * Set the canvas view mode
   */
  const setViewMode = (mode: 'desktop' | 'tablet' | 'mobile') => {
    state.value.viewMode = mode;
  };

  /**
   * Set the canvas zoom level
   */
  const setZoom = (zoom: number) => {
    state.value.zoom = zoom;
  };

  /**
   * Lock or unlock a component
   */
  const toggleLock = (id: string) => {
    try {
      const component = selectedComponent.value;
      if (component && component.id === id) {
        saveToHistory();
        updateComponent(id, { locked: !component.locked });
      }
    } catch (error) {
      console.error('Error toggling component lock:', error);
    }
  };

  return {
    state,
    selectedComponent,
    addComponent,
    removeComponent,
    updateComponent,
    selectComponent,
    copyComponent,
    pasteComponent,
    undo,
    redo,
    exportSchema,
    importSchema,
    setViewMode,
    setZoom,
    toggleLock,
  };
}); 