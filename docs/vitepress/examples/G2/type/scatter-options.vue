<template>
  <div class="container">
    <G2 :options="options" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const options = ref({
  type: 'point',
  autoFit: true,
  data: [
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 4 },
    { x: 4, y: 5 },
    { x: 5, y: 6 },
    { x: 6, y: 7 },
  ],
  encode: {
    x: 'x',
    y: 'y',
  },
  style: {
    fill: '#1890ff',
    r: 5,
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

