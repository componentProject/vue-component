/**
 * Component registry with all available components
 */
import type { ComponentDefinition } from '../types';
import {
  Edit,
  Search,
  Menu,
  Document,
  Setting,
  Plus,
  Minus,
  Delete,
  Grid,
  Operation,
  House,
  PictureFilled,
  CopyDocument,
  Link,
  List,
  Picture
} from '@element-plus/icons-vue';

/**
 * List of all available components in the component palette
 */
export const availableComponents: ComponentDefinition[] = [
  // Basic Components
  {
    id: 'el-button',
    type: 'el-button',
    category: 'basic',
    name: 'Button',
    icon: 'Plus',
    defaultProps: {
      type: 'primary',
      size: 'default',
      text: 'Button',
    },
    defaultStyle: {
      width: '100px',
      height: '40px',
    },
    defaultEvents: {},
  },
  {
    id: 'el-input',
    type: 'el-input',
    category: 'basic',
    name: 'Input',
    icon: 'Edit',
    defaultProps: {
      placeholder: 'Please input',
      clearable: true,
    },
    defaultStyle: {
      width: '200px',
    },
    defaultEvents: {},
  },
  {
    id: 'el-select',
    type: 'el-select',
    category: 'basic',
    name: 'Select',
    icon: 'Menu',
    defaultProps: {
      placeholder: 'Please select',
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ],
    },
    defaultStyle: {
      width: '200px',
    },
    defaultEvents: {},
  },
  {
    id: 'el-switch',
    type: 'el-switch',
    category: 'basic',
    name: 'Switch',
    icon: 'Switch',
    defaultProps: {
      activeColor: '#13ce66',
      inactiveColor: '#ff4949',
    },
    defaultStyle: {},
    defaultEvents: {},
  },
  {
    id: 'el-radio',
    type: 'el-radio-group',
    category: 'basic',
    name: 'Radio',
    icon: 'Radio',
    defaultProps: {
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ],
    },
    defaultStyle: {},
    defaultEvents: {},
  },
  {
    id: 'el-checkbox',
    type: 'el-checkbox-group',
    category: 'basic',
    name: 'Checkbox',
    icon: 'Checkbox',
    defaultProps: {
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ],
    },
    defaultStyle: {},
    defaultEvents: {},
  },
  {
    id: 'el-date-picker',
    type: 'el-date-picker',
    category: 'basic',
    name: 'Date Picker',
    icon: 'DatePicker',
    defaultProps: {
      type: 'date',
      placeholder: 'Select date',
    },
    defaultStyle: {
      width: '200px',
    },
    defaultEvents: {},
  },
  {
    id: 'el-time-picker',
    type: 'el-time-picker',
    category: 'basic',
    name: 'Time Picker',
    icon: 'TimePicker',
    defaultProps: {
      placeholder: 'Select time',
    },
    defaultStyle: {
      width: '200px',
    },
    defaultEvents: {},
  },
  {
    id: 'el-input-number',
    type: 'el-input-number',
    category: 'basic',
    name: 'InputNumber',
    icon: 'InputNumber',
    defaultProps: {
      min: 1,
      max: 10,
      step: 1,
    },
    defaultStyle: {},
    defaultEvents: {},
  },
  {
    id: 'el-rate',
    type: 'el-rate',
    category: 'basic',
    name: 'Rate',
    icon: 'Rate',
    defaultProps: {
      max: 5,
      allowHalf: true,
    },
    defaultStyle: {},
    defaultEvents: {},
  },
  {
    id: 'el-slider',
    type: 'el-slider',
    category: 'basic',
    name: 'Slider',
    icon: 'Slider',
    defaultProps: {
      min: 0,
      max: 100,
      step: 1,
    },
    defaultStyle: {
      width: '200px',
    },
    defaultEvents: {},
  },
  {
    id: 'el-color-picker',
    type: 'el-color-picker',
    category: 'basic',
    name: 'ColorPicker',
    icon: 'ColorPicker',
    defaultProps: {},
    defaultStyle: {},
    defaultEvents: {},
  },
  {
    id: 'el-upload',
    type: 'el-upload',
    category: 'basic',
    name: 'Upload',
    icon: 'Upload',
    defaultProps: {
      action: 'https://example.com/upload',
      multiple: true,
      limit: 5,
    },
    defaultStyle: {},
    defaultEvents: {},
  },

  // Layout Components
  {
    id: 'el-container',
    type: 'el-container',
    category: 'layout',
    name: 'Container',
    icon: 'Container',
    defaultProps: {
      direction: 'vertical',
    },
    defaultStyle: {
      width: '100%',
      height: '300px',
      border: '1px dashed #ccc',
    },
    defaultEvents: {},
    children: [],
  },
  {
    id: 'el-row',
    type: 'el-row',
    category: 'layout',
    name: 'Row',
    icon: 'Row',
    defaultProps: {
      gutter: 20,
    },
    defaultStyle: {
      width: '100%',
      minHeight: '50px',
    },
    defaultEvents: {},
    children: [],
  },
  {
    id: 'el-col',
    type: 'el-col',
    category: 'layout',
    name: 'Column',
    icon: 'Col',
    defaultProps: {
      span: 12,
    },
    defaultStyle: {
      minHeight: '50px',
      border: '1px dashed #ccc',
    },
    defaultEvents: {},
    children: [],
  },
  {
    id: 'el-divider',
    type: 'el-divider',
    category: 'layout',
    name: 'Divider',
    icon: 'Divider',
    defaultProps: {
      direction: 'horizontal',
      contentPosition: 'center',
    },
    defaultStyle: {
      margin: '20px 0',
    },
    defaultEvents: {},
  },
  {
    id: 'el-card',
    type: 'el-card',
    category: 'layout',
    name: 'Card',
    icon: 'Card',
    defaultProps: {
      shadow: 'always',
      title: 'Card Title',
    },
    defaultStyle: {
      width: '100%',
      minHeight: '100px',
    },
    defaultEvents: {},
    children: [],
  },
  {
    id: 'el-tabs',
    type: 'el-tabs',
    category: 'layout',
    name: 'Tabs',
    icon: 'Tabs',
    defaultProps: {
      type: 'border-card',
      tabs: [
        { name: 'tab1', label: 'Tab 1', content: 'Tab 1 content' },
        { name: 'tab2', label: 'Tab 2', content: 'Tab 2 content' },
        { name: 'tab3', label: 'Tab 3', content: 'Tab 3 content' },
      ],
    },
    defaultStyle: {
      width: '100%',
    },
    defaultEvents: {},
  },
  {
    id: 'el-table',
    type: 'el-table',
    category: 'layout',
    name: 'Table',
    icon: 'Table',
    defaultProps: {
      border: true,
      stripe: true,
      data: [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Jane', age: 25 },
        { id: 3, name: 'Bob', age: 35 },
      ],
      columns: [
        { prop: 'id', label: 'ID', width: '80' },
        { prop: 'name', label: 'Name', width: '120' },
        { prop: 'age', label: 'Age', width: '80' },
      ],
    },
    defaultStyle: {
      width: '100%',
    },
    defaultEvents: {},
  },

  // Chart Components (ECharts)
  {
    id: 'echarts-bar',
    type: 'echarts',
    category: 'chart',
    name: 'Bar Chart',
    icon: 'Menu',
    defaultProps: {
      chartType: 'bar',
      option: {
        title: {
          text: 'Bar Chart',
        },
        tooltip: {},
        xAxis: {
          data: ['A', 'B', 'C', 'D', 'E', 'F'],
        },
        yAxis: {},
        series: [
          {
            name: 'Sales',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      },
    },
    defaultStyle: {
      width: '100%',
      height: '300px',
    },
    defaultEvents: {},
  },
  {
    id: 'echarts-line',
    type: 'echarts',
    category: 'chart',
    name: 'Line Chart',
    icon: 'Menu',
    defaultProps: {
      chartType: 'line',
      option: {
        title: {
          text: 'Line Chart',
        },
        tooltip: {},
        xAxis: {
          data: ['A', 'B', 'C', 'D', 'E', 'F'],
        },
        yAxis: {},
        series: [
          {
            name: 'Sales',
            type: 'line',
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      },
    },
    defaultStyle: {
      width: '100%',
      height: '300px',
    },
    defaultEvents: {},
  },
  {
    id: 'echarts-pie',
    type: 'echarts',
    category: 'chart',
    name: 'Pie Chart',
    icon: 'Menu',
    defaultProps: {
      chartType: 'pie',
      option: {
        title: {
          text: 'Pie Chart',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '60%',
            data: [
              { value: 1048, name: 'A' },
              { value: 735, name: 'B' },
              { value: 580, name: 'C' },
              { value: 484, name: 'D' },
              { value: 300, name: 'E' },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      },
    },
    defaultStyle: {
      width: '100%',
      height: '300px',
    },
    defaultEvents: {},
  },

  // Chart Components (G2)
  {
    id: 'g2-bar',
    type: 'g2',
    category: 'chart',
    name: 'G2 Bar Chart',
    icon: 'Menu',
    defaultProps: {
      chartType: 'bar',
      data: [
        { type: 'A', value: 27 },
        { type: 'B', value: 25 },
        { type: 'C', value: 18 },
        { type: 'D', value: 15 },
        { type: 'E', value: 10 },
        { type: 'F', value: 5 },
      ],
      config: {
        xField: 'type',
        yField: 'value',
        title: 'G2 Bar Chart',
      },
    },
    defaultStyle: {
      width: '100%',
      height: '300px',
    },
    defaultEvents: {},
  },
  {
    id: 'g2-line',
    type: 'g2',
    category: 'chart',
    name: 'G2 Line Chart',
    icon: 'Menu',
    defaultProps: {
      chartType: 'line',
      data: [
        { month: 'Jan', value: 5 },
        { month: 'Feb', value: 20 },
        { month: 'Mar', value: 36 },
        { month: 'Apr', value: 10 },
        { month: 'May', value: 15 },
        { month: 'Jun', value: 20 },
      ],
      config: {
        xField: 'month',
        yField: 'value',
        title: 'G2 Line Chart',
      },
    },
    defaultStyle: {
      width: '100%',
      height: '300px',
    },
    defaultEvents: {},
  },
  {
    id: 'g2-pie',
    type: 'g2',
    category: 'chart',
    name: 'G2 Pie Chart',
    icon: 'Menu',
    defaultProps: {
      chartType: 'pie',
      data: [
        { type: 'A', value: 27 },
        { type: 'B', value: 25 },
        { type: 'C', value: 18 },
        { type: 'D', value: 15 },
        { type: 'E', value: 10 },
      ],
      config: {
        colorField: 'type',
        angleField: 'value',
        radius: 0.8,
        title: 'G2 Pie Chart',
      },
    },
    defaultStyle: {
      width: '100%',
      height: '300px',
    },
    defaultEvents: {},
  },

  // Custom components
  {
    id: 'custom-text',
    type: 'custom-text',
    category: 'custom',
    name: 'Text',
    icon: 'Document',
    defaultProps: {
      content: 'Text content',
      textAlign: 'left',
      fontSize: '14px',
      fontWeight: 'normal',
    },
    defaultStyle: {
      padding: '10px',
    },
    defaultEvents: {},
  },
  {
    id: 'custom-image',
    type: 'custom-image',
    category: 'custom',
    name: 'Image',
    icon: 'Image',
    defaultProps: {
      src: 'https://via.placeholder.com/300x200',
      alt: 'Image',
      fit: 'cover',
    },
    defaultStyle: {
      width: '300px',
      height: '200px',
    },
    defaultEvents: {},
  },
];

/**
 * Find a component by its type
 */
export const findComponentByType = (type: string): ComponentDefinition | undefined => {
  try {
    return availableComponents.find(comp => comp.type === type);
  } catch (error) {
    console.error(`Error finding component by type ${type}:`, error);
    return undefined;
  }
}; 