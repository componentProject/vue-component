<template>
  <div class="container">
    <G2 :options="options" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const options = ref({
  type: 'interval',
  autoFit: true,
  coordinate: {
    type: 'theta',
    outerRadius: 0.8,
    innerRadius: 0.5,
  },
  data: [
    { item: '事例一', count: 40 },
    { item: '事例二', count: 21 },
    { item: '事例三', count: 17 },
    { item: '事例四', count: 13 },
    { item: '事例五', count: 9 },
  ],
  encode: {
    y: 'count',
    color: 'item',
  },
  transform: [
    {
      type: 'stackY',
    },
  ],
  tooltip: {
    items: [
      {
        field: 'count',
        name: '数量',
      },
    ],
  },
  legend: {
    color: {
      position: 'bottom',
      layout: {
        justifyContent: 'center',
      },
    },
  },
})
</script>

<style scoped>
.container {
  width: 100%;
  height: 400px;
  background-color: #fff;
}
</style>
