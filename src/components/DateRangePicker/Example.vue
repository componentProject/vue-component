<template>
  <div class="date-range-picker-example">
    <h2>日期范围选择器示例</h2>

    <div class="example-section">
      <h3>1. 基础日期选择器</h3>
      <div class="example-item">
        <div class="label">基本用法：</div>
        <div class="component">
          <DateRangePicker v-model="date1" type="date" />
        </div>
        <div class="value">选中值: {{ date1 }}</div>
      </div>

      <div class="example-item">
        <div class="label">默认返回今天：</div>
        <div class="component">
          <DateRangePicker v-model="date2" type="date" :defaultToday="true" />
        </div>
        <div class="value">选中值: {{ date2 }}</div>
      </div>
    </div>

    <div class="example-section">
      <h3>2. 日期范围选择器</h3>
      <div class="example-item">
        <div class="label">基本用法：</div>
        <div class="component">
          <DateRangePicker v-model="dateRange1" type="daterange" />
        </div>
        <div class="value">选中值: {{ dateRange1 }}</div>
      </div>

      <div class="example-item">
        <div class="label">默认返回今天：</div>
        <div class="component">
          <DateRangePicker v-model="dateRange2" type="daterange" :defaultToday="true" />
        </div>
        <div class="value">选中值: {{ dateRange2 }}</div>
      </div>
    </div>

    <div class="example-section">
      <h3>3. 自定义日期范围</h3>
      <div class="example-item">
        <div class="label">dateRange=7（今天到未来7天）：</div>
        <div class="component">
          <DateRangePicker v-model="dateRange3" type="daterange" :dateRange="7" />
        </div>
        <div class="value">选中值: {{ dateRange3 }}</div>
      </div>

      <div class="example-item">
        <div class="label">dateRange=-7（过去7天到今天）：</div>
        <div class="component">
          <DateRangePicker v-model="dateRange4" type="daterange" :dateRange="-7" />
        </div>
        <div class="value">选中值: {{ dateRange4 }}</div>
      </div>

      <div class="example-item">
        <div class="label">dateRange=[-7, 7]（过去7天到未来7天）：</div>
        <div class="component">
          <DateRangePicker v-model="dateRange5" type="daterange" :dateRange="[-7, 7]" />
        </div>
        <div class="value">选中值: {{ dateRange5 }}</div>
      </div>
    </div>

    <div class="example-section">
      <h3>4. 禁用日期</h3>
      <div class="example-item">
        <div class="label">minDate（今天之前的日期禁用）：</div>
        <div class="component">
          <DateRangePicker v-model="dateRange6" type="daterange" :minDate="today" />
        </div>
        <div class="value">选中值: {{ dateRange6 }}</div>
      </div>

      <div class="example-item">
        <div class="label">maxDate（今天之后的日期禁用）：</div>
        <div class="component">
          <DateRangePicker v-model="dateRange7" type="daterange" :maxDate="today" />
        </div>
        <div class="value">选中值: {{ dateRange7 }}</div>
      </div>

      <div class="example-item">
        <div class="label">disabledDateRange（只允许选择未来7天内的日期）：</div>
        <div class="component">
          <DateRangePicker
            v-model="dateRange8"
            type="daterange"
            :disabledDateRange="[today, futureWeek]"
          />
        </div>
        <div class="value">选中值: {{ dateRange8 }}</div>
      </div>
    </div>

    <div class="example-section">
      <h3>5. 快速选择选项</h3>
      <div class="example-item">
        <div class="label">显示快速选择：</div>
        <div class="component">
          <DateRangePicker v-model="dateRange9" type="daterange" :quickOptions="true" />
        </div>
        <div class="value">选中值: {{ dateRange9 }}</div>
      </div>
    </div>

    <div class="example-section">
      <h3>6. 尺寸和禁用</h3>
      <div class="example-item">
        <div class="label">小尺寸：</div>
        <div class="component">
          <DateRangePicker v-model="dateRange10" type="daterange" size="small" />
        </div>
      </div>

      <div class="example-item">
        <div class="label">禁用状态：</div>
        <div class="component">
          <DateRangePicker
            v-model="dateRange11"
            type="daterange"
            :disabled="true"
            :defaultToday="true"
          />
        </div>
        <div class="value">选中值: {{ dateRange11 }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import moment from 'moment'
import DateRangePicker from './index.vue'

// 基础日期选择器
const date1 = ref([])
const date2 = ref([])

// 日期范围选择器
const dateRange1 = ref([])
const dateRange2 = ref([])

// 自定义日期范围
const dateRange3 = ref([])
const dateRange4 = ref([])
const dateRange5 = ref([])

// 禁用日期
const today = moment().format('YYYY-MM-DD')
const futureWeek = moment().add(7, 'days').format('YYYY-MM-DD')
const dateRange6 = ref([])
const dateRange7 = ref([])
const dateRange8 = ref([])

// 快速选择选项
const dateRange9 = ref([])

// 尺寸和禁用
const dateRange10 = ref([])
const dateRange11 = ref([])
</script>

<style scoped>
.date-range-picker-example {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

h3 {
  margin-top: 30px;
  margin-bottom: 15px;
  color: #555;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.example-section {
  margin-bottom: 30px;
}

.example-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  background-color: #fafafa;
}

.label {
  width: 300px;
  color: #666;
  font-weight: bold;
  margin-bottom: 10px;
}

.component {
  width: 280px;
  margin-bottom: 10px;
}

.value {
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  background-color: #f0f9ff;
  border-radius: 4px;
  color: #333;
  font-family: monospace;
  word-break: break-all;
}
</style>
