<template>
  <ReForm :items="items" />
</template>

<script setup lang="ts">
import ReForm from './index.vue'
import { ref } from 'vue'

const items = ref([
  {
    label: '输入框',
    component: 'TsSelect',
    props: {
      clearable: true,
      disabled: false,
    },
  },
])
</script>

<style scoped>

</style>
