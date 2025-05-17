<template>
  <div class="component-panel h-full overflow-y-auto">
    <div class="p-4">
      <h3 class="text-base font-medium text-gray-700 mb-3">组件列表</h3>
      
      <!-- 搜索框 -->
      <el-input
        v-model="searchText"
        placeholder="搜索组件..."
        clearable
        class="mb-4"
        prefix-icon="Search"
      />
      
      <!-- 组件类型选择 -->
      <el-tabs v-model="activeCategory">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="基础" name="basic" />
        <el-tab-pane label="布局" name="layout" />
        <el-tab-pane label="图表" name="chart" />
      </el-tabs>
      
      <!-- 组件列表 -->
      <div class="components-list mt-2">
        <template v-for="group in filteredComponentGroups" :key="group.type">
          <div class="component-group mb-4" v-if="group.components.length > 0">
            <h4 class="text-sm font-medium text-gray-600 mb-2">{{ getGroupLabel(group.type) }}</h4>
            
            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="component in group.components"
                :key="component.id"
                class="component-item p-2 bg-white rounded border border-gray-200 cursor-grab hover:border-blue-500 hover:shadow-sm transition-all"
                :draggable="draggable"
                @dragstart="handleDragStart($event, component)"
              >
                <!-- 基础组件预览 -->
                <div v-if="component.type === 'basic'" class="component-preview mb-2">
                  <!-- 按钮预览 -->
                  <el-button 
                    v-if="component.id === 'el-button'" 
                    size="small" 
                    :type="component.defaultProps.type"
                  >
                    {{ component.defaultProps.text }}
                  </el-button>

                  <!-- 输入框预览 -->
                  <el-input 
                    v-else-if="component.id === 'el-input'" 
                    size="small" 
                    :placeholder="component.defaultProps.placeholder"
                    class="w-full"
                    disabled
                  />

                  <!-- 选择器预览 -->
                  <el-select
                    v-else-if="component.id === 'el-select'"
                    size="small"
                    :placeholder="component.defaultProps.placeholder"
                    class="w-full"
                    disabled
                  />

                  <!-- 开关预览 -->
                  <el-switch
                    v-else-if="component.id === 'el-switch'"
                    disabled
                  />

                  <!-- 日期选择器预览 -->
                  <el-date-picker
                    v-else-if="component.id === 'el-date-picker'"
                    size="small"
                    :placeholder="component.defaultProps.placeholder"
                    class="w-full"
                    disabled
                  />

                  <!-- 默认图标 -->
                  <el-icon v-else class="text-lg">
                    <component :is="component.icon" />
                  </el-icon>
                </div>

                <!-- 布局组件预览 -->
                <div v-else-if="component.type === 'layout'" class="component-preview mb-2 bg-gray-50 border border-dashed border-gray-300 p-1 rounded">
                  <!-- 容器预览 -->
                  <div v-if="component.id === 'el-container'" class="bg-white h-10 w-full flex items-center justify-center text-xs text-gray-500">
                    容器
                  </div>

                  <!-- 行预览 -->
                  <div v-else-if="component.id === 'el-row'" class="bg-white h-8 w-full flex flex-row items-center justify-between p-1 text-xs text-gray-500">
                    <div class="bg-gray-100 w-4 h-4"></div>
                    <div class="bg-gray-100 w-4 h-4"></div>
                    <div class="bg-gray-100 w-4 h-4"></div>
                  </div>

                  <!-- 列预览 -->
                  <div v-else-if="component.id === 'el-col'" class="bg-white h-10 w-full flex items-center justify-center text-xs text-gray-500">
                    列
                  </div>

                  <!-- 默认图标 -->
                  <el-icon v-else class="text-lg">
                    <component :is="component.icon" />
                  </el-icon>
                </div>

                <!-- 图表组件预览 -->
                <div v-else-if="component.type === 'chart'" class="component-preview mb-2">
                  <!-- 柱状图预览 -->
                  <img 
                    v-if="component.id === 'echarts-bar'" 
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgNjAiPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjNDA5RUZGIi8+PHJlY3QgeD0iMzAiIHk9IjIwIiB3aWR0aD0iMTAiIGhlaWdodD0iMzAiIGZpbGw9IiM0MDlFRkYiLz48cmVjdCB4PSI1MCIgeT0iNSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjQ1IiBmaWxsPSIjNDA5RUZGIi8+PHJlY3QgeD0iNzAiIHk9IjE1IiB3aWR0aD0iMTAiIGhlaWdodD0iMzUiIGZpbGw9IiM0MDlFRkYiLz48bGluZSB4MT0iNSIgeTE9IjUwIiB4Mj0iOTUiIHkyPSI1MCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4="
                    alt="柱状图"
                    class="w-full h-16 object-contain"
                  />

                  <!-- 折线图预览 -->
                  <img 
                    v-else-if="component.id === 'echarts-line'" 
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgNjAiPjxwYXRoIGQ9Ik01LDQwIEwyNSwyMCBMNDUsMzAgTDY1LDE1IEw4NSwyNSBMOTUsNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNDA5RUZGIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iNSIgeTE9IjUwIiB4Mj0iOTUiIHkyPSI1MCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4="
                    alt="折线图"
                    class="w-full h-16 object-contain"
                  />

                  <!-- 饼图预览 -->
                  <img 
                    v-else-if="component.id === 'echarts-pie'" 
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNNTAsNTAgTDUwLDEwIEE0MCw0MCAwIDAsMSA5MCw1MCBaIiBmaWxsPSIjNDA5RUZGIi8+PHBhdGggZD0iTTUwLDUwIEw5MCw1MCBBNDM0MCAwIDAsMSA3MCw4NSBaIiBmaWxsPSIjNjdDMjNBIi8+PHBhdGggZD0iTTUwLDUwIEw3MCw4NSBBNDA0MCAwIDAsMSAyMCw2MCBaIiBmaWxsPSIjRTZBMjNDIi8+PHBhdGggZD0iTTUwLDUwIEwyMCw2MCBBNDM0MCAwIDAsMSA1MCwxMCBaIiBmaWxsPSIjRjU2QzZDIi8+PC9zdmc+"
                    alt="饼图"
                    class="w-full h-16 object-contain"
                  />

                  <!-- 散点图预览 -->
                  <img 
                    v-else-if="component.id === 'g2-scatter'" 
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgNjAiPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjMiIGZpbGw9IiM0MDlFRkYiLz48Y2lyY2xlIGN4PSIzMCIgY3k9IjIwIiByPSI0IiBmaWxsPSIjNDA5RUZGIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSIzMCIgcj0iMyIgZmlsbD0iIzQwOUVGRiIvPjxjaXJjbGUgY3g9IjcwIiBjeT0iMTUiIHI9IjUiIGZpbGw9IiM0MDlFRkYiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjQwIiByPSIzIiBmaWxsPSIjNDA5RUZGIi8+PGNpcmNsZSBjeD0iODAiIGN5PSI0MCIgcj0iNCIgZmlsbD0iIzQwOUVGRiIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iNDUiIHI9IjMiIGZpbGw9IiM0MDlFRkYiLz48bGluZSB4MT0iNSIgeTE9IjUwIiB4Mj0iOTUiIHkyPSI1MCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4="
                    alt="散点图"
                    class="w-full h-16 object-contain"
                  />

                  <!-- 默认图标 -->
                  <el-icon v-else class="text-lg">
                    <component :is="component.icon" />
                  </el-icon>
                </div>

                <div class="component-info flex flex-col items-center">
                  <span class="text-xs text-gray-700">{{ component.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        
        <!-- 空状态 -->
        <div v-if="filteredComponents.length === 0" class="text-center py-8 text-gray-500">
          <el-icon class="text-2xl mb-2"><Search /></el-icon>
          <p>没有找到匹配的组件</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { useEditorStore } from '../../store/editorStore';
import type { ComponentDefinition } from '../../types';
import { BASIC_COMPONENTS, LAYOUT_COMPONENTS, CHART_COMPONENTS } from '../../constants/components';

/**
 * 组件属性
 */
const props = defineProps({
  /**
   * 是否可拖拽
   */
  draggable: {
    type: Boolean,
    default: true,
  },
});

/**
 * 组件事件
 */
const emit = defineEmits<{
  // 组件拖动开始事件
  (e: 'component-drag-start', component: ComponentDefinition): void;
}>();

/**
 * 搜索文本
 */
const searchText = ref('');

/**
 * 当前激活的分类
 */
const activeCategory = ref('all');

/**
 * 编辑器store
 */
const editorStore = useEditorStore();

/**
 * 所有组件列表
 */
const allComponents = computed(() => editorStore.state.componentDefinitions);

/**
 * 过滤后的组件列表
 */
const filteredComponents = computed(() => {
  try {
    let components = allComponents.value;
    
    // 按类型过滤
    if (activeCategory.value !== 'all') {
      components = components.filter(comp => comp.type === activeCategory.value);
    }
    
    // 按搜索文本过滤
    if (searchText.value) {
      const searchLower = searchText.value.toLowerCase();
      components = components.filter(comp => 
        comp.name.toLowerCase().includes(searchLower) || 
        comp.id.toLowerCase().includes(searchLower)
      );
    }
    
    return components;
  } catch (error) {
    console.error('计算过滤后的组件列表失败:', error);
    return [];
  }
});

/**
 * 按组分类的组件列表
 */
const filteredComponentGroups = computed(() => {
  try {
    // 构建分组数据
    return [
      { type: 'basic', components: filteredComponents.value.filter(comp => comp.type === 'basic') },
      { type: 'layout', components: filteredComponents.value.filter(comp => comp.type === 'layout') },
      { type: 'chart', components: filteredComponents.value.filter(comp => comp.type === 'chart') },
    ];
  } catch (error) {
    console.error('计算按组分类的组件列表失败:', error);
    return [];
  }
});

/**
 * 获取组类型标签
 */
const getGroupLabel = (type: string): string => {
  try {
    switch (type) {
      case 'basic': return '基础组件';
      case 'layout': return '布局组件';
      case 'chart': return '图表组件';
      default: return '其他组件';
    }
  } catch (error) {
    console.error('获取组类型标签失败:', error);
    return '未知组件';
  }
};

/**
 * 处理拖动开始
 */
const handleDragStart = (event: DragEvent, component: ComponentDefinition) => {
  try {
    if (!event.dataTransfer) return;
    
    // 设置拖拽数据
    event.dataTransfer.setData('application/json', JSON.stringify({
      type: 'component',
      componentId: component.id,
    }));
    
    // 设置拖拽效果
    event.dataTransfer.effectAllowed = 'copy';
    
    // 设置拖拽图像
    const ghostElement = document.createElement('div');
    ghostElement.className = 'drag-ghost';
    ghostElement.textContent = component.name;
    ghostElement.style.position = 'absolute';
    ghostElement.style.top = '-9999px';
    document.body.appendChild(ghostElement);
    event.dataTransfer.setDragImage(ghostElement, 0, 0);
    
    // 创建一个延时函数移除ghost元素
    setTimeout(() => {
      document.body.removeChild(ghostElement);
    }, 0);
    
    // 触发事件
    emit('component-drag-start', component);
  } catch (error) {
    console.error('处理拖动开始失败:', error);
  }
};
</script>

<style scoped>
.component-item {
  min-height: 60px;
}

:deep(.el-tabs__header) {
  margin-bottom: 15px;
}

:deep(.el-tabs__nav) {
  width: 100%;
  display: flex;
}

:deep(.el-tabs__item) {
  flex: 1;
  text-align: center;
}
</style> 