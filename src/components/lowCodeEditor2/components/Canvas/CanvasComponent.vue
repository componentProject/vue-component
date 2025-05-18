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
    
    const styles: Record<string, any> = {
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
      height: `${height}px`,
      zIndex: zIndex,
      ...otherStyles,
    };
    
    // 根据组件类型应用特定样式
    if (isLayoutComponent.value) {
      // 布局组件样式处理
      const componentId = props.component.componentId;
      
      if (componentId === 'el-container') {
        // 容器组件: 占满父容器宽高或画布宽高的100%
        styles.width = '100%';
        styles.height = '100%';
        styles.backgroundColor = otherStyles.backgroundColor || '#ffffff';
        styles.border = otherStyles.border !== false ? '1px solid #e4e7ed' : 'none';
        styles.borderRadius = otherStyles.borderRadius || '4px';
        styles.padding = otherStyles.padding || '12px';
        styles.boxSizing = 'border-box';
      } 
      else if (componentId === 'el-row') {
        // 行组件: 宽度占满父容器100%，高度根据内容自适应
        styles.width = '100%';
        styles.height = 'auto';
        styles.minHeight = '40px'; // 确保有最小高度以便于选择
        styles.backgroundColor = otherStyles.backgroundColor || 'transparent';
        styles.padding = otherStyles.padding || '4px';
        styles.boxSizing = 'border-box';
      } 
      else if (componentId === 'el-col') {
        // 列组件: 高度根据内容自适应
        styles.height = 'auto';
        styles.minHeight = '40px'; // 确保有最小高度以便于选择
        styles.backgroundColor = otherStyles.backgroundColor || 'transparent';
        styles.padding = otherStyles.padding || '4px';
        styles.boxSizing = 'border-box';
      }
      
      // 添加网格布局
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
    
    // 检查组件ID是否有效
    if (!props.component || !props.component.id) {
      console.warn('无效的组件ID, 无法选择组件');
      return;
    }
    
    // 对于图表组件，需要特殊处理，因为可能会包含echarts绑定的事件
    if (isChartComponent.value) {
      // 阻止事件冒泡，但不立即执行选中操作，避免与图表内部事件冲突
      e.stopPropagation();
      
      // 延迟选中操作，确保DOM已更新且其他事件已处理完毕
      setTimeout(() => {
        try {
          // 执行选中操作前再次检查组件ID的有效性
          if (props.component && props.component.id) {
            emit('select', props.component.id, false); // 图表点击时不支持多选
          }
        } catch (selectError) {
          console.error('选择图表组件时发生错误:', selectError);
        }
      }, 50); // 使用较长的延迟以确保DOM稳定
      
      return;
    }
    
    // 其他非图表组件的处理
    // 使用setTimeout避免可能的DOM操作冲突
    setTimeout(() => {
      try {
        // 发送选择事件
        emit('select', props.component.id, e.ctrlKey || e.metaKey);
      } catch (selectError) {
        console.error('选择组件时发生错误:', selectError);
      }
    }, 0);
    
    // 阻止事件冒泡
    e.stopPropagation();
  } catch (error) {
    console.error('处理组件点击失败:', error);
    // 防止错误传播
    e.stopPropagation();
    e.preventDefault();
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
    // 确保组件引用和类型有效
    if (!componentRef.value || !isChartComponent.value) return;
    
    // 确保组件DOM仍然附加在文档中
    if (!document.body.contains(componentRef.value)) {
      console.warn('尝试初始化已从DOM移除的图表组件');
      return;
    }
    
    // 安全地销毁现有实例
    if (chartInstance.value) {
      try {
        chartInstance.value.dispose();
        chartInstance.value = null;
      } catch (disposeError) {
        console.warn('销毁旧图表实例失败:', disposeError);
      }
    }
    
    // 使用try-catch包装echarts初始化操作
    try {
      // 初始化图表实例
      chartInstance.value = echarts.init(componentRef.value);
      
      // 获取图表配置
      const options = generateChartOptions();
      
      // 设置图表配置
      if (options && chartInstance.value) {
        chartInstance.value.setOption(options);
        
        // 注册图表点击事件时阻止冒泡，防止与组件选择冲突
        chartInstance.value.getZr().on('click', (e: any) => {
          if (e && e.event) {
            e.event.stopPropagation();
          }
        });
      }
      
      // 监听窗口大小变化
      window.addEventListener('resize', handleResize);
    } catch (initError) {
      console.error('初始化echarts实例失败:', initError);
      chartInstance.value = null;
    }
  } catch (error) {
    console.error('初始化图表失败:', error);
    chartInstance.value = null;
  }
};

