import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import LowCodeEditor from './LowCodeEditor.vue';
import { useEditorStore } from './store/editor';
import { v4 as uuidv4 } from 'uuid';
import type { CanvasComponent } from './types';

// Initialize Pinia store before stories
setActivePinia(createPinia());

/**
 * Low Code Editor component meta information
 */
const meta: Meta<typeof LowCodeEditor> = {
  title: 'Components/LowCodeEditor',
  component: LowCodeEditor,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A visual low-code editor for building UI interfaces with drag-and-drop components.'
      }
    }
  },
  decorators: [
    // Ensure the component has proper sizing within Storybook
    (story) => ({
      components: { story },
      template: '<div style="height: 100vh; width: 100%;"><story /></div>'
    })
  ]
};

export default meta;

/**
 * Define story type
 */
type Story = StoryObj<typeof LowCodeEditor>;

/**
 * Empty canvas story - the default state
 */
export const EmptyCanvas: Story = {
  render: () => ({
    components: { LowCodeEditor },
    setup() {
      // Reset the store to ensure a clean state
      const editorStore = useEditorStore();
      editorStore.$reset();
      
      return { LowCodeEditor };
    },
    template: '<LowCodeEditor />'
  })
};

/**
 * Story with some pre-loaded components
 */
export const WithPreloadedComponents: Story = {
  render: () => ({
    components: { LowCodeEditor },
    setup() {
      // Get store and reset it
      const editorStore = useEditorStore();
      editorStore.$reset();
      
      // We need to register components first
      // This is normally done in the LowCodeEditor component's onMounted hook
      // but for the story we need to manually trigger it
      import('./components/BaseComponents').then(({ registerBaseComponents }) => {
        registerBaseComponents();
        
        // After components are registered, add some components to the canvas
        setTimeout(() => {
          // Find a button component
          const buttonDef = editorStore.componentDefinitions.find(c => c.name === 'Button');
          const inputDef = editorStore.componentDefinitions.find(c => c.name === 'Input');
          const cardDef = editorStore.componentDefinitions.find(c => c.name === 'Card');
          
          if (buttonDef) {
            // Add a button to the canvas
            const buttonComponent: CanvasComponent = {
              id: uuidv4(),
              componentId: buttonDef.id,
              props: { ...buttonDef.defaultProps, text: 'Sample Button', type: 'primary' },
              style: {
                top: 100,
                left: 150,
                width: 120,
                height: 40,
                zIndex: 1
              }
            };
            editorStore.canvasComponents.push(buttonComponent);
          }
          
          if (inputDef) {
            // Add an input to the canvas
            const inputComponent: CanvasComponent = {
              id: uuidv4(),
              componentId: inputDef.id,
              props: { 
                ...inputDef.defaultProps, 
                placeholder: 'Type something...', 
                clearable: true 
              },
              style: {
                top: 200,
                left: 150,
                width: 250,
                height: 40,
                zIndex: 2
              }
            };
            editorStore.canvasComponents.push(inputComponent);
          }
          
          if (cardDef) {
            // Add a card to the canvas
            const cardComponent: CanvasComponent = {
              id: uuidv4(),
              componentId: cardDef.id,
              props: { 
                ...cardDef.defaultProps, 
                title: 'Sample Card'
              },
              style: {
                top: 300,
                left: 150,
                width: 300,
                height: 200,
                zIndex: 3
              }
            };
            editorStore.canvasComponents.push(cardComponent);
          }
        }, 100);
      });
      
      return { LowCodeEditor };
    },
    template: '<LowCodeEditor />'
  })
};

/**
 * Story with grid enabled
 */
export const WithGridEnabled: Story = {
  render: () => ({
    components: { LowCodeEditor },
    setup() {
      // Reset the store to ensure a clean state
      const editorStore = useEditorStore();
      editorStore.$reset();
      
      // Ensure grid is shown
      editorStore.updateCanvas({ showGrid: true });
      
      return { LowCodeEditor };
    },
    template: '<LowCodeEditor />'
  })
};

/**
 * Story with different canvas dimensions
 */
export const CustomCanvasSize: Story = {
  render: () => ({
    components: { LowCodeEditor },
    setup() {
      // Reset the store to ensure a clean state
      const editorStore = useEditorStore();
      editorStore.$reset();
      
      // Set custom canvas dimensions
      editorStore.updateCanvas({ 
        width: 800,
        height: 600,
        showGrid: true 
      });
      
      return { LowCodeEditor };
    },
    template: '<LowCodeEditor />'
  })
};

/**
 * Story with a selected component
 */
export const WithSelectedComponent: Story = {
  render: () => ({
    components: { LowCodeEditor },
    setup() {
      // Get store and reset it
      const editorStore = useEditorStore();
      editorStore.$reset();
      
      // Register components and add one with selection
      import('./components/BaseComponents').then(({ registerBaseComponents }) => {
        registerBaseComponents();
        
        setTimeout(() => {
          // Find a button component
          const buttonDef = editorStore.componentDefinitions.find(c => c.name === 'Button');
          
          if (buttonDef) {
            // Add a button to the canvas
            const buttonComponent: CanvasComponent = {
              id: uuidv4(),
              componentId: buttonDef.id,
              props: { ...buttonDef.defaultProps, text: 'Selected Button', type: 'danger' },
              style: {
                top: 150,
                left: 250,
                width: 150,
                height: 50,
                zIndex: 1
              }
            };
            editorStore.canvasComponents.push(buttonComponent);
            
            // Select the component
            editorStore.selectComponent(buttonComponent.id);
          }
        }, 100);
      });
      
      return { LowCodeEditor };
    },
    template: '<LowCodeEditor />'
  })
};

/**
 * Story with zoomed canvas
 */
export const ZoomedCanvas: Story = {
  render: () => ({
    components: { LowCodeEditor },
    setup() {
      // Reset the store to ensure a clean state
      const editorStore = useEditorStore();
      editorStore.$reset();
      
      // Set zoom level
      editorStore.updateCanvas({ scale: 0.75 });
      
      return { LowCodeEditor };
    },
    template: '<LowCodeEditor />'
  })
}; 