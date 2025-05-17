<template>
  <div
    ref="componentRef"
    class="canvas-component"
    :class="{
      'selected': isSelected,
      'preview-mode': mode === 'preview',
      'layout-component': isLayoutComponent,
      'chart-component': isChartComponent,
      'basic-component': isBasicComponent
    }"
    :style="componentStyle"
    :data-component-id="component.id"
    :data-component-type="componentDefinition?.type"
    @click.stop="handleComponentClick"
    @mousedown.stop="handleMouseDown"
  >
    <!-- 组件内容 -->
    <component
      :is="renderComponent"
      v-if="componentDefinition"
      v-bind="getComponentProps()"
      class="component-content"
    >
      <!-- 渲染子组件（如果有） -->
      <template v-if="isLayoutComponent && component.children?.length">
        <canvas-component
          v-for="child in component.children"
          :key="child.id"
          :component="child"
          :component-definition="getChildComponentDefinition(child.componentId)"
          :is-selected="isComponentSelected(child.id)"
          :mode="mode"
          :scale="scale"
          :snap-to-grid="snapToGrid"
          :grid-size="gridSize"
          @select="handleChildSelect"
          @update:props="handleChildPropsUpdate"
          @update:style="handleChildStyleUpdate"
          @delete="handleChildDelete"
        />
      </template>
    </component>

    <!-- 编辑模式下的控制器 -->
    <template v-if="mode === 'edit' && isSelected">
      <!-- 操作按钮 -->
      <div class="component-controls">
        <el-tooltip content="删除" placement="top">
          <el-button 
            size="small" 
            circle 
            type="danger" 
            @click.stop="handleDelete"
          >
            <el-icon><Delete /></el-icon>
          </el-button>
        </el-tooltip>

        <el-tooltip content="复制" placement="top">
          <el-button 
            size="small" 
            circle 
            type="primary" 
            @click.stop="handleDuplicate"
          >
            <el-icon><CopyDocument /></el-icon>
          </el-button>
        </el-tooltip>
      </div>

      <!-- 调整大小句柄 -->
      <div class="resize-handle resize-handle-tl" @mousedown.stop="handleResizeStart('top-left')"></div>
      <div class="resize-handle resize-handle-tm" @mousedown.stop="handleResizeStart('top')"></div>
      <div class="resize-handle resize-handle-tr" @mousedown.stop="handleResizeStart('top-right')"></div>
      <div class="resize-handle resize-handle-ml" @mousedown.stop="handleResizeStart('left')"></div>
      <div class="resize-handle resize-handle-mr" @mousedown.stop="handleResizeStart('right')"></div>
      <div class="resize-handle resize-handle-bl" @mousedown.stop="handleResizeStart('bottom-left')"></div>
      <div class="resize-handle resize-handle-bm" @mousedown.stop="handleResizeStart('bottom')"></div>
      <div class="resize-handle resize-handle-br" @mousedown.stop="handleResizeStart('bottom-right')"></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { Delete, CopyDocument } from '@element-plus/icons-vue';
import { useDraggable } from '../../hooks/useDraggable';
import { useEditorStore } from '../../store/editorStore';
import { getMousePosition, snapToGridPosition, calculateAlignmentGuides } from '../../utils/dragUtils';
import type { ComponentDefinition, CanvasComponent } from '../../types';
import * as echarts from 'echarts';

/**
 * 组件属性
 */
const props = defineProps<{
  /**
   * 组件数据
   */
  component: CanvasComponent;
  
  /**
   * 组件定义
   */
  componentDefinition?: ComponentDefinition;
  
  /**
   * 是否被选中
   */
  isSelected: boolean;
  
  /**
   * 编辑器模式
   */
  mode: 'edit' | 'preview';
  
  /**
   * 缩放比例
   */
  scale: number;
  
  /**
   * 是否吸附到网格
   */
  snapToGrid: boolean;
  
  /**
   * 网格大小
   */
  gridSize: number;
}>();

/**
 * 组件事件
 */
const emit = defineEmits<{
  // 选择组件
  (e: 'select', id: string, isMultiSelect: boolean): void;
  // 更新组件属性
  (e: 'update:props', props: Record<string, any>): void;
  // 更新组件样式
  (e: 'update:style', style: Partial<CanvasComponent['style']>): void;
  // 删除组件
  (e: 'delete'): void;
}>();

/**
 * 组件DOM引用
 */
const componentRef = ref<HTMLElement | null>(null);

/**
 * 编辑器store实例
 */
