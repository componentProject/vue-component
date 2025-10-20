<template>
  <el-upload v-if="show" v-bind="Options" v-on="Event">
    <slot name="default">
      <el-button>点击上传</el-button>
    </slot>
    <template v-if="slots.tip" #tip>
      <slot name="tip" />
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import type { configType, FormModelProps } from '@moluoxixi/components/ConfigForm/src/types'
import { ref, watch } from 'vue'
import { isType } from '@moluoxixi/utils/_utils'

defineOptions({
  name: 'WlUpload',
})

const props = withDefaults(
  defineProps<{
    prop: string
    slots?: Record<string, any>
    model: FormModelProps
    config?: configType
  }>(),
  {
    slots: () => ({}),
    config: () => ({}),
  },
)

const show = ref(true)
const Event = ref({})
const Options = ref({})

watch(
  () => props.config,
  (v) => {
    const { show: showVal, event, ...rest } = v
    if (isType(showVal, 'boolean')) {
      show.value = !!showVal
    }
    Options.value = rest
    Event.value = event || {}
  },
  { immediate: true, deep: true },
)
</script>

<style scoped lang="scss"></style>
