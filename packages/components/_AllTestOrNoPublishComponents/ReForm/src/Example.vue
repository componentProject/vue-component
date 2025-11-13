<!-- _AllTestOrNoPublishComponents的示例文件 -->
<template>
  <ReForm :items="items" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ReForm from './index.vue'

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
