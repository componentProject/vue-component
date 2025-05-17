/**
 * 低代码编辑器组件的 Storybook 故事
 */
import type { Meta, StoryObj } from '@storybook/vue3';
import { LowCodeEditor } from './index';
import type { ComponentData } from './types';

/**
 * 元数据
 */
const meta = {
  title: 'Components/LowCodeEditor',
  component: LowCodeEditor,
  argTypes: {
    title: { control: 'text' },
    canvasWidth: { control: { type: 'number', min: 600, max: 2000, step: 100 } },
    canvasHeight: { control: { type: 'number', min: 400, max: 2000, step: 100 } },
    initialComponents: { control: 'object' },
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof LowCodeEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 空画布示例
 */
export const Empty: Story = {
  args: {
    title: '低代码编辑器示例',
    canvasWidth: 1200,
    canvasHeight: 800,
    initialComponents: [],
  },
};

/**
 * 布局示例 - 使用行和列组件
 */
export const LayoutExample: Story = {
  args: {
    title: '布局示例',
    canvasWidth: 1200,
    canvasHeight: 800,
    initialComponents: [
      {
        id: 'container1',
        type: 'container',
        name: '容器',
        props: {
          backgroundColor: '#ffffff',
          border: '1px solid #eeeeee',
          borderRadius: 8,
          padding: 16,
        },
        style: {
          width: 1000,
          height: 600,
          left: 100,
          top: 100,
          zIndex: 1,
        },
        children: [
          {
            id: 'text1',
            type: 'text',
            name: '文本',
            props: {
              content: '这是一个布局示例',
              fontSize: 20,
              color: '#333333',
              textAlign: 'center',
              fontWeight: 'bold',
            },
            style: {
              width: 300,
              height: 50,
              left: 350,
              top: 30,
              zIndex: 2,
            },
          },
          {
            id: 'row1',
            type: 'row',
            name: '行',
            props: {
              gutter: 20,
              justify: 'center',
              align: 'middle',
            },
            style: {
              width: 900,
              height: 400,
              left: 50,
              top: 100,
              zIndex: 2,
            },
            children: [
              {
                id: 'col1',
                type: 'column',
                name: '列1',
                props: {
                  span: 8,
                  offset: 0,
                },
                style: {
                  width: 280,
                  height: 380,
                  left: 50,
                  top: 10,
                  zIndex: 3,
                  backgroundColor: '#f5f7fa',
                  borderRadius: '4px',
                },
                children: [
                  {
                    id: 'card1',
                    type: 'card',
                    name: '卡片1',
                    props: {
                      title: '卡片标题1',
                      shadow: 'hover',
                    },
                    style: {
                      width: 240,
                      height: 340,
                      left: 20,
                      top: 20,
                      zIndex: 4,
                    },
                    children: [
                      {
                        id: 'text2',
                        type: 'text',
                        name: '文本',
                        props: {
                          content: '卡片内容区域1，可以放置任何内容',
                          fontSize: 14,
                          color: '#606266',
                          textAlign: 'center',
                          fontWeight: 'normal',
                        },
                        style: {
                          width: 200,
                          height: 200,
                          left: 20,
                          top: 70,
                          zIndex: 5,
                        },
                      },
                    ],
                  },
                ],
              },
              {
                id: 'col2',
                type: 'column',
                name: '列2',
                props: {
                  span: 8,
                  offset: 0,
                },
                style: {
                  width: 280,
                  height: 380,
                  left: 350,
                  top: 10,
                  zIndex: 3,
                  backgroundColor: '#f5f7fa',
                  borderRadius: '4px',
                },
                children: [
                  {
                    id: 'card2',
                    type: 'card',
                    name: '卡片2',
                    props: {
                      title: '卡片标题2',
                      shadow: 'hover',
                    },
                    style: {
                      width: 240,
                      height: 340,
                      left: 20,
                      top: 20,
                      zIndex: 4,
                    },
                    children: [
                      {
                        id: 'text3',
                        type: 'text',
                        name: '文本',
                        props: {
                          content: '卡片内容区域2，可以放置任何内容',
                          fontSize: 14,
                          color: '#606266',
                          textAlign: 'center',
                          fontWeight: 'normal',
                        },
                        style: {
                          width: 200,
                          height: 200,
                          left: 20,
                          top: 70,
                          zIndex: 5,
                        },
                      },
                    ],
                  },
                ],
              },
              {
                id: 'col3',
                type: 'column',
                name: '列3',
                props: {
                  span: 8,
                  offset: 0,
                },
                style: {
                  width: 280,
                  height: 380,
                  left: 650,
                  top: 10,
                  zIndex: 3,
                  backgroundColor: '#f5f7fa',
                  borderRadius: '4px',
                },
                children: [
                  {
                    id: 'card3',
                    type: 'card',
                    name: '卡片3',
                    props: {
                      title: '卡片标题3',
                      shadow: 'hover',
                    },
                    style: {
                      width: 240,
                      height: 340,
                      left: 20,
                      top: 20,
                      zIndex: 4,
                    },
                    children: [
                      {
                        id: 'text4',
                        type: 'text',
                        name: '文本',
                        props: {
                          content: '卡片内容区域3，可以放置任何内容',
                          fontSize: 14,
                          color: '#606266',
                          textAlign: 'center',
                          fontWeight: 'normal',
                        },
                        style: {
                          width: 200,
                          height: 200,
                          left: 20,
                          top: 70,
                          zIndex: 5,
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ] as ComponentData[],
  },
};

/**
 * 仪表盘示例 - 使用图表组件
 */
export const DashboardExample: Story = {
  args: {
    title: '仪表盘示例',
    canvasWidth: 1200,
    canvasHeight: 800,
    initialComponents: [
      {
        id: 'container1',
        type: 'container',
        name: '容器',
        props: {
          backgroundColor: '#ffffff',
          border: '1px solid #eeeeee',
          borderRadius: 8,
          padding: 20,
        },
        style: {
          width: 1100,
          height: 700,
          left: 50,
          top: 50,
          zIndex: 1,
        },
        children: [
          {
            id: 'text1',
            type: 'text',
            name: '标题',
            props: {
              content: '销售数据分析仪表盘',
              fontSize: 24,
              color: '#303133',
              textAlign: 'center',
              fontWeight: 'bold',
            },
            style: {
              width: 400,
              height: 50,
              left: 350,
              top: 20,
              zIndex: 2,
            },
          },
          {
            id: 'text2',
            type: 'text',
            name: '副标题',
            props: {
              content: '最近7天销售数据可视化分析',
              fontSize: 14,
              color: '#909399',
              textAlign: 'center',
              fontWeight: 'normal',
            },
            style: {
              width: 300,
              height: 30,
              left: 400,
              top: 70,
              zIndex: 2,
            },
          },
          {
            id: 'lineChart1',
            type: 'lineChart',
            name: '销售趋势',
            props: {
              title: '销售趋势 (近7天)',
              xAxisData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
              seriesData: [150, 230, 224, 218, 135, 147, 260],
              smooth: true,
              showSymbol: true,
              areaStyle: true,
              color: '#409EFF',
            },
            style: {
              width: 500,
              height: 300,
              left: 50,
              top: 120,
              zIndex: 2,
            },
          },
          {
            id: 'barChart1',
            type: 'barChart',
            name: '各类别销售情况',
            props: {
              title: '各类别销售情况',
              xAxisData: ['电子产品', '服装', '食品', '家居', '化妆品'],
              seriesData: [320, 240, 180, 150, 200],
              showBackground: true,
              color: '#67C23A',
            },
            style: {
              width: 450,
              height: 300,
              left: 600,
              top: 120,
              zIndex: 2,
            },
          },
          {
            id: 'pieChart1',
            type: 'pieChart',
            name: '销售占比',
            props: {
              title: '销售占比',
              data: [
                { value: 42, name: '线上销售' },
                { value: 28, name: '线下销售' },
                { value: 30, name: '分销渠道' },
              ],
              showLegend: true,
              roseType: false,
            },
            style: {
              width: 300,
              height: 300,
              left: 150,
              top: 450,
              zIndex: 2,
            },
          },
          {
            id: 'scatterChart1',
            type: 'scatterChart',
            name: '客户分布',
            props: {
              title: '客户年龄与消费金额分布',
              data: [
                [18, 120],
                [25, 180],
                [30, 220],
                [35, 280],
                [40, 150],
                [45, 160],
                [50, 100],
                [55, 80],
                [60, 90],
              ],
              symbol: 'circle',
              symbolSize: 12,
              color: '#E6A23C',
            },
            style: {
              width: 400,
              height: 300,
              left: 600,
              top: 450,
              zIndex: 2,
            },
          },
        ],
      },
    ] as ComponentData[],
  },
}; 