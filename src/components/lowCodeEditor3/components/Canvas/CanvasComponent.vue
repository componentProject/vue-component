<template>
  <div
    ref="componentRef"
    class="canvas-component"
    :class="{ selected, hovered }"
    :style="componentStyle"
    @mousedown="handleMouseDown"
    @mouseover="handleMouseOver"
    @mouseout="handleMouseOut"
    @click.stop="handleClick"
  >
    <!-- 组件内容 -->
    <component
      :is="resolveComponent(component.type)"
      v-bind="component.props"
      class="component-content"
    ></component>

    <!-- 如果是容器，渲染子组件 -->
    <slot name="children"></slot>

    <!-- 拖拽手柄 - 仅在选中时显示 -->
    <div v-if="selected" class="drag-handle">
      <el-icon><Rank /></el-icon>
    </div>

    <!-- 调整手柄 - 仅在选中时显示 -->
    <template v-if="selected">
      <div
        v-for="handle in resizeHandles"
        :key="handle.direction"
        :class="handle.class"
        :style="handle.style"
        @mousedown.stop="(e) => handle.onMouseDown(e)"
      ></div>
    </template>

    <!-- 组件工具栏 - 仅在选中时显示 -->
    <div v-if="selected" class="component-toolbar">
      <el-tooltip content="复制" placement="top" :show-after="300">
        <el-button size="small" circle @click.stop="handleCopy">
          <el-icon><CopyDocument /></el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip content="删除" placement="top" :show-after="300">
        <el-button size="small" circle @click.stop="handleDelete">
          <el-icon><Delete /></el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip content="上移一层" placement="top" :show-after="300">
        <el-button size="small" circle @click.stop="handleMoveUp">
          <el-icon><TopRight /></el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip content="下移一层" placement="top" :show-after="300">
        <el-button size="small" circle @click.stop="handleMoveDown">
          <el-icon><BottomRight /></el-icon>
        </el-button>
      </el-tooltip>
    </div>

    <!-- 组件名称标签 - 仅在选中时显示 -->
    <div v-if="selected" class="component-label">
      {{ component.name }}
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 画布组件项
 * 渲染和操作单个组件
 */
import { ref, computed, markRaw, onMounted, onUnmounted } from 'vue';
import { ElButton, ElIcon, ElTooltip } from 'element-plus';
import { Rank, CopyDocument, Delete, TopRight, BottomRight } from '@element-plus/icons-vue';
import { useDraggable } from '../../hooks/useDraggable';
import { useResizable } from '../../hooks/useResizable';
import type { ComponentData } from '../../types';
import { getComponentDefinition } from '../../constants/components';

// 导入基础组件
import { ElButton as Button, ElInput, ElImage, ElRow, ElCol, ElCard } from 'element-plus';

// 导入图表组件 (按需在项目中实现)
import * as echarts from 'echarts';

interface Props {
  /**
   * 组件数据
   */
  component: ComponentData;
  /**
   * 是否选中
   */
  selected?: boolean;
  /**
   * 是否悬停
   */
  hovered?: boolean;
  /**
   * 缩放比例
   */
  scale?: number;
  /**
   * 网格大小
   */
  gridSize?: number;
  /**
   * 是否对齐网格
   */
  snapToGrid?: boolean;
  /**
   * 是否显示网格
   */
  showGrid?: boolean;
  /**
   * 其他组件，用于对齐
   */
  otherComponents?: ComponentData[];
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  hovered: false,
  scale: 1,
  gridSize: 10,
  snapToGrid: true,
  showGrid: true,
  otherComponents: () => [],
});

/**
 * 事件
 */
const emit = defineEmits<{
  /**
   * 选择组件
   */
  (e: 'select', id: string): void;
  /**
   * 悬停组件
   */
  (e: 'hover', id: string | null): void;
  /**
   * 更新组件
   */
  (e: 'update', id: string, updates: Partial<ComponentData>): void;
  /**
   * 复制组件
   */
  (e: 'copy', id: string): void;
  /**
   * 删除组件
   */
  (e: 'delete', id: string): void;
}>();

