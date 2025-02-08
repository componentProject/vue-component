<template>
  <div class="calendar" :class="props.className">
    <CalendarHeader :localeContext="localeContext" v-model="curDate" @change="monthChange" />
    <CalendarMonth :localeContext="localeContext" v-model="curDate" @change="dateChange">
      <template #date="{ date }">
        <slot name="date" :date="date"></slot>
      </template>

      <template #dateContent="{ date }">
        <slot name="dateContent" :date="date"></slot>
      </template>
    </CalendarMonth>
  </div>
</template>

<script lang="ts" setup>
import CalendarHeader from './components/CalendarHeader.vue'
import CalendarMonth from './components/CalendarMonth.vue'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { computed, inject, ref, watch } from 'vue'
import type { propsType } from './types'
import type { ConfigProviderPropsType } from '@/components/ConfigProvider/types/index.ts'

defineOptions({
  name: 'Calendar',
})

const props = withDefaults(defineProps<propsType>(), {
  modelValue: Date.now(),
  locale: 'zh-CN',
})
const configProvider: ConfigProviderPropsType = inject('configProvider', {})
const localeContext = computed(() => {
  console.log('configProvider', configProvider.locale)
  return {
    ...props,
    locale: configProvider.locale || props.locale,
  }
})
const curDate = ref<Dayjs>()

watch(
  () => {
    return props.modelValue
  },
  (val) => {
    curDate.value = dayjs(val)
  },
  {
    immediate: true,
  },
)

const emits = defineEmits(['update:modelValue'])
const dateChange = (date: Dayjs) => {
  curDate.value = date
  emits('update:modelValue', date)
}

const monthChange = (type = 'subtract') => {
  if (type == 'today') {
    curDate.value = dayjs(Date.now())
  } else {
    curDate.value = curDate.value[type](1, 'month')
  }
  emits('update:modelValue', curDate.value)
}
</script>

<style scoped>
.calendar {
  width: 100%;
  max-width: 500px;
}
</style>
