<template>
  <Suspense>
    <RouterView />
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>
<script lang="ts" setup>
import { RouterView } from 'vue-router'
import { Suspense } from 'vue'
</script>
<style scoped>
</style>