/**
 * 组件引用
 */
const componentRef = ref<HTMLDivElement | null>(null);

/**
 * 组件样式
 */
const componentStyle = computed(() => {
  const { width, height, left, top, zIndex, ...otherStyles } = props.component.style;
  
  return {
    width: `${width}px`,
    height: `${height}px`,
    left: `${left}px`,
    top: `${top}px`,
    zIndex: zIndex || 1,
    position: 'absolute',
    ...otherStyles,
  };
});

/**
 * 拖拽功能
 */
const { isDragging, position, alignmentLines } = useDraggable(componentRef, {
  snapToGrid: props.snapToGrid,
  gridSize: props.gridSize,
  constrainToParent: true,
  enableAlignment: true,
  otherComponents: props.otherComponents,
});

/**
 * 调整大小功能
 */
const { isResizing, size, position: resizePosition, resizeHandles } = useResizable(componentRef, {
  snapToGrid: props.snapToGrid,
  gridSize: props.gridSize,
  minWidth: 50,
  minHeight: 50,
  constrainToParent: true,
});

/**
 * 监听拖拽和调整大小状态变化
 */
let positionChangeTimer: number | null = null;
let sizeChangeTimer: number | null = null;

/**
 * 组件位置变化监听
 */
watch(position, (newPos) => {
  try {
    if (!isDragging.value) return;

    // 防抖处理位置更新
    if (positionChangeTimer) {
      clearTimeout(positionChangeTimer);
    }

    positionChangeTimer = window.setTimeout(() => {
      emit('update', props.component.id, {
        style: {
          ...props.component.style,
          left: newPos.x,
          top: newPos.y,
        },
      });
    }, 16); // 16ms 约等于一帧动画的时间
  } catch (error) {
    console.error(`组件位置变化监听失败: ${error}`);
  }
});

/**
 * 组件大小变化监听
 */
watch([size, resizePosition], ([newSize, newPos]) => {
  try {
    if (!isResizing.value) return;

    // 防抖处理大小更新
    if (sizeChangeTimer) {
      clearTimeout(sizeChangeTimer);
    }

    sizeChangeTimer = window.setTimeout(() => {
      emit('update', props.component.id, {
        style: {
          ...props.component.style,
          width: newSize.width,
          height: newSize.height,
          left: newPos.x,
          top: newPos.y,
        },
      });
    }, 16);
  } catch (error) {
    console.error(`组件大小变化监听失败: ${error}`);
  }
});

/**
 * 处理组件点击
 */
const handleClick = () => {
  try {
    emit('select', props.component.id);
  } catch (error) {
    console.error(`处理组件点击失败: ${error}`);
  }
};

/**
 * 处理鼠标按下
 */
const handleMouseDown = (event: MouseEvent) => {
  try {
    // 确保组件被选中
    emit('select', props.component.id);
    
    // 防止事件冒泡，让拖拽能正确工作
    event.stopPropagation();
  } catch (error) {
    console.error(`处理鼠标按下失败: ${error}`);
  }
};

/**
 * 处理鼠标悬停
 */
const handleMouseOver = () => {
  try {
    emit('hover', props.component.id);
  } catch (error) {
    console.error(`处理鼠标悬停失败: ${error}`);
  }
};

/**
 * 处理鼠标离开
 */
const handleMouseOut = () => {
  try {
    emit('hover', null);
  } catch (error) {
    console.error(`处理鼠标离开失败: ${error}`);
  }
};

/**
 * 处理复制
 */
const handleCopy = () => {
  try {
    emit('copy', props.component.id);
  } catch (error) {
    console.error(`处理复制失败: ${error}`);
  }
};

/**
 * 处理删除
 */
const handleDelete = () => {
  try {
    emit('delete', props.component.id);
  } catch (error) {
    console.error(`处理删除失败: ${error}`);
  }
};

/**
 * 处理上移一层
 */
