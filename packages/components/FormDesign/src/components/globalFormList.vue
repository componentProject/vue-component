<template>
  <div>
    <div
      v-for="(item, index) in globalFormLists"
      :key="index"
      class="form_tab3_list"
    >
      <component
        :is="item.ControlType"
        :item="item"
        :data="globalDatas"
        :control-items="globalFormLists"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue'
import type { Controls } from '../type'

export default defineComponent({
  setup() {
    const { formStore } = inject<Controls>('control') || {}
    const globalFormLists = computed(() => formStore?.get('globalFormList'))
    const globalDatas = computed(() => formStore?.get('globalDatas'))
    return {
      globalFormLists,
      globalDatas,
    }
  },
})
</script>
