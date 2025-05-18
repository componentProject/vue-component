import type { Meta, StoryObj } from '@storybook/vue3'
import LowCodeEditor from './LowCodeEditor.vue'
import type { PageSchema } from './types'

/**
 * 低代码编辑器组件
 *
 * 提供拖拽式页面构建能力，支持基础组件、布局组件和图表组件。
 */
const meta: Meta<typeof LowCodeEditor> = {
  title: '低代码编辑器',
  component: LowCodeEditor,
  tags: ['autodocs'],
  argTypes: {
    initialWidth: {
      description: '画布初始宽度',
      control: { type: 'number' },
      defaultValue: 1200,
    },
    initialHeight: {
      description: '画布初始高度',
      control: { type: 'number' },
      defaultValue: 800,
    },
    initialSchema: {
      description: '初始页面配置',
      control: 'object',
    },
    onChange: {
      description: '配置变更事件',
      action: 'changed',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '低代码编辑器组件，支持拖拽添加组件、调整大小和位置、设置属性等，可用于快速搭建页面。',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof LowCodeEditor>

/**
 * 默认空白示例
 *
 * 展示一个空白的低代码编辑器，可以从左侧组件面板拖拽组件到画布上。
 */
export const Empty: Story = {
  args: {
    initialWidth: 1200,
    initialHeight: 800,
  },
  parameters: {
    docs: {
      description: {
        story:
          '空白编辑器示例，从左侧组件面板拖拽组件到画布中，可以调整组件大小、位置，在右侧设置属性面板修改组件属性。',
      },
    },
  },
}

/**
 * 布局示例
 *
 * 展示一个包含基础布局结构的低代码编辑器页面。
 */
export const LayoutExample: Story = {
  args: {
    initialWidth: 1200,
    initialHeight: 800,
    initialSchema: {
      name: '布局示例',
      description: '包含标准布局组件的页面示例',
      components: [
        {
          id: 'container-1',
          componentId: 'el-container',
          props: {
            direction: 'vertical',
            background: '#ffffff',
            border: true,
          },
          style: {
            top: 20,
            left: 20,
            width: 1160,
            height: 760,
            zIndex: 1,
          },
          children: [
            {
              id: 'row-1',
              componentId: 'el-row',
              props: {
                gutter: 0,
                justify: 'space-between',
                align: 'middle',
              },
              style: {
                top: 20,
                left: 20,
                width: 1120,
                height: 80,
                zIndex: 2,
              },
              parentId: 'container-1',
              children: [
                {
                  id: 'col-1',
                  componentId: 'el-col',
                  props: {
                    span: 8,
                    offset: 0,
                    background: 'transparent',
                  },
                  style: {
                    top: 0,
                    left: 0,
                    width: 360,
                    height: 80,
                    zIndex: 3,
                  },
                  parentId: 'row-1',
                  children: [
                    {
                      id: 'button-1',
                      componentId: 'el-button',
                      props: {
                        type: 'primary',
                        size: 'default',
                        text: '示例按钮',
                        round: true,
                      },
                      style: {
                        top: 20,
                        left: 20,
                        width: 120,
                        height: 40,
                        zIndex: 4,
                      },
                      parentId: 'col-1',
                    },
                  ],
                },
                {
                  id: 'col-2',
                  componentId: 'el-col',
                  props: {
                    span: 16,
                    offset: 0,
                    background: 'transparent',
                  },
                  style: {
                    top: 0,
                    left: 370,
                    width: 750,
                    height: 80,
                    zIndex: 3,
                  },
                  parentId: 'row-1',
                  children: [
                    {
                      id: 'input-1',
                      componentId: 'el-input',
                      props: {
                        placeholder: '搜索...',
                        clearable: true,
                      },
                      style: {
                        top: 20,
                        left: 20,
                        width: 300,
                        height: 40,
                        zIndex: 4,
                      },
                      parentId: 'col-2',
                    },
                  ],
                },
              ],
            },
            {
              id: 'row-2',
              componentId: 'el-row',
              props: {
                gutter: 20,
                justify: 'start',
                align: 'top',
              },
              style: {
                top: 120,
                left: 20,
                width: 1120,
                height: 600,
                zIndex: 2,
              },
              parentId: 'container-1',
              children: [
                {
                  id: 'col-3',
                  componentId: 'el-col',
                  props: {
                    span: 6,
                    offset: 0,
                    background: '#f5f7fa',
                  },
                  style: {
                    top: 0,
                    left: 0,
                    width: 260,
                    height: 600,
                    zIndex: 3,
                  },
                  parentId: 'row-2',
                },
                {
                  id: 'col-4',
                  componentId: 'el-col',
                  props: {
                    span: 18,
                    offset: 0,
                    background: 'transparent',
                  },
                  style: {
                    top: 0,
                    left: 280,
                    width: 840,
                    height: 600,
                    zIndex: 3,
                  },
                  parentId: 'row-2',
                },
              ],
            },
          ],
        },
      ],
      canvas: {
        width: 1200,
        height: 800,
        background: '#f0f2f5',
      },
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as PageSchema,
  },
  parameters: {
    docs: {
      description: {
        story: '包含基础布局结构的低代码编辑器页面示例，展示了容器、行、列的嵌套使用方式。',
      },
    },
  },
}

/**
 * 仪表盘示例
 *
 * 展示一个包含数据可视化图表的仪表盘页面。
 */
export const DashboardExample: Story = {
  args: {
    initialWidth: 1200,
    initialHeight: 800,
    initialSchema: {
      name: '数据仪表盘',
      description: '包含多种图表组件的数据仪表盘示例',
      components: [
        {
          id: 'container-1',
          componentId: 'el-container',
          props: {
            direction: 'vertical',
            background: '#ffffff',
            border: true,
          },
          style: {
            top: 20,
            left: 20,
            width: 1160,
            height: 760,
            zIndex: 1,
          },
          children: [
            {
              id: 'row-header',
              componentId: 'el-row',
              props: {
                gutter: 0,
                justify: 'space-between',
                align: 'middle',
              },
              style: {
                top: 0,
                left: 0,
                width: 1160,
                height: 80,
                zIndex: 2,
              },
              parentId: 'container-1',
              children: [
                {
                  id: 'col-header',
                  componentId: 'el-col',
                  props: {
                    span: 24,
                    offset: 0,
                    background: '#f5f7fa',
                  },
                  style: {
                    top: 0,
                    left: 0,
                    width: 1160,
                    height: 80,
                    zIndex: 3,
                  },
                  parentId: 'row-header',
                },
              ],
            },
            {
              id: 'row-charts',
              componentId: 'el-row',
              props: {
                gutter: 20,
                justify: 'space-between',
                align: 'top',
              },
              style: {
                top: 100,
                left: 0,
                width: 1160,
                height: 300,
                zIndex: 2,
              },
              parentId: 'container-1',
              children: [
                {
                  id: 'col-chart1',
                  componentId: 'el-col',
                  props: {
                    span: 8,
                    offset: 0,
                    background: 'transparent',
                  },
                  style: {
                    top: 0,
                    left: 0,
                    width: 360,
                    height: 300,
                    zIndex: 3,
                  },
                  parentId: 'row-charts',
                  children: [
                    {
                      id: 'pie-chart',
                      componentId: 'echarts-pie',
                      props: {
                        title: '收入来源',
                        showLegend: true,
                        radius: '60%',
                        data: [
                          { name: '销售额', value: 335 },
                          { name: '广告费', value: 310 },
                          { name: '会员费', value: 234 },
                          { name: '其他', value: 135 },
                        ],
                      },
                      style: {
                        top: 20,
                        left: 20,
                        width: 320,
                        height: 260,
                        zIndex: 4,
                      },
                      parentId: 'col-chart1',
                    },
                  ],
                },
                {
                  id: 'col-chart2',
                  componentId: 'el-col',
                  props: {
                    span: 16,
                    offset: 0,
                    background: 'transparent',
                  },
                  style: {
                    top: 0,
                    left: 380,
                    width: 760,
                    height: 300,
                    zIndex: 3,
                  },
                  parentId: 'row-charts',
                  children: [
                    {
                      id: 'bar-chart',
                      componentId: 'echarts-bar',
                      props: {
                        title: '月度销售趋势',
                        xAxisName: '月份',
                        yAxisName: '销售额',
                        showLegend: true,
                        data: [
                          { name: '1月', value: 120 },
                          { name: '2月', value: 132 },
                          { name: '3月', value: 101 },
                          { name: '4月', value: 134 },
                          { name: '5月', value: 90 },
                          { name: '6月', value: 230 },
                        ],
                      },
                      style: {
                        top: 20,
                        left: 20,
                        width: 720,
                        height: 260,
                        zIndex: 4,
                      },
                      parentId: 'col-chart2',
                    },
                  ],
                },
              ],
            },
            {
              id: 'row-bottom',
              componentId: 'el-row',
              props: {
                gutter: 20,
                justify: 'space-between',
                align: 'top',
              },
              style: {
                top: 420,
                left: 0,
                width: 1160,
                height: 320,
                zIndex: 2,
              },
              parentId: 'container-1',
              children: [
                {
                  id: 'col-chart3',
                  componentId: 'el-col',
                  props: {
                    span: 12,
                    offset: 0,
                    background: 'transparent',
                  },
                  style: {
                    top: 0,
                    left: 0,
                    width: 560,
                    height: 320,
                    zIndex: 3,
                  },
                  parentId: 'row-bottom',
                  children: [
                    {
                      id: 'line-chart',
                      componentId: 'echarts-line',
                      props: {
                        title: '用户增长趋势',
                        xAxisName: '月份',
                        yAxisName: '用户数',
                        smooth: true,
                        showLegend: true,
                        data: [
                          { name: '1月', value: 500 },
                          { name: '2月', value: 632 },
                          { name: '3月', value: 701 },
                          { name: '4月', value: 834 },
                          { name: '5月', value: 1090 },
                          { name: '6月', value: 1230 },
                        ],
                      },
                      style: {
                        top: 20,
                        left: 20,
                        width: 520,
                        height: 280,
                        zIndex: 4,
                      },
                      parentId: 'col-chart3',
                    },
                  ],
                },
                {
                  id: 'col-chart4',
                  componentId: 'el-col',
                  props: {
                    span: 12,
                    offset: 0,
                    background: 'transparent',
                  },
                  style: {
                    top: 0,
                    left: 580,
                    width: 560,
                    height: 320,
                    zIndex: 3,
                  },
                  parentId: 'row-bottom',
                  children: [
                    {
                      id: 'scatter-chart',
                      componentId: 'g2-scatter',
                      props: {
                        title: '用户分布',
                        xAxisName: '年龄',
                        yAxisName: '消费金额',
                        showLegend: true,
                        data: [
                          { x: 20, y: 500, size: 20, category: '男性' },
                          { x: 25, y: 600, size: 30, category: '男性' },
                          { x: 30, y: 700, size: 40, category: '男性' },
                          { x: 22, y: 400, size: 20, category: '女性' },
                          { x: 28, y: 800, size: 30, category: '女性' },
                          { x: 35, y: 650, size: 40, category: '女性' },
                        ],
                      },
                      style: {
                        top: 20,
                        left: 20,
                        width: 520,
                        height: 280,
                        zIndex: 4,
                      },
                      parentId: 'col-chart4',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      canvas: {
        width: 1200,
        height: 800,
        background: '#f0f2f5',
      },
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as PageSchema,
  },
  parameters: {
    docs: {
      description: {
        story: '包含多种图表组件的数据仪表盘示例，展示了如何使用低代码编辑器构建数据可视化仪表盘。',
      },
    },
  },
}
