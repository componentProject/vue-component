<template>
  <div class="component-style-form">
    <el-form label-position="top" size="small">
      <!-- 尺寸与位置 -->
      <el-collapse>
        <el-collapse-item title="尺寸与位置" name="dimensions">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="宽度">
                <el-input 
                  v-model="styleValues.width" 
                  placeholder="auto"
                  @change="(val) => updateStyle('width', val)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="高度">
                <el-input 
                  v-model="styleValues.height" 
                  placeholder="auto"
                  @change="(val) => updateStyle('height', val)"
                />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="最小宽度">
                <el-input 
                  v-model="styleValues.minWidth" 
                  placeholder="auto"
                  @change="(val) => updateStyle('minWidth', val)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最小高度">
                <el-input 
                  v-model="styleValues.minHeight" 
                  placeholder="auto"
                  @change="(val) => updateStyle('minHeight', val)"
                />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="最大宽度">
                <el-input 
                  v-model="styleValues.maxWidth" 
                  placeholder="none"
                  @change="(val) => updateStyle('maxWidth', val)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最大高度">
                <el-input 
                  v-model="styleValues.maxHeight" 
                  placeholder="none"
                  @change="(val) => updateStyle('maxHeight', val)"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        
        <!-- 边距 -->
        <el-collapse-item title="内边距" name="padding">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="上内边距">
                <el-input 
                  v-model="styleValues.paddingTop" 
                  placeholder="0"
                  @change="(val) => updateStyle('paddingTop', val)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="右内边距">
                <el-input 
                  v-model="styleValues.paddingRight" 
                  placeholder="0"
                  @change="(val) => updateStyle('paddingRight', val)"
                />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="下内边距">
                <el-input 
                  v-model="styleValues.paddingBottom" 
                  placeholder="0"
                  @change="(val) => updateStyle('paddingBottom', val)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="左内边距">
                <el-input 
                  v-model="styleValues.paddingLeft" 
                  placeholder="0"
                  @change="(val) => updateStyle('paddingLeft', val)"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        
        <!-- 外边距 -->
        <el-collapse-item title="外边距" name="margin">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="上外边距">
                <el-input 
                  v-model="styleValues.marginTop" 
                  placeholder="0"
                  @change="(val) => updateStyle('marginTop', val)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="右外边距">
                <el-input 
                  v-model="styleValues.marginRight" 
                  placeholder="0"
                  @change="(val) => updateStyle('marginRight', val)"
                />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="下外边距">
                <el-input 
                  v-model="styleValues.marginBottom" 
                  placeholder="0"
                  @change="(val) => updateStyle('marginBottom', val)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="左外边距">
                <el-input 
                  v-model="styleValues.marginLeft" 
                  placeholder="0"
                  @change="(val) => updateStyle('marginLeft', val)"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        
        <!-- 背景 -->
        <el-collapse-item title="背景" name="background">
          <el-form-item label="背景颜色">
            <el-color-picker 
              v-model="styleValues.backgroundColor" 
              show-alpha
              @change="(val) => updateStyle('backgroundColor', val)"
            />
          </el-form-item>
          
          <el-form-item label="背景图片URL">
            <el-input 
              v-model="styleValues.backgroundImage" 
              placeholder="none"
              @change="(val) => updateStyle('backgroundImage', val)"
            />
          </el-form-item>
          
          <el-form-item label="背景尺寸">
            <el-select 
              v-model="styleValues.backgroundSize" 
              placeholder="auto"
              @change="(val) => updateStyle('backgroundSize', val)"
            >
              <el-option label="自动" value="auto" />
              <el-option label="覆盖" value="cover" />
              <el-option label="包含" value="contain" />
              <el-option label="100%" value="100%" />
            </el-select>
          </el-form-item>
        </el-collapse-item>
        
        <!-- 边框 -->
        <el-collapse-item title="边框" name="border">
          <el-form-item label="边框宽度">
            <el-input 
              v-model="styleValues.borderWidth" 
              placeholder="0"
              @change="(val) => updateStyle('borderWidth', val)"
            />
          </el-form-item>
          
          <el-form-item label="边框样式">
            <el-select 
              v-model="styleValues.borderStyle" 
              placeholder="none"
              @change="(val) => updateStyle('borderStyle', val)"
            >
              <el-option label="无" value="none" />
              <el-option label="实线" value="solid" />
              <el-option label="虚线" value="dashed" />
              <el-option label="点线" value="dotted" />
              <el-option label="双线" value="double" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="边框颜色">
            <el-color-picker 
              v-model="styleValues.borderColor" 
              show-alpha
              @change="(val) => updateStyle('borderColor', val)"
            />
          </el-form-item>
          
          <el-form-item label="边框圆角">
            <el-input 
              v-model="styleValues.borderRadius" 
              placeholder="0"
              @change="(val) => updateStyle('borderRadius', val)"
            />
          </el-form-item>
        </el-collapse-item>
        
        <!-- 字体 -->
        <el-collapse-item title="字体" name="font">
          <el-form-item label="字体大小">
            <el-input 
              v-model="styleValues.fontSize" 
              placeholder="默认"
              @change="(val) => updateStyle('fontSize', val)"
            />
          </el-form-item>
          
          <el-form-item label="字体权重">
            <el-select 
              v-model="styleValues.fontWeight" 
              placeholder="normal"
              @change="(val) => updateStyle('fontWeight', val)"
            >
              <el-option label="正常" value="normal" />
              <el-option label="加粗" value="bold" />
              <el-option label="更细" value="lighter" />
              <el-option label="更粗" value="bolder" />
              <el-option label="100" value="100" />
              <el-option label="200" value="200" />
              <el-option label="300" value="300" />
              <el-option label="400" value="400" />
              <el-option label="500" value="500" />
              <el-option label="600" value="600" />
              <el-option label="700" value="700" />
              <el-option label="800" value="800" />
              <el-option label="900" value="900" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="字体颜色">
            <el-color-picker 
              v-model="styleValues.color" 
              @change="(val) => updateStyle('color', val)"
            />
          </el-form-item>
          
          <el-form-item label="文本对齐">
            <el-select 
              v-model="styleValues.textAlign" 
              placeholder="left"
              @change="(val) => updateStyle('textAlign', val)"
            >
              <el-option label="左对齐" value="left" />
              <el-option label="居中" value="center" />
              <el-option label="右对齐" value="right" />
              <el-option label="两端对齐" value="justify" />
            </el-select>
          </el-form-item>
        </el-collapse-item>
        
        <!-- 其他 -->
        <el-collapse-item title="其他" name="others">
          <el-form-item label="透明度">
            <el-slider 
              v-model="opacityValue" 
              :min="0" 
              :max="100" 
              :step="1"
              :format-tooltip="formatOpacity"
              @change="handleOpacityChange"
            />
          </el-form-item>
          
          <el-form-item label="显示">
            <el-select 
              v-model="styleValues.display" 
              placeholder="block"
              @change="(val) => updateStyle('display', val)"
            >
              <el-option label="块级" value="block" />
              <el-option label="行内" value="inline" />
              <el-option label="行内块" value="inline-block" />
              <el-option label="弹性布局" value="flex" />
              <el-option label="网格" value="grid" />
              <el-option label="隐藏" value="none" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="溢出处理">
            <el-select 
              v-model="styleValues.overflow" 
              placeholder="visible"
              @change="(val) => updateStyle('overflow', val)"
            >
              <el-option label="显示" value="visible" />
              <el-option label="隐藏" value="hidden" />
              <el-option label="滚动" value="scroll" />
              <el-option label="自动" value="auto" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="自定义CSS">
            <el-input 
              type="textarea" 
              v-model="customCss"
              rows="4"
              placeholder="输入自定义CSS，如：box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
              @change="handleCustomCssChange"
            />
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
/**
 * 组件样式表单
 * 用于编辑组件的CSS样式
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
  (e: 'update-style', property: string, value: any): void;
}>();

// 组件样式的本地副本
const styleValues = ref<Record<string, any>>({});

// 透明度值 (0-100)
const opacityValue = ref(100);

// 自定义CSS
const customCss = ref('');

// 监听组件变化，更新本地样式副本
watch(
  () => props.component,
  (newComponent) => {
    try {
      // 重置样式值
      styleValues.value = { ...newComponent.style };
      
      // 设置透明度值
      if (newComponent.style?.opacity !== undefined) {
        opacityValue.value = parseFloat(newComponent.style.opacity) * 100;
      } else {
        opacityValue.value = 100;
      }
      
      // 提取自定义CSS
      extractCustomCss();
    } catch (error) {
      logError('Failed to update local style values', error);
    }
  },
  { immediate: true, deep: true }
);

/**
 * 提取自定义CSS
 */
