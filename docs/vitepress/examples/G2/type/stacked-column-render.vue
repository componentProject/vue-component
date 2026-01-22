<template>
  <div class="container">
    <G2 :render="render" />
  </div>
</template>

<script setup lang="ts">
import type { Chart } from '@antv/g2'

function render(chart: Chart) {
  const data = [
    { category: 'A', value: 10, group: 'G1' },
    { category: 'B', value: 20, group: 'G1' },
    { category: 'C', value: 30, group: 'G1' },
    { category: 'A', value: 15, group: 'G2' },
    { category: 'B', value: 25, group: 'G2' },
    { category: 'C', value: 35, group: 'G2' },
  ]

  chart.options({
    type: 'interval',
    autoFit: true,
    data,
    encode: {
      x: 'category',
      y: 'value',
      color: 'group',
    },
  })

  const mark = chart.interval()
  mark.transform({
    type: 'stackY',
  })
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 400px;
  background-color: #fff;
}
</style>
