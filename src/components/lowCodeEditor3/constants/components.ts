/**
 * 组件常量定义文件
 * 包含基础组件、布局组件和图表组件的定义
 */
import type { ComponentDefinition } from '../types';

/**
 * 基础组件定义
 */
export const BASIC_COMPONENTS: ComponentDefinition[] = [
  {
    type: 'text',
    name: '文本',
    icon: 'document',
    category: 'basic',
    defaultProps: {
      content: '这是一个文本组件',
      fontSize: 14,
      color: '#333333',
      textAlign: 'left',
      fontWeight: 'normal',
    },
    propSchema: [
      {
        name: 'content',
        label: '内容',
        type: 'text',
        default: '这是一个文本组件',
        required: true,
      },
      {
        name: 'fontSize',
        label: '字体大小',
        type: 'number',
        default: 14,
        min: 12,
        max: 72,
      },
      {
        name: 'color',
        label: '颜色',
        type: 'color',
        default: '#333333',
      },
      {
        name: 'textAlign',
        label: '对齐方式',
        type: 'select',
        default: 'left',
        options: [
          { label: '左对齐', value: 'left' },
          { label: '居中', value: 'center' },
          { label: '右对齐', value: 'right' },
        ],
      },
      {
        name: 'fontWeight',
        label: '字体粗细',
        type: 'select',
        default: 'normal',
        options: [
          { label: '正常', value: 'normal' },
          { label: '加粗', value: 'bold' },
        ],
      },
    ],
  },
  {
    type: 'button',
    name: '按钮',
    icon: 'thumb',
    category: 'basic',
    defaultProps: {
      text: '按钮',
      type: 'primary',
      size: 'default',
      disabled: false,
    },
    propSchema: [
      {
        name: 'text',
        label: '文本',
        type: 'text',
        default: '按钮',
        required: true,
      },
      {
        name: 'type',
        label: '类型',
        type: 'select',
        default: 'primary',
        options: [
          { label: '主要', value: 'primary' },
          { label: '成功', value: 'success' },
          { label: '警告', value: 'warning' },
          { label: '危险', value: 'danger' },
          { label: '信息', value: 'info' },
        ],
      },
      {
        name: 'size',
        label: '尺寸',
        type: 'select',
        default: 'default',
        options: [
          { label: '大', value: 'large' },
          { label: '默认', value: 'default' },
          { label: '小', value: 'small' },
        ],
      },
      {
        name: 'disabled',
        label: '禁用',
        type: 'switch',
        default: false,
      },
    ],
  },
  {
    type: 'image',
    name: '图片',
    icon: 'picture',
    category: 'basic',
    defaultProps: {
      src: 'https://placeholder.pics/svg/200x100',
      alt: '图片',
      fit: 'cover',
    },
    propSchema: [
      {
        name: 'src',
        label: '图片地址',
        type: 'text',
        default: 'https://placeholder.pics/svg/200x100',
        required: true,
      },
      {
        name: 'alt',
        label: '替代文本',
        type: 'text',
        default: '图片',
      },
      {
        name: 'fit',
        label: '填充方式',
        type: 'select',
        default: 'cover',
        options: [
          { label: '填充', value: 'fill' },
          { label: '包含', value: 'contain' },
          { label: '覆盖', value: 'cover' },
          { label: '无缩放', value: 'none' },
          { label: '缩小', value: 'scale-down' },
        ],
      },
    ],
  },
  {
    type: 'input',
    name: '输入框',
    icon: 'edit',
    category: 'basic',
    defaultProps: {
      placeholder: '请输入内容',
      disabled: false,
      clearable: true,
      type: 'text',
    },
    propSchema: [
      {
        name: 'placeholder',
        label: '占位文本',
        type: 'text',
        default: '请输入内容',
      },
      {
        name: 'disabled',
        label: '禁用',
        type: 'switch',
        default: false,
      },
      {
        name: 'clearable',
        label: '可清空',
        type: 'switch',
        default: true,
      },
      {
        name: 'type',
        label: '类型',
        type: 'select',
        default: 'text',
        options: [
          { label: '文本', value: 'text' },
          { label: '密码', value: 'password' },
          { label: '数字', value: 'number' },
          { label: '邮箱', value: 'email' },
        ],
      },
    ],
  },
];

