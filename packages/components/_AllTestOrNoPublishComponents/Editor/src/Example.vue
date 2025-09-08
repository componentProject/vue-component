<template>
  <div>
    <ElSelect v-model="language" style="width: 100px;margin-right: 8px" placeholder="请选择">
      <ElOption label="JavaScript" value="js" />
      <ElOption label="TypeScript" value="ts" />
      <ElOption label="SQL" value="sql" />
    </ElSelect>
    <ElSelect v-model="theme" style="width: 100px;margin-right: 8px" placeholder="请选择">
      <ElOption label="vs" value="vs" />
      <ElOption label="hc-black" value="hc-black" />
      <ElOption label="vs-dark" value="vs-dark" />
    </ElSelect>
    <ElCheckbox v-model="options.readOnly">
      是否只读
    </ElCheckbox>
  </div>

  <ElTabs>
    <ElTabPane label="单编辑器">
      <Editor
        v-model="code"
        :options="options"
        style="height: 360px; margin-top: 12px; display: block;"
        :theme="theme"
        :language="language"
      />
    </ElTabPane>
    <ElTabPane label="Diff 编辑器">
      <Editor
        v-model="modifiedCode"
        :original-value="originalCode"
        :options="options"
        :theme="theme"
        :language="language"
        style="height: 360px; margin-top: 12px; display: block;"
      />
    </ElTabPane>
  </ElTabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElOption, ElSelect } from 'element-plus'
import Editor from './index.vue'
import type { languageType, themeType } from './_types'

const options = ref({
  readOnly: true,
})
const theme = ref<themeType>('vs')

//#region sql
const language = ref<languageType>('sql')
const code = ref(`SELECT * FROM ord.ORD_MODEL_STRUCTURE ORDER BY CREATE_DATE`)
// Diff 示例
const originalCode = ref(`SELECT *
FROM ord.ORD_MODEL_STRUCTURE
ORDER BY CREATE_DATE`)
const modifiedCode = ref(`SELECT *
FROM ord.ORD_MODEL_STRUCTURE
WHERE CREATE_DATE >= DATE '2024-01-01'
ORDER BY CREATE_DATE DESC`)
//#endregion

// //#region ts
// const language = ref<languageType>('ts')
// const code = ref(`import { Fragment } from 'vue'
//
// function filterEmpty(children = []) {const res: any[] = [];children.forEach((child: any) => {
//     if (Array.isArray(child)) {
//       res.push(...child)
//     }
//     else if (child?.type === Fragment) {
//       res.push(...filterEmpty(child.children))
//     }
//     else {
//       res.push(child)
//     }
//   })
//   return res
// }`)
// //#endregion

// //#region js
// const language = ref<languageType>('js')
// const code = ref(`import { Fragment } from 'vue'
//
// function filterEmpty(children = []) {const res = [];children.forEach((child) => {
//     if (Array.isArray(child)) {
//       res.push(...child)
//     }
//     else if (child?.type === Fragment) {
//       res.push(...filterEmpty(child.children))
//     }
//     else {
//       res.push(child)
//     }
//   })
//   return res
// }`)
// //#endregion
</script>

<style scoped>

</style>
