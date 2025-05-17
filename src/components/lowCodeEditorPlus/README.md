# Low Code Editor Plus

A powerful low-code editor component for Vue 3 that enables drag-and-drop UI building with Element Plus, ECharts, and G2 components.

## Features

- **Component Palette**: Drag and drop Element Plus components, charts, and custom elements
- **Visual Canvas**: Magnetic alignment, resizing, nested components, responsive preview
- **Property Editor**: Edit component properties, styles, and events in real-time
- **Advanced Features**:
  - Import/export designs as JSON
  - Undo/redo capability
  - Component locking and grouping
  - Responsive design preview

## Usage

### Basic Usage

```vue
<template>
  <div style="height: 800px;">
    <LowCodeEditorPlus />
  </div>
</template>

<script setup>
import { LowCodeEditorPlus } from '@/components/lowCodeEditorPlus';
</script>
```

### Importing/Exporting Designs

The editor includes built-in import/export functionality that allows designs to be saved as JSON and loaded later.

### Component Registration

The editor includes a wide range of Element Plus components, ECharts, and G2 visualizations out of the box.

You can extend the available components by modifying the `useComponentRegistry.ts` file.

## Props

| Prop                | Type      | Default | Description                              |
|---------------------|-----------|---------|------------------------------------------|
| `initialComponents` | `Array`   | `[]`    | Initial components to load in the editor |
| `height`            | `String`  | `100%`  | Height of the editor                     |
| `width`             | `String`  | `100%`  | Width of the editor                      |

## Events

| Event           | Description                                   | Parameters              |
|-----------------|-----------------------------------------------|------------------------|
| `change`        | Fired when the editor content changes         | `{ components: Array }` |
| `select`        | Fired when a component is selected            | `{ component: Object }` |
| `import`        | Fired when a design is imported               | `{ components: Array }` |
| `export`        | Fired when a design is exported               | `{ schema: Object }`    |

## Development

### Adding New Component Types

To add new component types to the palette:

1. Open `hooks/useComponentRegistry.ts`
2. Add your component definition to the `availableComponents` array
3. Include default props, styles, and other required configuration

### Customizing the Canvas

The canvas appearance and behavior can be customized in `components/CanvasArea.vue`.

### Modifying the Property Editor

To add new property editing capabilities, modify `components/PropertyEditor.vue`.

## Dependencies

- Vue 3
- Element Plus
- ECharts
- G2 Charts
- Tailwind CSS 