/**
 * 布局组件定义
 */
export const LAYOUT_COMPONENTS: ComponentDefinition[] = [
  {
    type: 'container',
    name: '容器',
    icon: 'folder',
    category: 'layout',
    isContainer: true,
    defaultProps: {
      backgroundColor: '#ffffff',
      border: '1px solid #eeeeee',
      borderRadius: 4,
      padding: 16,
    },
    propSchema: [
      {
        name: 'backgroundColor',
        label: '背景色',
        type: 'color',
        default: '#ffffff',
      },
      {
        name: 'border',
        label: '边框',
        type: 'text',
        default: '1px solid #eeeeee',
      },
      {
        name: 'borderRadius',
        label: '圆角',
        type: 'number',
        default: 4,
        min: 0,
        max: 20,
      },
      {
        name: 'padding',
        label: '内边距',
        type: 'number',
        default: 16,
        min: 0,
        max: 50,
      },
    ],
  },
  {
    type: 'row',
    name: '行',
    icon: 'menu',
    category: 'layout',
    isContainer: true,
    defaultProps: {
      gutter: 20,
      justify: 'start',
      align: 'top',
    },
    propSchema: [
      {
        name: 'gutter',
        label: '间距',
        type: 'number',
        default: 20,
        min: 0,
        max: 50,
      },
      {
        name: 'justify',
        label: '水平排列',
        type: 'select',
        default: 'start',
        options: [
          { label: '开始', value: 'start' },
          { label: '结束', value: 'end' },
          { label: '居中', value: 'center' },
          { label: '两端对齐', value: 'space-between' },
          { label: '环绕对齐', value: 'space-around' },
        ],
      },
      {
        name: 'align',
        label: '垂直对齐',
        type: 'select',
        default: 'top',
        options: [
          { label: '顶部', value: 'top' },
          { label: '中间', value: 'middle' },
          { label: '底部', value: 'bottom' },
        ],
      },
    ],
  },
  {
    type: 'column',
    name: '列',
    icon: 'tickets',
    category: 'layout',
    isContainer: true,
    defaultProps: {
      span: 24,
      offset: 0,
    },
    propSchema: [
      {
        name: 'span',
        label: '栅格数',
        type: 'slider',
        default: 24,
        min: 1,
        max: 24,
        step: 1,
      },
      {
        name: 'offset',
        label: '偏移距离',
        type: 'slider',
        default: 0,
        min: 0,
        max: 24,
        step: 1,
      },
    ],
  },
  {
    type: 'card',
    name: '卡片',
    icon: 'postcard',
    category: 'layout',
    isContainer: true,
    defaultProps: {
      title: '卡片标题',
      shadow: 'hover',
    },
    propSchema: [
      {
        name: 'title',
        label: '标题',
        type: 'text',
        default: '卡片标题',
      },
      {
        name: 'shadow',
        label: '阴影',
        type: 'select',
        default: 'hover',
        options: [
          { label: '总是', value: 'always' },
          { label: '悬停时', value: 'hover' },
          { label: '从不', value: 'never' },
        ],
      },
    ],
  },
];

/**
 * 图表组件定义
 */