const editorStore = useEditorStore();

/**
 * 当前渲染的组件
 */
const renderComponent = computed(() => {
  try {
    if (!props.componentDefinition) return null;
    
    // 返回组件名称或组件本身
    return props.componentDefinition.component;
  } catch (error) {
    console.error('计算渲染组件失败:', error);
    return null;
  }
});

/**
 * 计算属性 - 是否是布局组件
 */
const isLayoutComponent = computed(() => {
  try {
    return props.componentDefinition?.type === 'layout';
  } catch (error) {
    console.error('判断是否是布局组件失败:', error);
    return false;
  }
});

/**
 * 计算属性 - 是否是图表组件
 */
const isChartComponent = computed(() => {
  try {
    return props.componentDefinition?.type === 'chart';
  } catch (error) {
    console.error('判断是否是图表组件失败:', error);
    return false;
  }
});

/**
 * 计算属性 - 是否是基础组件
 */
const isBasicComponent = computed(() => {
  try {
    return props.componentDefinition?.type === 'basic';
  } catch (error) {
    console.error('判断是否是基础组件失败:', error);
    return false;
  }
});

/**
 * 组件样式
 */
const componentStyle = computed(() => {
  try {
    const { top, left, width, height, zIndex, ...otherStyles } = props.component.style;
    
    const styles = {
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
      height: `${height}px`,
      zIndex: zIndex,
      ...otherStyles,
    };
    
    // 为布局组件添加白色背景和边框
    if (isLayoutComponent.value && !otherStyles.backgroundColor) {
      styles.backgroundColor = '#ffffff';
      if (!otherStyles.border) {
        styles.border = '1px solid #e4e7ed';
      }
      if (!otherStyles.borderRadius) {
        styles.borderRadius = '4px';
      }
    }
    
    // 添加网格布局
    if (isLayoutComponent.value) {
      Object.assign(styles, getLayoutGridStyle());
    }
    
    return styles;
  } catch (error) {
    console.error('计算组件样式失败:', error);
    return {};
  }
});

/**
 * 获取组件属性
 */
const getComponentProps = () => {
  try {
    if (!props.component.props) return {};
    
    // 根据组件类型处理特殊属性
    if (props.componentDefinition?.id === 'el-button') {
      const { text, ...otherProps } = props.component.props;
      return {
        ...otherProps,
        children: text,
      };
    }
    
    return props.component.props;
  } catch (error) {
    console.error('获取组件属性失败:', error);
    return {};
  }
};

/**
 * 获取子组件定义
 */
const getChildComponentDefinition = (componentId: string): ComponentDefinition | undefined => {
  try {
    return editorStore.state.componentDefinitions.find(def => def.id === componentId);
  } catch (error) {
    console.error('获取子组件定义失败:', error);
    return undefined;
  }
};

/**
 * 判断子组件是否被选中
 */
const isComponentSelected = (id: string): boolean => {
  try {
    return editorStore.state.selectedComponentIds.includes(id);
  } catch (error) {
    console.error('判断子组件是否被选中失败:', error);
    return false;
  }
};

/**
 * 处理组件点击
 */
const handleComponentClick = (e: MouseEvent) => {
  try {
    // 如果是预览模式，则不处理点击事件
    if (props.mode === 'preview') return;
    
    // 发送选择事件
    emit('select', props.component.id, e.ctrlKey || e.metaKey);
    
    // 阻止事件冒泡
    e.stopPropagation();
  } catch (error) {
    console.error('处理组件点击失败:', error);
  }
};

/**
 * 处理子组件选择
 */
const handleChildSelect = (id: string, isMultiSelect: boolean) => {
  try {
    emit('select', id, isMultiSelect);
  } catch (error) {
    console.error('处理子组件选择失败:', error);
  }
};

/**
 * 处理子组件属性更新
 */
const handleChildPropsUpdate = (props: Record<string, any>) => {
  try {
    emit('update:props', props);
  } catch (error) {
    console.error('处理子组件属性更新失败:', error);
  }
};

/**
 * 处理子组件样式更新
 */
const handleChildStyleUpdate = (style: Partial<CanvasComponent['style']>) => {
  try {
    emit('update:style', style);
  } catch (error) {
    console.error('处理子组件样式更新失败:', error);
  }
};

/**
 * 处理子组件删除
 */
const handleChildDelete = () => {
  try {
    emit('delete');
  } catch (error) {
    console.error('处理子组件删除失败:', error);
  }
};

