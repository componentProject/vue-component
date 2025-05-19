<template>
  <div class="chart-data-editor">
    <el-tabs v-model="activeTab">
      <!-- 数据配置选项卡 -->
      <el-tab-pane label="数据配置" name="data">
        <el-form label-position="top" size="small">
          <!-- 数据源选择 -->
          <el-form-item label="数据源类型">
            <el-radio-group v-model="dataSourceType" @change="handleDataSourceTypeChange">
              <el-radio-button label="static">静态数据</el-radio-button>
              <el-radio-button label="api">API接口</el-radio-button>
              <el-radio-button label="variable">全局变量</el-radio-button>
            </el-radio-group>
          </el-form-item>
          
          <!-- 静态数据编辑 -->
          <template v-if="dataSourceType === 'static'">
            <el-form-item label="静态数据">
              <el-button type="primary" @click="openJsonEditor">
                编辑JSON数据
              </el-button>
            </el-form-item>
            
            <el-form-item label="数据预览">
              <div class="data-preview">
                <pre v-if="staticData">{{ formattedStaticData }}</pre>
                <el-empty v-else description="暂无数据" />
              </div>
            </el-form-item>
          </template>
          
          <!-- API接口配置 -->
          <template v-if="dataSourceType === 'api'">
            <el-form-item label="API地址">
              <el-input 
                v-model="apiUrl" 
                placeholder="请输入API地址"
                @change="handleApiUrlChange"
              />
            </el-form-item>
            
            <el-form-item label="请求方法">
              <el-select 
                v-model="apiMethod" 
                placeholder="请选择请求方法"
                @change="handleApiMethodChange"
              >
                <el-option label="GET" value="GET" />
                <el-option label="POST" value="POST" />
                <el-option label="PUT" value="PUT" />
                <el-option label="DELETE" value="DELETE" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="请求参数">
              <el-button type="primary" @click="openParamsEditor">
                编辑请求参数
              </el-button>
            </el-form-item>
            
            <el-form-item label="自动刷新间隔(秒)">
              <el-input-number 
                v-model="refreshInterval" 
                :min="0" 
                :step="1"
                @change="handleRefreshIntervalChange"
              />
              <span class="text-gray-500 text-sm ml-2">0表示不自动刷新</span>
            </el-form-item>
          </template>
          
          <!-- 全局变量配置 -->
          <template v-if="dataSourceType === 'variable'">
            <el-form-item label="变量名">
              <el-input 
                v-model="variableName" 
                placeholder="请输入全局变量名"
                @change="handleVariableNameChange"
              />
            </el-form-item>
          </template>
        </el-form>
      </el-tab-pane>
      
      <!-- 数据映射选项卡 -->
      <el-tab-pane label="数据映射" name="mapping">
        <el-alert
          type="info"
          show-icon
          class="mb-4"
        >
          <p>设置数据字段与图表显示的映射关系</p>
        </el-alert>
        
        <el-form label-position="top" size="small">
          <!-- 不同图表类型有不同的映射字段 -->
          <template v-if="isLineOrBarChart">
            <el-form-item label="X轴字段">
              <el-input 
                v-model="xField" 
                placeholder="请输入X轴数据字段"
                @change="handleMappingChange('xField')"
              />
            </el-form-item>
            
            <el-form-item label="Y轴字段">
              <el-input 
                v-model="yField" 
                placeholder="请输入Y轴数据字段"
                @change="handleMappingChange('yField')"
              />
            </el-form-item>
            
            <el-form-item label="系列字段">
              <el-input 
                v-model="seriesField" 
                placeholder="用于分组的字段名(可选)"
                @change="handleMappingChange('seriesField')"
              />
            </el-form-item>
          </template>
          
          <template v-else-if="isPieChart">
            <el-form-item label="名称字段">
              <el-input 
                v-model="nameField" 
                placeholder="分类名称字段"
                @change="handleMappingChange('nameField')"
              />
            </el-form-item>
            
            <el-form-item label="值字段">
              <el-input 
                v-model="valueField" 
                placeholder="数值字段"
                @change="handleMappingChange('valueField')"
              />
            </el-form-item>
          </template>
          
          <template v-else>
            <el-form-item>
              <el-empty description="当前图表类型暂不支持自定义映射" />
            </el-form-item>
          </template>
        </el-form>
      </el-tab-pane>
      
      <!-- 图表配置选项卡 -->
      <el-tab-pane label="图表选项" name="options">
        <el-form label-position="top" size="small">
          <el-form-item label="图表标题">
            <el-input 
              v-model="chartTitle" 
              placeholder="请输入图表标题"
              @change="handleChartOptionChange('title')"
            />
          </el-form-item>
          
          <el-form-item label="显示图例">
            <el-switch 
              v-model="showLegend"
              @change="handleChartOptionChange('legend')"
            />
          </el-form-item>
          
          <el-form-item label="显示工具提示">
            <el-switch 
              v-model="showTooltip"
              @change="handleChartOptionChange('tooltip')"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    
    <!-- JSON编辑器对话框 -->
    <el-dialog
      v-model="jsonDialogVisible"
      :title="jsonDialogTitle"
      width="80%"
      destroy-on-close
    >
      <el-input
        v-model="jsonEditorContent"
        type="textarea"
        :rows="15"
        placeholder="请输入JSON格式的数据"
      />
      
      <div class="json-error" v-if="jsonError">
        {{ jsonError }}
      </div>
      
      <template #footer>
        <span>
          <el-button @click="jsonDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleJsonSave">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
