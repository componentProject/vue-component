<template>
  <div>
    <Codemirror
      v-model="internalValue"
      placeholder="json导入"
      mode="text/json"
      :style="{ height: '400px' }"
      :extensions="extensions"
      @input="onUpdateValue($event.target.innerText)"
    />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { json } from '@codemirror/lang-json'
import { Codemirror } from 'vue-codemirror'

export default defineComponent({
  components: {
    Codemirror,
  },
  props: {
    value: String, // 接收外部传递的值
  },
  emits: ['update:value'], // 定义emit事件名称
  setup(props, { attrs, emit }) {
    const extensions = [json()]
    const internalValue = ref(props.value) // 内部状态变量

    function updateInternalValue(newVal) {
      internalValue.value = newVal

      if (attrs.onUpdate) {
        attrs.onUpdate(newVal) // 调用外部传递的onUpdate函数
      }
      else {
        emit('update:value', newVal) // 或者直接触发emit事件
      }
    }
    return {
      extensions,
      internalValue,
      onUpdateValue: updateInternalValue,
    }
  },
})
</script>