const handleMoveUp = () => {
  try {
    emit('update', props.component.id, {
      style: {
        ...props.component.style,
        zIndex: (props.component.style.zIndex || 0) + 1,
      },
    });
  } catch (error) {
    console.error(`处理上移一层失败: ${error}`);
  }
};

/**
 * 处理下移一层
 */
const handleMoveDown = () => {
  try {
    emit('update', props.component.id, {
      style: {
        ...props.component.style,
        zIndex: Math.max(0, (props.component.style.zIndex || 0) - 1),
      },
    });
  } catch (error) {
    console.error(`处理下移一层失败: ${error}`);
  }
};

/**
 * 解析并返回组件
 */
const resolveComponent = (type: string) => {
  try {
    // 根据组件类型返回相应的组件
    switch (type) {
      case 'text':
        return {
          render() {
            return h('div', {
              style: {
                fontSize: `${props.component.props.fontSize}px`,
                color: props.component.props.color,
                fontWeight: props.component.props.fontWeight,
                textAlign: props.component.props.textAlign,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: getJustifyContent(props.component.props.textAlign),
                padding: '8px',
                boxSizing: 'border-box',
                overflow: 'hidden',
              },
            }, props.component.props.content);
          },
        };
      case 'button':
        return markRaw(Button);
      case 'image':
        return markRaw(ElImage);
      case 'input':
        return markRaw(ElInput);
      case 'container':
        return {
          render() {
            return h('div', {
              style: {
                backgroundColor: props.component.props.backgroundColor,
                border: props.component.props.border,
                borderRadius: `${props.component.props.borderRadius}px`,
                padding: `${props.component.props.padding}px`,
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
              },
            }, [/* 子组件将通过 slot 渲染 */]);
          },
        };
      case 'row':
        return markRaw(ElRow);
      case 'column':
        return markRaw(ElCol);
      case 'card':
        return markRaw(ElCard);
      case 'lineChart':
      case 'barChart':
      case 'pieChart':
      case 'scatterChart':
        return createChartComponent(type);
      default:
        // 返回一个空的 div 作为默认
        return {
          render() {
            return h('div', {
              style: {
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8f8f8',
                border: '1px dashed #dcdfe6',
                color: '#909399',
                fontSize: '12px',
              },
            }, `未知组件类型: ${type}`);
          },
        };
    }
  } catch (error) {
    console.error(`解析组件失败: ${error}`);
    // 返回一个错误提示组件
    return {
      render() {
        return h('div', {
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff0f0',
            border: '1px dashed #f56c6c',
            color: '#f56c6c',
            fontSize: '12px',
          },
        }, '组件加载失败');
      },
    };
  }
};

/**
 * 获取文本对齐的 justifyContent 值
 */
const getJustifyContent = (textAlign: string) => {
  switch (textAlign) {
    case 'left':
      return 'flex-start';
    case 'center':
      return 'center';
    case 'right':
      return 'flex-end';
    default:
      return 'flex-start';
  }
};

/**
 * 创建图表组件
 */
