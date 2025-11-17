<!-- ConfigForm组件主文件 -->
<template>
  <div class="starfish-dynamicform" :class="cssModules.root">
    <ElForm ref="ruleForm" :model="formResult" :rules="rules" label-width="120px" class="demo-ruleForm" :size="globalConfig.size || 'large'" :validate-on-rule-change="false">
      <template v-for="item in allFormList" :key="item.id">
        <ElFormItem v-if="!item.layout && item.show" :prop="item.data.fieldName">
          <component :is="getComponent(item.ControlType)" ref="controlObj" v-bind="globalConfig" :item="item" :data="formResult || '{}'" :drag="false" @change="handleControlChange" />
        </ElFormItem>
        <template v-else-if="item.show">
          <component :is="getComponent(item.ControlType)" ref="controlObj" v-bind="globalConfig" :item="item" :data="formResult || '{}'" :drag="false" @change="handleControlChange" />
        </template>
      </template>
    </ElForm>
  </div>
</template>

<script setup lang="ts">
import type { FormDesignStore } from '@moluoxixi/components/FormDesign/src/store'
import type { emitsType, propsType } from './_types'
import { FormDesignStoreKey } from '@moluoxixi/components/FormDesign/src/store'
import { ElForm, ElFormItem } from 'element-plus'
import { getCurrentInstance, inject, onMounted, ref, resolveComponent, toRaw } from 'vue'
// 直接从 main.ts 导入 formComponents，这样即使不调用 install 也能使用
import { formComponents } from './main'
import cssModules from './styles/modules/index.module.scss'

defineOptions({
  name: 'ConfigForm',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<propsType>(), {
  allFormList: () => [],
  formResult: () => ({}),
  globalConfig: () => ({}),
})

const emits = defineEmits<emitsType>()

const { proxy } = getCurrentInstance() as any
const rules: any = ref({})
const ruleForm = ref()
const controlObj = ref()

// 尝试从 Store 获取 $Flex（如果在 FormDesign 组件树内）
let $Flex: any = null
try {
  const store = inject<FormDesignStore>(FormDesignStoreKey, null)
  if (store) {
    $Flex = store.$Flex
  }
}
catch {
  // Store 不存在，$Flex 为 null
}

// 获取表单组件
function getComponent(controlType: string) {
  // 从 formComponents 中获取（从 main.ts 导入）
  // main.ts 通过 import.meta.glob 加载所有表单组件
  if (formComponents && formComponents[controlType]) {
    return formComponents[controlType]
  }
  // 如果找不到，尝试使用 resolveComponent（可能已全局注册）
  try {
    return resolveComponent(controlType)
  }
  catch (e) {
    console.warn(`ConfigForm: 无法找到组件 ${controlType}`, {
      availableComponents: formComponents ? Object.keys(formComponents) : [],
    })
    return null
  }
}

// 确保 formComponents 被正确导入（开发时检查）
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  if (!formComponents) {
    console.error('ConfigForm: formComponents 未能从 main.ts 正确导入')
  }
  else {
    console.log('ConfigForm: 从 main.ts 加载的表单组件:', Object.keys(formComponents))
  }
}

props.allFormList?.forEach((item: any) => {
  getRules(item)
})

function getFormListRules(rulesList: any[]) {
  const result: any[] = []
  if (Array.isArray(rulesList) && rulesList && rulesList.length > 0) {
    rulesList.forEach((item) => {
      if (item.type === 'enum') {
        // eslint-disable-next-line no-eval
        const func = eval(`(${item.value})`)
        result.push({
          validator: func,
          trigger: 'blur',
        })
      }
      else if (item.type === 'func') {
        // eslint-disable-next-line no-eval
        const func = eval(`(() => {${item.value.func}})`)
        result.push({
          validator: func,
          trigger: 'blur',
        })
      }
      else if (item.type === 'high') {
        if (item.value.ruleType === 5) {
          result.push({
            // eslint-disable-next-line no-eval
            validator: eval(item.value.validor),
            trigger: item.value.trigger,
          })
          return
        }
        result.push(item.value)
      }
    })
  }
  return result
}

