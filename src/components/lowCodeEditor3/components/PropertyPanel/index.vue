<template>
  <div class="property-panel">
    <div class="property-panel-header">
      <h2 class="property-panel-title">{{ title }}</h2>
    </div>

    <div v-if="selectedComponent" class="property-panel-content">
      <el-tabs v-model="activeTab" class="property-tabs">
        <el-tab-pane label="组件属性" name="props">
          <component-properties-form
            :component="selectedComponent"
            :definition="componentDefinition"
            @update="updateComponentProps"
          />
        </el-tab-pane>

        <el-tab-pane label="样式属性" name="style">
          <el-form label-position="top" size="small">
            <el-form-item label="位置和大小">
              <div class="position-size-form">
                <el-row :gutter="8" class="mb-2">
                  <el-col :span="12">
                    <el-form-item label="X 坐标">
                      <el-input-number
                        v-model="componentStyle.left"
                        controls-position="right"
                        :step="1"
                        @change="updateStyleValue('left', $event)"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="Y 坐标">
                      <el-input-number
                        v-model="componentStyle.top"
                        controls-position="right"
                        :step="1"
                        @change="updateStyleValue('top', $event)"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="8">
                  <el-col :span="12">
                    <el-form-item label="宽度">
                      <el-input-number
                        v-model="componentStyle.width"
                        controls-position="right"
                        :min="20"
                        :step="1"
                        @change="updateStyleValue('width', $event)"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="高度">
                      <el-input-number
                        v-model="componentStyle.height"
                        controls-position="right"
                        :min="20"
                        :step="1"
                        @change="updateStyleValue('height', $event)"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>

            <el-form-item label="层级 (Z-Index)">
              <el-input-number
                v-model="componentStyle.zIndex"
                controls-position="right"
                :min="0"
                :step="1"
                @change="updateStyleValue('zIndex', $event)"
              />
            </el-form-item>

            <el-form-item label="可见性">
              <el-switch
                v-model="visibility"
                @change="updateStyleValue('display', $event ? 'block' : 'none')"
              />
            </el-form-item>

            <el-form-item label="背景色">
              <el-color-picker
                v-model="componentStyle.backgroundColor"
                show-alpha
                @change="updateStyleValue('backgroundColor', $event)"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="高级" name="advanced">
          <div class="advanced-options">
            <el-form label-position="top" size="small">
              <el-form-item label="组件 ID">
                <el-input v-model="componentId" disabled />
              </el-form-item>
              
              <el-form-item label="组件类型">
                <el-input v-model="componentType" disabled />
              </el-form-item>
              
              <el-form-item label="组件定义">
                <el-button @click="showComponentSchema = true">查看组件定义</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div v-else class="empty-panel">
      <el-icon class="empty-icon"><Select /></el-icon>
      <p class="empty-text">请选择一个组件进行编辑</p>
    </div>

    <!-- 组件定义对话框 -->
    <el-dialog
      v-model="showComponentSchema"
      title="组件定义"
      width="600px"
      :destroy-on-close="true"
    >
      <pre class="schema-preview">{{ JSON.stringify(componentDefinition, null, 2) }}</pre>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
/**
 * 属性面板
 * 用于编辑选中组件的属性
 */
import { ref, computed, watch } from 'vue';
import { ElTabs, ElTabPane, ElForm, ElFormItem, ElInputNumber, ElSwitch, ElColorPicker, ElInput, ElButton, ElDialog, ElRow, ElCol, ElIcon } from 'element-plus';
import { Select } from '@element-plus/icons-vue';
import type { ComponentData } from '../../types';
import { getComponentDefinition } from '../../constants/components';
import ComponentPropertiesForm from './ComponentPropertiesForm.vue';

interface Props {
  /**
   * 面板标题
   */
  title?: string;
  /**
   * 选中的组件
   */
  selectedComponent: ComponentData | null;
}

const props = withDefaults(defineProps<Props>(), {
  title: '属性面板',
});

/**
 * 事件
 */
const emit = defineEmits<{
  /**
   * 更新组件属性
   */
  (e: 'update-props', id: string, props: Record<string, any>): void;
  /**
   * 更新组件样式
   */
  (e: 'update-style', id: string, style: Partial<ComponentData['style']>): void;
}>();

/**
 * 当前激活的标签页
 */
const activeTab = ref('props');

/**
 * 显示组件定义
 */
const showComponentSchema = ref(false);

/**
 * 计算属性 - 组件定义
 */
const componentDefinition = computed(() => {
  try {
    if (!props.selectedComponent) return null;
    return getComponentDefinition(props.selectedComponent.type);
  } catch (error) {
    console.error(`获取组件定义失败: ${error}`);
    return null;
  }
});

/**
 * 计算属性 - 组件 ID
 */
const componentId = computed(() => props.selectedComponent?.id || '');

/**
 * 计算属性 - 组件类型
 */
const componentType = computed(() => props.selectedComponent?.type || '');

/**
 * 组件样式
 */
const componentStyle = ref<Record<string, any>>({});

/**
 * 计算属性 - 可见性
 */
const visibility = computed({
  get() {
    return componentStyle.value.display !== 'none';
  },
  set(value: boolean) {
    componentStyle.value.display = value ? 'block' : 'none';
  },
});

/**
 * 监听选中组件变化
 */
watch(
  () => props.selectedComponent,
  (newComponent) => {
    if (newComponent) {
      // 深拷贝样式避免直接修改Props
      componentStyle.value = JSON.parse(JSON.stringify(newComponent.style));
    } else {
      componentStyle.value = {};
    }
  },
  { immediate: true },
);

/**
 * 更新组件属性
 */
const updateComponentProps = (updatedProps: Record<string, any>) => {
  try {
    if (!props.selectedComponent) return;
    emit('update-props', props.selectedComponent.id, updatedProps);
  } catch (error) {
    console.error(`更新组件属性失败: ${error}`);
  }
};

/**
 * 更新样式值
 */
const updateStyleValue = (key: string, value: any) => {
  try {
    if (!props.selectedComponent) return;
    
    const styleUpdates: Partial<ComponentData['style']> = {
      [key]: value,
    };
    
    emit('update-style', props.selectedComponent.id, styleUpdates);
  } catch (error) {
    console.error(`更新样式值失败: ${error}`);
  }
};
</script>

<style lang="scss" scoped>
.property-panel {
  width: 100%;
  height: 100%;
  border-left: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  overflow: hidden;
  
  &-header {
    padding: 12px;
    border-bottom: 1px solid #e4e7ed;
  }
  
  &-title {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: #303133;
  }
  
  &-content {
    flex: 1;
    overflow: auto;
    padding: 12px;
  }
}

.property-tabs {
  height: 100%;
}

.position-size-form {
  padding: 8px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  background-color: #fafafa;
}

.mb-2 {
  margin-bottom: 8px;
}

.advanced-options {
  padding: 12px;
  border: 1px dashed #e4e7ed;
  border-radius: 4px;
  margin-top: 12px;
}

.schema-preview {
  background-color: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  overflow: auto;
  max-height: 400px;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}

.empty-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  
  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    color: #c0c4cc;
  }
  
  .empty-text {
    font-size: 14px;
    margin: 0;
  }
}
</style> 