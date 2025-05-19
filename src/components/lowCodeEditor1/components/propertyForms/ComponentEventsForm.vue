<template>
  <div class="events-form-container">
    <el-form label-position="top" size="small">
      <!-- 常用事件列表 -->
      <el-collapse v-model="activeEvents">
        <el-collapse-item title="常用事件" name="commonEvents">
          <template v-for="(event, index) in commonEvents" :key="index">
            <el-form-item :label="event.label">
              <el-input
                v-model="eventHandlers[event.name]"
                type="textarea"
                :rows="3"
                :placeholder="event.placeholder || '请输入事件处理代码'"
                @change="(val) => handleEventChange(event.name, val)"
              />
            </el-form-item>
          </template>
        </el-collapse-item>
        
        <!-- 自定义事件编辑 -->
        <el-collapse-item title="自定义事件" name="customEvents">
          <div class="custom-event-container">
            <div class="custom-event-form">
              <el-form-item label="事件名称">
                <el-input v-model="newEventName" placeholder="如: custom-click" />
              </el-form-item>
              
              <el-form-item label="事件处理代码">
                <el-input
                  v-model="newEventHandler"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入事件处理代码"
                />
              </el-form-item>
              
              <el-button type="primary" @click="addCustomEvent" :disabled="!newEventName">
                添加事件
              </el-button>
            </div>
            
            <!-- 已添加的自定义事件列表 -->
            <div v-if="Object.keys(customEventHandlers).length > 0" class="mt-4">
              <div v-for="(handler, eventName) in customEventHandlers" :key="eventName" class="custom-event-item">
                <el-divider content-position="left">{{ eventName }}</el-divider>
                <el-input
                  v-model="customEventHandlers[eventName]"
                  type="textarea"
                  :rows="3"
                  @change="(val) => handleEventChange(eventName, val)"
                />
                <el-button 
                  type="danger" 
                  size="small" 
                  @click="removeCustomEvent(eventName)"
                  class="mt-2"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
/**
 * 组件事件表单
 * 用于配置组件的事件处理函数
 */
import { ref, computed, watch, onMounted } from 'vue';
import type { Component } from '../../types';
import { logInfo, logError } from '../../utils/logger';

// 定义属性
const props = defineProps<{
  component: Component;
}>();

// 定义事件
const emit = defineEmits<{
  (e: 'update-event', eventName: string, handlerCode: string): void;
}>();

// 当前打开的折叠面板
const activeEvents = ref(['commonEvents']);

// 事件处理函数容器
const eventHandlers = ref<Record<string, string>>({});

// 自定义事件处理函数容器
const customEventHandlers = ref<Record<string, string>>({});

// 新事件表单
const newEventName = ref('');
const newEventHandler = ref('');

/**
 * 常用事件列表
 * 根据组件类型动态生成
 */
