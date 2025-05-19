/**
 * 布局组件定义
 * 包含Element Plus的布局相关组件
 */
import type { ComponentDefinition } from '../../types';
import { ComponentCategory } from '../../types';

/**
 * 布局组件列表
 */
export const layoutComponents: ComponentDefinition[] = [
  {
    type: 'el-row',
    category: ComponentCategory.LAYOUT,
    name: '行',
    icon: 'el-icon-s-grid',
    isContainer: true,
    defaultProps: {
      gutter: 20,
      justify: 'start',
      align: 'top'
    },
    rules: {
      allowedParentComponents: ['el-container']
    }
  },
  {
    type: 'el-col',
    category: ComponentCategory.LAYOUT,
    name: '列',
    icon: 'el-icon-s-unfold',
    isContainer: true,
    defaultProps: {
      span: 12,
      offset: 0,
      xs: 24,
      sm: 12,
      md: 8,
      lg: 6,
      xl: 4
    },
    rules: {
      requiredParentComponents: ['el-row']
    }
  },
  {
    type: 'el-container',
    category: ComponentCategory.LAYOUT,
    name: '容器',
    icon: 'el-icon-s-order',
    isContainer: true,
    defaultProps: {
      direction: 'vertical'
    }
  },
  {
    type: 'el-header',
    category: ComponentCategory.LAYOUT,
    name: '页头',
    icon: 'el-icon-s-platform',
    isContainer: true,
    defaultProps: {
      height: '60px'
    },
    rules: {
      requiredParentComponents: ['el-container']
    }
  },
  {
    type: 'el-main',
    category: ComponentCategory.LAYOUT,
    name: '主区域',
    icon: 'el-icon-s-home',
    isContainer: true,
    defaultProps: {},
    rules: {
      requiredParentComponents: ['el-container']
    }
  },
  {
    type: 'el-footer',
    category: ComponentCategory.LAYOUT,
    name: '页脚',
    icon: 'el-icon-sort-down',
    isContainer: true,
    defaultProps: {
      height: '60px'
    },
    rules: {
      requiredParentComponents: ['el-container']
    }
  },
  {
    type: 'el-aside',
    category: ComponentCategory.LAYOUT,
    name: '侧边栏',
    icon: 'el-icon-s-fold',
    isContainer: true,
    defaultProps: {
      width: '200px'
    },
    rules: {
      requiredParentComponents: ['el-container']
    }
  },
  {
    type: 'el-space',
    category: ComponentCategory.LAYOUT,
    name: '间距',
    icon: 'el-icon-set-up',
    isContainer: true,
    defaultProps: {
      direction: 'horizontal',
      alignment: 'center',
      size: 'default',
      wrap: false,
      fill: false
    }
  },
  {
    type: 'el-card',
    category: ComponentCategory.LAYOUT,
    name: '卡片',
    icon: 'el-icon-postcard',
    isContainer: true,
    defaultProps: {
      header: '卡片标题',
      'body-style': { padding: '20px' },
      shadow: 'always'
    },
    slots: [
      {
        name: 'header',
        allowedComponents: ['el-button', 'el-link', 'el-tag']
      }
    ]
  },
  {
    type: 'el-descriptions',
    category: ComponentCategory.LAYOUT,
    name: '描述列表',
    icon: 'el-icon-s-operation',
    isContainer: true,
    defaultProps: {
      title: '用户信息',
      column: 3,
      border: true,
      direction: 'horizontal',
      size: 'default'
    },
    slots: [
      {
        name: 'extra',
        allowedComponents: ['el-button', 'el-link', 'el-tag']
      }
    ]
  },
  {
    type: 'el-descriptions-item',
    category: ComponentCategory.LAYOUT,
    name: '描述项',
    icon: 'el-icon-s-operation',
    isContainer: true,
    defaultProps: {
      label: '标签名称',
      span: 1
    },
    rules: {
      requiredParentComponents: ['el-descriptions']
    }
  },
  {
    type: 'el-tabs',
    category: ComponentCategory.LAYOUT,
    name: '标签页',
    icon: 'el-icon-document',
    isContainer: true,
    defaultProps: {
      type: 'border-card',
      'tab-position': 'top',
      stretch: false
    }
  },
  {
    type: 'el-tab-pane',
    category: ComponentCategory.LAYOUT,
    name: '标签项',
    icon: 'el-icon-document-copy',
    isContainer: true,
    defaultProps: {
      label: '标签项',
      name: '',
      disabled: false,
      lazy: false
    },
    rules: {
      requiredParentComponents: ['el-tabs']
    }
  }
]; 