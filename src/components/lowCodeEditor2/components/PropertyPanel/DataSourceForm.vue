<template>
  <div class="data-source-form">
    <el-form label-position="top" size="small">
      <!-- 数据源类型 -->
      <el-form-item label="数据源类型">
        <el-select 
          v-model="dataSourceType" 
          class="w-full" 
          @change="handleTypeChange"
        >
          <el-option label="静态数据" value="static" />
          <el-option label="API数据" value="api" />
          <el-option label="变量" value="variable" />
        </el-select>
      </el-form-item>

      <!-- 静态数据 -->
      <template v-if="dataSourceType === 'static'">
        <el-form-item label="静态数据">
          <el-button 
            size="small" 
            type="primary" 
            @click="openDataEditor"
          >
            编辑数据
          </el-button>
        </el-form-item>
      </template>

      <!-- API数据 -->
      <template v-else-if="dataSourceType === 'api'">
        <el-form-item label="API地址">
          <el-input 
            v-model="apiUrl" 
            placeholder="请输入API地址" 
            @change="handleApiUrlChange"
          />
        </el-form-item>
        
        <el-form-item label="刷新间隔(秒)">
          <el-input-number
            v-model="refreshInterval"
            :min="0"
            :step="1"
            @change="handleRefreshIntervalChange"
          />
        </el-form-item>
      </template>

      <!-- 变量数据 -->
      <template v-else-if="dataSourceType === 'variable'">
        <el-form-item label="变量名">
          <el-input 
            v-model="variableName" 
            placeholder="请输入变量名" 
            @change="handleVariableNameChange"
          />
        </el-form-item>
      </template>

      <!-- 数据映射 -->
      <el-collapse v-model="activeCollapse">
        <el-collapse-item title="数据映射" name="mapping">
          <el-alert
            type="info"
            show-icon
            class="mb-4"
          >
            <p>根据图表类型设置数据映射关系</p>
          </el-alert>

          <el-form-item label="X轴字段" v-if="showXMapping">
            <el-input 
              v-model="dataMapping.x" 
              placeholder="x轴数据字段" 
              @change="handleMappingChange('x', $event)"
            />
          </el-form-item>

          <el-form-item label="Y轴字段" v-if="showYMapping">
            <el-input 
              v-model="dataMapping.y" 
              placeholder="y轴数据字段" 
              @change="handleMappingChange('y', $event)"
            />
          </el-form-item>

          <el-form-item label="系列字段" v-if="showSeriesMapping">
            <el-input 
              v-model="dataMapping.series" 
              placeholder="系列数据字段" 
              @change="handleMappingChange('series', $event)"
            />
          </el-form-item>

          <el-form-item label="值字段" v-if="showValueMapping">
            <el-input 
              v-model="dataMapping.value" 
              placeholder="值数据字段" 
              @change="handleMappingChange('value', $event)"
            />
          </el-form-item>
        </el-collapse-item>
      </el-collapse>

    </el-form>

    <!-- 数据编辑对话框 -->
    <el-dialog
      v-model="showDataEditor"
      title="编辑静态数据"
      width="80%"
      destroy-on-close
    >
      <div class="json-editor-container">
        <el-input
          v-model="staticDataText"
          type="textarea"
          :rows="15"
          placeholder="请输入JSON格式的数据"
          class="w-full font-mono text-sm"
        />
        <div class="text-red-500 text-xs mt-2" v-if="jsonError">
          {{ jsonError }}
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showDataEditor = false">取消</el-button>
        <el-button type="primary" @click="applyStaticData">应用</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { CanvasComponent } from '../../types';

/**
 * 组件属性
 */
const props = defineProps<{
  /**
   * 当前组件
   */
  component: CanvasComponent;
}>();

/**
 * 组件事件
 */
const emit = defineEmits<{
  // 更新数据源
  (e: 'update', dataSource: Partial<NonNullable<CanvasComponent['dataSource']>>): void;
}>();

/**
 * 数据源类型
 */
const dataSourceType = ref<'static' | 'api' | 'variable'>('static');

/**
 * API地址
 */
const apiUrl = ref('');

/**
 * 刷新间隔
 */
const refreshInterval = ref(0);

/**
 * 变量名
 */
const variableName = ref('');

/**
 * 数据映射
 */
const dataMapping = ref<{
  x?: string;
  y?: string;
  series?: string;
  value?: string;
}>({});

/**
 * 展开的面板
 */
const activeCollapse = ref(['mapping']);

/**
 * 静态数据文本
 */
const staticDataText = ref('');

/**
 * 数据编辑器显示状态
 */
const showDataEditor = ref(false);

/**
 * JSON错误信息
 */
const jsonError = ref('');

/**
 * 计算属性 - 是否显示X轴映射
 */
