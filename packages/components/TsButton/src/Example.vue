<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <wl-button type="primary" @click="onClick">
        默认按钮
      </wl-button>
      <wl-button type="primary" :disabled="true" show-type="disabled" content="按钮被禁用">
        禁用时展示 Popover
      </wl-button>
      <wl-button type="primary" show-type="content">
        <template #default>
          自定义内容 Button
        </template>
        <template #content>
          我是自定义 Popover 内容
        </template>
      </wl-button>
    </div>

    <div class="flex items-center gap-2">
      <wl-button type="success" :throttle="1000" @click="onThrottle">
        点击（节流 1s）
      </wl-button>
      <wl-button type="warning" :debounce="800" @click="onDebounce">
        点击（防抖 800ms）
      </wl-button>
    </div>

    <div class="flex items-center gap-2">
      <wl-button type="danger" :throttle="10000" :options="{ promise: true, trailing: true, leading: false }" @click="onAsyncThrottle">
        异步节流（必须上一次完成）
      </wl-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import wlButton from './index.vue'

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
