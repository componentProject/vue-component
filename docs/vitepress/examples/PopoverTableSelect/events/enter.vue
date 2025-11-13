<template>
  <div class="container">
    <ElInput
      ref="ipt"
      v-model="val"
      class="ipt"
      placeholder="回车选择"
    />
    <PopoverTableSelect
      v-model="visible"
      :virtual-ref="ipt"
      :data="tableData"
      :columns="columns"
      :input-value="val"
      @enter="onEnter"
    />
    <p class="tip">
      最近回车：<code>{{ lastEnter }}</code>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ElInput } from 'element-plus'
import { ref } from 'vue'

const visible = ref(false)
const val = ref('')
const lastEnter = ref('')
const ipt = ref()
const tableData = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
])
const columns = ref([
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '姓名' },
])

function onEnter(row: any) {
  lastEnter.value = JSON.stringify(row)
}
</script>

<style scoped>
.ipt {
  width: 220px;
}
.tip {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}
</style>
