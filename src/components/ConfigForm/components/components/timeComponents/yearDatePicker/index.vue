<template>
  <div class="yearPicker" ref="yearPicker" :style="{ width: width + 'px' }">
    <div class="_inner labelText" :style="{ width: labelWidth + 'px' }">{{ labelText }}</div>
    <input
      class="_inner"
      ref="inputLeft"
      v-model="startShowYear"
      @focus="onFocus"
      type="text"
      @click="clickInput"
      name="yearInput"
      @input="checkStartInput"
      placeholder="选择年份"
    />
    <span>{{ sp }}</span>
    <input
      class="_inner"
      ref="inputRight"
      v-model="endShowYear"
      @focus="onFocus"
      type="text"
      @click="clickInput"
      name="yearInput"
      @input="checkEndInput"
      placeholder="选择年份"
    />
    <div class="_inner floatPanel" v-if="showPanel">
      <div class="_inner leftPanel">
        <div class="_inner panelHead">
          <i class="_inner el-icon-d-arrow-left" @click="onClickLeft"></i>
          {{ leftYearList[0] + '-' + leftYearList[9] }}
        </div>
        <div class="_inner panelContent">
          <div
            v-for="item in leftYearList"
            :class="{
              disabled: checkValidYear(item) !== 0,
              oneSelected: item === startYear && oneSelected,
              startSelected: item === startYear,
              endSelected: item === endYear,
              _inner: true,
              betweenSelected: item > startYear && item < endYear,
            }"
            :key="item"
          >
            <a
              :class="{
                cell: true,
                _inner: true,
                selected: item === startYear || item === endYear,
              }"
              @click="onClickItem(item)"
              @mouseover="onHoverItem(item)"
            >
              {{ item }}
            </a>
          </div>
        </div>
      </div>
      <div class="_inner rightPanel">
        <div class="_inner panelHead">
          <i class="_inner el-icon-d-arrow-right" @click="onClickRight"></i>
          {{ rightYearList[0] + '-' + rightYearList[9] }}
        </div>
        <div class="_inner panelContent">
          <div
            :class="{
              disabled: checkValidYear(item) !== 0,
              startSelected: item === startYear,
              endSelected: item === endYear,
              betweenSelected: item > startYear && item < endYear,
            }"
            v-for="item in rightYearList"
            :key="item"
          >
            <a
              :class="{
                cell: true,
                _inner: true,
                selected: item === endYear || item === startYear,
              }"
              @click="onClickItem(item)"
              @mouseover="onHoverItem(item)"
            >
              {{ item }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { isType } from '@/components/ConfigForm/utils'

enum SELECT_STATE {
  UNSELECT,
  SELECTING,
  SELECTED,
}

const props = defineProps<{
  width?: number
  labelWidth?: number
  labelText?: string
  sp?: string
  initYear?: { startYear: number; endYear: number } | null
  value?: [string, string]
  prop: string
  model: Record<string, any>
  config: Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'input', value: [string, string]): void
  (e: 'change', value: [string, string]): void
  (e: 'update:model', value: Record<string, any>): void
}>()

const yearPicker = ref<HTMLElement | null>(null)
const inputLeft = ref<HTMLInputElement | null>(null)
const inputRight = ref<HTMLInputElement | null>(null)

const itemBg = ref({})
const startShowYear = ref<string | null>(null)
const endShowYear = ref<string | null>(null)
const yearList = ref<number[]>([])
const showPanel = ref(false)
const startYear = ref<number | null>(null)
const endYear = ref<number | null>(null)
const curYear = ref(0)
const curSelectedYear = ref(0)
const curState = ref(SELECT_STATE.UNSELECT)

const oneSelected = computed(() => {
  return (
    curState.value === SELECT_STATE.SELECTING &&
    (startYear.value === endYear.value || endYear.value == null)
  )
})

const leftYearList = computed(() => yearList.value.slice(0, 10))
const rightYearList = computed(() => yearList.value.slice(10, 20))

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
  () => props.value,
  (newValue) => {
    const [start, end] = newValue
    startYear.value = parseInt(start)
    endYear.value = parseInt(end)
  },
)

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

const checkStartInput = () => {
  if (isNaN(Number(startShowYear.value))) {
    startShowYear.value = startYear.value?.toString() || null
  } else {
    startYear.value = Number(startShowYear.value)
  }
}

const checkEndInput = () => {
  if (isNaN(Number(endShowYear.value))) {
    endShowYear.value = endYear.value?.toString() || null
  } else {
    endYear.value = Number(endShowYear.value)
  }
}

const changeYear = () => {
  if (startYear.value && endYear.value && startYear.value > endYear.value) {
    const tmp = endYear.value
    endYear.value = startYear.value
    startYear.value = tmp
  }

  if (props.initYear) {
    if (startYear.value) {
      startYear.value = Math.max(startYear.value, props.initYear.startYear)
    }
    if (endYear.value) {
      endYear.value = Math.min(endYear.value, props.initYear.endYear)
    }
  }

  startShowYear.value = startYear.value?.toString() || null
  endShowYear.value = endYear.value?.toString() || null

  if (startYear.value && endYear.value) {
    emit('input', [startYear.value.toString(), endYear.value.toString()])
    emit('change', [startYear.value.toString(), endYear.value.toString()])
  } else {
    console.warn('WARN:年份不合法', startYear.value, endYear.value)
  }
}

