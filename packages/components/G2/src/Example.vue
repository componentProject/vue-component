<!-- G2的示例文件 -->
<template>
  <div style="height: 20%;width: 30%">
    <G2 :render="render" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { Chart } from '../index'
import G2 from './index.vue'

//#region options
const options = ref({
  type: 'interval',
  autoFit: true,
  data: [
    { letter: 'A', frequency: 0.08167 },
    { letter: 'B', frequency: 0.01492 },
    { letter: 'C', frequency: 0.02782 },
    { letter: 'D', frequency: 0.04253 },
    { letter: 'E', frequency: 0.12702 },
    { letter: 'F', frequency: 0.02288 },
    { letter: 'G', frequency: 0.02015 },
    { letter: 'H', frequency: 0.06094 },
    { letter: 'I', frequency: 0.06966 },
    { letter: 'J', frequency: 0.00153 },
    { letter: 'K', frequency: 0.00772 },
    { letter: 'L', frequency: 0.04025 },
    { letter: 'M', frequency: 0.02406 },
    { letter: 'N', frequency: 0.06749 },
    { letter: 'O', frequency: 0.07507 },
    { letter: 'P', frequency: 0.01929 },
    { letter: 'Q', frequency: 0.00095 },
    { letter: 'R', frequency: 0.05987 },
    { letter: 'S', frequency: 0.06327 },
    { letter: 'T', frequency: 0.09056 },
    { letter: 'U', frequency: 0.02758 },
    { letter: 'V', frequency: 0.00978 },
    { letter: 'W', frequency: 0.0236 },
    { letter: 'X', frequency: 0.0015 },
    { letter: 'Y', frequency: 0.01974 },
    { letter: 'Z', frequency: 0.00074 },
  ],
  encode: { x: 'letter', y: 'frequency' },
})
//#endregion

//#region render
async function render(c) {
  const data = [
    { item: '事例一', count: 40, percent: 0.4 },
    { item: '事例二', count: 21, percent: 0.21 },
    { item: '事例三', count: 17, percent: 0.17 },
    { item: '事例四', count: 13, percent: 0.13 },
    { item: '事例五', count: 9, percent: 0.09 },
  ]

  await nextTick()
  const chartOptions = {
    autoFit: true,
  }

  // const c = new Chart(chartOptions)
  c.options(chartOptions)
  console.log('`dasf`', c)
  const coord = { type: 'theta', outerRadius: 0.8, innerRadius: 0.5 }

  c.coordinate(coord)

  const mark = c.interval()
  mark
    .data(data)
    .encode('y', 'count')
    .encode('color', 'item')
    .animate('update', { duration: 1000 })
    .tooltip(data => ({
      name: data.item,
      value: `${data.count}`,
    }))
    .transform({ type: 'stackY' })
    .animate('enter', { type: 'waveIn' })
    .legend('color', { position: 'bottom', layout: { justifyContent: 'center' } })

  mark.transform([{ type: 'stackY' }])
  mark.label({ position: 'spider', text: d => d.category })
  mark.label({ text: d => d.countByCategory, fontSize: 10, fontWeight: 'bold', fill: '#000' })
  // chart.coordinate({ type: 'theta', outerRadius: 0.8, innerRadius: 0.5 })
  //
  // chart
  //   .interval()
  //   .data(data)
  //   .transform({ type: 'stackY' })
  //   .encode('y', 'percent')
  //   .encode('color', 'item')
  //   .legend('color', { position: 'bottom', layout: { justifyContent: 'center' } })
  //   .label({
  //     position: 'outside',
  //     text: data => `${data.item}: ${data.percent * 100}%`,
  //   })
  //   .tooltip(data => ({
  //     name: data.item,
  //     value: `${data.percent * 100}%`,
  //   }))
  //
  // chart
  //   .text()
  //   .style('text', '主机')
  //   // Relative position
  //   .style('x', '50%')
  //   .style('y', '50%')
  //   .style('dy', -25)
  //   .style('fontSize', 34)
  //   .style('fill', '#8c8c8c')
  //   .style('textAlign', 'center')
  //
  // chart
  //   .text()
  //   .style('text', '200')
  //   // Relative position
  //   .style('x', '50%')
  //   .style('y', '50%')
  //   .style('dx', -25)
  //   .style('dy', 25)
  //   .style('fontSize', 44)
  //   .style('fill', '#8c8c8c')
  //   .style('textAlign', 'center')
  //
  // chart
  //   .text()
  //   .style('text', '台')
  //   // Relative position
  //   .style('x', '50%')
  //   .style('y', '50%')
  //   .style('dx', 35)
  //   .style('dy', 25)
  //   .style('fontSize', 34)
  //   .style('fill', '#8c8c8c')
  //   .style('textAlign', 'center')
}
//#endregion
// function render() {}
</script>
