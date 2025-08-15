<template>
  <div class="example-container">
    <h3>本地数据源</h3>
    <div class="select-container">
      <Select v-model="localValue" :options="localData" label="name" value="age" @change="onLocalChange" />
      <div class="value-display">
        当前选中值: {{ localValue }}
      </div>
    </div>

    <h3>远程数据源</h3>
    <div class="select-container">
      <Select
        v-model="remoteValue"
        :server-props="{ serverType: 'base', optionsParams: { dictType: 'COMMON_YES_NO' } }"
        @change="onRemoteChange"
      />
      <div class="value-display">
        当前选中值: {{ remoteValue }}
      </div>
    </div>

    <div class="config-info">
      <h3>全局配置示例</h3>
      <pre>
// 在应用入口配置
import { configureServerOptions } from '@moluoxixi/components/Select/src/uitls'

configureServerOptions({
  serverMap: {
    base: '/api/common/dict',
    users: '/api/users',
    departments: '/api/departments'
  },
  requestHandler: async (url, params) => {
    // 自定义请求处理逻辑
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(params)
    })
    const data = await response.json()
    return data.list || []
  }
})
      </pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Select from '@moluoxixi/components/Select/index.ts'

// 本地数据
const localData = [
  { name: '测试1', age: '12' },
  { name: '测试2', age: '13' },
  { name: '测试3', age: '14' },
  { name: '测试4', age: '15' },
  { name: '测试5', age: '16' },
  { name: '测试6', age: '17' },
  { name: '测试7', age: '18' },
  { name: '测试8', age: '19' },
]

const localValue = ref('')
const remoteValue = ref('')

function onLocalChange(value: string) {
  console.log('本地数据选中:', value)
  localValue.value = value
}

function onRemoteChange(value: string) {
  console.log('远程数据选中:', value)
  remoteValue.value = value
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

  .select-container {
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
