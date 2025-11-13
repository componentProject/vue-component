<template>
  <div class="container">
    <ElInput
      ref="ipt"
      v-model="val"
      class="ipt"
      placeholder="弹窗宽度"
    />
    <PopoverTableSelect
      v-model="visible"
      :virtual-ref="ipt"
      :data="tableData"
      :columns="columns"
      :popover-props="{ width: 520 }"
      :input-value="val"
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
</script>

<style scoped>
.ipt {
  width: 220px;
}
</style>
