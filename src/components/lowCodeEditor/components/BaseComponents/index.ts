import { v4 as uuidv4 } from 'uuid';
import { useEditorStore } from '../../store/editor';
import type { ComponentDefinition } from '../../types';
import { h } from 'vue';

// Import Element Plus icons
import {
  Edit,
  Search,
  Check,
  Message,
  Star,
  Delete,
  Plus,
  Calendar,
  Histogram,
  PieChart,
  TrendCharts,
  Tickets,
  Collection,
  Grid,
  Menu
} from '@element-plus/icons-vue';

/**
 * Register all available components into the editor store
 */
export function registerBaseComponents() {
  try {
    const editorStore = useEditorStore();

    // Register basic components
    registerBasicComponents(editorStore);
    
    // Register layout components
    registerLayoutComponents(editorStore);
    
    // Register chart components
    registerChartComponents(editorStore);
  } catch (error) {
    console.error('Error registering base components:', error);
  }
}

/**
 * Register basic UI components
 * @param editorStore Editor store instance
 */
function registerBasicComponents(editorStore: ReturnType<typeof useEditorStore>) {
  try {
    const basicComponents: ComponentDefinition[] = [
      // Button component
      {
        id: uuidv4(),
        name: 'Button',
        type: 'basic',
        icon: 'Plus',
        defaultProps: {
          type: 'primary',
          size: 'default',
          text: 'Button',
          disabled: false,
          round: false,
        },
        propsSchema: [
          {
            name: 'text',
            label: 'Text',
            type: 'string',
            default: 'Button'
          },
          {
            name: 'type',
            label: 'Type',
            type: 'select',
            default: 'primary',
            options: [
              { label: 'Primary', value: 'primary' },
              { label: 'Success', value: 'success' },
              { label: 'Warning', value: 'warning' },
              { label: 'Danger', value: 'danger' },
              { label: 'Info', value: 'info' },
              { label: 'Text', value: 'text' }
            ]
          },
          {
            name: 'size',
            label: 'Size',
            type: 'select',
            default: 'default',
            options: [
              { label: 'Large', value: 'large' },
              { label: 'Default', value: 'default' },
              { label: 'Small', value: 'small' }
            ]
          },
          {
            name: 'disabled',
            label: 'Disabled',
            type: 'boolean',
            default: false
          },
          {
            name: 'round',
            label: 'Round',
            type: 'boolean',
            default: false
          }
        ],
        component: {
          name: 'ElButtonWrapper',
          render(attrs: any) {
            return h('el-button', {
              type: attrs.type,
              size: attrs.size,
              disabled: attrs.disabled,
              round: attrs.round
            }, { default: () => attrs.text });
          }
        }
      },
      
      // Input component
      {
        id: uuidv4(),
        name: 'Input',
        type: 'basic',
        icon: 'Edit',
        defaultProps: {
          placeholder: 'Please input',
          clearable: true,
          disabled: false,
          type: 'text',
          maxlength: 50,
          showWordLimit: false
        },
        propsSchema: [
          {
            name: 'placeholder',
            label: 'Placeholder',
            type: 'string',
            default: 'Please input'
          },
          {
            name: 'clearable',
            label: 'Clearable',
            type: 'boolean',
            default: true
          },
          {
            name: 'disabled',
            label: 'Disabled',
            type: 'boolean',
            default: false
          },
          {
            name: 'type',
            label: 'Type',
            type: 'select',
            default: 'text',
            options: [
              { label: 'Text', value: 'text' },
              { label: 'Textarea', value: 'textarea' },
              { label: 'Number', value: 'number' },
              { label: 'Password', value: 'password' }
            ]
          },
          {
            name: 'maxlength',
            label: 'Max Length',
            type: 'number',
            default: 50,
            min: 1,
            max: 500
          },
          {
            name: 'showWordLimit',
            label: 'Show Word Limit',
            type: 'boolean',
            default: false
          }
        ],
        component: {
          name: 'ElInputWrapper',
          render(attrs: any) {
            const props = {
              type: attrs.type,
              placeholder: attrs.placeholder,
              clearable: attrs.clearable,
              disabled: attrs.disabled,
              maxlength: attrs.maxlength,
              'show-word-limit': attrs.showWordLimit
            };

            if (attrs.type === 'textarea') {
              return h('el-input', { ...props, rows: 4 });
            }
            
            return h('el-input', props);
          }
        }
      },
      
      // Select component
      {
        id: uuidv4(),
        name: 'Select',
        type: 'basic',
        icon: 'Tickets',
        defaultProps: {
          placeholder: 'Please select',
          clearable: true,
          disabled: false,
          multiple: false,
          options: [
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
            { label: 'Option 3', value: '3' }
          ]
        },
        propsSchema: [
          {
            name: 'placeholder',
            label: 'Placeholder',
            type: 'string',
            default: 'Please select'
          },
          {
            name: 'clearable',
            label: 'Clearable',
            type: 'boolean',
            default: true
          },
          {
            name: 'disabled',
            label: 'Disabled',
            type: 'boolean',
            default: false
          },
          {
            name: 'multiple',
            label: 'Multiple',
            type: 'boolean',
            default: false
          }
        ],
        component: {
          name: 'ElSelectWrapper',
          render(attrs: any) {
            const options = (attrs.options || []).map((option: any) => {
              return h('el-option', {
                key: option.value,
                label: option.label,
                value: option.value
              });
            });
            
            return h('el-select', {
              placeholder: attrs.placeholder,
              clearable: attrs.clearable,
              disabled: attrs.disabled,
              multiple: attrs.multiple,
              style: 'width: 100%'
            }, { default: () => options });
          }
        }
      },
      
      // Checkbox component
      {
        id: uuidv4(),
        name: 'Checkbox',
        type: 'basic',
        icon: 'Check',
        defaultProps: {
          label: 'Checkbox',
          disabled: false,
          checked: false
        },
        propsSchema: [
          {
            name: 'label',
            label: 'Label',
            type: 'string',
            default: 'Checkbox'
          },
          {
            name: 'disabled',
            label: 'Disabled',
            type: 'boolean',
            default: false
          },
          {
            name: 'checked',
            label: 'Checked',
            type: 'boolean',
            default: false
          }
        ],
        component: {
          name: 'ElCheckboxWrapper',
          render(attrs: any) {
            return h('el-checkbox', {
              label: attrs.label,
              disabled: attrs.disabled,
              modelValue: attrs.checked
            });
          }
        }
      },
      
      // Date Picker component
      {
        id: uuidv4(),
        name: 'DatePicker',
        type: 'basic',
        icon: 'Calendar',
        defaultProps: {
          placeholder: 'Select date',
          type: 'date',
          disabled: false,
          clearable: true
        },
        propsSchema: [
          {
            name: 'placeholder',
            label: 'Placeholder',
            type: 'string',
            default: 'Select date'
          },
          {
            name: 'type',
            label: 'Type',
            type: 'select',
            default: 'date',
            options: [
              { label: 'Date', value: 'date' },
              { label: 'Week', value: 'week' },
              { label: 'Month', value: 'month' },
              { label: 'Year', value: 'year' },
              { label: 'Date Range', value: 'daterange' }
            ]
          },
          {
            name: 'disabled',
            label: 'Disabled',
            type: 'boolean',
            default: false
          },
          {
            name: 'clearable',
            label: 'Clearable',
            type: 'boolean',
            default: true
          }
        ],
        component: {
          name: 'ElDatePickerWrapper',
          render(attrs: any) {
            return h('el-date-picker', {
              type: attrs.type,
              placeholder: attrs.placeholder,
              disabled: attrs.disabled,
              clearable: attrs.clearable,
              style: 'width: 100%'
            });
          }
        }
      },
    ];
    
    editorStore.registerComponentDefinitions(basicComponents);
  } catch (error) {
    console.error('Error registering basic components:', error);
  }
}

