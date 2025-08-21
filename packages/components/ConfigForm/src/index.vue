<template>
  <FormProvider :form="form">
    <SchemaField :schema="schema">
      <slot/>
    </SchemaField>
  </FormProvider>
</template>

<script setup lang="ts">
import type {ISchema} from '@formily/json-schema'
import {createForm} from '@formily/core'
import {createSchemaField, FormProvider} from '@formily/vue'
import * as ElementPlusComponents from '@moluoxixi/element'
import {watch} from 'vue'

defineOptions({name: 'ConfigForm'})

// props
const props = withDefaults(defineProps<{
  modelValue?: Record<string, any>
  schema: ISchema
  disabled?: boolean
}>(), {
  modelValue: () => ({}),
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: Record<string, any>): void
  (e: 'submit', v: Record<string, any>): void
}>()

// 创建 formily 表单实例
const form = createForm({
  values: props.modelValue,
  disabled: props.disabled,
})

// 同步外部 v-model 到表单
watch(() => props.modelValue, (v) => {
  form.setValues(v || {})
}, {deep: true})


const {SchemaField} = createSchemaField({
  components: {
    ...ElementPlusComponents
  },
})

function submit() {
  form.submit()
  emit('submit', form.values)
}

defineExpose({submit, form})
</script>

<style scoped>
</style>


