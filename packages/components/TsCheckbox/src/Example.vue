<!-- TsCheckbox的示例文件 -->
<template>
  <div class="example-container">
    <h3>本地数据源</h3>
    <div class="checkbox-container">
      <TsCheckbox
        v-model="localValues"
        :options="localData"
        label="name"
        value="age"
        @change="onLocalChange"
      />
      <div class="value-display">
        当前选中值: {{ localValues }}
      </div>
    </div>

    <h3>分组显示</h3>
    <div class="checkbox-container">
      <TsCheckbox
        v-model="groupValues"
        :options="groupData"
        label="name"
        value="id"
        is-group
        group-key="departmentId"
        group-label="departmentName"
        @change="onGroupChange"
      />
      <div class="value-display">
        当前选中值: {{ groupValues }}
      </div>
    </div>

    <h3>远程数据源</h3>
    <div class="checkbox-container">
      <TsCheckbox
        v-model="remoteValues"
        request-url="/ompBase/upgServices"
        :request-params="requestParams"
        request-method="GET"
        :request-headers="{
          token: '84677795-e391-4a79-a313-4fc89598a73d',
        }"
        response-data-path="rows"
        label="name"
        value="id"
        @change="onRemoteChange"
      />
      <div class="value-display">
        当前选中值: {{ remoteValues }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TsCheckbox from './index.vue'

const requestParams = ref({
  applicationId: '2',
  pageNo: 1,
  pageSize: 999,
})
// 本地数据
const localData = [
  { name: '测试1222222222222222', age: '12' },
  { name: '测试2', age: '13' },
  { name: '测试3', age: '14' },
  { name: '测试4', age: '15' },
  { name: '测试5', age: '16' },
  { name: '测试6', age: '17' },
  { name: '测试7', age: '18' },
  { name: '测试8', age: '19' },
]
const localValues = ref<string[]>([])
const remoteValues = ref<string[]>([])

function onLocalChange(value: string[]) {
  console.log('本地数据选中:', value)
  localValues.value = value
}

function onRemoteChange(value: string[]) {
  console.log('远程数据选中:', value)
  remoteValues.value = value
}
</script>

<style scoped lang="scss">
.example-container {
  padding: 20px;
  max-width: 800px;
  font-family: Arial, sans-serif;

  h3 {
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 16px;
    color: #333;
  }

  .checkbox-container {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #eee;
    border-radius: 4px;
    background-color: #f9f9f9;
  }

  .value-display {
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  }

  .config-info {
    margin-top: 30px;
    border: 1px dashed #ccc;
    padding: 15px;
    background-color: #f5f5f5;

    pre {
      font-family: 'Courier New', Courier, monospace;
      background-color: #eee;
      padding: 10px;
      border-radius: 4px;
      overflow: auto;
      font-size: 13px;
    }
  }
}
</style>