function getRules(item: any) {
  if (!item.layout) {
    let rule: any[] = []
    if (item.data.required) {
      rule.push({
        required: true,
        message: `请输入${item.data.label}`,
        trigger: 'blur',
      })
    }
    if (typeof item.data.rule === 'string') {
      if ($Flex) {
        rule = rule.concat($Flex.tryParseJson(item.data.rule))
      }
    }
    else {
      rule = rule.concat(getFormListRules(item.data.rule))
    }
    // 特殊的jsoneditor表单要单独处理
    if (item.data.json && $Flex) {
      rule.push(...$Flex.getJsonValidate())
    }
    rules.value[item.data.fieldName] = rule
  }
  else if (item.layout) {
    if (item.ControlType === 'Grid') {
      item.data.columns.forEach((colItem: any) => {
        colItem.list.forEach((listItem: any) => {
          getRules(listItem)
        })
      })
    }
    else if (item.ControlType === 'TableLayout') {
      const trs = item.data.trs
      trs.forEach((trItem: any) => {
        trItem.tds.forEach((tdItem: any) => {
          tdItem.list.forEach((listItem: any) => {
            getRules(listItem)
          })
        })
      })
    }
    else if (item.ControlType === 'Collapse' || item.ControlType === 'Tabs') {
      const items = item.data.items
      items.forEach((colItem: any) => {
        colItem.list.forEach((listItem: any) => {
          getRules(listItem)
        })
      })
    }
  }
}

function handleControlChange() {
  const allFormLists: any = props.allFormList
  allFormLists.forEach((item: any) => {
    if (item.data.showRule === '{}') {
      item.show = true
    }
    else {
      try {
        if (Array.isArray(item.data.showRule)) {
          item.show = conditionChange(transformData(toRaw(item.data.showRule)))
        }
        else {
          item.show = conditionChange(toRaw(item.data.showRule))
        }
      }
      catch (e) {
        item.show = true
      }
    }
  })
  executeFunc('updated')
  emits('change')
}

function transformData(data: any) {
  /** 普通模式转为高级模式的数据结构,方便复用 */
  const r: any = []
  data.forEach((item: any) => {
    r.push({
      type: 'andgroup',
      result: item.map((d: any) => {
        return {
          type: 'data',
          data: d,
        }
      }),
    })
  })
  return {
    type: 'orgroup',
    result: r,
  }
}

function conditionChange(data: any) {
  if (data.type === 'andgroup') {
    const result = data.result
      .map((item: any) => {
        return conditionChange(item)
      })
      .find((item: boolean) => {
        return item === false
      })
    return result === undefined ? true : result
  }
  else if (data.type === 'orgroup') {
    const result = data.result
      .map((item: any) => {
        return conditionChange(item)
      })
      .find((item: boolean) => {
        return item === true
      })
    return result === undefined ? false : result
  }
  else if (data.type === 'data') {
    const result = data.data
    const formResults: any = props.formResult
    const value = formResults[result.field]
    let isShow = false
    switch (result.logic) {
      case '=':
        isShow = value === result.value
        break
      case '!=':
        isShow = value !== result.value
        break
      case 'in':
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (result.value.includes(item)) {
              isShow = result.value.includes(item)
              return item
            }
          })
        }
        else {
          isShow = result.value.includes(value)
        }
        break
      case 'not in':
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (!result.value.includes(item)) {
              isShow = !result.value.includes(item)
              return item
            }
          })
        }
        else {
          isShow = !result.value.includes(value)
        }
        break
    }
    return isShow
  }
}

function reset() {
  ruleForm.value?.resetFields()
}

function getValidate() {
  return new Promise((resolve) => {
    ruleForm.value?.validate((valide: boolean) => {
      resolve(valide)
    })
  })
}

onMounted(() => {
  handleControlChange()
  executeFunc('mounted')
})

function executeFunc(funcName: string) {
  const mountedAction = props.globalConfig.action?.forEach((item: any) => {
    if (item.type === funcName) {
      return item
    }
  })
  if (mountedAction && proxy) {
    // eslint-disable-next-line no-eval
    eval(`(function(){${mountedAction.funcStr}}).call(proxy)`)
  }
}

// 暴露方法供外部调用
defineExpose({
  reset,
  getValidate,
})
</script>

<style scoped>
.starfish-dynamicform {
  width: 100%;
}
</style>
