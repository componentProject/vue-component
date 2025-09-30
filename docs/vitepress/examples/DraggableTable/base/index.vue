<template>
  <div class="container" style="height: 350px">
    <DraggableTable
      id="demo2"
      v-model="tableData"
      :columns="columns"
      :show-pagination="true"
      save-type="local"
      :pager-config="pagerConfig"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三', age: 25, createTime: '2023-01-01' },
  { id: 2, name: '李四', age: 30, createTime: '2023-01-02' },
])

const columns = ref([
  { field: 'id', title: 'ID', width: 70 },
  { field: 'name', title: '姓名' },
  { field: 'age', title: '年龄' },
  { field: 'createTime', title: '日期' },
])

const pagerConfig = ref({
  currentPage: 1,
  pageSize: 2,
  total: tableData.value.length,
  pageSizes: [2, 10, 20, 30],
  layouts: ['Home', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'End', 'Sizes', 'FullJump', 'Total'],
})

function handlePageChange(params: any) {
  console.log('handlePageChange', params)
}
</script>

<style scoped>

</style>