/**
 * 处理删除组件
 */
const handleDelete = () => {
  try {
    emit('delete');
  } catch (error) {
    console.error('处理删除组件失败:', error);
  }
};

/**
 * 处理复制组件
 */
const handleDuplicate = () => {
  try {
    editorStore.copyComponent(props.component.id);
  } catch (error) {
    console.error('处理复制组件失败:', error);
  }
};

/**
 * 拖拽相关状态
 */
const isDragging = ref(false);
const startPosition = reactive({ x: 0, y: 0 });
const startMousePosition = reactive({ x: 0, y: 0 });

/**
 * 调整大小相关状态
 */
const isResizing = ref(false);
const resizeDirection = ref<string | null>(null);
const startSize = reactive({ width: 0, height: 0 });

/**
 * 图表实例ref
 */
const chartInstance = ref<echarts.ECharts | null>(null);

/**
 * 处理鼠标按下
 */
const handleMouseDown = (e: MouseEvent) => {
  try {
    // 如果是预览模式或者点在调整大小的句柄上，则不处理拖拽
    if (props.mode === 'preview' || (e.target as HTMLElement).closest('.resize-handle')) {
      return;
    }
    
    e.stopPropagation();
    
    // 选中组件（不使用Ctrl多选）
    if (!props.isSelected) {
      emit('select', props.component.id, false);
    }
    
    // 开始拖拽
    isDragging.value = true;
    
    // 记录起始位置
    startPosition.x = props.component.style.left;
    startPosition.y = props.component.style.top;
    
    // 记录鼠标起始位置
    startMousePosition.x = e.clientX;
    startMousePosition.y = e.clientY;
    
    // 添加事件监听
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  } catch (error) {
    console.error('处理鼠标按下失败:', error);
  }
};

/**
 * 处理鼠标移动（拖拽）
 */
const handleMouseMove = (e: MouseEvent) => {
  try {
    if (!isDragging.value) return;
    
    // 计算位移
    const deltaX = e.clientX - startMousePosition.x;
    const deltaY = e.clientY - startMousePosition.y;
    
    // 计算新位置
    let newLeft = startPosition.x + deltaX / props.scale;
    let newTop = startPosition.y + deltaY / props.scale;
    
    // 吸附到网格
    if (props.snapToGrid) {
      const snapped = snapToGridPosition({ x: newLeft, y: newTop }, props.gridSize);
      newLeft = snapped.x;
      newTop = snapped.y;
    }
    
    // 更新位置
    emit('update:style', {
      left: newLeft,
      top: newTop,
    });
  } catch (error) {
    console.error('处理鼠标移动（拖拽）失败:', error);
  }
};

/**
 * 处理鼠标松开（结束拖拽）
 */
const handleMouseUp = () => {
  try {
    isDragging.value = false;
    
    // 移除事件监听
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  } catch (error) {
    console.error('处理鼠标松开（结束拖拽）失败:', error);
  }
};

/**
 * 处理开始调整大小
 */
const handleResizeStart = (direction: string) => {
  try {
    if (props.mode === 'preview') return;
    
    isResizing.value = true;
    resizeDirection.value = direction;
    
    // 记录起始大小
    startSize.width = props.component.style.width;
    startSize.height = props.component.style.height;
    
    // 记录起始位置
    startPosition.x = props.component.style.left;
    startPosition.y = props.component.style.top;
    
    // 记录鼠标起始位置
    const mousePos = getMousePosition(event as any);
    startMousePosition.x = mousePos.x;
    startMousePosition.y = mousePos.y;
    
    // 添加事件监听
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  } catch (error) {
    console.error('处理开始调整大小失败:', error);
  }
};

/**
 * 处理调整大小移动
 */
