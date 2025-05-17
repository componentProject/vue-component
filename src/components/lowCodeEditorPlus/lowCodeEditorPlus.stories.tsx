/**
 * Storybook story for LowCodeEditorPlus component
 */
import type { Meta, StoryObj } from '@storybook/vue3';
import LowCodeEditorPlus from './LowCodeEditorPlus.vue';
import { useEditorStore } from './store/editorStore';

// Define the meta information for the component
const meta: Meta<typeof LowCodeEditorPlus> = {
  title: 'Components/LowCodeEditorPlus',
  component: LowCodeEditorPlus,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (story) => ({
      components: { story },
      template: `
        <div style="height: 100vh; overflow: hidden;">
          <story />
        </div>
      `,
    }),
  ],
};

export default meta;

type Story = StoryObj<typeof LowCodeEditorPlus>;

/**
 * Default story with empty canvas
 */
export const Empty: Story = {
  render: () => ({
    components: { LowCodeEditorPlus },
    template: `<LowCodeEditorPlus />`,
  }),
};

/**
 * Story with a pre-populated canvas
 */
export const Populated: Story = {
  render: () => ({
    components: { LowCodeEditorPlus },
    setup() {
      // Initialize the editor with some components
      const editorStore = useEditorStore();
      
      // Add a container with a button and an input
      editorStore.addComponent({
        type: 'el-container',
        name: 'Container',
        props: {
          direction: 'vertical',
        },
        style: {
          width: '500px',
          height: '300px',
          padding: '20px',
          backgroundColor: '#f5f7fa',
          border: '1px solid #e4e7ed',
          borderRadius: '4px',
        },
        events: {},
        position: {
          x: 100,
          y: 100,
          width: 500,
          height: 300,
        },
      });
      
      // Add a button inside the container
      const containerId = editorStore.state.components[0].id;
      
      editorStore.addComponent({
        type: 'el-button',
        name: 'Button',
        props: {
          type: 'primary',
          text: 'Click Me',
        },
        style: {
          width: '120px',
          marginBottom: '20px',
        },
        events: {
          click: "console.log('Button clicked!')",
        },
        position: {
          x: 20,
          y: 30,
          width: 120,
          height: 40,
        },
      }, containerId);
      
      // Add an input inside the container
      editorStore.addComponent({
        type: 'el-input',
        name: 'Input',
        props: {
          placeholder: 'Please input',
          clearable: true,
        },
        style: {
          width: '250px',
        },
        events: {
          input: "console.log('Input changed:', $event)",
        },
        position: {
          x: 20,
          y: 100,
          width: 250,
          height: 40,
        },
      }, containerId);
      
      // Add a chart outside the container
      editorStore.addComponent({
        type: 'echarts',
        name: 'Bar Chart',
        props: {
          chartType: 'bar',
          option: {
            title: {
              text: 'Sample Bar Chart',
            },
            tooltip: {},
            xAxis: {
              data: ['A', 'B', 'C', 'D', 'E'],
            },
            yAxis: {},
            series: [
              {
                name: 'Sales',
                type: 'bar',
                data: [5, 20, 36, 10, 15],
              },
            ],
          },
        },
        style: {},
        events: {},
        position: {
          x: 650,
          y: 100,
          width: 400,
          height: 300,
        },
      });
      
      return {};
    },
    template: `<LowCodeEditorPlus />`,
  }),
};

/**
 * Story with a responsive layout example
 */
export const Responsive: Story = {
  render: () => ({
    components: { LowCodeEditorPlus },
    setup() {
      // Initialize the editor with a responsive layout
      const editorStore = useEditorStore();
      
      // Add a container with row and columns
      editorStore.addComponent({
        type: 'el-container',
        name: 'Container',
        props: {
          direction: 'vertical',
        },
        style: {
          width: '800px',
          height: '500px',
          padding: '20px',
          backgroundColor: '#f5f7fa',
          border: '1px solid #e4e7ed',
          borderRadius: '4px',
        },
        events: {},
        position: {
          x: 50,
          y: 50,
          width: 800,
          height: 500,
        },
      });
      
      const containerId = editorStore.state.components[0].id;
      
      // Add a row
      editorStore.addComponent({
        type: 'el-row',
        name: 'Row',
        props: {
          gutter: 20,
        },
        style: {
          width: '100%',
          marginBottom: '20px',
        },
        events: {},
        position: {
          x: 0,
          y: 0,
          width: 760,
          height: 100,
        },
      }, containerId);
      
      const rowId = editorStore.state.components[0].children?.[0].id;
      
      // Add columns
      editorStore.addComponent({
        type: 'el-col',
        name: 'Column 1',
        props: {
          span: 8,
        },
        style: {
          height: '100px',
          backgroundColor: '#e1f3d8',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        events: {},
        position: {
          x: 0,
          y: 0,
          width: 240,
          height: 100,
        },
      }, rowId);
      
      editorStore.addComponent({
        type: 'el-col',
        name: 'Column 2',
        props: {
          span: 8,
        },
        style: {
          height: '100px',
          backgroundColor: '#ffd2d2',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        events: {},
        position: {
          x: 260,
          y: 0,
          width: 240,
          height: 100,
        },
      }, rowId);
      
      editorStore.addComponent({
        type: 'el-col',
        name: 'Column 3',
        props: {
          span: 8,
        },
        style: {
          height: '100px',
          backgroundColor: '#d0e7ff',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        events: {},
        position: {
          x: 520,
          y: 0,
          width: 240,
          height: 100,
        },
      }, rowId);
      
      return {};
    },
    template: `<LowCodeEditorPlus />`,
  }),
}; 