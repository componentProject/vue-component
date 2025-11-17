<template>
  <ElInput v-model="value" placeholder="请输入内容" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ElInput from './index.vue'

const value = ref('')
</script>