const extractCustomCss = () => {
  try {
    // 从组件样式中提取不在表单中显示的样式，作为自定义CSS
    const customProperties: string[] = [];
    const standardProperties = [
      'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
      'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
      'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
      'backgroundColor', 'backgroundImage', 'backgroundSize',
      'borderWidth', 'borderStyle', 'borderColor', 'borderRadius',
      'fontSize', 'fontWeight', 'color', 'textAlign',
      'opacity', 'display', 'overflow', 'position', 'left', 'top'
    ];
    
    if (props.component.style) {
      Object.entries(props.component.style).forEach(([key, value]) => {
        if (!standardProperties.includes(key)) {
          customProperties.push(`${key}: ${value};`);
        }
      });
    }
    
    customCss.value = customProperties.join('\n');
  } catch (error) {
    logError('Failed to extract custom CSS', error);
  }
};

/**
 * 格式化透明度显示
 * @param value 透明度值 (0-100)
 * @returns 格式化后的透明度字符串
 */
const formatOpacity = (value: number): string => {
  try {
    return `${value}%`;
  } catch (error) {
    logError('Failed to format opacity', error);
    return '100%';
  }
};

/**
 * 处理透明度变化
 * @param value 透明度值 (0-100)
 */
const handleOpacityChange = (value: number) => {
  try {
    // 转换为0-1范围的值
    const opacity = value / 100;
    updateStyle('opacity', opacity.toString());
  } catch (error) {
    logError('Failed to handle opacity change', error);
  }
};

