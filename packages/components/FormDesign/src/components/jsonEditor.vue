<!-- FormDesign的jsonEditor组件 -->
<template>
  <div ref="jsonCenter" />
</template>

<script lang="ts">
import JSONEditor from 'jsoneditor'
import { computed, defineComponent, inject, onMounted, ref, toRaw } from 'vue'
import { useFormDesignStore } from '../composables/useFormDesignStore'

export default defineComponent({
  emits: ['editor'],
  setup(props, { emit }) {
    const jsonCenter = ref()
    let jsonEditor
    const { formStore } = inject('control') || {}
    const formDesignStore = useFormDesignStore()
    const allmainList = computed(() => formStore?.get('allFormList'))
    const initFormToJson = (formlist) => {
      return formDesignStore.$Flex.initFormToJson(toRaw(formlist))
    }
    onMounted(() => {
      const result = initJsonCenter()
      emit('editor', result)
    })
    function initJsonCenter() {
      const jsonDom = jsonCenter.value
      if (jsonEditor) {
        jsonEditor?.set(initFormToJson(allmainList.value))
      }
      else {
        const options = {
          modes: ['text', 'code', 'view'],
          mode: 'code',
          search: false,
        }
        jsonEditor = new JSONEditor(jsonDom, options)
        jsonEditor?.set(initFormToJson(allmainList.value))
      }
      return jsonEditor
    }
    return {
      initJsonCenter,
      jsonCenter,
    }
  },
})
</script>
