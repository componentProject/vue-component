<template>
  <el-cascader v-if="show" v-model="computedModel" v-bind="Options" v-on="Event">
    <!-- default 自定义备选项的节点内容，参数为 { node, data }，分别为当前节点的 Node 对象和数据-->
    <template v-if="slots.default" #default="scope">
      <slot name="default" v-bind="scope" />
    </template>
    <!-- empty 无匹配选项时的内容-->
    <template v-if="slots.empty" #empty="scope">
      <slot name="empty" v-bind="scope" />
    </template>
  </el-cascader>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { isType } from '@/components/ConfigForm/utils'
import type { FormModelProps, configType } from '@/components/ConfigForm/types'

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

const emit = defineEmits(['update:model'])

const show = ref(true)
const Event = ref({})
const Options = ref({})

const computedModel = computed({
  get: () => props.model[props.prop],
  set: (val) => {
    emit('update:model', val)
  },
})

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
