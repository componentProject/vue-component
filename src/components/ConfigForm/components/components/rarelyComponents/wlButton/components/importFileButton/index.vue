<!--
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-03-07 10:07:19
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-04-09 10:50:52
 * @FilePath: \vue-component\src\components\ConfigForm\components\components\rarelyComponents\wlButton\components\importFileButton\index.vue
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
-->
<template>
  <div>
    <input
      name="file"
      type="file"
      :accept="props.accept"
      @change="fileChange"
      ref="selectFile"
      class="none"
    />
    <el-button class="button" :loading="props.loading" v-bind="attrs">
      <template #default>
        <span v-if="props.title">{{ props.title }}</span>
        <slot name="default" />
      </template>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { configType } from '@/components/ConfigForm/types'

defineOptions({
  name: 'importFileButton',
})

const props = withDefaults(
  defineProps<{
    accept: string
    title: string
    loading: boolean
    config: configType
  }>(),
  {
    accept: '',
    title: '',
    loading: false,
    config: () => ({}),
  },
)

const emit = defineEmits(['update:model', 'change'])

const selectFile = ref<HTMLInputElement>()

const attrs = computed(() => {
  const attrs = { ...useAttrs() }
  const { onClick } = attrs
  attrs.onClick = (event: Event) => {
    selectFile.value?.click()
    if (onClick) {
      ;(onClick as any)(event)
    }
  }
  return attrs
})

const fileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('change', target.files?.[0])
  target.value = ''
}
</script>

<style scoped lang="scss"></style>
