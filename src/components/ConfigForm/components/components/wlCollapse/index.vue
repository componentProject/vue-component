<template>
  <el-collapse v-if="show" v-bind="Options" v-on="Event">
    <el-collapse-item v-for="item in items" :key="item.name" v-bind="item" />
  </el-collapse>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { isType } from '../../utils'

const props = defineProps<{
  prop: string
  model: Record<string, any>
  config: Record<string, any>
}>()

const show = ref(true)
const Event = ref({})
const Options = ref({})
const items = ref([])

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

<style scoped lang="scss"></style>
