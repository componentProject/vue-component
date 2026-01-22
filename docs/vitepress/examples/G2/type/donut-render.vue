<template>
  <div class="container">
    <G2 :render="render" />
  </div>
</template>

<script setup lang="ts">
import type { Chart } from '@antv/g2'

function render(chart: Chart) {
  const data = [
    { item: '事例一', count: 40 },
    { item: '事例二', count: 21 },
    { item: '事例三', count: 17 },
  ]

  chart.options({
    autoFit: true,
  })

  chart.coordinate({
    type: 'theta',
    innerRadius: 0.6,
  })

  const mark = chart.interval()
  mark
    .data(data)
    .encode('y', 'count')
    .encode('color', 'item')
    .transform({
      type: 'stackY',
    })
    .label({
      text: 'item',
      position: 'outside',
    })
    .tooltip(data => ({
      name: data.item,
      value: `${data.count}`,
    }))
    .legend('color', {
      position: 'bottom',
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
