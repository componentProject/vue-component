<script setup lang="ts">
import type { configType, FormModelProps } from '@/components/ConfigForm/src/types'
import { ref, watch } from 'vue'
import { isType } from '@/components/ConfigForm/src/utils'

interface BreadcrumbItem {
  to: string
  [key: string]: any
}

const props = withDefaults(
  defineProps<{
    prop: string
    slots: Record<string, any>
    model: FormModelProps
    config: configType
  }>(),
  {
    prop: '',
    slots: () => ({}),
    model: () => ({}),
    config: () => ({}),
  },
)

const show = ref(true)
const Event = ref({})
const Options = ref({})
const items = ref<BreadcrumbItem[]>([])

watch(
  () => props.config,
  (v) => {
    const { show: showVal, event, items: itemsVal = [], ...rest } = v
    if (isType(showVal, 'boolean')) {
      show.value = !!showVal
    }
    items.value = itemsVal
    Options.value = rest
    Event.value = event || {}
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <el-breadcrumb v-if="show" v-bind="Options" v-on="Event">
    <el-breadcrumb-item v-for="item in items" :key="item.to" v-bind="item">
      <template v-if="slots.default" #default>
        <slot name="default" />
      </template>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped lang="scss"></style>
