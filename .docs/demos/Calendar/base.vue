<template>
<Calendar v-bind="config" />
</template>

<script setup lang="ts">
import Calendar from '@/components/Calendar/index.vue'
const config={
  locale: 'en-US',
}
</script>
