<template>
  <div class="component-props-form">
    <el-form label-position="top" size="small" label-width="100px">
      <!-- 动态渲染属性表单项 -->
      <template v-for="(propConfig, propName) in propFields" :key="propName">
        <el-form-item :label="propConfig.label">
          <!-- 文本输入 -->
          <el-input 
            v-if="propConfig.type === 'string'" 
            v-model="componentProps[propName]"
            :placeholder="propConfig.placeholder"
            @change="(val) => updateProperty(propName, val)"
          />
          
          <!-- 数字输入 -->
          <el-input-number 
            v-else-if="propConfig.type === 'number'"
            v-model="componentProps[propName]"
            :min="propConfig.min"
            :max="propConfig.max"
            :step="propConfig.step || 1"
            @change="(val) => updateProperty(propName, val)"
          />
          
          <!-- 布尔值开关 -->
          <el-switch 
            v-else-if="propConfig.type === 'boolean'"
            v-model="componentProps[propName]"
            @change="(val) => updateProperty(propName, val)"
          />
          
          <!-- 选择器 -->
          <el-select 
            v-else-if="propConfig.type === 'select'"
            v-model="componentProps[propName]"
            :placeholder="propConfig.placeholder"
            @change="(val) => updateProperty(propName, val)"
          >
            <el-option 
              v-for="option in propConfig.options" 
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          
          <!-- 颜色选择器 -->
          <el-color-picker 
            v-else-if="propConfig.type === 'color'"
            v-model="componentProps[propName]"
            show-alpha
            @change="(val) => updateProperty(propName, val)"
          />
          
          <!-- 日期选择器 -->
          <el-date-picker 
            v-else-if="propConfig.type === 'date'"
            v-model="componentProps[propName]"
            :type="propConfig.dateType || 'date'"
            @change="(val) => updateProperty(propName, val)"
          />
          
          <!-- 默认文本输入 -->
          <el-input 
            v-else
            v-model="componentProps[propName]"
            @change="(val) => updateProperty(propName, val)"
          />
        </el-form-item>
      </template>
      
      <!-- 未能识别的属性 -->
      <el-collapse v-if="unknownProps.length > 0">
        <el-collapse-item title="其他属性">
          <el-form-item 
            v-for="propName in unknownProps" 
            :key="propName"
            :label="propName"
          >
            <el-input 
              v-model="componentProps[propName]"
              @change="(val) => updateProperty(propName, val)"
            />
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
/**
 * 组件属性表单
 * 根据组件类型动态生成属性编辑表单
 */
import { ref, computed, watch, onMounted } from 'vue';
import type { Component, ComponentDefinition } from '../../types';
import { logInfo, logError } from '../../utils/logger';

// 定义属性
const props = defineProps<{
  component: Component;
  componentDefinition: ComponentDefinition | null;
}>();

// 定义事件
const emit = defineEmits<{
  (e: 'update-property', property: string, value: any): void;
}>();

// 组件属性的本地副本
const componentProps = ref<Record<string, any>>({});

// 监听组件变化，更新本地属性副本
watch(
  () => props.component,
  (newComponent) => {
    try {
      componentProps.value = { ...newComponent.props };
    } catch (error) {
      logError('Failed to update local component props', error);
    }
  },
  { immediate: true, deep: true }
);

/**
 * 根据组件类型和属性名获取属性配置
 */
