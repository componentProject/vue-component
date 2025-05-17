<template>
  <div class="component-properties-form">
    <el-form v-if="definition" label-position="top" size="small">
      <template v-for="prop in definition.propSchema" :key="prop.name">
        <el-form-item
          :label="prop.label"
          :required="prop.required"
          :prop="prop.name"
        >
          <!-- 文本输入框 -->
          <template v-if="prop.type === 'text'">
            <el-input
              v-model="formData[prop.name]"
              :placeholder="`请输入${prop.label}`"
              @change="handleValueChange(prop.name, $event)"
            />
          </template>

          <!-- 数字输入框 -->
          <template v-else-if="prop.type === 'number'">
            <el-input-number
              v-model="formData[prop.name]"
              controls-position="right"
              :min="prop.min"
              :max="prop.max"
              :step="prop.step || 1"
              style="width: 100%"
              @change="handleValueChange(prop.name, $event)"
            />
          </template>

          <!-- 颜色选择器 -->
          <template v-else-if="prop.type === 'color'">
            <el-color-picker
              v-model="formData[prop.name]"
              show-alpha
              @change="handleValueChange(prop.name, $event)"
            />
          </template>

          <!-- 下拉选择框 -->
          <template v-else-if="prop.type === 'select'">
            <el-select
              v-model="formData[prop.name]"
              :placeholder="`请选择${prop.label}`"
              style="width: 100%"
              @change="handleValueChange(prop.name, $event)"
            >
              <el-option
                v-for="option in prop.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </template>

          <!-- 开关 -->
          <template v-else-if="prop.type === 'switch'">
            <el-switch
              v-model="formData[prop.name]"
              @change="handleValueChange(prop.name, $event)"
            />
          </template>

          <!-- 滑块 -->
          <template v-else-if="prop.type === 'slider'">
            <el-slider
              v-model="formData[prop.name]"
              :min="prop.min"
              :max="prop.max"
              :step="prop.step || 1"
              @change="handleValueChange(prop.name, $event)"
            />
          </template>

          <!-- 单选组 -->
          <template v-else-if="prop.type === 'radio'">
            <el-radio-group
              v-model="formData[prop.name]"
              @change="handleValueChange(prop.name, $event)"
            >
              <el-radio
                v-for="option in prop.options"
                :key="option.value"
                :label="option.value"
              >
                {{ option.label }}
              </el-radio>
            </el-radio-group>
          </template>

          <!-- 日期选择器 -->
          <template v-else-if="prop.type === 'datePicker'">
            <el-date-picker
              v-model="formData[prop.name]"
              type="date"
              style="width: 100%"
              placeholder="选择日期"
              @change="handleValueChange(prop.name, $event)"
            />
          </template>

          <!-- 默认显示为文本输入框 -->
          <template v-else>
            <el-input
              v-model="formData[prop.name]"
              :placeholder="`请输入${prop.label}`"
              @change="handleValueChange(prop.name, $event)"
            />
          </template>
        </el-form-item>
      </template>
    </el-form>

    <div v-else class="property-form-empty">
      <p>无可用属性</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 组件属性表单
 * 根据组件定义动态生成表单
 */
import { ref, computed, watch } from 'vue';
import { ElForm, ElFormItem, ElInput, ElInputNumber, ElColorPicker, ElSelect, ElOption, ElSwitch, ElSlider, ElRadioGroup, ElRadio, ElDatePicker } from 'element-plus';
import type { ComponentData, ComponentDefinition } from '../../types';

interface Props {
  /**
   * 组件数据
   */
  component: ComponentData;
  /**
   * 组件定义
   */
  definition: ComponentDefinition | null;
}

const props = defineProps<Props>();

/**
 * 事件
 */
const emit = defineEmits<{
  /**
   * 更新事件
   */
  (e: 'update', props: Record<string, any>): void;
}>();

/**
 * 表单数据
 */
const formData = ref<Record<string, any>>({});

/**
 * 监听组件变化
 */
watch(
  () => props.component,
  (newComponent) => {
    try {
      if (newComponent) {
        // 深拷贝属性避免直接修改Props
        formData.value = JSON.parse(JSON.stringify(newComponent.props || {}));
        
        // 确保所有定义的属性都有值，即使组件没有传入
        if (props.definition) {
          props.definition.propSchema.forEach((prop) => {
            // 如果属性不存在，使用默认值
            if (!(prop.name in formData.value)) {
              formData.value[prop.name] = prop.default !== undefined ? prop.default : null;
            }
          });
        }
      } else {
        formData.value = {};
      }
    } catch (error) {
      console.error(`初始化表单数据失败: ${error}`);
    }
  },
  { immediate: true, deep: true },
);

/**
 * 监听组件定义变化
 */
watch(
  () => props.definition,
  (newDefinition) => {
    try {
      if (newDefinition) {
        // 确保所有定义的属性都有值
        newDefinition.propSchema.forEach((prop) => {
          // 如果属性不存在，使用默认值
          if (!(prop.name in formData.value)) {
            formData.value[prop.name] = prop.default !== undefined ? prop.default : null;
          }
        });
      }
    } catch (error) {
      console.error(`处理组件定义变化失败: ${error}`);
    }
  },
  { immediate: true },
);

/**
 * 处理值变化
 */
const handleValueChange = (propName: string, value: any) => {
  try {
    // 克隆当前表单数据以避免直接修改Props
    const updatedData = { ...formData.value };
    
    // 更新特定属性值
    updatedData[propName] = value;
    
    // 执行验证
    if (props.definition) {
      const propSchema = props.definition.propSchema.find(
        (prop) => prop.name === propName
      );
      
      if (propSchema?.validator && !propSchema.validator(value)) {
        // 如果验证失败，恢复原始值
        updatedData[propName] = props.component.props[propName];
        return;
      }
    }
    
    // 触发更新事件
    emit('update', updatedData);
  } catch (error) {
    console.error(`处理值变化失败: ${error}`);
  }
};
</script>

<style lang="scss" scoped>
.component-properties-form {
  padding: 4px;
}

.property-form-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: #909399;
  font-size: 14px;
  border: 1px dashed #e4e7ed;
  border-radius: 4px;
  margin-top: 16px;
}
</style> 