const showXMapping = computed(() => {
  try {
    // 柱状图、折线图、散点图需要X轴映射
    const chartType = getChartType();
    return ['echarts-bar', 'echarts-line', 'g2-scatter'].includes(chartType);
  } catch (error) {
    console.error('计算是否显示X轴映射失败:', error);
    return false;
  }
});

/**
 * 计算属性 - 是否显示Y轴映射
 */
const showYMapping = computed(() => {
  try {
    // 柱状图、折线图、散点图需要Y轴映射
    const chartType = getChartType();
    return ['echarts-bar', 'echarts-line', 'g2-scatter'].includes(chartType);
  } catch (error) {
    console.error('计算是否显示Y轴映射失败:', error);
    return false;
  }
});

/**
 * 计算属性 - 是否显示系列映射
 */
const showSeriesMapping = computed(() => {
  try {
    // 多系列图表需要系列映射
    const chartType = getChartType();
    return ['echarts-line', 'g2-scatter'].includes(chartType);
  } catch (error) {
    console.error('计算是否显示系列映射失败:', error);
    return false;
  }
});

/**
 * 计算属性 - 是否显示值映射
 */
const showValueMapping = computed(() => {
  try {
    // 饼图需要值映射
    const chartType = getChartType();
    return ['echarts-pie'].includes(chartType);
  } catch (error) {
    console.error('计算是否显示值映射失败:', error);
    return false;
  }
});

/**
 * 获取图表类型
 */
const getChartType = (): string => {
  try {
    return props.component?.componentId || '';
  } catch (error) {
    console.error('获取图表类型失败:', error);
    return '';
  }
};

/**
 * 初始化数据
 */
const initData = () => {
  try {
    const dataSource = props.component?.dataSource;
    
    if (dataSource) {
      dataSourceType.value = dataSource.type || 'static';
      apiUrl.value = dataSource.apiUrl || '';
      refreshInterval.value = dataSource.refreshInterval || 0;
      variableName.value = dataSource.variableName || '';
      
      if (dataSource.value && typeof dataSource.value === 'object') {
        staticDataText.value = JSON.stringify(dataSource.value, null, 2);
      } else {
        staticDataText.value = '[]';
      }
      
      // 数据映射
      if (dataSource.mapping) {
        dataMapping.value = { ...dataSource.mapping };
      } else {
        dataMapping.value = {};
      }
    } else {
      // 默认值
      dataSourceType.value = 'static';
      apiUrl.value = '';
      refreshInterval.value = 0;
      variableName.value = '';
      staticDataText.value = '[]';
      dataMapping.value = {};
    }
  } catch (error) {
    console.error('初始化数据源表单失败:', error);
  }
};

/**
 * 处理数据源类型变化
 */
const handleTypeChange = (value: 'static' | 'api' | 'variable') => {
  try {
    emit('update', { type: value });
  } catch (error) {
    console.error('处理数据源类型变化失败:', error);
  }
};

/**
 * 处理API地址变化
 */
const handleApiUrlChange = (value: string) => {
  try {
    emit('update', { apiUrl: value });
  } catch (error) {
    console.error('处理API地址变化失败:', error);
  }
};

/**
 * 处理刷新间隔变化
 */
const handleRefreshIntervalChange = (value: number) => {
  try {
    emit('update', { refreshInterval: value });
  } catch (error) {
    console.error('处理刷新间隔变化失败:', error);
  }
};

/**
 * 处理变量名变化
 */
const handleVariableNameChange = (value: string) => {
  try {
    emit('update', { variableName: value });
  } catch (error) {
    console.error('处理变量名变化失败:', error);
  }
};

/**
 * 处理映射变化
 */
const handleMappingChange = (field: string, value: string) => {
  try {
    const mapping = { ...dataMapping.value, [field]: value };
    emit('update', { mapping });
  } catch (error) {
    console.error('处理映射变化失败:', error);
  }
};

/**
 * 打开数据编辑器
 */
const openDataEditor = () => {
  try {
    showDataEditor.value = true;
    jsonError.value = '';
  } catch (error) {
    console.error('打开数据编辑器失败:', error);
  }
};

/**
 * 应用静态数据
 */
const applyStaticData = () => {
  try {
    try {
      const parsedData = JSON.parse(staticDataText.value);
      emit('update', { value: parsedData });
      showDataEditor.value = false;
      jsonError.value = '';
    } catch (error) {
      jsonError.value = '无效的JSON格式，请检查输入';
    }
  } catch (error) {
    console.error('应用静态数据失败:', error);
  }
};

// 初始化
watch(() => props.component, () => {
  initData();
}, { immediate: true, deep: true });
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}

:deep(.el-form-item) {
  margin-bottom: 15px;
}

:deep(.el-form-item__label) {
  padding: 0;
  line-height: 1.5;
  margin-bottom: 5px;
}
</style> 