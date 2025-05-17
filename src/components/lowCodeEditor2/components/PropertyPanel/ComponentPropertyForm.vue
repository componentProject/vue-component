<template>
  <el-form label-position="top" size="small" class="property-form">
    <template v-for="prop in filteredPropsSchema" :key="prop.name">
      <!-- 字符串类型属性 -->
      <el-form-item :label="prop.label" v-if="prop.type === 'string'">
        <el-input
          v-model="internalProps[prop.name]"
          :placeholder="`请输入${prop.label}`"
          @change="handlePropertyChange(prop.name, $event)"
        />
      </el-form-item>
      
      <!-- 数字类型属性 -->
      <el-form-item :label="prop.label" v-else-if="prop.type === 'number'">
        <el-input-number
          v-model="internalProps[prop.name]"
          controls-position="right"
          :min="prop.min"
          :max="prop.max"
          @change="handlePropertyChange(prop.name, $event)"
        />
      </el-form-item>
      
      <!-- 布尔类型属性 -->
      <el-form-item :label="prop.label" v-else-if="prop.type === 'boolean'">
        <el-switch
          v-model="internalProps[prop.name]"
          @change="handlePropertyChange(prop.name, $event)"
        />
      </el-form-item>
      
      <!-- 下拉选择类型属性 -->
      <el-form-item :label="prop.label" v-else-if="prop.type === 'select'">
        <el-select
          v-model="internalProps[prop.name]"
          :placeholder="`请选择${prop.label}`"
          class="w-full"
          @change="handlePropertyChange(prop.name, $event)"
        >
          <el-option
            v-for="option in prop.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      
      <!-- 颜色选择器 -->
      <el-form-item :label="prop.label" v-else-if="prop.type === 'color'">
        <el-color-picker
          v-model="internalProps[prop.name]"
          show-alpha
          @change="handlePropertyChange(prop.name, $event)"
        />
      </el-form-item>
      
      <!-- 滑块 -->
      <el-form-item :label="prop.label" v-else-if="prop.type === 'slider'">
        <el-slider
          v-model="internalProps[prop.name]"
          :min="prop.min"
          :max="prop.max"
          @change="handlePropertyChange(prop.name, $event)"
        />
      </el-form-item>
      
      <!-- 日期选择器 -->
      <el-form-item :label="prop.label" v-else-if="prop.type === 'date'">
        <el-date-picker
          v-model="internalProps[prop.name]"
          type="date"
          :placeholder="`请选择${prop.label}`"
          class="w-full"
          @change="handlePropertyChange(prop.name, $event)"
        />
      </el-form-item>
      
      <!-- 数组/对象类型 -->
      <el-form-item :label="prop.label" v-else-if="['array', 'object'].includes(prop.type)">
        <el-button
          size="small"
          @click="openJsonEditor(prop.name)"
        >
          编辑{{ prop.label }}
        </el-button>
      </el-form-item>
      
      <!-- 图标选择器 -->
      <el-form-item :label="prop.label" v-else-if="prop.type === 'icon'">
        <el-popover trigger="click" placement="bottom" width="300">
          <template #reference>
            <el-button size="small">
              <component
                :is="getIconComponent(internalProps[prop.name])"
                v-if="internalProps[prop.name]"
                class="mr-1"
              />
              选择图标
            </el-button>
          </template>
          <div class="icon-grid">
            <div
              v-for="iconName in availableIcons"
              :key="iconName"
              class="icon-item"
              @click="selectIcon(prop.name, iconName)"
            >
              <component :is="getIconComponent(iconName)" />
            </div>
          </div>
        </el-popover>
      </el-form-item>
      
      <!-- 事件编辑器 -->
      <el-form-item :label="prop.label" v-else-if="prop.type === 'event'">
        <el-input
          v-model="internalProps[prop.name]"
          :placeholder="'输入事件处理代码'"
          type="textarea"
          :rows="3"
          @change="handlePropertyChange(prop.name, $event)"
        />
      </el-form-item>
    </template>
  </el-form>
  
  <!-- JSON编辑器对话框 -->
  <el-dialog
    v-model="showJsonDialog"
    :title="`编辑${currentEditProp?.label || ''}`"
    width="80%"
    destroy-on-close
    append-to-body
  >
    <div class="json-editor-container">
      <el-input
        v-model="jsonEditorContent"
        type="textarea"
        :rows="10"
        placeholder="请输入JSON格式的数据"
        class="w-full font-mono text-sm"
      />
      
      <div class="text-red-500 text-xs mt-2" v-if="jsonEditorError">
        {{ jsonEditorError }}
      </div>
    </div>
    
    <template #footer>
      <el-button @click="showJsonDialog = false">取消</el-button>
      <el-button type="primary" @click="applyJsonChanges">应用</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import * as ElementPlusIcons from '@element-plus/icons-vue';
