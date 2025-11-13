<!-- trigger-select-click.vue文件 -->
<template>
  <div class="container">
    <ElInput
      ref="ipt"
      v-model="val"
      class="ipt"
      placeholder="单击选择并关闭"
    />
    <PopoverTableSelect
      v-model="visible"
      :data="tableData"
      :columns="columns"
      :virtual-ref="ipt"
      select-trigger="click"
      :input-value="val"
      @select="onSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ElInput } from 'element-plus'
import { ref } from 'vue'

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
.ipt {
  width: 220px;
}
</style>
