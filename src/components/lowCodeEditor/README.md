# Low Code Editor for Vue 3

A powerful low-code editor built with Vue 3, TypeScript, and Element Plus, enabling users to visually design and customize UI interfaces through drag-and-drop.

## Features

### 1. Layout

- **Left Panel**: Component selection with categorization and search
- **Center**: Visual canvas with grid and snapping support
- **Right Panel**: Property configuration for the selected component

### 2. Component System

- **Basic Components**: Button, Input, Select, Checkbox, DatePicker
- **Layout Components**: Container, Card, Tabs
- **Chart Components**: Bar Chart, Line Chart, Pie Chart (placeholders for ECharts integration)

### 3. Core Functionality

- Drag-and-drop components onto the canvas
- Select and configure component properties
- Resize and position components
- Undo/redo operations
- Preview mode
- Import/export page schemas as JSON

## Directory Structure

```
lowCodeEditor/
├── components/             # UI Components
│   ├── BaseComponents/     # Available component definitions
│   ├── Canvas/             # Canvas and drag-drop implementation
│   ├── ComponentPanel/     # Component selection panel 
│   ├── Preview/            # Preview implementation
│   └── PropertyPanel/      # Property configuration panel
├── hooks/                  # Custom hooks
├── store/                  # Pinia state management
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
├── LowCodeEditor.vue       # Main component
├── index.ts                # Public exports
└── README.md               # Documentation
```

## Usage

```vue
<template>
  <div class="editor-container">
    <LowCodeEditor />
  </div>
</template>

<script setup lang="ts">
import { LowCodeEditor } from '@/components/lowCodeEditor';
</script>

<style>
.editor-container {
  width: 100%;
  height: 100vh;
}
</style>
```

## Extending Components

To add a custom component to the editor, add a new component definition to the `BaseComponents/index.ts` file following the existing pattern:

```typescript
const customComponents: ComponentDefinition[] = [
  {
    id: uuidv4(),
    name: 'Custom Component',
    type: 'basic', // or 'layout', 'chart'
    icon: 'Icon',
    defaultProps: {
      // Default props
    },
    propsSchema: [
      // Property definitions 
    ],
    component: {
      name: 'CustomComponentWrapper',
      render(attrs: any) {
        return h('div', { /* ... */ });
      }
    }
  }
];
```

## Future Enhancements

- Component nesting support
- Code generation for Vue components
- Template system
- Custom event handlers
- Advanced chart integration with real data binding
- Responsive design preview
- Component library extensions 