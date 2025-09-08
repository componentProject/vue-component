<template>
  <div class="container">
    <ElInput
      ref="ipt"
      v-model="val"
      class="ipt"
      placeholder="选中后写回输入框"
    />
    <PopoverTableSelect
      v-model="visible"
      :virtual-ref="ipt"
      :data="tableData"
      :columns="columns"
      :input-value="val"
      @select="onSelect"
    />
    <p class="tip">
      最近选择：<code>{{ lastSelected }}</code>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElInput } from 'element-plus'

const visible = ref(false)
const val = ref('')
const lastSelected = ref('')
const ipt = ref()
const tableData = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
])
const columns = ref([
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '姓名' },
])

function onSelect(row: any) {
  val.value = row?.name ?? ''
  lastSelected.value = JSON.stringify(row)
}
</script>

<style scoped>
.container {
  padding: 8px;
}
.ipt {
  width: 220px;
}
.tip {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}
</style>