const onHoverItem = (iYear: number) => {
  if (checkValidYear(iYear) !== 0) {
    return
  }
  if (curState.value === SELECT_STATE.SELECTING) {
    const tmpStart = curSelectedYear.value
    endYear.value = Math.max(tmpStart, iYear)
    startYear.value = Math.min(tmpStart, iYear)
  }
}

const checkValidYear = (year: number): number => {
  if (!props.initYear) return 0
  if (year < props.initYear.startYear) return -1
  if (year > props.initYear.endYear) return 1
  return 0
}

const onClickItem = (iYear: number) => {
  if (checkValidYear(iYear) !== 0) return

  if (curState.value === SELECT_STATE.UNSELECT) {
    startYear.value = iYear
    endYear.value = iYear
    curSelectedYear.value = iYear
    curState.value = SELECT_STATE.SELECTING
  } else if (curState.value === SELECT_STATE.SELECTING) {
    curState.value = SELECT_STATE.SELECTED
    showPanel.value = false
    changeYear()
  }
}

const onClickLeft = () => {
  const firstYear = yearList.value[0]
  yearList.value = Array.from({ length: 20 }, (_, i) => firstYear - 20 + i)
}

const onClickRight = () => {
  const lastYear = yearList.value[yearList.value.length - 1]
  yearList.value = Array.from({ length: 20 }, (_, i) => lastYear + 1 + i)
}

const onFocus = () => {
  showPanel.value = true
  const currentYear = new Date().getFullYear()
  yearList.value = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i)
  curState.value = SELECT_STATE.UNSELECT
}

const clickInput = () => {
  showPanel.value = true
}

// Close panel when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (yearPicker.value && !yearPicker.value.contains(target)) {
    showPanel.value = false
  }
}

// Add click outside listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
.yearPicker {
  font-size: 14px;
  display: flex;
  position: relative;
  transition: all 0.3s;

  input {
    text-align: center;
  }

  input:first-child {
    text-align: right;
  }

  background-color: #fff;

  .labelText {
    text-align: center;
  }

  span {
    padding: 0 8px;
    height: 32px;
    line-height: 32px;
  }

  border: 1px solid #eff1f3;
  height: 34px;
  line-height: 34px;
  border-radius: 4px;
  padding: 0 28px 0 8px;
  box-sizing: border-box;

  .floatPanel {
    > div {
      width: 50%;
    }

    padding: 0 16px;
    position: absolute;
    display: flex;
    background-color: #fff;
    z-index: 2000;
    border-radius: 4px;
    width: 650px;
    height: 250px;
    top: 40px;
    left: -10px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);

    .panelContent {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      height: calc(100% - 70px);

      .disabled {
        color: #ccc;
      }

      .oneSelected {
        border-top-right-radius: 24px;
        border-bottom-right-radius: 24px;
      }

      .startSelected {
        background-color: #f6f6f7;
        border-top-left-radius: 24px;
        border-bottom-left-radius: 24px;
      }

      .endSelected {
        background-color: #f6f6f7;
        border-top-right-radius: 24px;
        border-bottom-right-radius: 24px;
      }

      .betweenSelected {
        background-color: #f6f6f7;
      }

      > div {
        width: 75px;
        height: 48px;
        line-height: 48px;
        margin: 3px 0;

        // border-radius: 24px;
        text-align: center;

        a {
          display: inline-block;
          width: 60px;
          height: 36px;
          cursor: pointer;
          line-height: 36px;
          border-radius: 18px;
        }

        .selected {
          background-color: #3e77fc;
          color: #fff;
        }
      }
    }

    .panelHead {
      position: relative;
      height: 46px;
      line-height: 46px;
      text-align: center;

      i {
        position: absolute;
        cursor: pointer;

        &:hover {
          color: #3e77fc;
        }
      }
    }

    .rightPanel {
      padding-left: 8px;
    }

    .leftPanel .panelHead i {
      left: 20px;
      top: 15px;
    }

    .rightPanel .panelHead i {
      right: 20px;
      top: 15px;
    }
  }

  .floatPanel::before {
    content: '';
    height: 100%;
    position: absolute;
    left: 50%;
    width: 1px;
    border-left: 1px solid #e4e4e4;
  }
}

input {
  width: 60px;
  border: none;
  height: 32px;
  line-height: 32px;
  box-sizing: border-box;
  background-color: transparent;
}

input:focus {
  outline: none;
  background-color: transparent;
}

.yearPicker:hover {
  border-color: #3e77fc;
}

.dateIcon {
  position: absolute;
  right: 16px;
  top: 9px;
  color: #adb2bc;
}
</style>
