<template>
  <div class="container">
    <Select
      v-model="val"
      :options="options"
      :filterable="true"
      :label="'label'"
      :value="'value'"
      @change="onChange"
    />
    <p class="tip">支持输入过滤</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const val = ref('')
const options = ref([
  { label: '苹果', value: 'apple', pyCode: 'pg', wbCode: 'pg' },
  { label: '香蕉', value: 'banana', pyCode: 'jx', wbCode: 'jx' },
  { label: '西瓜', value: 'watermelon', pyCode: 'xg', wbCode: 'xg' },
])

function onChange(v: string) {
  val.value = v
}
</script>

<style scoped>
.container { padding: 8px; }
.tip { margin-top: 8px; font-size: 12px; color: #666; }
</style>


