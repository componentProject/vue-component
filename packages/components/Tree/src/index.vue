<template>
  <div class="wl-tree">
    <ElTreeV2
      :data="treeData"
      :value="props.rowField"
      :label="props.labelField"
      :children="props.childrenField"
      :height="height"
      :indent="indent"
      :expand-on-click-node="false"
      highlight-current
      @node-click="onRowClick"
      v-bind="$attrs"
    >
      <template #default="{ node, data }">
        <div class="wl-tree__row flex space-between items-center pr-8 w-full" style="padding-right: 8px">
          <div class="flex items-center flex-1-hidden">
            <ElIcon v-if="props.icon" class="wl-tree__icon">
              <component :is="props.icon(data)"/>
            </ElIcon>
            <ElIcon v-else-if="isLeaf(data) && props.childIcon" class="wl-tree__icon">
              <component :is="props.childIcon"/>
            </ElIcon>
            <ElIcon v-else-if="!isLeaf(data) && props.parentIcon" class="wl-tree__icon">
              <component :is="props.parentIcon"/>
            </ElIcon>

            <span class="ml-4" style="margin-left: 4px">
            <slot name="label" :node="node" :data="data">{{(data as any)[props.labelField] ?? '' }}</slot>
          </span>
          </div>

          <span
            class="wl-tree__buttons"
            :class="{
              'wl-tree__buttons--hover': props.showType === 'hover',
            }"
            v-show="props.showType !== 'click' || data[props.rowField] === activeNode?.[props.rowField]"
          >
            <template v-for="btn in getButtons(data)" :key="btn.type || btn.tooltip || (typeof btn.slot === 'string' ? btn.slot : '') || (typeof btn.icon === 'string' ? btn.icon : '') || 'btn'">
              <ElTooltip :disabled="!btn.tooltip" :content="btn.tooltip" placement="top">
                <slot v-if="typeof btn.slot === 'string' && btn.slot" :name="btn.slot as string" :data="data" :node="node" />
                <Render v-else-if="typeof btn.slot === 'function'" :render="() => (btn.slot as any)(data, node)" />
                <ElButton
                  v-else
                  link
                  size="small"
                  @click.stop="() => btn.event && btn.event(data, node)"
                >
                  <ElIcon>
                    <component :is="resolveButtonIcon(btn)" />
                  </ElIcon>
                </ElButton>
              </ElTooltip>
            </template>
          </span>
        </div>
      </template>
    </ElTreeV2>
  </div>

</template>

<script setup lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { ElTreeV2, ElButton, ElTooltip, ElIcon } from 'element-plus'
import type { TreeNodeData, TreeNode } from 'element-plus'
import type { Component as VueComponent } from 'vue'
import type { ButtonsItem, TreeProps } from './types'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

const Render = defineComponent<{ render: () => any }>({
  name: 'WlRender',
  props: { render: { type: Function as unknown as () => () => any, required: true } },
  setup: (props) => () => props.render(),
})

defineOptions({
  name: 'WlTree',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TreeProps>(), {
  childrenField: 'children',
  rowField: 'id',
  parentField: '',
  labelField: 'label',
  showType: 'default',
  indent: 16,
  height: 360,
})

const emit = defineEmits<{
  (e: 'node-click', data: TreeNodeData, node: TreeNode, e: MouseEvent): void
}>()

const isLeaf = (nodeData: Record<string, any>) => {
  const list = nodeData?.[props.childrenField] as any[] | undefined
  return !list || list.length === 0
}

function getButtons(nodeData: Record<string, any>): ButtonsItem[] {
  return props.buttons ? props.buttons(nodeData) || [] : []
}

const indent = props.indent
const height = props.height
const activeNode = ref<any | null>(null)

// 将扁平数据转换为树
const treeData = computed<any[]>(() => {
  const data = (props.data || []) as any[]
  // 当传入 rowField 和 parentField 时，覆盖 childrenField 行为
  if (props.rowField && props.parentField) {
    return buildTree(data, props.rowField, props.parentField, props.childrenField)
  }
  // 否则直接使用 childrenField 结构
  return data
})

function buildTree(list: any[], rowKey: string, parentKey: string, childrenKey: string) {
  const idToNodeMap = new Map<any, any>()
  const roots: any[] = []
  // 克隆并初始化 children
  for (const item of list) {
    const clone = { ...item }
    clone[childrenKey] = []
    idToNodeMap.set(clone[rowKey], clone)
  }
  for (const item of list) {
    const id = item[rowKey]
    const parentId = item[parentKey]
    const node = idToNodeMap.get(id)
    if (parentId == null || parentId === '' || !idToNodeMap.has(parentId)) {
      roots.push(node)
    } else {
      idToNodeMap.get(parentId)[childrenKey].push(node)
    }
  }
  return roots
}

function resolveButtonIcon(btn: ButtonsItem): VueComponent | string | undefined {
  if (btn.slot) return undefined
  if (btn.icon) return btn.icon
  switch (btn.type) {
    case 'add':
      return Plus
    case 'edit':
      return Edit
    case 'delete':
      return Delete
    default:
      return undefined
  }
}

function onRowClick(data: TreeNodeData, node: TreeNode, e: MouseEvent) {
  if (props.showType !== 'click') return
  activeNode.value = activeNode.value === data ? null : data
  emit('node-click', data, node, e)
}

// 占位，若后续扩展自定义插槽函数可复用
</script>

<style scoped lang="scss">
@forward '@moluoxixi/components/_assets/styles/tailwind.scss';
.wl-tree__buttons {
  :deep(.el-button){
    margin-left: 4px;
  }
}
.wl-tree__row {
  position: relative;
}
.wl-tree__buttons--hover {
  opacity: 0;
  transition: opacity .15s ease;
}
.wl-tree__row:hover .wl-tree__buttons--hover {
  opacity: 1;
}
</style>