/**
 * Register layout components
 * @param editorStore Editor store instance
 */
function registerLayoutComponents(editorStore: ReturnType<typeof useEditorStore>) {
  try {
    const layoutComponents: ComponentDefinition[] = [
      // Container component
      {
        id: uuidv4(),
        name: 'Container',
        type: 'layout',
        icon: 'Grid',
        defaultProps: {
          direction: 'vertical',
          background: '#ffffff',
          padding: '20px'
        },
        propsSchema: [
          {
            name: 'direction',
            label: 'Direction',
            type: 'select',
            default: 'vertical',
            options: [
              { label: 'Vertical', value: 'vertical' },
              { label: 'Horizontal', value: 'horizontal' }
            ]
          },
          {
            name: 'background',
            label: 'Background',
            type: 'color',
            default: '#ffffff'
          },
          {
            name: 'padding',
            label: 'Padding',
            type: 'string',
            default: '20px'
          }
        ],
        component: {
          name: 'ElContainerWrapper',
          render(attrs: any) {
            return h('el-container', {
              direction: attrs.direction,
              style: {
                backgroundColor: attrs.background,
                padding: attrs.padding,
                width: '100%',
                height: '100%'
              }
            });
          }
        }
      },
      
      // Card component
      {
        id: uuidv4(),
        name: 'Card',
        type: 'layout',
        icon: 'Collection',
        defaultProps: {
          title: 'Card Title',
          shadow: 'always'
        },
        propsSchema: [
          {
            name: 'title',
            label: 'Title',
            type: 'string',
            default: 'Card Title'
          },
          {
            name: 'shadow',
            label: 'Shadow',
            type: 'select',
            default: 'always',
            options: [
              { label: 'Always', value: 'always' },
              { label: 'Hover', value: 'hover' },
              { label: 'Never', value: 'never' }
            ]
          }
        ],
        component: {
          name: 'ElCardWrapper',
          render(attrs: any) {
            return h('el-card', {
              shadow: attrs.shadow,
              style: {
                width: '100%',
                height: '100%'
              }
            }, {
              header: () => h('div', {}, attrs.title),
              default: () => h('div', { style: 'padding: 20px;' }, 'Card content')
            });
          }
        }
      },
      
      // Tabs component
      {
        id: uuidv4(),
        name: 'Tabs',
        type: 'layout',
        icon: 'Menu',
        defaultProps: {
          type: 'border-card',
          tabs: [
            { name: 'tab1', label: 'Tab 1' },
            { name: 'tab2', label: 'Tab 2' },
            { name: 'tab3', label: 'Tab 3' }
          ]
        },
        propsSchema: [
          {
            name: 'type',
            label: 'Type',
            type: 'select',
            default: 'border-card',
            options: [
              { label: 'Card', value: 'card' },
              { label: 'Border Card', value: 'border-card' }
            ]
          }
        ],
        component: {
          name: 'ElTabsWrapper',
          render(attrs: any) {
            const tabPanes = (attrs.tabs || []).map((tab: any) => {
              return h('el-tab-pane', {
                key: tab.name,
                label: tab.label,
                name: tab.name
              }, {
                default: () => h('div', { style: 'padding: 20px;' }, `Content of ${tab.label}`)
              });
            });
            
            return h('el-tabs', {
              type: attrs.type,
              style: {
                width: '100%',
                height: '100%'
              }
            }, {
              default: () => tabPanes
            });
          }
        }
      }
    ];
    
    editorStore.registerComponentDefinitions(layoutComponents);
  } catch (error) {
    console.error('Error registering layout components:', error);
  }
}

