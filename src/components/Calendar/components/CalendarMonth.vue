<template>
  <div class="calendar-month">
    <div class="calendar-month-week-list">
      <div v-for="week in weekList" class="calendar-month-week-list-item" :key="week">
        {{ CalendarLocale.week[week] }}
      </div>
    </div>

    <div class="calendar-month-body">
      <div v-for="row in allDays" class="calendar-month-body-row">
        <div
          v-for="day in row" class="calendar-month-body-cell"
          @click="emits('change', day.date)"
          :class="{'calendar-month-body-cell-current': day.currentMonth}"
        >
          <slot name="date" :date="day.date">
            <div class="calendar-month-body-cell-date">
              <div
                class="calendar-month-body-cell-date-value"
                :class="{'calendar-month-body-cell-date-selected':props.modelValue?.format('YYYY-MM-DD') === day.date.format('YYYY-MM-DD')}"
              >{{ day.date.date() }}
              </div>
              <div class="calendar-month-body-cell-date-content">
                <slot name="dateContent" :date="day.date"></slot>
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
import dayjs, { Dayjs } from 'dayjs'
import allLocales from '../locale'

const weekList = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']


const emits = defineEmits(['change'])

const props = defineProps({
  modelValue: {
    type: Dayjs,
    default: dayjs()
  },
  localeContext: {
    type: Object,
    default: () => ({ locale: 'zh-CN' })
  }
})
const CalendarLocale = allLocales[props.localeContext.locale as string]

function getAllDays(date: Dayjs) {
  const startDate = date.startOf('month')
  const day = startDate.day()

  const daysInfo: Array<{ date: Dayjs, currentMonth: boolean }> = new Array(6 * 7)

  for (let i = 0; i < day; i++) {
    daysInfo[i] = {
      date: startDate.subtract(day - i, 'day'),
      currentMonth: false
    }
  }

  for (let i = day; i < daysInfo.length; i++) {
    const calcDate = startDate.add(i - day, 'day')

    daysInfo[i] = {
      date: calcDate,
      currentMonth: calcDate.month() === date.month()
    }
  }


  const rows: Array<typeof daysInfo> = []
  for (let i = 0; i < 6; i++) {
    const row = []
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
