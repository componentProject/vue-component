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
    innerRadius: 0.6,
  },
  data: [
    { item: '事例一', count: 40 },
    { item: '事例二', count: 21 },
    { item: '事例三', count: 17 },
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
  label: {
    text: 'item',
    position: 'outside',
  },
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
