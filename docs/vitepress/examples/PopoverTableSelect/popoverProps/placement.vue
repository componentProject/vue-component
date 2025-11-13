<!-- placement.vue文件 -->
<template>
  <div class="container">
    <ElInput
      ref="ipt"
      v-model="val"
      class="ipt"
      placeholder="不同弹出位置"
    />
    <div class="row">
      <PopoverTableSelect
        v-model="v1"
        :virtual-ref="ipt"
        :data="tableData"
        :columns="columns"
        :popover-props="{ placement: 'top' }"
        :input-value="val"
      />
      <PopoverTableSelect
        v-model="v2"
        :virtual-ref="ipt"
        :data="tableData"
        :columns="columns"
        :popover-props="{ placement: 'bottom' }"
        :input-value="val"
      />
      <PopoverTableSelect
        v-model="v3"
        :virtual-ref="ipt"
        :data="tableData"
        :columns="columns"
        :popover-props="{ placement: 'right' }"
        :input-value="val"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElInput } from 'element-plus'
import { ref } from 'vue'

const val = ref('')
const ipt = ref()
const v1 = ref(false)
const v2 = ref(false)
const v3 = ref(false)

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
.row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
</style>
