<template>
  <div id="container" />
</template>

<script setup lang="ts">
import { Chart } from '../index'

const chart = new Chart({ container: 'container' })

chart.options({
  type: 'boxplot',
  autoFit: true,
  inset: 6,
  data: {
    type: 'fetch',
    value: 'https://assets.antv.antgroup.com/g2/morley.json',
  },
  encode: { x: 'Expt', y: 'Speed' },
})

chart.render()
</script>

<style scoped>

</style>