const propFields = computed(() => {
  try {
    const fields: Record<string, any> = {};
    
    // 基本属性配置
    if (!props.componentDefinition) return fields;
    
    const componentType = props.component.type;
    
    // 根据组件类型动态生成属性配置
    switch (componentType) {
      case 'el-button': 
        fields.text = { type: 'string', label: '按钮文本', placeholder: '请输入按钮文本' };
        fields.type = { 
          type: 'select', 
          label: '类型', 
          options: [
            { label: '默认', value: 'default' },
            { label: '主要', value: 'primary' },
            { label: '成功', value: 'success' },
            { label: '警告', value: 'warning' },
            { label: '危险', value: 'danger' },
            { label: '信息', value: 'info' },
            { label: '文本', value: 'text' }
          ]
        };
        fields.size = { 
          type: 'select', 
          label: '尺寸', 
          options: [
            { label: '默认', value: 'default' },
            { label: '中等', value: 'medium' },
            { label: '小', value: 'small' },
            { label: '迷你', value: 'mini' }
          ]
        };
        fields.plain = { type: 'boolean', label: '朴素按钮' };
        fields.round = { type: 'boolean', label: '圆角按钮' };
        fields.circle = { type: 'boolean', label: '圆形按钮' };
        fields.disabled = { type: 'boolean', label: '禁用状态' };
        break;
        
      case 'el-input':
        fields.placeholder = { type: 'string', label: '占位文本', placeholder: '请输入占位文本' };
        fields.type = { 
          type: 'select', 
          label: '类型', 
          options: [
            { label: '文本', value: 'text' },
            { label: '文本域', value: 'textarea' },
            { label: '密码', value: 'password' },
            { label: '数字', value: 'number' },
            { label: '邮箱', value: 'email' },
            { label: '网址', value: 'url' }
          ]
        };
        fields.maxlength = { type: 'number', label: '最大长度', min: 0 };
        fields.minlength = { type: 'number', label: '最小长度', min: 0 };
        fields.clearable = { type: 'boolean', label: '可清空' };
        fields.disabled = { type: 'boolean', label: '禁用状态' };
        fields.readonly = { type: 'boolean', label: '只读' };
        break;
        
      // 其他组件类型的属性配置...
      case 'el-select':
        fields.placeholder = { type: 'string', label: '占位文本', placeholder: '请输入占位文本' };
        fields.clearable = { type: 'boolean', label: '可清空' };
        fields.disabled = { type: 'boolean', label: '禁用状态' };
        fields.multiple = { type: 'boolean', label: '多选' };
        fields.collapseTags = { type: 'boolean', label: '折叠标签' };
        break;
        
      case 'el-radio-group':
      case 'el-checkbox-group':
        fields.disabled = { type: 'boolean', label: '禁用状态' };
        break;
        
      case 'el-switch':
        fields.activeText = { type: 'string', label: '打开时文字', placeholder: '请输入打开时显示的文字' };
        fields.inactiveText = { type: 'string', label: '关闭时文字', placeholder: '请输入关闭时显示的文字' };
        fields.disabled = { type: 'boolean', label: '禁用状态' };
        break;
        
      case 'el-slider':
        fields.min = { type: 'number', label: '最小值', min: 0 };
        fields.max = { type: 'number', label: '最大值', min: 0 };
        fields.step = { type: 'number', label: '步长', min: 0 };
        fields.disabled = { type: 'boolean', label: '禁用状态' };
        fields.showInput = { type: 'boolean', label: '显示输入框' };
        fields.range = { type: 'boolean', label: '范围选择' };
        break;

      case 'el-tag':
        fields.text = { type: 'string', label: '标签内容', placeholder: '请输入标签内容' };
        fields.type = { 
          type: 'select', 
          label: '类型', 
          options: [
            { label: '默认', value: '' },
            { label: '成功', value: 'success' },
            { label: '警告', value: 'warning' },
            { label: '危险', value: 'danger' },
            { label: '信息', value: 'info' }
          ]
        };
        fields.effect = { 
          type: 'select', 
          label: '主题', 
          options: [
            { label: '明亮', value: 'light' },
            { label: '暗黑', value: 'dark' },
            { label: '朴素', value: 'plain' }
          ]
        };
        fields.closable = { type: 'boolean', label: '可关闭' };
        fields.disableTransitions = { type: 'boolean', label: '禁用渐变动画' };
        break;
        
      // 布局组件
      case 'el-row':
        fields.gutter = { type: 'number', label: '栅格间隔', min: 0 };
        fields.justify = { 
          type: 'select', 
          label: '水平排列方式', 
          options: [
            { label: '开始', value: 'start' },
            { label: '结束', value: 'end' },
            { label: '居中', value: 'center' },
            { label: '均匀排列', value: 'space-around' },
            { label: '两端对齐', value: 'space-between' }
          ]
        };
        fields.align = { 
          type: 'select', 
          label: '垂直排列方式', 
          options: [
            { label: '顶部', value: 'top' },
            { label: '中间', value: 'middle' },
            { label: '底部', value: 'bottom' }
          ]
        };
        break;
        
      case 'el-col':
        fields.span = { type: 'number', label: '栅格列数', min: 0, max: 24 };
        fields.offset = { type: 'number', label: '左侧间隔列数', min: 0, max: 24 };
        fields.xs = { type: 'number', label: '小屏幕列数', min: 0, max: 24 };
        fields.sm = { type: 'number', label: '中小屏幕列数', min: 0, max: 24 };
        fields.md = { type: 'number', label: '中等屏幕列数', min: 0, max: 24 };
        fields.lg = { type: 'number', label: '大屏幕列数', min: 0, max: 24 };
        fields.xl = { type: 'number', label: '超大屏幕列数', min: 0, max: 24 };
        break;
        
      case 'el-container':
        fields.direction = { 
          type: 'select', 
          label: '排列方向', 
          options: [
            { label: '垂直', value: 'vertical' },
            { label: '水平', value: 'horizontal' }
          ]
        };
        break;
        
      case 'el-header':
        fields.height = { type: 'string', label: '高度' };
        break;
        
      case 'el-footer':
        fields.height = { type: 'string', label: '高度' };
        break;
        
      case 'el-aside':
        fields.width = { type: 'string', label: '宽度' };
        break;
    }
    
    return fields;
  } catch (error) {
    logError('Failed to generate property fields', error);
    return {};
  }
});

/**
 * 未被识别的属性名列表
 */
const unknownProps = computed(() => {
  try {
    if (!props.component.props) return [];
    
    // 获取所有属性名
    const allPropNames = Object.keys(props.component.props);
    
    // 过滤出未被配置的属性名
    return allPropNames.filter(propName => !propFields.value[propName]);
  } catch (error) {
    logError('Failed to get unknown props', error);
    return [];
  }
});

/**
 * 更新属性值
 * @param property 属性名
 * @param value 属性值
 */
const updateProperty = (property: string, value: any) => {
  try {
    emit('update-property', property, value);
    logInfo('Property updated', { property, value });
  } catch (error) {
    logError('Failed to update property', error);
  }
};

onMounted(() => {
  try {
    // 将组件属性复制到本地状态
    componentProps.value = { ...props.component.props };
    logInfo('Component props form mounted');
  } catch (error) {
    logError('Failed to initialize component props form', error);
  }
});
</script>

<style scoped>
.component-props-form {
  @apply p-2;
}
</style> 