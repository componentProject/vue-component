<template>
  <div class="component-properties-form">
    <el-form label-position="top" size="small">
      <template v-for="propSchema in filteredPropSchemas" :key="propSchema.name">
        <!-- 字符串输入 -->
        <el-form-item :label="propSchema.label" v-if="propSchema.type === 'string'">
          <el-input 
            v-model="formValues[propSchema.name]" 
            :placeholder="`请输入${propSchema.label}`"
            @change="handleValueChange(propSchema.name, $event)"
          />
        </el-form-item>
        
        <!-- 数字输入 -->
        <el-form-item :label="propSchema.label" v-else-if="propSchema.type === 'number'">
          <el-input-number 
            v-model="formValues[propSchema.name]"
            :min="propSchema.min" 
            :max="propSchema.max"
            :step="1"
            class="w-full"
            controls-position="right"
            @change="handleValueChange(propSchema.name, $event)"
          />
        </el-form-item>
        
        <!-- 布尔值开关 -->
        <el-form-item :label="propSchema.label" v-else-if="propSchema.type === 'boolean'">
          <el-switch 
            v-model="formValues[propSchema.name]"
            @change="handleValueChange(propSchema.name, $event)"
          />
        </el-form-item>
        
        <!-- 选择器 -->
        <el-form-item :label="propSchema.label" v-else-if="propSchema.type === 'select'">
          <el-select 
            v-model="formValues[propSchema.name]"
            class="w-full"
            @change="handleValueChange(propSchema.name, $event)"
          >
            <el-option 
              v-for="option in propSchema.options" 
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        
        <!-- 颜色选择器 -->
        <el-form-item :label="propSchema.label" v-else-if="propSchema.type === 'color'">
          <el-color-picker 
            v-model="formValues[propSchema.name]"
            show-alpha
            class="w-full"
            @change="handleValueChange(propSchema.name, $event)"
          />
        </el-form-item>
        
        <!-- 滑块 -->
        <el-form-item :label="propSchema.label" v-else-if="propSchema.type === 'slider'">
          <el-slider 
            v-model="formValues[propSchema.name]"
            :min="propSchema.min" 
            :max="propSchema.max"
            :step="1"
            @change="handleValueChange(propSchema.name, $event)"
          />
        </el-form-item>
        
        <!-- 数组输入 -->
        <el-form-item :label="propSchema.label" v-else-if="propSchema.type === 'array'">
          <el-button 
            size="small" 
            type="primary" 
            @click="openArrayEditor(propSchema.name)"
          >
            编辑数组
          </el-button>
        </el-form-item>
        
        <!-- 对象输入 -->
        <el-form-item :label="propSchema.label" v-else-if="propSchema.type === 'object'">
          <el-button 
            size="small" 
            type="primary" 
            @click="openObjectEditor(propSchema.name)"
          >
            编辑对象
          </el-button>
        </el-form-item>
        
        <!-- 事件设置 -->
        <el-form-item :label="propSchema.label" v-else-if="propSchema.type === 'event'">
          <el-input 
            v-model="formValues[propSchema.name]" 
            :placeholder="'请输入事件处理代码'"
            type="textarea"
            rows="3"
            @change="handleValueChange(propSchema.name, $event)"
          />
        </el-form-item>
        
        <!-- 其他未知类型 -->
        <el-form-item :label="propSchema.label" v-else>
          <el-input 
            v-model="formValues[propSchema.name]" 
            :placeholder="`请输入${propSchema.label}`"
            @change="handleValueChange(propSchema.name, $event)"
          />
        </el-form-item>
      </template>
      
      <!-- 没有属性的情况 -->
      <el-empty 
        v-if="filteredPropSchemas.length === 0" 
        description="当前分组没有可配置的属性" 
        :image-size="100"
      />
    </el-form>
    
    <!-- 数组/对象编辑对话框 -->
    <el-dialog
      v-model="showJsonEditor"
      :title="`编辑${currentEditingProp ? '属性:' + currentEditingProp : ''}`"
      width="80%"
      destroy-on-close
    >
      <div class="json-editor">
        <el-input
          v-model="jsonEditorContent"
          type="textarea"
          :rows="15"
          :placeholder="'请输入有效的JSON格式'"
          class="w-full font-mono text-sm"
        />
        <div v-if="jsonEditorError" class="text-red-500 mt-2">
          {{ jsonEditorError }}
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showJsonEditor = false">取消</el-button>
          <el-button type="primary" @click="applyJsonChanges">应用</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue';
