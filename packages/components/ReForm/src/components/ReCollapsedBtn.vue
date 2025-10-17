<template>
  <ElButton
    :disabled="disabled"
    v-bind="$attrs"
    link
    type="primary"
    class="ap-collapsed-btn"
    @click="handleSwitchCollapsed"
  >
    <span v-if="!hiddenText" class="ap-collapsed-btn__text">{{
      modelValue ? localCollapsedText[0] : localCollapsedText[1]
    }}</span>
    <el-icon :class="{ 'is-expanded': !modelValue }">
      <ArrowDown />
    </el-icon>
  </ElButton>
</template>

<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { ElButton } from 'element-plus'
import { normalizeCollapsedText } from '../_utils'

defineOptions({
  name: 'ReCollapsedBtn',
})

const props = withDefaults(
  defineProps<{
    collapsedText?: string | [string] | [string, string]
    modelValue: boolean
    disabled?: boolean
    hiddenText?: boolean
  }>(),
  {
    collapsedText: () => ['展开', '收起'],
    disabled: false,
    hiddenText: false,
  },
)

const emits = defineEmits<{
  (e: 'click'): void
  (e: 'update:modelValue', collapsed: boolean): void
}>()

const localCollapsedText = computed(() =>
  normalizeCollapsedText(props.collapsedText),
)

function handleSwitchCollapsed() {
  emits('click')
  emits('update:modelValue', !props.modelValue)
}
</script>

<style lang="scss" scoped>
.ap-collapsed-btn {
  :deep(.el-icon) {
    transition: all 0.2s linear;
    transform: rotate(0);
    transform-origin: center center;

    &.is-expanded {
      transform: rotate(-180deg);
    }
  }
}
</style>
