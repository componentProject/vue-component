<template>
  <div class="container">
    <G2 ref="chartRef" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Chart } from '@antv/g2'

const chartRef = ref<{ getChart: () => Chart } | null>(null)

const options = ref({
  type: 'interval',
  autoFit: true,
  data: [
    { letter: 'A', frequency: 0.08167 },
    { letter: 'B', frequency: 0.01492 },
    { letter: 'C', frequency: 0.02782 },
  ],
  encode: {
    x: 'letter',
    y: 'frequency',
  },
  style: {
    fill: '#1890ff',
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
