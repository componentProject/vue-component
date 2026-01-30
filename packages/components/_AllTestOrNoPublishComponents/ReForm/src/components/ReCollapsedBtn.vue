<!-- 折叠按钮组件模板 -->
<template>
  <!-- Element Plus 按钮组件 -->
  <ElButton
    :disabled="disabled"
    v-bind="$attrs"
    link
    type="primary"
    class="ap-collapsed-btn"
    @click="handleSwitchCollapsed"
  >
    <!-- 折叠按钮文字 -->
    <span v-if="!hiddenText" class="ap-collapsed-btn__text">{{
      modelValue ? localCollapsedText[0] : localCollapsedText[1]
    }}</span>
    <!-- 折叠按钮图标 -->
    <el-icon :class="{ 'is-expanded': !modelValue }">
      <ArrowDown />
    </el-icon>
  </ElButton>
</template>

<!-- 折叠按钮组件脚本 -->
<script setup lang="ts">
/** 导入 Element Plus 图标 */
import { ArrowDown } from '@element-plus/icons-vue'
/** 导入 Element Plus 组件 */
import { ElButton } from 'element-plus'
/** 导入 Vue 组合式 API */
import { computed } from 'vue'
/** 导入工具函数 */
import { normalizeCollapsedText } from '../utils'

/** 组件选项配置 */
defineOptions({
  name: 'ReCollapsedBtn',
})

/** 组件属性定义 */
const props = withDefaults(
  defineProps<{
    /** 折叠按钮文字配置 */
    collapsedText?: string | [string] | [string, string]
    /** 折叠状态值 */
    modelValue: boolean
    /** 是否禁用 */
    disabled?: boolean
    /** 是否隐藏文字 */
    hiddenText?: boolean
  }>(),
  {
    /** 默认折叠文字 */
    collapsedText: () => ['展开', '收起'],
    /** 默认不禁用 */
    disabled: false,
    /** 默认显示文字 */
    hiddenText: false,
  },
)

/** 组件事件定义 */
const emits = defineEmits<{
  /** 点击事件 */
  (e: 'click'): void
  /** 更新折叠状态事件 */
  (e: 'update:modelValue', collapsed: boolean): void
}>()

/** 计算折叠文字 */
const localCollapsedText = computed(() =>
  normalizeCollapsedText(props.collapsedText),
)

/** 处理折叠状态切换 */
function handleSwitchCollapsed() {
  /** 触发点击事件 */
  emits('click')
  /** 触发更新折叠状态事件 */
  emits('update:modelValue', !props.modelValue)
}
</script>

<!-- 折叠按钮组件样式 -->
<style lang="scss" scoped>
.ap-collapsed-btn {
  /** 图标样式 */
  :deep(.el-icon) {
    /** 过渡动画 */
    transition: all 0.2s linear;
    /** 初始旋转角度 */
    transform: rotate(0);
    /** 旋转中心点 */
    transform-origin: center center;

    /** 展开状态样式 */
    &.is-expanded {
      /** 旋转180度 */
      transform: rotate(-180deg);
    }
  }
}
</style>
