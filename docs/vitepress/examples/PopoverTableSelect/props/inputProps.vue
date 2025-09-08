<template>
  <div class="container">
    <PopoverTableSelect
      v-model="visible"
      pop-type="input"
      :input-value="val"
      :input-props="{ clearable: true, prefixIcon: 'Search' }"
      :data="tableData"
      :columns="columns"
      @clear="onClear"
    />
    <p class="tip">
      是否清空过：<code>{{ cleared ? '是' : '否' }}</code>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const val = ref('')
const cleared = ref(false)
const tableData = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
])
const columns = ref([
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '姓名' },
])

function onClear() {
  cleared.value = true
}
</script>

<style scoped>
.container {
  padding: 8px;
}
.tip {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}
</style>
