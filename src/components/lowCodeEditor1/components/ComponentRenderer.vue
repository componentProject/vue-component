<template>
  <div 
    class="component-renderer-container"
    @dragover="handleDragOver"
    @drop="handleDrop"
    @click.self="handleCanvasClick"
  >
    <!-- 空状态提示 -->
    <div v-if="!components || components.length === 0" class="empty-container">
      <el-empty description="拖拽组件到此处开始设计">
        <el-button type="primary" @click="showImportDialog = true">导入现有配置</el-button>
      </el-empty>
    </div>
    
    <!-- 渲染组件列表 -->
    <template v-else>
      <div class="canvas-container">
        <draggable-component
          v-for="component in components"
          :key="component.id"
          :component="component"
          :is-selected="selectedComponentId === component.id"
          @select="handleSelectComponent"
          @move="handleMoveComponent"
          @delete="handleDeleteComponent"
        />
      </div>
    </template>
    
    <!-- 磁吸引导线 -->
    <div v-if="showGuides">
      <div 
        v-for="(guide, index) in activeGuides" 
        :key="index"
        class="guide-line"
        :class="guide.direction"
        :style="guideLineStyle(guide)"
      ></div>
    </div>
    
    <!-- 导入配置对话框 -->
    <el-dialog
      v-model="showImportDialog"
      title="导入JSON配置"
      width="50%"
    >
      <el-input
        v-model="importJsonText"
        type="textarea"
        :rows="10"
        placeholder="请粘贴JSON配置"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showImportDialog = false">取消</el-button>
          <el-button type="primary" @click="handleImportConfig">导入</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
/**
 * 组件渲染器
 * 在中间编辑区域渲染和管理拖拽的组件
 */
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { componentRegistry } from '../utils/componentRegistry';
import { useComponentRules } from '../hooks/useComponentRules';
import { useMagneticAlignment } from '../hooks/useMagneticAlignment';
import type { Component, Position } from '../types';
import { logInfo, logError } from '../utils/logger';
import DraggableComponent from './DraggableComponent.vue';

// 定义属性
const props = defineProps<{
  components: Component[]
}>();

// 定义事件
const emit = defineEmits<{
  (e: 'select-component', componentId: string): void;
  (e: 'update-components', components: Component[]): void;
}>();

// 当前选中的组件ID
const selectedComponentId = ref<string | null>(null);

// 导入配置相关
const showImportDialog = ref(false);
const importJsonText = ref('');

// 组件规则校验
const { validateComponentPlacement } = useComponentRules();

// 磁吸对齐相关
const { 
  activeGuides, 
  showGuides, 
  calculateGuides, 
  clearGuides 
} = useMagneticAlignment();

/**
 * 处理画布点击事件
 * 当点击画布空白区域时，取消组件选择
 */
const handleCanvasClick = () => {
  try {
    selectedComponentId.value = null;
    emit('select-component', '');
    logInfo('Canvas clicked, component deselected');
  } catch (error) {
    logError('Failed to handle canvas click', error);
  }
};

/**
 * 处理组件选择事件
 * @param componentId 选中的组件ID
 */
const handleSelectComponent = (componentId: string) => {
  try {
    selectedComponentId.value = componentId;
    emit('select-component', componentId);
    logInfo('Component selected', { componentId });
  } catch (error) {
    logError('Failed to select component', error);
  }
};

/**
 * 处理组件移动事件
 * @param componentId 组件ID
 * @param newPosition 新位置
 */
