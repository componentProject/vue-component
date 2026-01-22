<template>
  <div class="container">
    <TsSelect
      v-model="val"
      :options="options"
      :clearable="true"
      :filterable="false"
      label="name"
      value="id"
      :enable-load-more="true"
      :has-more="hasMore"
      :loading="isLoading"
      @load-more="handleLoadMore"
      @change="onChange"
    />
    <p class="tip">
      当前值：<code>{{ val }}</code>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const val = ref('')
const isLoading = ref(false)
const hasMore = ref(true)

const options = ref([
  { id: 1, name: '张三1', age: 18 },
  { id: 2, name: '李四2', age: 20 },
  { id: 3, name: '王五3', age: 22 },
  { id: 4, name: '王五4', age: 22 },
  { id: 5, name: '王五5', age: 22 },
  { id: 6, name: '王五6', age: 22 },
  { id: 7, name: '王五7', age: 22 },
  { id: 8, name: '王五8', age: 22 },
  { id: 9, name: '王五9', age: 22 },
  { id: 10, name: '王五10', age: 22 },
])

function onChange(v: string) {
  val.value = v
}

async function handleLoadMore() {
  isLoading.value = true
  console.log('加载更多')

  await new Promise(resolve => setTimeout(resolve, 1000))

  const newData = options.value.map((item: any) => ({
    ...item,
    id: item.id + 10,
    name: `${item.name}10`,
  }))

  options.value.push(...newData)

  if (options.value.length >= 30) {
    hasMore.value = false
  }
  isLoading.value = false
}
</script>

<style scoped>
.tip {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}
</style>