/**
 * 图表数据编辑器
 * 用于编辑图表组件的数据源和配置
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
  (e: 'update-chart-data', chartData: any): void;
}>();

// 当前激活的标签页
const activeTab = ref('data');

// 数据源类型
const dataSourceType = ref('static');

// API接口配置
const apiUrl = ref('');
const apiMethod = ref('GET');
const apiParams = ref({});
const refreshInterval = ref(0);

// 全局变量配置
const variableName = ref('');

// 静态数据
const staticData = ref<any>(null);

// 数据映射字段
const xField = ref('');
const yField = ref('');
const seriesField = ref('');
const nameField = ref('');
const valueField = ref('');

// 图表选项
const chartTitle = ref('');
const showLegend = ref(true);
const showTooltip = ref(true);

// JSON编辑器对话框
const jsonDialogVisible = ref(false);
const jsonDialogTitle = ref('编辑JSON数据');
const jsonEditorContent = ref('');
const jsonError = ref('');
const jsonEditorMode = ref<'data' | 'params'>('data');

/**
 * 格式化静态数据用于显示
 */
const formattedStaticData = computed(() => {
  try {
    if (!staticData.value) return '';
    return JSON.stringify(staticData.value, null, 2);
  } catch (error) {
    logError('Failed to format static data', error);
    return '';
  }
});

/**
 * 判断是否为折线图或柱状图
 */
const isLineOrBarChart = computed(() => {
  try {
    const type = props.component.type;
    return type.includes('line') || type.includes('bar');
  } catch (error) {
    logError('Failed to determine chart type', error);
    return false;
  }
});

/**
 * 判断是否为饼图
 */
const isPieChart = computed(() => {
  try {
    const type = props.component.type;
    return type.includes('pie');
  } catch (error) {
    logError('Failed to determine chart type', error);
    return false;
  }
});

/**
 * 初始化数据
 */
const initData = () => {
  try {
    // 获取组件数据配置
    const chartData = props.component.props.data;
    if (!chartData) return;
    
    // 初始化静态数据
    staticData.value = chartData;
    
    // 初始化图表选项
    if (chartData.title) {
      chartTitle.value = typeof chartData.title === 'object' 
        ? chartData.title.text 
        : chartData.title;
    }
    
    showLegend.value = !!(chartData.legend);
    showTooltip.value = !!(chartData.tooltip);
    
    // 初始化数据映射字段
    // 尝试从图表数据中推断映射字段
    if (isLineOrBarChart.value && chartData.xAxis) {
      xField.value = chartData.xAxis.data ? 'index' : '';
      
      if (chartData.series && chartData.series.length > 0) {
        const series = chartData.series[0];
        if (series.name) {
          seriesField.value = 'name';
        }
      }
    } else if (isPieChart.value && chartData.series && chartData.series.length > 0) {
      const pieData = chartData.series[0].data;
      if (pieData && pieData.length > 0 && pieData[0].name && pieData[0].value !== undefined) {
        nameField.value = 'name';
        valueField.value = 'value';
      }
    }
    
    logInfo('Chart data editor initialized');
  } catch (error) {
    logError('Failed to initialize chart data editor', error);
  }
};

/**
 * 打开JSON编辑器
 */
const openJsonEditor = () => {
  try {
    jsonDialogTitle.value = '编辑JSON数据';
    jsonEditorMode.value = 'data';
    jsonEditorContent.value = staticData.value 
      ? JSON.stringify(staticData.value, null, 2) 
      : '';
    jsonError.value = '';
    jsonDialogVisible.value = true;
  } catch (error) {
    logError('Failed to open JSON editor', error);
  }
};

/**
 * 打开参数编辑器
 */
const openParamsEditor = () => {
  try {
    jsonDialogTitle.value = '编辑请求参数';
    jsonEditorMode.value = 'params';
    jsonEditorContent.value = JSON.stringify(apiParams.value, null, 2);
    jsonError.value = '';
    jsonDialogVisible.value = true;
  } catch (error) {
    logError('Failed to open params editor', error);
  }
};

