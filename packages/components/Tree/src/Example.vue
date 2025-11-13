<template>
  <div class="p-4">
    <h1 class="font-bold mb-4">
      Tree ResizeObserver 测试
    </h1>

    <div class="mb-4">
      <button class="px-4 py-2 bg-blue-500 text-white rounded mr-2" @click="toggleContainerSize">
        切换容器大小
      </button>
      <button class="px-4 py-2 bg-green-500 text-white rounded mr-2" @click="addNode">
        添加节点
      </button>
      <button class="px-4 py-2 bg-red-500 text-white rounded mr-2" @click="removeNode">
        删除节点
      </button>
    </div>

    <div
      ref="containerRef"
      class="border-2 border-gray-300 transition-all duration-300"
      :style="{
        height: `${containerHeight}px`,
        width: `${containerWidth}px`,
      }"
    >
      <Tree
        ref="treeRef"
        :data="treeData"
        label-field="name"
        children-field="children"
        :height="treeHeight"
        show-line
        show-row-line
      />
    </div>

    <div class="mt-4 text-gray-600">
      <p>容器高度: {{ containerHeight }}px</p>
      <p>容器宽度: {{ containerWidth }}px</p>
      <p>Tree高度: {{ treeHeight }}px</p>
      <p>节点数量: {{ nodeCount }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Tree } from '@moluoxixi/components'
import { computed, onMounted, ref } from 'vue'

const containerRef = ref<HTMLElement>()
const treeRef = ref()
const containerHeight = ref(400)
const containerWidth = ref(600)
const treeHeight = ref(0)

const treeData = ref([
  {
    id: 1,
    name: '根节点 1',
    children: [
      { id: 11, name: '子节点 1-1' },
      { id: 12, name: '子节点 1-2', children: [
        { id: 121, name: '子节点 1-2-1' },
        { id: 122, name: '子节点 1-2-2' },
      ] },
    ],
  },
  {
    id: 2,
    name: '根节点 2',
    children: [
      { id: 21, name: '子节点 2-1' },
      { id: 22, name: '子节点 2-2' },
    ],
  },
  { id: 3, name: '根节点 3' },
  {
    id: 4,
    name: '根节点 1',
    children: [
      { id: 41, name: '子节点 1-1' },
      { id: 42, name: '子节点 1-2', children: [
        { id: 421, name: '子节点 1-2-1' },
        { id: 422, name: '子节点 1-2-2' },
      ] },
    ],
  },
  {
    id: 5,
    name: '根节点 1',
    children: [
      { id: 51, name: '子节点 1-1' },
      { id: 52, name: '子节点 1-2', children: [
        { id: 521, name: '子节点 1-2-1' },
        { id: 522, name: '子节点 1-2-2' },
      ] },
    ],
  },
  {
    id: 6,
    name: '根节点 1',
    children: [
      { id: 61, name: '子节点 1-1' },
      { id: 62, name: '子节点 1-2', children: [
        { id: 621, name: '子节点 1-2-1' },
        { id: 622, name: '子节点 1-2-2' },
      ] },
    ],
  },
  {
    id: 7,
    name: '根节点 1',
    children: [
      { id: 71, name: '子节点 1-1' },
      { id: 72, name: '子节点 1-2', children: [
        { id: 721, name: '子节点 1-2-1' },
        { id: 722, name: '子节点 1-2-2' },
      ] },
    ],
  },
])

const nodeCount = computed(() => {
  const countNodes = (nodes: any[]): number => {
    return nodes.reduce((count, node) => {
      return count + 1 + (node.children ? countNodes(node.children) : 0)
    }, 0)
  }
  return countNodes(treeData.value)
})

function toggleContainerSize() {
  if (containerHeight.value === 400) {
    containerHeight.value = 200
    containerWidth.value = 400
  }
  else {
    containerHeight.value = 400
    containerWidth.value = 600
  }
}

function addNode() {
  const newNode = {
    id: Date.now(),
    name: `新节点 ${nodeCount.value + 1}`,
    children: [],
  }
  treeData.value.push(newNode)
}

function removeNode() {
  if (treeData.value.length > 0) {
    treeData.value.pop()
  }
}

onMounted(() => {
  // 监听Tree组件的高度变化
  if (treeRef.value) {
    // 通过ResizeObserver监听Tree内部容器变化
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        treeHeight.value = Math.ceil(entry.contentRect.height)
      }
    })

    // 监听Tree组件的内部容器
    const treeContainer = treeRef.value.$el?.querySelector('.wl-tree')
    if (treeContainer) {
      observer.observe(treeContainer)
    }
  }
})
</script>
