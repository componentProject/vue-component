<template>
  <div class="w-full basic-flex justify-between items-center">
    <div v-if="type === 'line'" class="basic-flex items-center custom-title">
      <div class="title-line" />
      <div class="font-semibold" :style="{ fontSize: `${props.fontSize}px` }">
        {{ name }}
      </div>
    </div>
    <div v-if="type === 'segmentation'" class="width-100 custom-title flex-col">
      <el-divider direction="horizontal" />
      <div class="ml-12 text-bold" :style="{ fontSize: `${props.fontSize}px` }">
        {{ name }}
      </div>
      <el-divider direction="horizontal" />
    </div>
    <slot name="right" />
  </div>
</template>

<script setup lang="ts">
import type { emitsType, propsType, slotsType } from './_types'

defineOptions({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Title',
})

const props = withDefaults(defineProps<propsType>(), {
  fontSize: 14,
  type: 'line',
  name: '',
})

const emit = defineEmits<emitsType>()

// 获取插槽
const slots = defineSlots<slotsType>()
</script>

<style lang="scss" scoped>
@forward '@moluoxixi/components/_assets/styles/tailwind.scss';
.custom-title {
  :deep(.el-divider--horizontal) {
    margin: 12px 0;
  }

  .title-line {
    width: 4px;
    height: 14px;
    border-radius: 2px;
    background-color: var(--el-color-primary);
    margin-right: 10px;
  }

  .right-btn {
    right: 0;
  }
}
</style>
