<template>
  <TsFooter v-if="items.length" class="his-footer" :items="items" />
</template>

<script setup lang="ts">
import TsFooter from '@moluoxixi/components/TsFooter'
import { getQueryMedicaIInsuranceInfoApi } from '@moluoxixi/utils/_api'
import { onMounted, ref } from 'vue'

defineOptions({ name: 'HisFooter' })

const props = defineProps({
  token: {
    type: String,
    default: null,
  },
  addSign: {
    type: Function,
    default: () => {},
  },
  paramsObj: {
    type: Object,
    default: () => ({
      medicalInsuranceCode: '国家医疗机构个人编码',
      paltOrgCode: '国家定点医疗机构编码',
    }),
  },
})

const items = ref<any[]>([])

async function getQueryMedicaIInsuranceInfo() {
  const res = await getQueryMedicaIInsuranceInfoApi({
    headers: {
      Token: props.token,
    },
  }, props.addSign)
  if (res) {
    items.value = []
    for (const key in props.paramsObj) {
      if (res[key]) {
        items.value.push({ text: `${props.paramsObj[key]}: ${res[key]}` })
      }
    }
  }
}
onMounted(() => {
  if (props.token) {
    getQueryMedicaIInsuranceInfo()
  }
})

defineExpose({
  items,
})
</script>

<style scoped lang="scss">
.his-footer {
  margin-top: 10px;
}
</style>
