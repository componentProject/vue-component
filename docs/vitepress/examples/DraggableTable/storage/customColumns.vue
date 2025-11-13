<!-- customColumns.vue文件 -->
<template>
  <p class="tip">
    自定义个性化弹窗的列字段集合 `customColumns`。
  </p>
  <div class="container" style="height: 360px">
    <DraggableTable
      id="custom-columns-demo"
      v-model="tableData"
      :columns="columns"
      save-type="local"
      :custom-columns="customCols"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三', age: 28, city: '上海' },
  { id: 2, name: '李四', age: 31, city: '北京' },
])

const columns = ref([
  { field: 'id', title: 'ID', width: 70 },
  { field: 'name', title: '姓名', width: 120 },
  { field: 'age', title: '年龄', width: 100 },
  { field: 'city', title: '城市', width: 120 },
])

const customCols = ref([
  { type: 'checkbox', width: 40 },
  { field: 'field', title: '字段' },
  { field: 'title', title: '列名称' },
  { field: 'width', title: '宽度' },
  { field: 'resizable', title: '可调整' },
  { field: 'align', title: '对齐方式' },
])
</script>

<style scoped>
.tip {
  margin: 0 0 8px;
  color: #555;
  font-size: 12px;
}
</style>
