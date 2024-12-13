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
import dayjs, { Dayjs } from 'dayjs'
import { inject, ref, watch } from 'vue'

interface propsType {
  /**
   * 默认展示的日期
   * */
  modelValue?: number | Date | Dayjs,
  style?: object,
  className?: string | string[],
  /**
   * 国际化相关
   * */
  locale?: 'zh-CN' | 'en-US',


}
const props = withDefaults(defineProps<propsType>(), {
  modelValue: Date.now(),
  locale: 'zh-CN',
})

const localeContext = inject('calendarLocale', {
  locale: 'zh-CN',
  formatMonth: 'YYYY年MM月',
  today: '今天'
})


const curDate = ref<Dayjs>(null)

watch(() => {
  return props.modelValue
}, (val) => {
  curDate.value = dayjs(val)
}, {
  immediate: true
})

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
