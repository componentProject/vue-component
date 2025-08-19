<template>
  <div>
    <ElSelect v-model="language" placeholder="请选择">
      <ElOption label="JavaScript" value="js" />
      <ElOption label="TypeScript" value="ts" />
      <ElOption label="SQL" value="sql" />
    </ElSelect>
  </div>

  <div>
    <ElSelect v-model="theme" placeholder="请选择">
      <ElOption label="vs" value="vs" />
      <ElOption label="hc-black" value="hc-black" />
      <ElOption label="vs-dark" value="vs-dark" />
    </ElSelect>
  </div>
  <div>
    <ElInput v-model="code" rows="10" type="textarea" placeholder="请输入" />
  </div>
  <Editor v-model="code" auto-format :theme="theme" :language="language" @change="console.log" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElOption, ElSelect } from 'element-plus'
import Editor from './index.vue'

const theme = ref('vs')

// const language = ref('sql')
// const code = ref(`SELECT * FROM ord.ORD_MODEL_STRUCTURE ORDER BY CREATE_DATE`)
const language = ref('ts')
const code = ref(`import { Fragment } from 'vue'

function filterEmpty(children = []) {const res: any[] = [];children.forEach((child: any) => {
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
