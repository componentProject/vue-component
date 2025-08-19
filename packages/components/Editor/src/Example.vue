<template>
  <Editor v-model="code" :language="language" @change="console.log" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Editor from './index.vue'

const code = ref(`SELECT * FROM ord.ORD_MODEL_STRUCTURE ORDER BY CREATE_DATE`)
const language = ref<'js' | 'sql'>('sql')
// const language = ref<'js' | 'sql'>('js')
</script>

<style scoped>

</style>
