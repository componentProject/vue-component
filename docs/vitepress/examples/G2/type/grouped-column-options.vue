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
    { category: 'A', value: 10, group: 'G1' },
    { category: 'B', value: 20, group: 'G1' },
    { category: 'C', value: 30, group: 'G1' },
    { category: 'A', value: 15, group: 'G2' },
    { category: 'B', value: 25, group: 'G2' },
    { category: 'C', value: 35, group: 'G2' },
  ],
  encode: {
    x: 'category',
    y: 'value',
    color: 'group',
  },
  transform: [
    {
      type: 'dodgeX',
    },
  ],
})
</script>

<style scoped>
.container {
  width: 100%;
  height: 400px;
  background-color: #fff;
}
</style>