/**
 * 处理自定义CSS变化
 */
const handleCustomCssChange = () => {
  try {
    // 解析自定义CSS并更新样式
    const cssRules = customCss.value.split(';').filter(rule => rule.trim());
    
    cssRules.forEach(rule => {
      const [property, value] = rule.split(':').map(part => part.trim());
      if (property && value) {
        updateStyle(property, value);
      }
    });
    
    logInfo('Custom CSS updated');
  } catch (error) {
    logError('Failed to handle custom CSS change', error);
  }
};

/**
 * 更新样式属性
 * @param property 样式属性名
 * @param value 样式属性值
 */
const updateStyle = (property: string, value: any) => {
  try {
    // 更新本地样式值
    styleValues.value[property] = value;
    
    // 发送样式更新事件
    emit('update-style', property, value);
    logInfo('Style updated', { property, value });
  } catch (error) {
    logError('Failed to update style', error);
  }
};

onMounted(() => {
  try {
    // 将组件样式复制到本地状态
    styleValues.value = { ...props.component.style };
    
    // 设置透明度值
    if (props.component.style?.opacity) {
      opacityValue.value = parseFloat(props.component.style.opacity) * 100;
    }
    
    // 提取自定义CSS
    extractCustomCss();
    
    logInfo('Component style form mounted');
  } catch (error) {
    logError('Failed to initialize component style form', error);
  }
});
</script>

<style scoped>
.component-style-form {
  @apply p-2;
}
</style> 