const handleResizeMove = (e: MouseEvent) => {
  try {
    if (!isResizing.value || !resizeDirection.value) return;
    
    // 计算鼠标位移
    const deltaX = (e.clientX - startMousePosition.x) / props.scale;
    const deltaY = (e.clientY - startMousePosition.y) / props.scale;
    
    // 根据调整方向计算新尺寸和位置
    let newWidth = startSize.width;
    let newHeight = startSize.height;
    let newLeft = startPosition.x;
    let newTop = startPosition.y;
    
    // 水平方向调整
    if (resizeDirection.value.includes('right')) {
      newWidth = Math.max(20, startSize.width + deltaX);
    } else if (resizeDirection.value.includes('left')) {
      const width = Math.max(20, startSize.width - deltaX);
      newLeft = startPosition.x + (startSize.width - width);
      newWidth = width;
    }
    
    // 垂直方向调整
    if (resizeDirection.value.includes('bottom')) {
      newHeight = Math.max(20, startSize.height + deltaY);
    } else if (resizeDirection.value.includes('top')) {
      const height = Math.max(20, startSize.height - deltaY);
      newTop = startPosition.y + (startSize.height - height);
      newHeight = height;
    }
    
    // 吸附到网格
    if (props.snapToGrid) {
      // 调整宽高
      newWidth = Math.round(newWidth / props.gridSize) * props.gridSize;
      newHeight = Math.round(newHeight / props.gridSize) * props.gridSize;
      
      // 调整位置
      if (resizeDirection.value.includes('left')) {
        newLeft = startPosition.x + startSize.width - newWidth;
      }
      if (resizeDirection.value.includes('top')) {
        newTop = startPosition.y + startSize.height - newHeight;
      }
    }
    
    // 更新样式
    emit('update:style', {
      width: newWidth,
      height: newHeight,
      left: newLeft,
      top: newTop,
    });
  } catch (error) {
    console.error('处理调整大小移动失败:', error);
  }
};

/**
 * 处理结束调整大小
 */
const handleResizeEnd = () => {
  try {
    isResizing.value = false;
    resizeDirection.value = null;
    
    // 移除事件监听
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  } catch (error) {
    console.error('处理结束调整大小失败:', error);
  }
};

/**
 * 初始化图表
 */
const initChart = () => {
  try {
    if (!componentRef.value || !isChartComponent.value) return;
    
    // 如果已经有图表实例，先销毁
    if (chartInstance.value) {
      chartInstance.value.dispose();
    }
    
    // 初始化图表实例
    chartInstance.value = echarts.init(componentRef.value);
    
    // 获取图表配置
    const options = generateChartOptions();
    
    // 设置图表配置
    if (options) {
      chartInstance.value.setOption(options);
    }
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
  } catch (error) {
    console.error('初始化图表失败:', error);
  }
};

/**
 * 处理窗口大小变化
 */
const handleResize = () => {
  try {
    if (chartInstance.value) {
      chartInstance.value.resize();
    }
  } catch (error) {
    console.error('处理窗口大小变化失败:', error);
  }
};

/**
 * 生成图表配置
 */
