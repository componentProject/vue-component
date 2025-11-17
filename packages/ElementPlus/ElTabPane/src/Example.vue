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
import ElTabs from '../../ElTabs/src/index.vue'
import ElTabPane from './index.vue'

const activeName = ref('first')
</script>
