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
      :accept="accept"
      @change="fileChange"
      ref="selectFile"
      class="none"
    />
    <el-button class="button" :loading="loading" v-bind="$attrs" v-on="listeners">
      <template #default>
        <span v-if="title">{{ title }}</span>
        <slot name="default" />
      </template>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FormModelProps, configType } from '@/components/ConfigForm/types'

defineOptions({
  name: 'importFileButton',
})

const props = withDefaults(
  defineProps<{
    accept: string
    title: string
    loading: boolean
    model: FormModelProps
    config: configType
  }>(),
  {
    accept: '',
    title: '',
    loading: false,
    model: () => ({}),
    config: () => ({}),
  },
)

const emit = defineEmits(['update:model', 'change'])

const selectFile = ref<HTMLInputElement>()

const listeners = computed(() => {
  const listeners = { ...useAttrs() }
  const { click } = listeners
  listeners.click = (event: Event) => {
    selectFile.value?.click()
    click?.(event)
  }
  return listeners
})

const fileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('change', target.files?.[0])
  target.value = ''
}
</script>

<style scoped lang="scss"></style>
