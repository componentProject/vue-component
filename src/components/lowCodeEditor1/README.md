# Vue 3 Low-Code Editor Component

A versatile low-code editor component for Vue 3 applications, enabling visual page building with drag-and-drop functionality.

## Features

- **Three-Panel Layout**:
  - Left Panel: Component library with Element Plus components, layout tools, and chart visualizations
  - Middle Panel: Drag-and-drop editing canvas with magnetic alignment
  - Right Panel: Property configuration for selected components

- **Core Functionality**:
  - Component dragging with visual preview
  - Strict nesting rules (e.g., el-col must be in el-row)
  - Magnetic alignment guides for precise positioning
  - Dynamic property editing based on component type
  - JSON Schema import/export
  - Comprehensive error handling and logging

- **Component Types**:
  - Basic UI components (buttons, inputs, selects, etc.)
  - Layout components (containers, rows, columns)
  - Chart components (line, bar, pie charts)

## Installation

Include the component in your Vue 3 project:

```javascript
import { LowCodeEditor } from './components/lowCodeEditor';

// Register globally
app.component('LowCodeEditor', LowCodeEditor);

// Or use locally in a component
export default {
  components: {
    LowCodeEditor
  }
}
```

## Usage

```vue
<template>
  <div class="editor-container">
    <LowCodeEditor ref="editorRef" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { LowCodeEditor } from './components/lowCodeEditor';

const editorRef = ref(null);

// Export the current page schema
const exportSchema = () => {
  const schema = editorRef.value.exportSchema();
  console.log('Exported schema:', schema);
  return schema;
};

// Import a page schema
const importSchema = (schema) => {
  editorRef.value.importSchema(schema);
};

// Example schema
const exampleSchema = {
  version: '1.0',
  components: [
    {
      id: 'container-1',
      type: 'el-container',
      props: {},
      style: {
        width: '100%',
        height: '400px'
      },
      children: [
        {
          id: 'row-1',
          type: 'el-row',
          props: {
            gutter: 20
          },
          children: [
            {
              id: 'col-1',
              type: 'el-col',
              props: {
                span: 12
              },
              children: [
                {
                  id: 'button-1',
                  type: 'el-button',
                  props: {
                    type: 'primary',
                    text: 'Button'
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

onMounted(() => {
  // Optionally import a schema on mount
  // importSchema(exampleSchema);
});
</script>

<style>
.editor-container {
  width: 100%;
  height: 100vh;
}
</style>
```

## Component Structure

The low-code editor is composed of several key components:

1. **LowCodeEditor.vue**: Main component that orchestrates the editor's functionality
2. **ComponentPanel.vue**: Displays available components for dragging
3. **ComponentRenderer.vue**: Renders the edit canvas and handles component positioning
4. **ComponentPropertyPanel.vue**: Configures properties of selected components
5. **DraggableComponent.vue**: Makes components draggable and manages their position
6. **ComponentPreview.vue**: Renders preview of components in the canvas
7. **SlotPreview.vue**: Handles slot content in components that support slots

## Customization

### Adding Custom Components

To add custom components to the editor, extend the component registry:

```javascript
// Import the component registry
import { componentRegistry } from './utils/componentRegistry';

// Register a custom component
componentRegistry.registerComponent({
  type: 'custom-component',
  category: ComponentCategory.BASIC,
  name: 'Custom Component',
  icon: 'el-icon-star-on',
  defaultProps: {
    // Default properties
    text: 'Custom Text'
  },
  // Define allowed parent components
  rules: {
    allowedParentComponents: ['el-col', 'el-container']
  }
});
```

### Extending Property Editors

To add support for editing properties of custom components, extend the `ComponentPropsForm.vue` component:

1. Add a new case in the `propFields` computed property to handle your component type
2. Define the form fields needed for your component's properties

## JSON Schema Format

The editor uses a JSON schema format for importing and exporting designs:

```typescript
interface SchemaExport {
  version: string;
  components: Component[];
  metadata?: Record<string, any>;
}

interface Component {
  id: string;
  type: string;
  props: Record<string, any>;
  style?: Record<string, any>;
  children?: Component[];
  parentId?: string;
  slots?: Record<string, Component[]>;
}
```

## Error Handling

The component includes comprehensive error handling using a centralized logger:

- All operations are wrapped in try-catch blocks
- Errors are logged with context information
- Component state is preserved when errors occur

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Dependencies

- Vue 3 (Composition API)
- TypeScript
- Element Plus UI components
- Tailwind CSS (optional, for styling) 