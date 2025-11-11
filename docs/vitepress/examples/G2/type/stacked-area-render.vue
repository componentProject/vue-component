<template>
  <div class="container">
    <G2 :render="render" />
  </div>
</template>

<script setup lang="ts">
import type { Chart } from '@antv/g2'

function render(chart: Chart) {
  const data = [
    { year: '1991', value: 3, category: 'A' },
    { year: '1992', value: 4, category: 'A' },
    { year: '1993', value: 3.5, category: 'A' },
    { year: '1991', value: 2, category: 'B' },
    { year: '1992', value: 3, category: 'B' },
    { year: '1993', value: 2.5, category: 'B' },
  ]

  chart.options({
    type: 'area',
    autoFit: true,
    data,
    encode: {
      x: 'year',
      y: 'value',
      color: 'category',
    },
    style: {
      fillOpacity: 0.6,
    },
  })

  const mark = chart.area()
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