const handleMoveComponent = (componentId: string, newPosition: Position) => {
  try {
    const updatePosition = (componentList: Component[]): boolean => {
      for (const component of componentList) {
        if (component.id === componentId) {
          if (!component.style) component.style = {};
          component.style.left = `${newPosition.x}px`;
          component.style.top = `${newPosition.y}px`;
          return true;
        }
        
        // 递归检查子组件
        if (component.children && component.children.length > 0) {
          const updated = updatePosition(component.children);
          if (updated) return true;
        }
        
        // 递归检查插槽中的组件
        if (component.slots) {
          for (const slotName in component.slots) {
            const updated = updatePosition(component.slots[slotName]);
            if (updated) return true;
          }
        }
      }
      return false;
    };
    
    // 创建组件列表的副本以保持响应性
    const updatedComponents = JSON.parse(JSON.stringify(props.components));
    updatePosition(updatedComponents);
    
    // 更新组件列表
    emit('update-components', updatedComponents);
    logInfo('Component moved', { componentId, position: newPosition });
  } catch (error) {
    logError('Failed to move component', error);
  }
};

/**
 * 处理组件删除事件
 * @param componentId 要删除的组件ID
 */
const handleDeleteComponent = (componentId: string) => {
  try {
    const removeComponent = (componentList: Component[]): Component[] => {
      return componentList.filter(item => {
        if (item.id === componentId) return false;
        
        // 递归过滤子组件
        if (item.children && item.children.length > 0) {
          item.children = removeComponent(item.children);
        }
        
        // 递归过滤插槽中的组件
        if (item.slots) {
          for (const slotName in item.slots) {
            item.slots[slotName] = removeComponent(item.slots[slotName]);
          }
        }
        
        return true;
      });
    };
    
    // 创建组件列表的副本以保持响应性
    const updatedComponents = JSON.parse(JSON.stringify(props.components));
    const filteredComponents = removeComponent(updatedComponents);
    
    // 如果删除的是当前选中的组件，清除选择状态
    if (selectedComponentId.value === componentId) {
      selectedComponentId.value = null;
      emit('select-component', '');
    }
    
    // 更新组件列表
    emit('update-components', filteredComponents);
    logInfo('Component deleted', { componentId });
  } catch (error) {
    logError('Failed to delete component', error);
  }
};

/**
 * 处理拖拽悬停事件
 * @param event 拖拽事件
 */
const handleDragOver = (event: DragEvent) => {
  try {
    // 阻止默认行为以允许放置
    event.preventDefault();
    
    // 设置放置效果为复制
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  } catch (error) {
    logError('Failed to handle drag over', error);
  }
};

/**
 * 处理组件放置事件
 * @param event 拖拽事件
 */
const handleDrop = (event: DragEvent) => {
  try {
    event.preventDefault();
    
    if (!event.dataTransfer) return;
    
    // 获取组件数据
    const data = event.dataTransfer.getData('application/json');
    if (!data) return;
    
    const dragData = JSON.parse(data);
    const { componentType } = dragData;
    
    // 获取组件定义
    const componentDefinition = componentRegistry.getComponent(componentType);
    if (!componentDefinition) {
      logError('Component type not found', { componentType });
      return;
    }
    
    // 获取放置位置
    const canvasRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX - canvasRect.left;
    const y = event.clientY - canvasRect.top;
    
    // 创建新组件
    const newComponent: Component = {
      id: `${componentType}-${Date.now()}`,
      type: componentType,
      props: { ...componentDefinition.defaultProps } || {},
      style: {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        ...(componentType === 'el-row' ? { width: '100%' } : {}),
        ...(componentType === 'el-container' ? { width: '100%', height: '100%' } : {})
      }
    };
    
    // 验证组件放置规则
    const validationResult = validateComponentPlacement(newComponent, props.components);
    if (!validationResult.valid) {
      // 显示放置错误提示
      ElMessage.error(validationResult.message);
      logError('Invalid component placement', { 
        component: newComponent, 
        message: validationResult.message 
      });
      return;
    }
    
    // 添加到指定父组件或根级别
    if (validationResult.parentId) {
      const addToParent = (componentList: Component[]): boolean => {
        for (const component of componentList) {
          if (component.id === validationResult.parentId) {
            if (!component.children) component.children = [];
            component.children.push(newComponent);
            return true;
          }
          
          // 递归检查子组件
          if (component.children && component.children.length > 0) {
            const added = addToParent(component.children);
            if (added) return true;
          }
          
          // 递归检查插槽中的组件
          if (component.slots) {
            for (const slotName in component.slots) {
              const added = addToParent(component.slots[slotName]);
              if (added) return true;
            }
          }
        }
        return false;
      };
      
      // 创建组件列表的副本以保持响应性
      const updatedComponents = JSON.parse(JSON.stringify(props.components));
      addToParent(updatedComponents);
      
      // 更新组件列表
      emit('update-components', updatedComponents);
    } else {
      // 添加到根级别
      const updatedComponents = [...props.components, newComponent];
      emit('update-components', updatedComponents);
    }
    
    // 选中新添加的组件
    selectedComponentId.value = newComponent.id;
    emit('select-component', newComponent.id);
    
    logInfo('Component dropped', { 
      componentType,
      position: { x, y },
      newComponentId: newComponent.id
    });
  } catch (error) {
    logError('Failed to handle component drop', error);
  }
};

