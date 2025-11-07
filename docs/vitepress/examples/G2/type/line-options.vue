<template>
  <div class="container">
    <G2 :options="options" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const options = ref({
  type: 'line',
  autoFit: true,
  data: [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
  ],
  encode: {
    x: 'year',
    y: 'value',
  },
  style: {
    stroke: '#1890ff',
    lineWidth: 2,
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

