<template>
  <!-- 日历组件 -->
  <div class="calendar" :class="props.className">
    <!--  头部  -->
    <CalendarHeader :localeContext="localeContext" v-model="curDate" @change="monthChange" />
    <!--  主体  -->
    <CalendarMonth :localeContext="localeContext" v-model="curDate" @change="dateChange">
      <!--  重新渲染日期  -->
      <template #date="{ date }">
        <slot name="date" :date="date"></slot>
      </template>

      <!--  重新渲染日期内容  -->
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
import type { propsType, slotsType } from './types'
import type { propsType as ConfigProviderPropsType } from '@/components/ConfigProvider/types/index.ts'

//  defineOptions  VUE 3.x  defineComponent
defineOptions({
  name: 'Calendar',
})

const props = withDefaults(defineProps<propsType>(), {
  modelValue: Date.now(),
  locale: 'zh-CN',
})

//  defineSlots  VUE 3.x  defineComponent
defineSlots<slotsType>()

//  inject  VUE 3.x  defineComponent
const configProvider: ConfigProviderPropsType = inject('configProvider', {})
//  localeContext  current locale
const localeContext = computed(() => {
  return {
    ...props,
    locale: configProvider.locale || props.locale,
  }
})
//  curDate  current selected date
const curDate = ref<Dayjs | undefined>()

//  watch  current selected date
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
//  dateChange  change date
const dateChange = (date: Dayjs) => {
  curDate.value = date
  emits('update:modelValue', date)
}

//  monthChange  change month
const monthChange = (type = 'subtract') => {
  if (type == 'today') {
    curDate.value = dayjs(Date.now())
  } else {
    curDate.value = curDate.value?.[type](1, 'month')
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