/**
 * Register chart components (based on ECharts)
 * @param editorStore Editor store instance
 */
function registerChartComponents(editorStore: ReturnType<typeof useEditorStore>) {
  try {
    const chartComponents: ComponentDefinition[] = [
      // Bar Chart
      {
        id: uuidv4(),
        name: 'Bar Chart',
        type: 'chart',
        icon: 'Histogram',
        defaultProps: {
          title: 'Bar Chart',
          data: [
            { name: 'Category 1', value: 320 },
            { name: 'Category 2', value: 240 },
            { name: 'Category 3', value: 380 },
            { name: 'Category 4', value: 150 },
            { name: 'Category 5', value: 270 }
          ]
        },
        propsSchema: [
          {
            name: 'title',
            label: 'Title',
            type: 'string',
            default: 'Bar Chart'
          }
        ],
        component: {
          name: 'BarChartWrapper',
          render(attrs: any) {
            return h('div', {
              style: 'width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background-color: #f5f7fa;'
            }, [
              h('div', {
                style: 'font-size: 14px; color: #606266;'
              }, [
                attrs.title || 'Bar Chart',
                h('div', {
                  style: 'font-size: 12px; color: #909399; margin-top: 5px; font-style: italic;'
                }, '(Bar Chart Component)')
              ])
            ]);
          }
        }
      },
      
      // Line Chart
      {
        id: uuidv4(),
        name: 'Line Chart',
        type: 'chart',
        icon: 'TrendCharts',
        defaultProps: {
          title: 'Line Chart',
          smooth: true
        },
        propsSchema: [
          {
            name: 'title',
            label: 'Title',
            type: 'string',
            default: 'Line Chart'
          },
          {
            name: 'smooth',
            label: 'Smooth',
            type: 'boolean',
            default: true
          }
        ],
        component: {
          name: 'LineChartWrapper',
          render(attrs: any) {
            return h('div', {
              style: 'width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background-color: #f5f7fa;'
            }, [
              h('div', {
                style: 'font-size: 14px; color: #606266;'
              }, [
                attrs.title || 'Line Chart',
                h('div', {
                  style: 'font-size: 12px; color: #909399; margin-top: 5px; font-style: italic;'
                }, '(Line Chart Component)')
              ])
            ]);
          }
        }
      },
      
      // Pie Chart
      {
        id: uuidv4(),
        name: 'Pie Chart',
        type: 'chart',
        icon: 'PieChart',
        defaultProps: {
          title: 'Pie Chart',
          radius: '70%'
        },
        propsSchema: [
          {
            name: 'title',
            label: 'Title',
            type: 'string',
            default: 'Pie Chart'
          },
          {
            name: 'radius',
            label: 'Radius',
            type: 'string',
            default: '70%'
          }
        ],
        component: {
          name: 'PieChartWrapper',
          render(attrs: any) {
            return h('div', {
              style: 'width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background-color: #f5f7fa;'
            }, [
              h('div', {
                style: 'font-size: 14px; color: #606266;'
              }, [
                attrs.title || 'Pie Chart',
                h('div', {
                  style: 'font-size: 12px; color: #909399; margin-top: 5px; font-style: italic;'
                }, '(Pie Chart Component)')
              ])
            ]);
          }
        }
      }
    ];
    
    editorStore.registerComponentDefinitions(chartComponents);
  } catch (error) {
    console.error('Error registering chart components:', error);
  }
} 