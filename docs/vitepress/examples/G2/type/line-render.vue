<template>
  <div class="container">
    <G2 :render="render" />
  </div>
</template>

<script setup lang="ts">
import type { Chart } from '@antv/g2'

function render(chart: Chart) {
  const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
  ]

  chart.options({
    type: 'line',
    autoFit: true,
    data,
    encode: {
      x: 'year',
      y: 'value',
    },
    style: {
      stroke: '#1890ff',
      lineWidth: 2,
    },
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

