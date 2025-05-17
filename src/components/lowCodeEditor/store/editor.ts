import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import type { 
  EditorState,
  CanvasComponent,
  EditorStateSnapshot,
  ComponentDefinition 
} from '../types';

/**
 * Low code editor store, manages the entire editor state
 */
export const useEditorStore = defineStore('lowCodeEditor', {
  state: (): EditorState => ({
    componentDefinitions: [],
    canvasComponents: [],
    selectedComponentId: null,
    canvas: {
      width: 1200,
      height: 800,
      scale: 1,
      showGrid: true,
    },
    history: {
      past: [],
      future: [],
    }
  }),

  getters: {
    /**
     * Get selected component from canvas
     * @returns Selected component or null if none selected
     */
    selectedComponent(): CanvasComponent | null {
      try {
        if (!this.selectedComponentId) return null;
        return this.canvasComponents.find(c => c.id === this.selectedComponentId) || null;
      } catch (error) {
        console.error('Error in selectedComponent getter:', error);
        return null;
      }
    },

    /**
     * Get component definition by ID
     */
    getComponentDefinition() {
      return (id: string): ComponentDefinition | undefined => {
        try {
          return this.componentDefinitions.find(def => def.id === id);
        } catch (error) {
          console.error('Error in getComponentDefinition:', error);
          return undefined;
        }
      };
    },

    /**
     * Can perform undo operation
     */
    canUndo(): boolean {
      return this.history.past.length > 0;
    },

    /**
     * Can perform redo operation
     */
    canRedo(): boolean {
      return this.history.future.length > 0;
    }
  },

  actions: {
    /**
     * Register a component definition
     * @param definition Component definition to register
     */
    registerComponentDefinition(definition: ComponentDefinition) {
      try {
        this.componentDefinitions.push(definition);
      } catch (error) {
        console.error('Error registering component definition:', error);
      }
    },

    /**
     * Register multiple component definitions
     * @param definitions Component definitions to register
     */
    registerComponentDefinitions(definitions: ComponentDefinition[]) {
      try {
        this.componentDefinitions.push(...definitions);
      } catch (error) {
        console.error('Error registering component definitions:', error);
      }
    },

    /**
     * Create snapshot of current state for history
     * @returns State snapshot without history
     */
    createStateSnapshot(): EditorStateSnapshot {
      try {
        const { history, ...snapshot } = JSON.parse(JSON.stringify(this.$state));
        return snapshot;
      } catch (error) {
        console.error('Error creating state snapshot:', error);
        throw error;
      }
    },

    /**
     * Add component to canvas
     * @param componentId Component definition ID to add
     * @param x X position on canvas
     * @param y Y position on canvas
     */
    addComponent(componentId: string, x: number, y: number) {
      try {
        // Save state before modification
        const snapshot = this.createStateSnapshot();
        this.history.past.push(snapshot);
        this.history.future = [];

        const definition = this.getComponentDefinition(componentId);
        if (!definition) {
          throw new Error(`Component definition with ID ${componentId} not found`);
        }

        const newComponent: CanvasComponent = {
          id: uuidv4(),
          componentId,
          props: { ...definition.defaultProps },
          style: {
            top: y,
            left: x,
            width: 120,
            height: 40,
            zIndex: this.canvasComponents.length + 1,
          }
        };

        this.canvasComponents.push(newComponent);
        this.selectedComponentId = newComponent.id;
      } catch (error) {
        console.error('Error adding component:', error);
      }
    },

    /**
     * Update a component's properties
     * @param componentId Component instance ID
     * @param props Updated properties
     */
    updateComponentProps(componentId: string, props: Record<string, any>) {
      try {
        // Save state before modification
        const snapshot = this.createStateSnapshot();
        this.history.past.push(snapshot);
        this.history.future = [];

        const component = this.canvasComponents.find(c => c.id === componentId);
        if (component) {
          component.props = { ...component.props, ...props };
        }
      } catch (error) {
        console.error('Error updating component props:', error);
      }
    },

    /**
     * Update a component's style
     * @param componentId Component instance ID
     * @param style Updated style properties
     */
    updateComponentStyle(componentId: string, style: Partial<CanvasComponent['style']>) {
      try {
        // Save state before modification
        const snapshot = this.createStateSnapshot();
        this.history.past.push(snapshot);
        this.history.future = [];

        const component = this.canvasComponents.find(c => c.id === componentId);
        if (component) {
          component.style = { ...component.style, ...style };
        }
      } catch (error) {
        console.error('Error updating component style:', error);
      }
    },

    /**
     * Remove a component from the canvas
     * @param componentId Component instance ID to remove
     */
    removeComponent(componentId: string) {
      try {
        // Save state before modification
        const snapshot = this.createStateSnapshot();
        this.history.past.push(snapshot);
        this.history.future = [];

        const index = this.canvasComponents.findIndex(c => c.id === componentId);
        if (index !== -1) {
          this.canvasComponents.splice(index, 1);
        }
        
        if (this.selectedComponentId === componentId) {
          this.selectedComponentId = null;
        }
      } catch (error) {
        console.error('Error removing component:', error);
      }
    },

    /**
     * Select a component on the canvas
     * @param componentId Component instance ID to select
     */
    selectComponent(componentId: string | null) {
      try {
        this.selectedComponentId = componentId;
      } catch (error) {
        console.error('Error selecting component:', error);
      }
    },

    /**
     * Update canvas settings
     * @param settings Canvas settings to update
     */
    updateCanvas(settings: Partial<EditorState['canvas']>) {
      try {
        this.canvas = { ...this.canvas, ...settings };
      } catch (error) {
        console.error('Error updating canvas settings:', error);
      }
    },

    /**
     * Undo the last action
     */
    undo() {
      try {
        if (this.history.past.length === 0) return;
        
        const current = this.createStateSnapshot();
        const previous = this.history.past.pop();
        
        if (previous) {
          this.history.future.push(current);
          
          // Restore state from snapshot
          this.canvasComponents = previous.canvasComponents;
          this.selectedComponentId = previous.selectedComponentId;
          this.canvas = previous.canvas;
        }
      } catch (error) {
        console.error('Error performing undo:', error);
      }
    },

    /**
     * Redo the last undone action
     */
    redo() {
      try {
        if (this.history.future.length === 0) return;
        
        const current = this.createStateSnapshot();
        const next = this.history.future.pop();
        
        if (next) {
          this.history.past.push(current);
          
          // Restore state from snapshot
          this.canvasComponents = next.canvasComponents;
          this.selectedComponentId = next.selectedComponentId;
          this.canvas = next.canvas;
        }
      } catch (error) {
        console.error('Error performing redo:', error);
      }
    },

    /**
     * Clear the canvas of all components
     */
    clearCanvas() {
      try {
        const snapshot = this.createStateSnapshot();
        this.history.past.push(snapshot);
        this.history.future = [];
        
        this.canvasComponents = [];
        this.selectedComponentId = null;
      } catch (error) {
        console.error('Error clearing canvas:', error);
      }
    },

    /**
     * Export the current editor state as a page schema
     * @returns Page schema object
     */
    exportSchema() {
      try {
        return {
          name: 'Low Code Page',
          description: 'Created with Low Code Editor',
          components: this.canvasComponents,
          canvas: {
            width: this.canvas.width,
            height: this.canvas.height,
          },
          version: '1.0.0'
        };
      } catch (error) {
        console.error('Error exporting schema:', error);
        throw error;
      }
    },

    /**
     * Import a page schema into the editor
     * @param schema Page schema to import
     */
    importSchema(schema: any) {
      try {
        // Validate schema format
        if (!schema || !schema.components || !Array.isArray(schema.components)) {
          throw new Error('Invalid schema format');
        }
        
        const snapshot = this.createStateSnapshot();
        this.history.past.push(snapshot);
        this.history.future = [];
        
        this.canvasComponents = schema.components;
        this.selectedComponentId = null;
        
        if (schema.canvas) {
          this.canvas = {
            ...this.canvas,
            width: schema.canvas.width || this.canvas.width,
            height: schema.canvas.height || this.canvas.height,
          };
        }
      } catch (error) {
        console.error('Error importing schema:', error);
      }
    }
  }
}); 