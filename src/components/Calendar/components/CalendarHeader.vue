<template>
  <div class="calendar-header">
    <div class="calendar-header-left">
      <div class="calendar-header-icon" @click="emits('change', 'subtract')">&lt;</div>
      <div class="calendar-header-value">
        {{ props.modelValue.format(CalendarLocale.formatMonth) }}
      </div>
      <div class="calendar-header-icon" @click="emits('change', 'add')">&gt;</div>
      <button class="calendar-header-btn" @click="emits('change', 'today')">
        {{ CalendarLocale.today }}
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs'
import allLocales from '../locale'
import { computed } from 'vue'
const emits = defineEmits(['change'])
import type { CalendarHeaderPropsType } from '../types'

const props = withDefaults(defineProps<CalendarHeaderPropsType>(), {
  localeContext: () => ({
    locale: 'zh-CN',
  }),
  modelValue: () => dayjs(),
})
const CalendarLocale = computed(() => allLocales[props.localeContext.locale])
</script>

<style lang="scss" scoped>
.calendar-header {
  &-left {
    display: flex;
    align-items: center;
    height: 28px;
    line-height: 28px;
  }

  &-value {
    font-size: 20px;
  }

  &-btn {
    background: #eee;
    cursor: pointer;
    border: 0;
    padding: 0 15px;
    line-height: 28px;

    &:hover {
      background: #ccc;
    }
  }

  &-icon {
    width: 28px;
    height: 28px;
    line-height: 28px;
    border-radius: 50%;
    text-align: center;
    font-size: 12px;
    user-select: none;
    cursor: pointer;
    margin-right: 12px;

    &:not(:first-child) {
      margin: 0 12px;
    }

    &:hover {
      background: #ccc;
    }
  }
}
</style>
