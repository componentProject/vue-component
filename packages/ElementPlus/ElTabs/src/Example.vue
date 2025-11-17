<template>
  <ElTabs v-model="activeName">
    <ElTabPane label="Tab 1" name="first">
      Tab 1 内容
    </ElTabPane>
    <ElTabPane label="Tab 2" name="second">
      Tab 2 内容
    </ElTabPane>
  </ElTabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ElTabPane from '../../ElTabPane/src/index.vue'
import ElTabs from './index.vue'

const activeName = ref('first')
</script>
