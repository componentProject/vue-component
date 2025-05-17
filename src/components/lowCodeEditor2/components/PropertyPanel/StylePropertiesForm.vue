<template>
  <div class="style-properties-form">
    <el-form label-position="top" size="small">
      <!-- 位置和大小 -->
      <div class="section-title text-sm font-medium mb-2">位置和大小</div>
      <div class="grid grid-cols-2 gap-2 mb-4">
        <el-form-item label="X坐标">
          <el-input-number
            v-model="styleValues.left"
            :min="0"
            :step="1"
            controls-position="right"
            class="w-full"
            @change="updateStyle('left', $event)"
          />
        </el-form-item>
        
        <el-form-item label="Y坐标">
          <el-input-number
            v-model="styleValues.top"
            :min="0"
            :step="1"
            controls-position="right"
            class="w-full"
            @change="updateStyle('top', $event)"
          />
        </el-form-item>
        
        <el-form-item label="宽度">
          <el-input-number
            v-model="styleValues.width"
            :min="10"
            :step="1"
            controls-position="right"
            class="w-full"
            @change="updateStyle('width', $event)"
          />
        </el-form-item>
        
        <el-form-item label="高度">
          <el-input-number
            v-model="styleValues.height"
            :min="10"
            :step="1"
            controls-position="right"
            class="w-full"
            @change="updateStyle('height', $event)"
          />
        </el-form-item>
      </div>
      
      <!-- 外观样式 -->
      <div class="section-title text-sm font-medium mb-2">外观样式</div>
      <div class="mb-4">
        <el-form-item label="背景颜色">
          <el-color-picker
            v-model="styleValues.backgroundColor"
            show-alpha
            class="w-full"
            @change="updateStyle('backgroundColor', $event)"
          />
        </el-form-item>
        
        <el-form-item label="边框">
          <div class="flex gap-2">
            <el-input-number
              v-model="borderWidth"
              :min="0"
              :max="10"
              :step="1"
              controls-position="right"
              placeholder="宽度"
              @change="updateBorder"
            />
            
            <el-select
              v-model="borderStyle"
              placeholder="样式"
              @change="updateBorder"
            >
              <el-option label="无" value="none" />
              <el-option label="实线" value="solid" />
              <el-option label="虚线" value="dashed" />
              <el-option label="点线" value="dotted" />
            </el-select>
            
            <el-color-picker
              v-model="borderColor"
              show-alpha
              @change="updateBorder"
            />
          </div>
        </el-form-item>
        
        <el-form-item label="圆角">
          <el-input-number
            v-model="styleValues.borderRadius"
            :min="0"
            :max="100"
            :step="1"
            controls-position="right"
            class="w-full"
            @change="updateStyle('borderRadius', $event)"
          />
        </el-form-item>
      </div>
      
      <!-- 阴影 -->
      <div class="section-title text-sm font-medium mb-2">阴影</div>
      <div class="mb-4">
        <el-form-item label="阴影">
          <el-switch
            v-model="hasShadow"
            @change="updateShadow"
          />
        </el-form-item>
        
        <template v-if="hasShadow">
          <div class="grid grid-cols-2 gap-2">
            <el-form-item label="水平偏移">
              <el-input-number
                v-model="shadowX"
                :step="1"
                controls-position="right"
                class="w-full"
                @change="updateShadow"
              />
            </el-form-item>
            
            <el-form-item label="垂直偏移">
              <el-input-number
                v-model="shadowY"
                :step="1"
                controls-position="right"
                class="w-full"
                @change="updateShadow"
              />
            </el-form-item>
            
            <el-form-item label="模糊半径">
              <el-input-number
                v-model="shadowBlur"
                :min="0"
                :step="1"
                controls-position="right"
                class="w-full"
                @change="updateShadow"
              />
            </el-form-item>
            
            <el-form-item label="扩散半径">
              <el-input-number
                v-model="shadowSpread"
                :step="1"
                controls-position="right"
                class="w-full"
                @change="updateShadow"
              />
            </el-form-item>
          </div>
          
          <el-form-item label="阴影颜色">
            <el-color-picker
              v-model="shadowColor"
              show-alpha
              class="w-full"
              @change="updateShadow"
            />
          </el-form-item>
        </template>
      </div>
      
      <!-- 层级 -->
      <div class="section-title text-sm font-medium mb-2">层级</div>
      <div class="mb-4">
        <el-form-item label="层级 (z-index)">
          <el-input-number
            v-model="styleValues.zIndex"
            :min="1"
            :step="1"
            controls-position="right"
            class="w-full"
            @change="updateStyle('zIndex', $event)"
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
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
  // 样式更新
  (e: 'update', style: Partial<CanvasComponent['style']>): void;
}>();

/**
 * 样式值对象
 */