const commonEvents = computed(() => {
  try {
    const componentType = props.component.type;
    const events: Array<{ name: string; label: string; placeholder?: string }> = [];
    
    // 所有组件通用事件
    events.push({ 
      name: 'click', 
      label: '点击事件',
      placeholder: '组件被点击时触发的代码'
    });
    
    // 根据组件类型添加特定事件
    switch (componentType) {
      case 'el-button':
        // 按钮特有事件
        break;
        
      case 'el-input':
        events.push({ 
          name: 'input', 
          label: '输入事件',
          placeholder: '输入值变化时触发的代码'
        });
        events.push({ 
          name: 'change', 
          label: '变更事件',
          placeholder: '输入框失去焦点或用户按Enter时触发'
        });
        events.push({ 
          name: 'focus', 
          label: '获取焦点事件',
          placeholder: '输入框获得焦点时触发的代码'
        });
        events.push({ 
          name: 'blur', 
          label: '失去焦点事件',
          placeholder: '输入框失去焦点时触发的代码'
        });
        break;
        
      case 'el-select':
        events.push({ 
          name: 'change', 
          label: '变更事件',
          placeholder: '选中值变化时触发的代码'
        });
        break;
        
      case 'el-checkbox-group':
      case 'el-radio-group':
        events.push({ 
          name: 'change', 
          label: '变更事件',
          placeholder: '绑定值变化时触发的代码'
        });
        break;
        
      case 'el-switch':
        events.push({ 
          name: 'change', 
          label: '变更事件',
          placeholder: '开关状态变化时触发的代码'
        });
        break;
        
      case 'el-slider':
        events.push({ 
          name: 'change', 
          label: '变更事件',
          placeholder: '值变化时触发的代码(结束拖动时)'
        });
        events.push({ 
          name: 'input', 
          label: '输入事件',
          placeholder: '值变化时触发的代码(实时)'
        });
        break;
        
      case 'el-date-picker':
        events.push({ 
          name: 'change', 
          label: '变更事件',
          placeholder: '选中值变化时触发的代码'
        });
        break;
        
      case 'el-tag':
        events.push({ 
          name: 'close', 
          label: '关闭事件',
          placeholder: '关闭标签时触发的代码'
        });
        break;
    }
    
    return events;
  } catch (error) {
    logError('Failed to generate common events', error);
    return [];
  }
});

/**
 * 初始化事件处理函数
 */
const initEventHandlers = () => {
  try {
    // 重置事件处理函数容器
    eventHandlers.value = {};
    customEventHandlers.value = {};
    
    if (!props.component.props.events) return;
    
    // 从组件属性中提取事件处理函数
    const events = props.component.props.events;
    
    // 遍历所有事件，分类为常用事件和自定义事件
    for (const eventName in events) {
      const isCommonEvent = commonEvents.value.some(e => e.name === eventName);
      
      if (isCommonEvent) {
        eventHandlers.value[eventName] = events[eventName];
      } else {
        customEventHandlers.value[eventName] = events[eventName];
      }
    }
  } catch (error) {
    logError('Failed to initialize event handlers', error);
  }
};

/**
 * 处理事件代码变更
 * @param eventName 事件名称
 * @param handlerCode 处理代码
 */
const handleEventChange = (eventName: string, handlerCode: string) => {
  try {
    emit('update-event', eventName, handlerCode);
    logInfo('Event handler updated', { eventName, handlerCode });
  } catch (error) {
    logError('Failed to update event handler', error);
  }
};

/**
 * 添加自定义事件
 */
const addCustomEvent = () => {
  try {
    if (!newEventName.value) return;
    
    // 添加自定义事件
    customEventHandlers.value[newEventName.value] = newEventHandler.value;
    
    // 触发更新事件
    handleEventChange(newEventName.value, newEventHandler.value);
    
    // 重置表单
    newEventName.value = '';
    newEventHandler.value = '';
    
    logInfo('Custom event added', { eventName: newEventName.value });
  } catch (error) {
    logError('Failed to add custom event', error);
  }
};

/**
 * 移除自定义事件
 * @param eventName 事件名称
 */
const removeCustomEvent = (eventName: string) => {
  try {
    // 从自定义事件列表中移除
    delete customEventHandlers.value[eventName];
    
    // 触发更新事件，传空字符串表示删除事件
    handleEventChange(eventName, '');
    
    logInfo('Custom event removed', { eventName });
  } catch (error) {
    logError('Failed to remove custom event', error);
  }
};

// 监听组件变化
watch(
  () => props.component,
  () => {
    initEventHandlers();
  },
  { deep: true }
);

// 组件挂载时初始化
onMounted(() => {
  try {
    initEventHandlers();
    logInfo('Component events form mounted');
  } catch (error) {
    logError('Failed to mount component events form', error);
  }
});
</script>

<style scoped>
.events-form-container {
  @apply p-2;
}

.custom-event-container {
  @apply mt-2;
}

.custom-event-form {
  @apply p-2 border border-gray-200 rounded-md bg-gray-50;
}

.custom-event-item {
  @apply mb-4;
}
</style> 