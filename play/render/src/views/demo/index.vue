<template>
  <div @click="throwError">
    测试sentry报错，点我
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: '示例sentry报错收集' })
function throwError() {
  throw new Error('测试sentry报错，点我')
}
</script>

<style scoped lang="scss"></style>