import type { PropSchema } from '../../types';

/**
 * 组件属性
 */
const props = defineProps<{
  // 属性配置
  propsSchema: PropSchema[];
  // 组件属性值
  componentProps: Record<string, any>;
}>();

/**
 * 组件事件
 */
const emit = defineEmits<{
  // 属性更新事件
  (e: 'update:props', newProps: Record<string, any>): void;
}>();

/**
 * 内部维护的属性值
 */
const internalProps = ref<Record<string, any>>({});

/**
 * JSON编辑器相关状态
 */
const showJsonDialog = ref(false);
const jsonEditorContent = ref('');
const jsonEditorError = ref('');
const currentEditProp = ref<PropSchema | null>(null);

/**
 * 可用的图标列表
 */
const availableIcons = computed(() => {
  try {
    return Object.keys(ElementPlusIcons)
      .filter(key => typeof (ElementPlusIcons as Record<string, any>)[key] === 'object');
  } catch (error) {
    console.error('获取可用图标列表失败:', error);
    return [];
  }
});

/**
 * 过滤后的属性配置
 */
const filteredPropsSchema = computed(() => {
  try {
    return props.propsSchema.filter(prop => {
      // 检查条件可见性
      if (prop.visibleIf) {
        const { field, value } = prop.visibleIf;
        return props.componentProps[field] === value;
      }
      return true;
    });
  } catch (error) {
    console.error('过滤属性配置失败:', error);
    return props.propsSchema;
  }
});

/**
 * 监听属性变化，更新内部属性值
 */
watch(() => props.componentProps, (newProps) => {
  try {
    internalProps.value = { ...newProps };
  } catch (error) {
    console.error('更新内部属性值失败:', error);
  }
}, { deep: true, immediate: true });

/**
 * 处理属性变化
 */
const handlePropertyChange = (propName: string, value: any) => {
  try {
    // 创建更新对象
    const updateObj: Record<string, any> = {};
    updateObj[propName] = value;
    
    // 发出更新事件
    emit('update:props', updateObj);
  } catch (error) {
    console.error('处理属性变化失败:', error);
  }
};

/**
 * 打开JSON编辑器
 */
const openJsonEditor = (propName: string) => {
  try {
    // 查找属性配置
    currentEditProp.value = props.propsSchema.find(p => p.name === propName) || null;
    
    // 设置初始内容
    const value = props.componentProps[propName];
    jsonEditorContent.value = value ? JSON.stringify(value, null, 2) : '';
    jsonEditorError.value = '';
    
    // 打开对话框
    showJsonDialog.value = true;
  } catch (error) {
    console.error('打开JSON编辑器失败:', error);
  }
};

/**
 * 应用JSON编辑器的修改
 */
const applyJsonChanges = () => {
  try {
    if (!currentEditProp.value) return;
    
    // 验证JSON格式
    try {
      const parsedData = JSON.parse(jsonEditorContent.value);
      const propName = currentEditProp.value.name;
      
      // 创建更新对象
      const updateObj: Record<string, any> = {};
      updateObj[propName] = parsedData;
      
      // 发出更新事件
      emit('update:props', updateObj);
      
      // 关闭对话框
      showJsonDialog.value = false;
      jsonEditorError.value = '';
    } catch (e) {
      jsonEditorError.value = '无效的JSON格式';
    }
  } catch (error) {
    console.error('应用JSON修改失败:', error);
  }
};

/**
 * 选择图标
 */
const selectIcon = (propName: string, iconName: string) => {
  try {
    handlePropertyChange(propName, iconName);
  } catch (error) {
    console.error('选择图标失败:', error);
  }
};

/**
 * 根据图标名称获取图标组件
 */
const getIconComponent = (iconName: string) => {
  try {
    return (ElementPlusIcons as Record<string, any>)[iconName] || null;
  } catch (error) {
    console.error('获取图标组件失败:', error);
    return null;
  }
};
</script>

<style lang="scss" scoped>
.property-form {
  padding: 4px 0;
}

// 图标选择器网格
.icon-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.icon-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #f0f9ff;
    border-color: #409eff;
    color: #409eff;
  }
}

// 表单项布局
:deep(.el-form-item__label) {
  padding-bottom: 4px;
  font-size: 12px;
}
</style> 