export const CHART_COMPONENTS: ComponentDefinition[] = [
  {
    type: 'lineChart',
    name: '折线图',
    icon: 'trend-charts',
    category: 'chart',
    defaultProps: {
      title: '折线图',
      xAxisData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      seriesData: [150, 230, 224, 218, 135, 147, 260],
      smooth: true,
      showSymbol: true,
      areaStyle: false,
      color: '#409EFF',
    },
    propSchema: [
      {
        name: 'title',
        label: '标题',
        type: 'text',
        default: '折线图',
      },
      {
        name: 'smooth',
        label: '平滑曲线',
        type: 'switch',
        default: true,
      },
      {
        name: 'showSymbol',
        label: '显示标记点',
        type: 'switch',
        default: true,
      },
      {
        name: 'areaStyle',
        label: '面积样式',
        type: 'switch',
        default: false,
      },
      {
        name: 'color',
        label: '线条颜色',
        type: 'color',
        default: '#409EFF',
      },
    ],
  },
  {
    type: 'barChart',
    name: '柱状图',
    icon: 'histogram',
    category: 'chart',
    defaultProps: {
      title: '柱状图',
      xAxisData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      seriesData: [120, 200, 150, 80, 70, 110, 130],
      showBackground: true,
      color: '#67C23A',
    },
    propSchema: [
      {
        name: 'title',
        label: '标题',
        type: 'text',
        default: '柱状图',
      },
      {
        name: 'showBackground',
        label: '显示背景',
        type: 'switch',
        default: true,
      },
      {
        name: 'color',
        label: '柱条颜色',
        type: 'color',
        default: '#67C23A',
      },
    ],
  },
  {
    type: 'pieChart',
    name: '饼图',
    icon: 'pie-chart',
    category: 'chart',
    defaultProps: {
      title: '饼图',
      radius: ['50%', '70%'],
      data: [
        { value: 1048, name: '搜索引擎' },
        { value: 735, name: '直接访问' },
        { value: 580, name: '邮件营销' },
        { value: 484, name: '联盟广告' },
        { value: 300, name: '视频广告' },
      ],
      showLegend: true,
      roseType: false,
    },
    propSchema: [
      {
        name: 'title',
        label: '标题',
        type: 'text',
        default: '饼图',
      },
      {
        name: 'showLegend',
        label: '显示图例',
        type: 'switch',
        default: true,
      },
      {
        name: 'roseType',
        label: '南丁格尔图',
        type: 'switch',
        default: false,
      },
    ],
  },
  {
    type: 'scatterChart',
    name: '散点图',
    icon: 'data-analysis',
    category: 'chart',
    defaultProps: {
      title: '散点图',
      data: [
        [10.0, 8.04],
        [8.0, 6.95],
        [13.0, 7.58],
        [9.0, 8.81],
        [11.0, 8.33],
        [14.0, 9.96],
        [6.0, 7.24],
        [4.0, 4.26],
        [12.0, 10.84],
        [7.0, 4.82],
        [5.0, 5.68],
      ],
      symbol: 'circle',
      symbolSize: 10,
      color: '#E6A23C',
    },
    propSchema: [
      {
        name: 'title',
        label: '标题',
        type: 'text',
        default: '散点图',
      },
      {
        name: 'symbol',
        label: '标记形状',
        type: 'select',
        default: 'circle',
        options: [
          { label: '圆形', value: 'circle' },
          { label: '矩形', value: 'rect' },
          { label: '三角形', value: 'triangle' },
          { label: '菱形', value: 'diamond' },
          { label: '箭头', value: 'arrow' },
        ],
      },
      {
        name: 'symbolSize',
        label: '标记大小',
        type: 'slider',
        default: 10,
        min: 4,
        max: 20,
      },
      {
        name: 'color',
        label: '点颜色',
        type: 'color',
        default: '#E6A23C',
      },
    ],
  },
];

/**
 * 所有组件定义集合
 */
export const ALL_COMPONENTS: ComponentDefinition[] = [
  ...BASIC_COMPONENTS,
  ...LAYOUT_COMPONENTS,
  ...CHART_COMPONENTS,
];

/**
 * 获取组件定义的方法
 */
export const getComponentDefinition = (type: string): ComponentDefinition | undefined => {
  try {
    return ALL_COMPONENTS.find((comp) => comp.type === type);
  } catch (error) {
    console.error(`获取组件定义失败: ${error}`);
    return undefined;
  }
}; 