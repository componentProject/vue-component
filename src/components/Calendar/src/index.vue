<template>
  <!-- 日历组件 -->
  <div class="calendar" :class="props.className">
    <!--  头部  -->
    <CalendarHeader v-model="curDate" :locale-context="localeContext" @change="monthChange" />
    <!--  主体  -->
    <CalendarMonth v-model="curDate" :locale-context="localeContext" @change="dateChange">
      <!--  重新渲染日期  -->
      <template #date="{ date }">
        <slot name="date" :date="date" />
      </template>

      <!--  重新渲染日期内容  -->
      <template #dateContent="{ date }">
        <slot name="dateContent" :date="date" />
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

const emits = defineEmits(['update:modelValue'])

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

//  dateChange  change date
function dateChange(date: Dayjs) {
  curDate.value = date
  emits('update:modelValue', date)
}

//  monthChange  change month
function monthChange(type = 'subtract') {
  if (type == 'today') {
    curDate.value = dayjs(Date.now())
  }
  else {
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
