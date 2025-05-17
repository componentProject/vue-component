<template>
  <div class="property-panel h-full overflow-y-auto">
    <div v-if="component && componentDefinition" class="p-4">
      <h3 class="text-base font-medium text-gray-700 mb-3">属性设置</h3>
      
      <!-- 组件基本信息 -->
      <div class="component-info mb-4">
        <div class="flex items-center mb-2">
          <el-icon class="mr-2 text-gray-500">
            <component :is="componentDefinition.icon" />
          </el-icon>
          <span class="text-sm font-medium">{{ componentDefinition.name }}</span>
        </div>
        <div class="component-id text-xs text-gray-500">
          ID: {{ component.id }}
        </div>
      </div>
      
      <!-- 属性选项卡 -->
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基础属性" name="basic">
          <component-properties-form 
            :component="component" 
            :component-definition="componentDefinition"
            :filter-group="'basic'"
            @update="handlePropsUpdate"
          />
        </el-tab-pane>
        
        <el-tab-pane label="样式" name="style">
          <style-properties-form 
            :component="component"
            @update="handleStyleUpdate"
          />
        </el-tab-pane>
        
        <el-tab-pane label="高级" name="advanced" v-if="hasAdvancedProps">
          <component-properties-form 
            :component="component" 
            :component-definition="componentDefinition"
            :filter-group="'advanced'"
            @update="handlePropsUpdate"
          />
        </el-tab-pane>
        
        <el-tab-pane label="数据" name="data" v-if="isChartComponent">
          <data-source-form 
            :component="component"
            @update="handleDataSourceUpdate"
          />
        </el-tab-pane>
        
        <el-tab-pane label="事件" name="event" v-if="hasEventProps">
          <component-properties-form 
            :component="component" 
            :component-definition="componentDefinition"
            :filter-group="'event'"
            @update="handlePropsUpdate"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    
    <!-- 无选中组件时的空状态 -->
    <div v-else class="empty-state p-6 text-center">
      <el-empty description="请选择一个组件来编辑属性" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ComponentPropertiesForm from './ComponentPropertiesForm.vue';
import StylePropertiesForm from './StylePropertiesForm.vue';
import DataSourceForm from './DataSourceForm.vue';
import type { ComponentDefinition, CanvasComponent } from '../../types';

/**
 * 组件属性
 */
const props = defineProps<{
  /**
   * 当前选中的组件
   */
  component: CanvasComponent | null;
  
  /**
   * 组件定义
   */
  componentDefinition: ComponentDefinition | null;
}>();

/**
 * 组件事件
 */
const emit = defineEmits<{
  // 更新组件属性
  (e: 'update:props', props: Record<string, any>): void;
  // 更新组件样式
  (e: 'update:style', style: Partial<CanvasComponent['style']>): void;
  // 更新数据源
  (e: 'update:dataSource', dataSource: Partial<CanvasComponent['dataSource']>): void;
}>();

/**
 * 当前活动的选项卡
 */
const activeTab = ref('basic');

/**
 * 是否有高级属性
 */
const hasAdvancedProps = computed(() => {
  try {
    if (!props.componentDefinition?.propsSchema) return false;
    
    return props.componentDefinition.propsSchema.some(
      prop => prop.group === 'advanced'
    );
  } catch (error) {
    console.error('计算是否有高级属性失败:', error);
    return false;
  }
});

/**
 * 是否有事件属性
 */
const hasEventProps = computed(() => {
  try {
    if (!props.componentDefinition?.propsSchema) return false;
    
    return props.componentDefinition.propsSchema.some(
      prop => prop.group === 'event' || prop.type === 'event'
    );
  } catch (error) {
    console.error('计算是否有事件属性失败:', error);
    return false;
  }
});

/**
 * 是否是图表组件
 */
const isChartComponent = computed(() => {
  try {
    return props.componentDefinition?.type === 'chart';
  } catch (error) {
    console.error('计算是否是图表组件失败:', error);
    return false;
  }
});

/**
 * 处理属性更新
 */
const handlePropsUpdate = (newProps: Record<string, any>) => {
  try {
    emit('update:props', newProps);
  } catch (error) {
    console.error('处理属性更新失败:', error);
  }
};

/**
 * 处理样式更新
 */
const handleStyleUpdate = (newStyle: Partial<CanvasComponent['style']>) => {
  try {
    emit('update:style', newStyle);
  } catch (error) {
    console.error('处理样式更新失败:', error);
  }
};

/**
 * 处理数据源更新
 */
const handleDataSourceUpdate = (dataSource: Partial<CanvasComponent['dataSource']>) => {
  try {
    emit('update:dataSource', dataSource);
  } catch (error) {
    console.error('处理数据源更新失败:', error);
  }
};
</script>

<style scoped>
.property-panel {
  background-color: #f5f7fa;
  border-left: 1px solid #dcdfe6;
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
  font-size: 12px;
  padding: 0 5px;
}

.component-id {
  word-break: break-all;
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}
</style> 