/**
 * 处理配置导入
 */
const handleImportConfig = () => {
  try {
    if (!importJsonText.value) {
      ElMessage.warning('请输入有效的JSON配置');
      return;
    }
    
    // 解析JSON
    const config = JSON.parse(importJsonText.value);
    
    // 验证基本结构
    if (!config.components || !Array.isArray(config.components)) {
      ElMessage.error('无效的配置格式，缺少components数组');
      return;
    }
    
    // 更新组件列表
    emit('update-components', config.components);
    
    // 关闭对话框
    showImportDialog.value = false;
    
    ElMessage.success('配置导入成功');
    logInfo('Configuration imported', { componentCount: config.components.length });
  } catch (error) {
    logError('Failed to import configuration', error);
    ElMessage.error('配置导入失败，请检查JSON格式');
  }
};

/**
 * 磁吸引导线样式计算
 * @param guide 引导线信息
 * @returns 引导线样式对象
 */
const guideLineStyle = (guide: { direction: string; position: number; }) => {
  try {
    if (guide.direction === 'horizontal') {
      return {
        top: `${guide.position}px`,
        width: '100%'
      };
    } else {
      return {
        left: `${guide.position}px`,
        height: '100%'
      };
    }
  } catch (error) {
    logError('Failed to calculate guide line style', error);
    return {};
  }
};

// 组件挂载时添加键盘事件监听
onMounted(() => {
  try {
    window.addEventListener('keydown', handleKeyDown);
    logInfo('Component renderer mounted');
  } catch (error) {
    logError('Failed to setup component renderer', error);
  }
});

// 组件卸载时移除键盘事件监听
onUnmounted(() => {
  try {
    window.removeEventListener('keydown', handleKeyDown);
    logInfo('Component renderer unmounted');
  } catch (error) {
    logError('Failed to cleanup component renderer', error);
  }
});

/**
 * 处理键盘事件
 * @param event 键盘事件
 */
const handleKeyDown = (event: KeyboardEvent) => {
  try {
    // 删除选中的组件 (Delete 或 Backspace 键)
    if ((event.key === 'Delete' || event.key === 'Backspace') && selectedComponentId.value) {
      handleDeleteComponent(selectedComponentId.value);
    }
  } catch (error) {
    logError('Failed to handle key down event', error);
  }
};

// 暴露组件方法
defineExpose({
  selectComponent: handleSelectComponent,
  deleteComponent: handleDeleteComponent
});
</script>

<style scoped>
.component-renderer-container {
  @apply relative w-full h-full overflow-auto bg-gray-50;
  min-height: 500px;
}

.empty-container {
  @apply flex items-center justify-center h-full;
}

.canvas-container {
  @apply relative w-full h-full min-h-screen;
}

.guide-line {
  @apply absolute bg-blue-400 pointer-events-none;
  z-index: 1000;
}

.guide-line.horizontal {
  @apply h-px;
}

.guide-line.vertical {
  @apply w-px;
}
</style> 