<template>
  <TsFooter />
</template>

<script setup lang="ts">
import TsFooter from '@moluoxixi/components/TsFooter'
import type { propsType } from './_types'

defineOptions({ name: 'HisFooter' })

const props = withDefaults(defineProps<propsType>(), {

})
</script>
