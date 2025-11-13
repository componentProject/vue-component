<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <TsButton type="primary" @click="onClick">
        默认按钮
      </TsButton>
      <TsButton type="primary" :disabled="true" show-type="disabled" content="按钮被禁用">
        禁用时展示 Popover
      </TsButton>
      <TsButton type="primary" show-type="content">
        <template #default>
          自定义内容 Button
        </template>
        <template #content>
          我是自定义 Popover 内容
        </template>
      </TsButton>
    </div>

    <div class="flex items-center gap-2">
      <TsButton type="success" :throttle="1000" @click="onThrottle">
        点击（节流 1s）
      </TsButton>
      <TsButton type="warning" :debounce="800" @click="onDebounce">
        点击（防抖 800ms）
      </TsButton>
    </div>

    <div class="flex items-center gap-2">
      <TsButton type="danger" :throttle="10000" :options="{ promise: true, trailing: true, leading: false }" @click="onAsyncThrottle">
        异步节流（必须上一次完成）
      </TsButton>
    </div>

    <ElButton @click="drawerVisible = !drawerVisible">
      显示/隐藏Drawer
    </ElButton>
    <ElDrawer v-model="drawerVisible" destroy-on-close size="90%" title="退费申请">
      <ElTable :data="[{ name: 'nij' }]">
        <ElTableColumn prop="name" label="姓名">
          <template #default>
            <TsButton show-type="disabled" content="你好" disabled type="danger" size="small">
              aaa自定义插槽按钮
            </TsButton>
          </template>
        </ElTableColumn>
        <ElTableColumn fixed="right" prop="name" label="姓名">
          <template #default>
            <TsButton show-type="disabled" content="你好" disabled type="danger" size="small">
              aaa自定义插槽按钮
            </TsButton>
          </template>
        </ElTableColumn>
      </ElTable>
    </ElDrawer>
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElDrawer, ElTable, ElTableColumn } from 'element-plus'
import { ref } from 'vue'
import TsButton from './index.vue'

const drawerVisible = ref(false)

function onClick() {
  console.log('click')
}

function onThrottle() {
  console.log('throttle click at', Date.now())
}

function onDebounce() {
  console.log('debounce click at', Date.now())
}

async function onAsyncThrottle() {
  console.log('start async at', Date.now())
  await new Promise(resolve => setTimeout(resolve, 20))
  console.log('end async at', Date.now())
}
</script>

<style scoped>
</style>
