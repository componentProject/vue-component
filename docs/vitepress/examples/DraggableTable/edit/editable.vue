<template>
  <div class="container" style="height: 350px">
    <DraggableTable
      v-model="tableData"
      :columns="columns"
      :showPagination="true"
      :editable="true"
      :pagination="paginationConfig"
      :pageSizes="pageSizes"
      :paginationLayout="paginationLayout"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

//分页配置
const paginationConfig = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});

// 分页选项配置
const pageSizes = ref([10, 20, 30, 50]);
const paginationLayout = ref("total, sizes, prev, pager, next, jumper");

const tableData = ref([
  { id: 1, name: "张三", age: 25, createTime: "2023-01-01" },
  { id: 2, name: "李四", age: 30, createTime: "2023-01-02" },
]);

const columns = ref([
  { field: "id", title: "ID", width: 70 },
  { field: "name", title: "姓名" },
  { field: "age", title: "年龄" },
  { field: "createTime", title: "日期" },
]);
const handleSizeChange = (size: number) => {
  paginationConfig.value.pageSize = size;
};

const handleCurrentChange = (current: number) => {
  paginationConfig.value.currentPage = current;
};
</script>

<style scoped>
.container {
  padding: 8px;
}
</style>
