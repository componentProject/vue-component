<template>
  <ElSelect v-model="language" placeholder="请选择">
    <ElOption label="JavaScript" value="js" />
    <ElOption label="TypeScript" value="ts" />
    <ElOption label="SQL" value="sql" />
  </ElSelect>
  <Editor v-model="code" :language="language" @change="console.log" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElOption, ElSelect } from 'element-plus'
import Editor from './index.vue'

// const language = ref<'js' | 'sql'>('sql')
// const code = ref(`SELECT * FROM ord.ORD_MODEL_STRUCTURE ORDER BY CREATE_DATE`)
const language = ref('ts')
const code = ref(`import { Fragment } from 'vue'
function filterEmpty(children = []) {
  const res: any[] = []
  children.forEach((child: any) => {
    if (Array.isArray(child)) {
      res.push(...child)
    }
    else if (child?.type === Fragment) {
      res.push(...filterEmpty(child.children))
    }
    else {
      res.push(child)
    }
  })
  return res
}`)
</script>

<style scoped>

</style>