import type { ComponentDefinition, CanvasComponent, PropSchema } from '../../types';

/**
 * 组件属性
 */
const props = defineProps<{
  /**
   * 当前组件
   */
  component: CanvasComponent;
  
  /**
   * 组件定义
   */
  componentDefinition: ComponentDefinition;
  
  /**
   * 筛选属性组
   */
  filterGroup?: string;
}>();

/**
 * 组件事件
 */
const emit = defineEmits<{
  // 属性更新
  (e: 'update', props: Record<string, any>): void;
}>();

/**
 * 表单值，存储属性的当前值
 */
const formValues = reactive<Record<string, any>>({});

/**
 * 初始化表单值
 */
const initFormValues = () => {
  try {
    // 清空旧值
    Object.keys(formValues).forEach(key => {
      delete formValues[key];
    });
    
    // 从组件属性中获取当前值
    if (props.component && props.component.props) {
      Object.entries(props.component.props).forEach(([key, value]) => {
        formValues[key] = value;
      });
    }
    
    // 填充默认值
    if (props.componentDefinition && props.componentDefinition.propsSchema) {
      props.componentDefinition.propsSchema.forEach(schema => {
        if (!(schema.name in formValues) && 'default' in schema) {
          formValues[schema.name] = schema.default;
        }
      });
    }
  } catch (error) {
    console.error('初始化表单值失败:', error);
  }
};

/**
 * 筛选后的属性配置
 */
const filteredPropSchemas = computed(() => {
  try {
    if (!props.componentDefinition || !props.componentDefinition.propsSchema) {
      return [];
    }
    
    // 根据filterGroup过滤
    if (props.filterGroup) {
      return props.componentDefinition.propsSchema.filter(
        schema => schema.group === props.filterGroup
      );
    }
    
    return props.componentDefinition.propsSchema;
  } catch (error) {
    console.error('计算筛选后的属性配置失败:', error);
    return [];
  }
});

/**
 * 处理值变化
 */
const handleValueChange = (propName: string, value: any) => {
  try {
    // 准备更新的属性对象
    const updateProps: Record<string, any> = {
      [propName]: value
    };
    
    // 发送更新事件
    emit('update', updateProps);
  } catch (error) {
    console.error('处理值变化失败:', error);
  }
};

/**
 * JSON编辑器相关状态
 */
const showJsonEditor = ref(false);
const currentEditingProp = ref<string | null>(null);
const jsonEditorContent = ref('');
const jsonEditorError = ref('');

/**
 * 打开数组编辑器
 */
const openArrayEditor = (propName: string) => {
  try {
    currentEditingProp.value = propName;
    const value = formValues[propName] || [];
    jsonEditorContent.value = JSON.stringify(value, null, 2);
    jsonEditorError.value = '';
    showJsonEditor.value = true;
  } catch (error) {
    console.error('打开数组编辑器失败:', error);
  }
};

/**
 * 打开对象编辑器
 */
const openObjectEditor = (propName: string) => {
  try {
    currentEditingProp.value = propName;
    const value = formValues[propName] || {};
    jsonEditorContent.value = JSON.stringify(value, null, 2);
    jsonEditorError.value = '';
    showJsonEditor.value = true;
  } catch (error) {
    console.error('打开对象编辑器失败:', error);
  }
};

/**
 * 应用JSON编辑器的更改
 */
const applyJsonChanges = () => {
  try {
    if (!currentEditingProp.value) return;
    
    try {
      // 解析JSON
      const parsedValue = JSON.parse(jsonEditorContent.value);
      
      // 更新属性
      handleValueChange(currentEditingProp.value, parsedValue);
      
      // 更新本地表单值
      formValues[currentEditingProp.value] = parsedValue;
      
      // 关闭编辑器
      showJsonEditor.value = false;
      jsonEditorError.value = '';
    } catch (e) {
      jsonEditorError.value = '无效的JSON格式';
    }
  } catch (error) {
    console.error('应用JSON更改失败:', error);
  }
};

// 监听组件变化，重新初始化表单值
watch(() => props.component, () => {
  initFormValues();
}, { deep: true, immediate: true });
</script>

<style scoped>
:deep(.el-form-item) {
  margin-bottom: 15px;
}

:deep(.el-form-item__label) {
  padding: 0;
  line-height: 1.5;
  margin-bottom: 5px;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-color-picker) {
  width: 100%;
  display: flex;
}
</style> 