const generateChartOptions = () => {
  try {
    if (!props.component || !props.component.componentId) return null;
    
    const chartType = props.component.componentId;
    const chartProps = props.component.props || {};
    
    // 根据图表类型生成不同的配置
    switch (chartType) {
      case 'echarts-bar': // 柱状图
        return {
          title: {
            text: chartProps.title || '柱状图'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          xAxis: {
            type: 'category',
            data: chartProps.data?.map((item: any) => item.name) || [],
            name: chartProps.xAxisName
          },
          yAxis: {
            type: 'value',
            name: chartProps.yAxisName
          },
          legend: {
            show: chartProps.showLegend,
            bottom: 0
          },
          series: [
            {
              name: chartProps.title,
              type: 'bar',
              data: chartProps.data?.map((item: any) => item.value) || [],
              animationDuration: 300,
            }
          ]
        };
        
      case 'echarts-line': // 折线图
        return {
          title: {
            text: chartProps.title || '折线图'
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: chartProps.data?.map((item: any) => item.name) || [],
            name: chartProps.xAxisName
          },
          yAxis: {
            type: 'value',
            name: chartProps.yAxisName
          },
          legend: {
            show: chartProps.showLegend,
            bottom: 0
          },
          series: [
            {
              name: chartProps.title,
              type: 'line',
              data: chartProps.data?.map((item: any) => item.value) || [],
              smooth: chartProps.smooth,
              showSymbol: chartProps.showSymbol,
              areaStyle: chartProps.areaStyle ? {} : undefined,
              animationDuration: 300,
            }
          ]
        };
        
      case 'echarts-pie': // 饼图
        return {
          title: {
            text: chartProps.title || '饼图'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            show: chartProps.showLegend,
            bottom: 0
          },
          series: [
            {
              name: chartProps.title,
              type: 'pie',
              radius: chartProps.radius || '60%',
              data: chartProps.data || [],
              animationDuration: 300,
              label: {
                show: true,
                formatter: '{b}: {d}%'
              }
            }
          ]
        };
        
      case 'g2-scatter': // 散点图
        return {
          title: {
            text: chartProps.title || '散点图'
          },
          tooltip: {
            trigger: 'item'
          },
          xAxis: {},
          yAxis: {},
          series: [
            {
              symbolSize: 10,
              data: chartProps.data || [],
              type: 'scatter'
            }
          ]
        };
        
      default:
        return null;
    }
  } catch (error) {
    console.error('生成图表配置失败:', error);
    return null;
  }
};

// 监听组件属性变化，更新图表
watch(() => props.component.props, () => {
  try {
    if (isChartComponent.value && chartInstance.value) {
      // 获取图表配置
      const options = generateChartOptions();
      
      // 更新图表配置
      if (options) {
        chartInstance.value.setOption(options);
      }
    }
  } catch (error) {
    console.error('监听组件属性变化失败:', error);
  }
}, { deep: true });

// 组件挂载
onMounted(() => {
  try {
    // 如果是图表组件，初始化图表
    if (isChartComponent.value) {
      nextTick(() => {
        initChart();
      });
    }
  } catch (error) {
    console.error('组件挂载处理失败:', error);
  }
});

// 组件卸载
onUnmounted(() => {
  try {
    // 清理资源
    if (chartInstance.value) {
      chartInstance.value.dispose();
    }
    window.removeEventListener('resize', handleResize);
    
    // 移除事件监听
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  } catch (error) {
    console.error('组件卸载失败:', error);
  }
});

/**
 * 布局组件获取网格样式
 */
const getLayoutGridStyle = () => {
  try {
    // 只为布局组件提供网格样式
    if (!isLayoutComponent.value) return {};
    
    const componentId = props.component.componentId;
    
    if (componentId === 'el-row') {
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(24, 1fr)`,
        gap: `${props.component.props?.gutter || 0}px`,
        height: '100%'
      };
    } else if (componentId === 'el-container') {
      const direction = props.component.props?.direction || 'vertical';
      return {
        display: 'grid',
        gridTemplateRows: direction === 'vertical' ? 'auto 1fr auto' : 'none',
        gridTemplateColumns: direction === 'horizontal' ? 'auto 1fr auto' : 'none',
        gap: '8px',
        height: '100%'
      };
    }
    
    return {};
  } catch (error) {
    console.error('获取布局网格样式失败:', error);
    return {};
  }
};
</script>

<style scoped>
.canvas-component {
  position: absolute;
  box-sizing: border-box;
  cursor: move;
  border: 1px dashed transparent;
  overflow: visible;
}

/* 布局组件样式 */
.layout-component {
  background-color: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 布局组件内部的子组件样式 */
.layout-component > .component-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  gap: 8px;
  width: 100%;
  height: 100%;
}

/* 行组件内的列组件样式 */
.layout-component[data-component-id="el-row"] > .component-content > .canvas-component[data-component-id^="el-col"] {
  position: relative;
  grid-column: span attr(data-span number, 12);
  top: 0 !important;
  left: 0 !important;
}

/* 图表组件样式 */
.chart-component {
  background-color: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
}

/* 基础组件样式 */
.basic-component {
  /* 基础组件样式可以根据需要调整 */
}

.canvas-component.selected {
  border-color: #409EFF;
  outline: 1px solid #409EFF;
  z-index: 100 !important;
}

.canvas-component.preview-mode {
  cursor: default;
  border-color: transparent;
}

.component-content {
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.layout-component > .component-content {
  pointer-events: auto;
}

.component-controls {
  position: absolute;
  top: -30px;
  right: 0;
  display: flex;
  gap: 5px;
  z-index: 110;
}

.resize-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #fff;
  border: 1px solid #409EFF;
  z-index: 101;
}

.resize-handle-tl {
  top: -4px;
  left: -4px;
  cursor: nw-resize;
}

.resize-handle-tm {
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  cursor: n-resize;
}

.resize-handle-tr {
  top: -4px;
  right: -4px;
  cursor: ne-resize;
}

.resize-handle-ml {
  left: -4px;
  top: 50%;
  transform: translateY(-50%);
  cursor: w-resize;
}

.resize-handle-mr {
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
  cursor: e-resize;
}

.resize-handle-bl {
  bottom: -4px;
  left: -4px;
  cursor: sw-resize;
}

.resize-handle-bm {
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  cursor: s-resize;
}

.resize-handle-br {
  bottom: -4px;
  right: -4px;
  cursor: se-resize;
}

/* 预览模式下隐藏所有控件 */
.preview-mode .resize-handle,
.preview-mode .component-controls {
  display: none;
}
</style> 