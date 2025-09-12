<template>
  <div class="container" style="height: 360px">
    <DraggableTable
      id="server-save-demo"
      v-model="tableData"
      :columns="columns"
      page-id="demo-page-01"
      user-id="user-A"
      save-type="server"
      :get-config="getConfig"
      :set-config="setConfig"
      :show-pagination="false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const STORAGE_PREFIX = 'demo_server_columns__'

function getServerKey(config: { pageId?: string, widgetId?: string, userId?: string }) {
  const { pageId = '', widgetId = '', userId = '' } = config || {}
  return `${STORAGE_PREFIX}${pageId}__${widgetId}__${userId}`
}

async function getConfig(config: any): Promise<any[]> {
  const key = getServerKey(config)
  const txt = localStorage.getItem(key) || '[]'
  try {
    const parsed = JSON.parse(txt)
    return Array.isArray(parsed) ? parsed : []
  }
  catch {
    return []
  }
}

async function setConfig(config: any, columns: any[]): Promise<void> {
  const key = getServerKey(config)
  localStorage.setItem(key, JSON.stringify(columns))
}

function createRows() {
  const list: Array<Record<string, any>> = []
  for (let i = 1; i <= 10; i++) {
    list.push({ id: i, name: `用户${i}`, role: i % 2 ? '管理员' : '访客' })
  }
  return list
}

const tableData = ref(createRows())

const columns = ref([
  { field: 'id', title: 'ID', width: 70 },
  { field: 'name', title: '姓名', width: 120 },
  { field: 'role', title: '角色', width: 120 },
])
</script>

<style scoped>
.container {
  padding: 8px;
}
</style>