/**
 * 处理JSON保存
 */
const handleJsonSave = () => {
  try {
    if (!jsonEditorContent.value.trim()) {
      jsonDialogVisible.value = false;
      return;
    }
    
    try {
      const parsedData = JSON.parse(jsonEditorContent.value);
      
      if (jsonEditorMode.value === 'data') {
        // 更新静态数据
        staticData.value = parsedData;
        updateChartData();
      } else if (jsonEditorMode.value === 'params') {
        // 更新API参数
        apiParams.value = parsedData;
      }
      
      jsonDialogVisible.value = false;
      jsonError.value = '';
    } catch (error) {
      jsonError.value = '无效的JSON格式，请检查输入';
      logError('Invalid JSON format', error);
    }
  } catch (error) {
    logError('Failed to handle JSON save', error);
  }
};

/**
 * 处理数据源类型变更
 */
const handleDataSourceTypeChange = () => {
  try {
    // TODO: 根据数据源类型更新图表数据
    logInfo('Data source type changed', { type: dataSourceType.value });
  } catch (error) {
    logError('Failed to handle data source type change', error);
  }
};

/**
 * 处理API URL变更
 */
const handleApiUrlChange = () => {
  try {
    // TODO: 更新API URL配置
    logInfo('API URL changed', { url: apiUrl.value });
  } catch (error) {
    logError('Failed to handle API URL change', error);
  }
};

/**
 * 处理API Method变更
 */
const handleApiMethodChange = () => {
  try {
    // TODO: 更新API方法配置
    logInfo('API method changed', { method: apiMethod.value });
  } catch (error) {
    logError('Failed to handle API method change', error);
  }
};

/**
 * 处理刷新间隔变更
 */
const handleRefreshIntervalChange = () => {
  try {
    // TODO: 更新刷新间隔配置
    logInfo('Refresh interval changed', { interval: refreshInterval.value });
  } catch (error) {
    logError('Failed to handle refresh interval change', error);
  }
};

/**
 * 处理变量名变更
 */
const handleVariableNameChange = () => {
  try {
    // TODO: 更新变量名配置
    logInfo('Variable name changed', { name: variableName.value });
  } catch (error) {
    logError('Failed to handle variable name change', error);
  }
};

/**
 * 处理映射字段变更
 */
const handleMappingChange = (field: string) => {
  try {
    // TODO: 更新映射字段配置
    logInfo('Mapping field changed', { field });
  } catch (error) {
    logError('Failed to handle mapping field change', error);
  }
};

/**
 * 处理图表选项变更
 */
const handleChartOptionChange = (option: string) => {
  try {
    updateChartData();
    logInfo('Chart option changed', { option });
  } catch (error) {
    logError('Failed to handle chart option change', error);
  }
};

/**
 * 更新图表数据
 */
const updateChartData = () => {
  try {
    if (!staticData.value) return;
    
    // 克隆当前数据
    const updatedData = JSON.parse(JSON.stringify(staticData.value));
    
    // 更新图表标题
    if (chartTitle.value) {
      if (typeof updatedData.title === 'object') {
        updatedData.title.text = chartTitle.value;
      } else {
        updatedData.title = { text: chartTitle.value };
      }
    }
    
    // 更新图例配置
    if (showLegend.value) {
      updatedData.legend = updatedData.legend || { show: true };
      updatedData.legend.show = true;
    } else if (updatedData.legend) {
      updatedData.legend.show = false;
    }
    
    // 更新提示配置
    if (showTooltip.value) {
      updatedData.tooltip = updatedData.tooltip || { show: true };
      updatedData.tooltip.show = true;
    } else if (updatedData.tooltip) {
      updatedData.tooltip.show = false;
    }
    
    // 发送更新事件
    emit('update-chart-data', updatedData);
    logInfo('Chart data updated');
  } catch (error) {
    logError('Failed to update chart data', error);
  }
};

// 组件挂载时初始化数据
onMounted(() => {
  try {
    initData();
  } catch (error) {
    logError('Failed to mount chart data editor', error);
  }
});

// 监听组件变化
watch(
  () => props.component.props.data,
  () => {
    initData();
  },
  { deep: true }
);
</script>

<style scoped>
.chart-data-editor {
  @apply p-2;
}

.data-preview {
  @apply p-3 bg-gray-50 border border-gray-200 rounded max-h-60 overflow-auto;
}

.json-error {
  @apply mt-2 text-red-500 text-sm;
}

pre {
  @apply text-xs p-0 m-0 font-mono;
  white-space: pre-wrap;
}
</style> 