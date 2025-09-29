<template>
  <TsFooter :items="items" />
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
  paramsObj: {
    type: Object,
    default: () => ({
      medicalInsuranceCode: '员工医保编码',
      paltOrgCode: '机构医保编码',
    }),
  },
})

const items = ref<any[]>([])

async function getQueryMedicaIInsuranceInfo() {
  const res = await getQueryMedicaIInsuranceInfoApi({
    headers: {
      Token: props.token,
    },
  })
  if (res) {
    items.value = []
    for (const key in props.paramsObj) {
      if (res[key]) {
        items.value.push({ text: `${props.paramsObj[key]}:${res[key]}` })
      }
    }
  }
}

onMounted(() => {
  if (props.token) {
    getQueryMedicaIInsuranceInfo()
  }
})
</script>