const createChartComponent = (type: string) => {
  try {
    return {
      mounted() {
        this.initChart();
      },
      updated() {
        this.initChart();
      },
      unmounted() {
        if (this.chart) {
          this.chart.dispose();
        }
      },
      methods: {
        initChart() {
          try {
            if (!this.$el) return;
            
            // 初始化或获取已有的图表实例
            this.chart = echarts.init(this.$el);
            
            // 配置图表选项
            const options = this.getChartOptions(type, props.component.props);
            
            // 设置图表选项
            this.chart.setOption(options);
            
            // 添加窗口大小变化的监听
            window.addEventListener('resize', this.handleResize);
          } catch (error) {
            console.error(`初始化图表失败: ${error}`);
          }
        },
        handleResize() {
          try {
            if (this.chart) {
              this.chart.resize();
            }
          } catch (error) {
            console.error(`调整图表大小失败: ${error}`);
          }
        },
        getChartOptions(chartType: string, chartProps: any) {
          try {
            // 根据图表类型返回对应的选项
            switch (chartType) {
              case 'lineChart':
                return {
                  title: { text: chartProps.title || '折线图' },
                  xAxis: {
                    type: 'category',
                    data: chartProps.xAxisData || [],
                  },
                  yAxis: { type: 'value' },
                  series: [
                    {
                      data: chartProps.seriesData || [],
                      type: 'line',
                      smooth: chartProps.smooth,
                      showSymbol: chartProps.showSymbol,
                      areaStyle: chartProps.areaStyle ? {} : null,
                      itemStyle: {
                        color: chartProps.color,
                      },
                    },
                  ],
                };
              case 'barChart':
                return {
                  title: { text: chartProps.title || '柱状图' },
                  xAxis: {
                    type: 'category',
                    data: chartProps.xAxisData || [],
                  },
                  yAxis: { type: 'value' },
                  series: [
                    {
                      data: chartProps.seriesData || [],
                      type: 'bar',
                      showBackground: chartProps.showBackground,
                      itemStyle: {
                        color: chartProps.color,
                      },
                    },
                  ],
                };
              case 'pieChart':
                return {
                  title: { text: chartProps.title || '饼图' },
                  legend: {
                    show: chartProps.showLegend,
                    orient: 'horizontal',
                    bottom: 'bottom',
                  },
                  series: [
                    {
                      type: 'pie',
                      radius: chartProps.radius || ['50%', '70%'],
                      roseType: chartProps.roseType ? 'radius' : false,
                      data: chartProps.data || [],
                    },
                  ],
                };
              case 'scatterChart':
                return {
                  title: { text: chartProps.title || '散点图' },
                  xAxis: {},
                  yAxis: {},
                  series: [
                    {
                      type: 'scatter',
                      data: chartProps.data || [],
                      symbol: chartProps.symbol || 'circle',
                      symbolSize: chartProps.symbolSize || 10,
                      itemStyle: {
                        color: chartProps.color,
                      },
                    },
                  ],
                };
              default:
                return {};
            }
          } catch (error) {
            console.error(`获取图表选项失败: ${error}`);
            return {};
          }
        },
      },
      render() {
        return h('div', {
          style: {
            width: '100%',
            height: '100%',
          },
        });
      },
    };
  } catch (error) {
    console.error(`创建图表组件失败: ${error}`);
    return {
      render() {
        return h('div', {
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff0f0',
            border: '1px dashed #f56c6c',
            color: '#f56c6c',
            fontSize: '12px',
          },
        }, '图表加载失败');
      },
    };
  }
};

/**
 * 清理资源
 */
onUnmounted(() => {
  try {
    if (positionChangeTimer) {
      clearTimeout(positionChangeTimer);
    }
    if (sizeChangeTimer) {
      clearTimeout(sizeChangeTimer);
    }
  } catch (error) {
    console.error(`清理资源失败: ${error}`);
  }
});
</script>

<style lang="scss" scoped>
.canvas-component {
  box-sizing: border-box;
  border: 1px solid transparent;
  transition: border-color 0.2s, box-shadow 0.2s;
  
  &.hovered:not(.selected) {
    border-color: #409eff;
  }
  
  &.selected {
    border-color: #409eff;
    box-shadow: 0 0 8px rgba(64, 158, 255, 0.2);
  }
}

.component-content {
  width: 100%;
  height: 100%;
}

.drag-handle {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #409eff;
  color: #fff;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  font-size: 12px;
  z-index: 10;
}

.resize-handle {
  cursor: pointer;
  z-index: 10;
  background-color: #fff;
  border: 1px solid #409eff;
}

.component-toolbar {
  position: absolute;
  top: -40px;
  right: 0;
  display: flex;
  gap: 4px;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.component-label {
  position: absolute;
  top: -20px;
  left: 0;
  font-size: 12px;
  background-color: #409eff;
  color: #fff;
  padding: 0 4px;
  border-radius: 2px;
  white-space: nowrap;
  z-index: 10;
}
</style> 