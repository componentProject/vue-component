<template>
  <el-carousel v-if="show" v-bind="Options" v-on="Event">
    <el-carousel-item v-for="item in items" :key="item.name" v-bind="item">
      <slot v-if="slots.default" name="default" v-bind="item" />
    </el-carousel-item>
  </el-carousel>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { isType } from '../../utils'

const props = withDefaults(
  defineProps<{
    prop: string
    slots: Record<string, any>
    model: Record<string, any>
    config: Record<string, any>
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
