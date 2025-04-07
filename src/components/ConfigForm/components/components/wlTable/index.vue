<template>
  <div
    v-if="show"
    class="wflex wflex-col wlTable"
    :class="{ tableExpandContainer: config.isExpand }"
  >
    <el-table class="flex-1" :data="model[prop]" v-bind="Options" v-on="Event" height="100%" border>
      <template #default>
        <wl-table-column
          v-bind="column"
          v-for="(column, index) in columns"
          :column="column"
          :key="index"
        >
          <template v-if="slots.default" #default="scope">
            <slot name="default" v-bind="scope"></slot>
          </template>
          <!-- append 插入至表格最后一行之后的内容，如果需要对表格的内容进行无限滚动操作，可能需要用到这个 slot。若表格有合计行，该 slot 会位于合计行之上。-->
          <template v-if="slots.append" #append>
            <slot name="append"></slot>
          </template>
        </wl-table-column>
      </template>
    </el-table>
    <div v-if="pageConfig" style="align-self: flex-end">
      <el-pagination
        v-bind="pageConfig"
        @size-change="sizeChange"
        @current-change="currentChange"
        @prev-click="currentChange"
        @next-click="currentChange"
        layout="prev, pager, next, jumper,sizes,total"
        :page-sizes="pageConfig.pageSizes || [10, 20, 50, 100]"
        :currentPage="pageConfig.currentPage || pageConfig.pageNo"
        :total="pageConfig.total || model[prop].length"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onBeforeMount } from 'vue'
import { isType } from '../../utils'
import components from './components'

const props = withDefaults(
  defineProps<{
    prop: string
    slots: Record<string, any>
    model: Record<string, any>
    config: Record<string, any>
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
const columns = ref([])
const pageConfig = ref({})

onBeforeMount(() => {
  const { model, prop } = props
  if (!model[prop]) {
    console.error('表格数据不能为空', prop, model)
  }
})
watch(
  () => props.config,
  (v) => {
    const { show: showVal, event, columns: columnsVal = [], ...rest } = v
    if (isType(showVal, 'boolean')) {
      show.value = !!showVal
    }
    columns.value = columnsVal
    Options.value = rest
    Event.value = event || {}
    pageConfig.value = v.pageConfig || {}
  },
  { immediate: true, deep: true },
)

const sizeChange = (pageSize) => {
  emit('change', { ...pageConfig.value, pageSize })
}

const currentChange = (pageNo) => {
  emit('change', { ...pageConfig.value, pageNo })
}
</script>

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
