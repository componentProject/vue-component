/**
 * 基础组件定义
 * 包含Element Plus的基础UI组件
 */
import type { ComponentDefinition } from '../../types';
import { ComponentCategory } from '../../types';

/**
 * 基础组件列表
 */
export const basicComponents: ComponentDefinition[] = [
  {
    type: 'el-button',
    category: ComponentCategory.BASIC,
    name: '按钮',
    icon: 'el-icon-s-promotion',
    defaultProps: {
      type: 'primary',
      size: 'default',
      text: '按钮'
    },
    rules: {
      allowedParentComponents: ['el-col', 'el-container']
    }
  },
  {
    type: 'el-input',
    category: ComponentCategory.BASIC,
    name: '输入框',
    icon: 'el-icon-edit',
    defaultProps: {
      placeholder: '请输入内容',
      clearable: true,
      type: 'text'
    },
    rules: {
      allowedParentComponents: ['el-col', 'el-container']
    }
  },
  {
    type: 'el-select',
    category: ComponentCategory.BASIC,
    name: '选择器',
    icon: 'el-icon-arrow-down',
    defaultProps: {
      placeholder: '请选择',
      clearable: true,
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
        { label: '选项3', value: '3' }
      ]
    },
    rules: {
      allowedParentComponents: ['el-col', 'el-container']
    }
  },
  {
    type: 'el-radio-group',
    category: ComponentCategory.BASIC,
    name: '单选框组',
    icon: 'el-icon-circle-check',
    defaultProps: {
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
        { label: '选项3', value: '3' }
      ]
    },
    rules: {
      allowedParentComponents: ['el-col', 'el-container']
    }
  },
  {
    type: 'el-checkbox-group',
    category: ComponentCategory.BASIC,
    name: '多选框组',
    icon: 'el-icon-check',
    defaultProps: {
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
        { label: '选项3', value: '3' }
      ]
    },
    rules: {
      allowedParentComponents: ['el-col', 'el-container']
    }
  },
  {
    type: 'el-date-picker',
    category: ComponentCategory.BASIC,
    name: '日期选择器',
    icon: 'el-icon-date',
    defaultProps: {
      type: 'date',
      placeholder: '选择日期',
      format: 'YYYY-MM-DD'
    },
    rules: {
      allowedParentComponents: ['el-col', 'el-container']
    }
  },
  {
    type: 'el-switch',
    category: ComponentCategory.BASIC,
    name: '开关',
    icon: 'el-icon-open',
    defaultProps: {
      activeText: '开启',
      inactiveText: '关闭'
    },
    rules: {
      allowedParentComponents: ['el-col', 'el-container']
    }
  },
  {
    type: 'el-slider',
    category: ComponentCategory.BASIC,
    name: '滑块',
    icon: 'el-icon-right',
    defaultProps: {
      min: 0,
      max: 100,
      step: 1
    },
    rules: {
      allowedParentComponents: ['el-col', 'el-container']
    }
  },
  {
    type: 'el-rate',
    category: ComponentCategory.BASIC,
    name: '评分',
    icon: 'el-icon-star-on',
    defaultProps: {
      max: 5,
      'allow-half': false,
      'show-text': false
    },
    rules: {
      allowedParentComponents: ['el-col', 'el-container']
    }
  },
  {
    type: 'el-color-picker',
    category: ComponentCategory.BASIC,
    name: '颜色选择器',
    icon: 'el-icon-picture-outline-round',
    defaultProps: {
      'show-alpha': true
    },
    rules: {
      allowedParentComponents: ['el-col', 'el-container']
    }
  },
  {
    type: 'el-tag',
    category: ComponentCategory.BASIC,
    name: '标签',
    icon: 'el-icon-collection-tag',
    defaultProps: {
      type: 'success',
      effect: 'light',
      closable: false,
      text: '标签'
    },
    rules: {
      allowedParentComponents: ['el-col', 'el-container']
    }
  },
  {
    type: 'el-progress',
    category: ComponentCategory.BASIC,
    name: '进度条',
    icon: 'el-icon-s-data',
    defaultProps: {
      percentage: 50,
      type: 'line',
      'stroke-width': 6,
      'text-inside': false,
      status: 'success'
    },
    rules: {
      allowedParentComponents: ['el-col', 'el-container']
    }
  },
  {
    type: 'el-image',
    category: ComponentCategory.BASIC,
    name: '图片',
    icon: 'el-icon-picture',
    defaultProps: {
      src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      fit: 'cover',
      alt: '图片'
    },
    rules: {
      allowedParentComponents: ['el-col', 'el-container']
    }
  },
  {
    type: 'el-divider',
    category: ComponentCategory.BASIC,
    name: '分割线',
    icon: 'el-icon-minus',
    defaultProps: {
      'content-position': 'center',
      direction: 'horizontal'
    },
    rules: {
      allowedParentComponents: ['el-col', 'el-container']
    }
  },
  {
    type: 'el-link',
    category: ComponentCategory.BASIC,
    name: '链接',
    icon: 'el-icon-link',
    defaultProps: {
      type: 'primary',
      underline: true,
      href: '#',
      text: '链接文本'
    },
    rules: {
      allowedParentComponents: ['el-col', 'el-container']
    }
  }
]; 