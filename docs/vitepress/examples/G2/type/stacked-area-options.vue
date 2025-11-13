<!-- stacked-area-options.vue文件 -->
<template>
  <div class="container">
    <G2 :options="options" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const options = ref({
  type: 'area',
  autoFit: true,
  data: [
    { year: '1991', value: 3, category: 'A' },
    { year: '1992', value: 4, category: 'A' },
    { year: '1993', value: 3.5, category: 'A' },
    { year: '1991', value: 2, category: 'B' },
    { year: '1992', value: 3, category: 'B' },
    { year: '1993', value: 2.5, category: 'B' },
  ],
  encode: {
    x: 'year',
    y: 'value',
    color: 'category',
  },
  transform: [
    {
      type: 'stackY',
    },
  ],
  style: {
    fillOpacity: 0.6,
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
