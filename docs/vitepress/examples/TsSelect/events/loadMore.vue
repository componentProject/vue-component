<template>
  <div class="container">
    <TsSelect
      v-model="value"
      :options="displayOptions"
      :enable-load-more="true"
      :has-more="hasMore"
      :loading="loading"
      label="label"
      value="value"
      @load-more="handleLoadMore"
    />
    <div class="value">
      已加载：{{ displayOptions.length }} 条
      <br>
      还有更多：{{ hasMore ? '是' : '否' }}
      <br>
      加载中：{{ loading ? '是' : '否' }}
      <br>
      触发次数：{{ loadMoreCount }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const allOptions = ref([
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
  { label: '选项4', value: '4' },
  { label: '选项5', value: '5' },
  { label: '选项6', value: '6' },
  { label: '选项7', value: '7' },
  { label: '选项8', value: '8' },
  { label: '选项9', value: '9' },
  { label: '选项10', value: '10' },
])

const displayOptions = ref(allOptions.value.slice(0, 5))
const hasMore = ref(true)
const loading = ref(false)
const loadMoreCount = ref(0)

function handleLoadMore() {
  loadMoreCount.value++
  loading.value = true

  setTimeout(() => {
    const currentLength = displayOptions.value.length
    const nextBatch = allOptions.value.slice(currentLength, currentLength + 3)
    displayOptions.value.push(...nextBatch)
    hasMore.value = displayOptions.value.length < allOptions.value.length
    loading.value = false
    console.log('loadMore 事件触发')
  }, 500)
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.value {
  font-size: 14px;
  color: #666;
  min-height: 80px;
}
</style>

