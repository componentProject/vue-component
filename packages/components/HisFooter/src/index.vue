<template>
  <TsFooter v-if="items.length" :items="items" />
</template>

<script setup lang="ts">
import { getQueryMedicaIInsuranceInfoApi } from '@moluoxixi/utils/_api'
import { onMounted, ref } from 'vue'
import type { propsType } from './_types'

defineOptions({ name: 'HisFooter' })

const props = withDefaults(defineProps<propsType>(), {
  token: '',
  paramsObj: () => ({
    medicalInsuranceCode: '国家医疗机构个人编码',
    paltOrgCode: '国家定点医疗机构编码',
  }),
  addSign: () => {},
})

const items = ref<any[]>([])

async function getMedicalInsuranceInfo() {
  try {
    // 获取医保信息数据
    const res = await getQueryMedicaIInsuranceInfoApi({
      headers: {
        Token: props.token,
      },
    }, props.addSign)
    // 清空现有数据
    items.value = []
    // 检查响应和参数字典是否有效
    if (!res || typeof res !== 'object' || !props.paramsObj || typeof props.paramsObj !== 'object') {
      return
    }
    items.value = Object.keys(props.paramsObj)
      .filter(key => Reflect.has(res, key))
      .map((key) => {
        // 格式化显示文本，处理空值情况
        const value = res[key] ?? '未维护'
        return { text: `${props.paramsObj[key]}: ${value}` }
      })
  }
  catch (error) {
    console.error('获取医保信息失败:', error)
    // 可以根据需要添加错误提示逻辑
  }
}
onMounted(() => {
  if (props.token) {
    getMedicalInsuranceInfo()
  }
})

defineExpose({
  items,
})
</script>

<style scoped lang="scss"></style>
