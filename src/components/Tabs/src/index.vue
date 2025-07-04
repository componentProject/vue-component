<template>
  <div class="height-100">
    <el-tabs
      v-model="activeName"
      type="border-card"
      @tab-change="handleTabChange"
    >
      <template v-for="item in props.tabList">
        <el-tab-pane
          v-if="item.show ? item.show(item) : true"
          :key="item.id"
          style="height: 100%"
          :label="item.label"
          :name="item.id"
          :lazy="item.lazy"
        >
          <slot :name="item.slot || item.label" />
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  tabList: {
    type: Array<{
      id: string
      label: string
      slot?: string
      lazy?: boolean
      show?: (item: any) => boolean
    }>,
    default: () => [],
  },
})

const emits = defineEmits(['tabChange'])
const activeName = defineModel({ default: '1', type: String })
function handleTabChange(val: any) {
  emits('tabChange', val)
}
</script>
