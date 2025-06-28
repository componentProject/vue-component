<template>
  <div class="calendar-month">
    <div class="calendar-month-week-list">
      <div v-for="week in weekList" :key="week" class="calendar-month-week-list-item">
        {{ CalendarLocale.week[week] }}
      </div>
    </div>

    <div class="calendar-month-body">
      <div v-for="(row, i) in allDays" :key="i" class="calendar-month-body-row">
        <div
          v-for="(day, index) in row"
          :key="index"
          class="calendar-month-body-cell"
          :class="{ 'calendar-month-body-cell-current': day.currentMonth }"
          @click="emits('change', day.date)"
        >
          <slot name="date" :date="day.date">
            <div class="calendar-month-body-cell-date">
              <div
                class="calendar-month-body-cell-date-value"
                :class="{
                  'calendar-month-body-cell-date-selected':
                    props.modelValue?.format('YYYY-MM-DD') === day.date.format('YYYY-MM-DD'),
                }"
              >
                {{ day.date.date() }}
              </div>
              <div class="calendar-month-body-cell-date-content">
                <slot name="dateContent" :date="day.date" />
              </div>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import allLocales from '../locale'
import type { CalendarHeaderPropsType } from '../types'

const props = withDefaults(defineProps<CalendarHeaderPropsType>(), {
  localeContext: () => ({
    locale: 'zh-CN',
  }),
  modelValue: () => dayjs(),
})
const emits = defineEmits(['change'])

const weekList = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

interface daysType {
  date: Dayjs
  currentMonth: boolean
}
const CalendarLocale = computed(() => allLocales[props.localeContext.locale])
function getAllDays(date: Dayjs) {
  const startDate = date.startOf('month')
  const day = startDate.day()

  const daysInfo: Array<daysType> = Array.from({ length: 6 * 7 })

  for (let i = 0; i < day; i++) {
    daysInfo[i] = {
      date: startDate.subtract(day - i, 'day'),
      currentMonth: false,
    }
  }

  for (let i = day; i < daysInfo.length; i++) {
    const calcDate = startDate.add(i - day, 'day')

    daysInfo[i] = {
      date: calcDate,
      currentMonth: calcDate.month() === date.month(),
    }
  }

  const rows: Array<daysType[]> = []
  for (let i = 0; i < 6; i++) {
    const row: daysType[] = []
    for (let j = 0; j < 7; j++) {
      row[j] = daysInfo[i * 7 + j]
    }
    rows.push(row)
  }
  return rows
}

const allDays = computed(() => getAllDays(props.modelValue))
</script>

<style lang="scss" scoped>
.calendar-month {
  &-week-list {
    display: flex;
    padding: 0;
    width: 100%;
    box-sizing: border-box;
    border-bottom: 1px solid #eee;

    &-item {
      padding: 20px 16px;
      text-align: left;
      color: #7d7d7f;
      flex: 1;
    }
  }

  &-body {
    &-row {
      min-height: 50px;
      display: flex;
    }

    &-cell {
      flex: 1;
      border: 1px solid #eee;
      color: #ccc;
      overflow: hidden;

      &-current {
        color: #000;
      }

      &-date {
        padding: 10px;

        &-selected {
          background: blue;
          width: 28px;
          height: 28px;
          line-height: 28px;
          text-align: center;
          color: #fff;
          border-radius: 50%;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
