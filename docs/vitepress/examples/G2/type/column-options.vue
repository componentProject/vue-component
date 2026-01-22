<template>
  <div class="container">
    <G2 :options="options" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const options = ref({
  type: 'interval',
  autoFit: true,
  data: [
    { letter: 'A', frequency: 0.08167 },
    { letter: 'B', frequency: 0.01492 },
    { letter: 'C', frequency: 0.02782 },
    { letter: 'D', frequency: 0.04253 },
    { letter: 'E', frequency: 0.12702 },
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
