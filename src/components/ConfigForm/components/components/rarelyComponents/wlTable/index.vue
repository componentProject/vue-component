<script setup lang="ts">
import type { configType, FormModelProps } from '@/components/ConfigForm/types'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { isType } from '@/components/ConfigForm/utils'

const props = withDefaults(
  defineProps<{
    prop: string
    slots: Record<string, any>
    model: FormModelProps
    config: configType
  }>(),
  {
    prop: '',
    slots: () => ({}),
    model: () => ({}),
    config: () => ({}),
  },
)

const emit = defineEmits(['change', 'update:model'])

const show = ref(true)
const Event = ref({})
const Options = ref({})
const columns = ref<Array<Record<string, any>>>([])
const pageConfig = ref<{
  pageSizes?: number[]
  currentPage?: number
  pageNo?: number
  total?: number
}>({})

const computedModel = computed({
  get: () => props.model[props.prop],
  set: (val) => {
    emit('update:model', val)
  },
})

onBeforeMount(() => {
  const { model, prop } = props
  if (!model?.[prop]) {
    console.error('表格数据不能为空', prop, model)
  }
})

watch(
  () => props.config,
  (v) => {
    const { show: showVal, event, columns: cols = [], pageConfig: pageConfigVal = {}, ...rest } = v
    if (isType(showVal, 'boolean')) {
      show.value = !!showVal
    }
    Options.value = rest
    Event.value = event || {}
    columns.value = cols
    pageConfig.value = pageConfigVal
  },
  { immediate: true, deep: true },
)

function sizeChange(pageSize: number) {
  emit('change', { ...pageConfig.value, pageSize })
}

function currentChange(pageNo: number) {
  emit('change', { ...pageConfig.value, pageNo })
}
</script>

<template>
  <div
    v-if="show"
    class="wflex wflex-col wlTable"
    :class="{ tableExpandContainer: config?.isExpand }"
  >
    <el-table v-model="computedModel" v-bind="Options" height="100%" border v-on="Event">
      <template #default>
        <el-table-column v-for="(col, index) in columns" :key="index" v-bind="col">
          <template v-if="slots.default" #default="scope">
            <slot name="default" v-bind="scope" />
          </template>
          <!-- append 插入至表格最后一行之后的内容，如果需要对表格的内容进行无限滚动操作，可能需要用到这个 slot。若表格有合计行，该 slot 会位于合计行之上。 -->
          <template v-if="slots.append" #append>
            <slot name="append" />
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div v-if="pageConfig" style="align-self: flex-end">
      <el-pagination
        v-bind="pageConfig"
        layout="prev, pager, next, jumper,sizes,total"
        :page-sizes="pageConfig?.pageSizes || [10, 20, 50, 100]"
        :current-page="pageConfig?.currentPage || pageConfig?.pageNo"
        :total="pageConfig?.total || computedModel.length"
        @size-change="sizeChange"
        @current-change="currentChange"
        @prev-click="currentChange"
        @next-click="currentChange"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.tableExpandContainer {
  margin: 5px 5px 5px 45px;
}

.wlTable {
  height: 100%;
  width: 100%;

  :deep(.el-table) {
    .row-expand-cover {
      .el-table__expand-column .el-icon {
        display: none !important;
      }
    }
  }
}
</style>