/**
 * 处理窗口大小变化
 */
const handleResize = () => {
  try {
    // 确保图表实例存在且组件DOM依然存在于文档中
    if (chartInstance.value && componentRef.value && document.body.contains(componentRef.value)) {
      chartInstance.value.resize();
    } else if (chartInstance.value) {
      // 如果DOM已不存在但图表实例仍然存在，则安全销毁图表实例
      try {
        chartInstance.value.dispose();
        chartInstance.value = null;
      } catch (disposeError) {
        console.error('销毁图表实例失败:', disposeError);
      }
    }
  } catch (error) {
    console.error('处理窗口大小变化失败:', error);
    // 移除事件监听以防止继续出错
    window.removeEventListener('resize', handleResize);
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

// 添加一个手动事件处理函数来捕获ECharts图表的点击事件
const handleChartClick = (e: MouseEvent) => {
  try {
    // 如果是图表组件，处理点击事件
    if (!isChartComponent.value || props.mode === 'preview') return;
    
    // 阻止事件冒泡防止DOM错误
    e.stopPropagation();
    
    // 延时执行选择操作以确保DOM稳定
    setTimeout(() => {
      if (props.component && props.component.id) {
        emit('select', props.component.id, false);
      }
    }, 100);
  } catch (error) {
    console.error('处理图表点击事件失败:', error);
  }
};

// 组件挂载
onMounted(() => {
  try {
    // 如果是图表组件，初始化图表
    if (isChartComponent.value) {
      nextTick(() => {
        initChart();
        
        // 为图表组件添加点击事件监听
        if (componentRef.value) {
          componentRef.value.addEventListener('click', handleChartClick);
        }
      });
    }
  } catch (error) {
    console.error('组件挂载处理失败:', error);
  }
});

// 组件卸载
onUnmounted(() => {
  try {
    // 安全地清理图表资源
    if (chartInstance.value) {
      try {
        // 移除所有事件监听
        if (chartInstance.value.getZr) {
          const zr = chartInstance.value.getZr();
          if (zr) {
            zr.off('click');
          }
        }
        // 销毁图表实例
        chartInstance.value.dispose();
        chartInstance.value = null;
      } catch (disposeError) {
        console.warn('销毁图表实例失败:', disposeError);
      }
    }
    
    // 移除图表点击事件监听
    if (isChartComponent.value && componentRef.value) {
      componentRef.value.removeEventListener('click', handleChartClick);
    }
    
    // 移除窗口事件监听
    window.removeEventListener('resize', handleResize);
    
    // 移除拖拽相关事件监听
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // 移除调整大小相关事件监听
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
        justifyContent: props.component.props?.justify || 'start',
        alignItems: props.component.props?.align || 'top',
        width: '100%',
      };
    } else if (componentId === 'el-container') {
      const direction = props.component.props?.direction || 'vertical';
      return {
        display: 'flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        gap: '8px',
        width: '100%',
        height: '100%',
      };
    } else if (componentId === 'el-col') {
      const span = props.component.props?.span || 12;
      return {
        gridColumn: `span ${span}`,
        display: 'flex',
        flexDirection: 'column',
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

/* 容器组件特殊样式 */
.layout-component[data-component-id="el-container"] {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* 行组件特殊样式 */
.layout-component[data-component-id="el-row"] {
  width: 100%;
  min-height: 40px;
  margin-bottom: 8px;
  padding: 8px;
  background-color: rgba(240, 240, 240, 0.3);
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
}

/* 列组件特殊样式 */
.layout-component[data-component-id="el-col"] {
  min-height: 40px;
  padding: 8px;
  background-color: rgba(230, 230, 230, 0.3);
  box-sizing: border-box;
}

/* 布局组件内部的子组件样式 */
.layout-component > .component-content {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  height: 100%;
}

/* 行组件内的内容样式 */
.layout-component[data-component-id="el-row"] > .component-content {
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  gap: var(--row-gutter, 0px);
  width: 100%;
}

/* 列组件内的内容 */
.layout-component[data-component-id="el-col"] > .component-content {
  flex-direction: column;
  height: 100%;
  align-items: stretch;
}

/* 图表组件样式 */
.chart-component {
  background-color: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer; /* 确保图表组件更容易点击 */
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