const styleValues = reactive<Record<string, any>>({
  left: 0,
  top: 0,
  width: 100,
  height: 100,
  zIndex: 1,
  backgroundColor: '',
  borderRadius: 0,
  border: '',
  boxShadow: '',
});

/**
 * 边框相关状态
 */
const borderWidth = ref(0);
const borderStyle = ref('none');
const borderColor = ref('');

/**
 * 阴影相关状态
 */
const hasShadow = ref(false);
const shadowX = ref(0);
const shadowY = ref(2);
const shadowBlur = ref(4);
const shadowSpread = ref(0);
const shadowColor = ref('rgba(0, 0, 0, 0.1)');

/**
 * 初始化样式值
 */
const initStyleValues = () => {
  try {
    if (!props.component) return;
    
    // 复制基本样式
    const { left, top, width, height, zIndex } = props.component.style;
    styleValues.left = left;
    styleValues.top = top;
    styleValues.width = width;
    styleValues.height = height;
    styleValues.zIndex = zIndex;
    
    // 复制其他样式
    const {
      backgroundColor = '',
      borderRadius = 0,
      border = '',
      boxShadow = '',
    } = props.component.style;
    
    styleValues.backgroundColor = backgroundColor;
    styleValues.borderRadius = borderRadius;
    styleValues.border = border;
    styleValues.boxShadow = boxShadow;
    
    // 解析边框
    parseBorder(border);
    
    // 解析阴影
    parseBoxShadow(boxShadow);
  } catch (error) {
    console.error('初始化样式值失败:', error);
  }
};

/**
 * 解析边框值
 */
const parseBorder = (borderValue: string) => {
  try {
    if (!borderValue || borderValue === 'none') {
      borderWidth.value = 0;
      borderStyle.value = 'none';
      borderColor.value = '#000000';
      return;
    }
    
    // 简单解析，例如: "1px solid #000"
    const parts = borderValue.split(' ');
    if (parts.length >= 3) {
      // 提取宽度
      const widthStr = parts[0];
      borderWidth.value = parseInt(widthStr) || 0;
      
      // 提取样式
      borderStyle.value = parts[1];
      
      // 提取颜色
      borderColor.value = parts.slice(2).join(' ');
    }
  } catch (error) {
    console.error('解析边框值失败:', error);
  }
};

/**
 * 更新边框
 */
const updateBorder = () => {
  try {
    if (borderStyle.value === 'none' || borderWidth.value === 0) {
      updateStyle('border', 'none');
      return;
    }
    
    const border = `${borderWidth.value}px ${borderStyle.value} ${borderColor.value}`;
    updateStyle('border', border);
  } catch (error) {
    console.error('更新边框失败:', error);
  }
};

/**
 * 解析阴影值
 */
const parseBoxShadow = (boxShadowValue: string) => {
  try {
    if (!boxShadowValue || boxShadowValue === 'none') {
      hasShadow.value = false;
      return;
    }
    
    hasShadow.value = true;
    
    // 简单解析，例如: "0px 2px 4px 0px rgba(0, 0, 0, 0.1)"
    const parts = boxShadowValue.split(' ');
    if (parts.length >= 4) {
      // 提取偏移值
      shadowX.value = parseInt(parts[0]) || 0;
      shadowY.value = parseInt(parts[1]) || 0;
      shadowBlur.value = parseInt(parts[2]) || 0;
      shadowSpread.value = parseInt(parts[3]) || 0;
      
      // 提取颜色
      shadowColor.value = parts.slice(4).join(' ');
    }
  } catch (error) {
    console.error('解析阴影值失败:', error);
  }
};

/**
 * 更新阴影
 */
const updateShadow = () => {
  try {
    if (!hasShadow.value) {
      updateStyle('boxShadow', 'none');
      return;
    }
    
    const boxShadow = `${shadowX.value}px ${shadowY.value}px ${shadowBlur.value}px ${shadowSpread.value}px ${shadowColor.value}`;
    updateStyle('boxShadow', boxShadow);
  } catch (error) {
    console.error('更新阴影失败:', error);
  }
};

/**
 * 更新样式
 */
const updateStyle = (key: string, value: any) => {
  try {
    const style: Partial<CanvasComponent['style']> = {
      [key]: value,
    };
    
    // 更新本地样式值
    styleValues[key] = value;
    
    // 发送更新事件
    emit('update', style);
  } catch (error) {
    console.error('更新样式失败:', error);
  }
};

// 监听组件变化
watch(() => props.component, () => {
  initStyleValues();
}, { deep: true, immediate: true });
</script>

<style scoped>
.section-title {
  background-color: #f5f7fa;
  padding: 4px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
}

:deep(.el-form-item) {
  margin-bottom: 12px;
}

:deep(.el-form-item__label) {
  padding: 0;
  line-height: 1.5;
  margin-bottom: 4px;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-color-picker) {
  width: 100%;
  display: flex;
}

:deep(.el-color-picker__trigger) {
  width: 100%;
}
</style> 