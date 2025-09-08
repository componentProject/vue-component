<template>
  <div class="container">
    <ElInput
      ref="ipt"
      v-model="val"
      class="ipt"
      placeholder="外部输入框作为触发器"
    />
    <PopoverTableSelect
      v-model="visible"
      pop-type="default"
      :virtual-ref="ipt"
      :data="tableData"
      :columns="columns"
      :input-value="val"
      @select="onSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElInput } from 'element-plus'

const visible = ref(false)
const val = ref('')
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
}
</script>

<style scoped>
.container {
  padding: 8px;
}
.ipt {
  width: 220px;
}
</style>
