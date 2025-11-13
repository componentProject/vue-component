<template>
  <div ref="treeContainer" class="wl-tree h-full">
    <ElTreeV2
      ref="treeRef"
      :data="treeData"
      :indent="indent"
      :height="height"
      :expand-on-click-node="false"
      highlight-current
      :node-key="props.rowField"
      :props="treeProps"
      v-bind="$attrs"
      :empty-text="emptyText"
      @node-click="onRowClick"
    >
      <template #default="{ node, data }">
        <slot name="default" v-bind="{ node, data }">
          <div
            class="wl-tree__row flex space-between items-center pr-8 h-full flex-1!"
            style="padding-right: 8px"
          >
            <template v-if="props.showLine">
              <template v-for="item in node.level - 1" :key="item">
                <div
                  v-if="item === 1" class="wl-tree_line" :style="{
                    width: node.isLeaf ? `${props.indent * 2 - 4}px` : `${props.indent - 2}px`,
                    left: `${-props.indent * 2 + 3.4}px`,
                  }"
                />
                <div
                  v-else-if="leftLineShow(item, node)" class="wl-tree_left_line" :style="{
                    left: `${-props.indent * (item + 1) + 3.4}px`,
                  }"
                />
              </template>
            </template>

            <div :class="{ 'flex-1-hidden': !props.showRowLine }" class="flex items-center">
              <ElIcon v-if="props.icon" class="wl-tree__icon">
                <component :is="props.icon(data)" />
              </ElIcon>
              <ElIcon v-else-if="isLeaf(data) && props.childIcon" class="wl-tree__icon">
                <component :is="props.childIcon" />
              </ElIcon>
              <ElIcon v-else-if="!isLeaf(data) && props.parentIcon" class="wl-tree__icon">
                <component :is="props.parentIcon" />
              </ElIcon>

              <span class="ml-4" style="margin-left: 4px">
                <slot name="label" :node="node" :data="data">{{ data[props.labelField] ?? '' }}</slot>
              </span>
            </div>
            <div v-if="props.showRowLine" class="flex-1-hidden wl-right_line" />
            <span
              v-show="props.showType !== 'click' || data[props.rowField] === activeNode?.[props.rowField]"
              class="wl-tree__buttons h-full"
              :class="{
                'wl-tree__buttons--hover': props.showType === 'hover',
              }"
            >
              <Buttons size="small" link :buttons="getButtons(data)" :resolve-button-icon="resolveButtonIcon" />
            </span>
          </div>
        </slot>
      </template>
    </ElTreeV2>
  </div>
</template>

<script setup lang="ts">
import type { TreeNode, TreeNodeData } from 'element-plus'
import type { Component as VueComponent } from 'vue'
import type { ButtonsItem, emitsType, propsType, slotsType } from './_types'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { Buttons } from '@moluoxixi/components/_utilComponents'
import { ElIcon, ElTreeV2 } from 'element-plus'
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'

defineOptions({
  name: 'Tree',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<propsType>(), {
  childrenField: 'children',
  rowField: 'id',
  parentField: '',
  labelField: 'label',
  showType: 'default',
  indent: 16,
  showLine: false,
  showRowLine: false,
  emptyText: '暂无数据',
  expandAllOnClickNode: false,
})

const emit = defineEmits<emitsType>()

// 获取插槽
const slots = defineSlots<slotsType>()

const treeProps = computed(() => {
  const { class: _classNames, ...rest } = props.props || {}
  const classNames = typeof _classNames === 'function' ? _classNames : () => _classNames
  return {
    class: (data: TreeNodeData) => {
      const classNameResult = classNames(data)
      return {
        ...treeClass(data),
        ...(typeof classNameResult === 'object' && classNameResult !== null ? classNameResult : {}),
      }
    },
    label: props.labelField,
    children: props.childrenField,
    value: props.rowField,
    ...rest,
  }
})

//#region 动态高度计算 - 使用 ResizeObserver
const height = ref()
const treeContainer = useTemplateRef('treeContainer')
let resizeObserver: ResizeObserver | null = null

function updateHeight() {
  nextTick(() => {
    if (treeContainer.value) {
      height.value = Math.ceil(treeContainer.value.getBoundingClientRect().height)
    }
  })
}

onMounted(() => {
  updateHeight()

  // 使用 ResizeObserver 监听容器尺寸变化
  if (treeContainer.value) {
    resizeObserver = new ResizeObserver(() => {
      updateHeight()
    })
    resizeObserver.observe(treeContainer.value)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
//#endregion

function isLeaf(nodeData: Record<string, any>) {
  const list = nodeData?.[props.childrenField] as any[] | undefined
  return !list || list.length === 0
}

function treeClass(data: TreeNodeData) {
  return {
    'is-cascade-highlight': isHighlighted(data),
    'is-cascade': props.levelSelect,
  }
}

function getButtons(nodeData: Record<string, any>): ButtonsItem[] {
  return props.buttons ? props.buttons(nodeData) || [] : []
}

const indent = props.indent
const activeNode = ref<any | null>(null)
const treeRef = useTemplateRef('treeRef')

const idMaps = computed(() => {
  const idToNodeMap = new Map<any, any>()
  const idToParentIdMap = new Map<any, any>()
  const childrenKey = props.childrenField
  const idKey = props.rowField
  const traverse = (nodes: any[], parentId: any | null) => {
    for (const n of nodes || []) {
      const id = (n as any)?.[idKey]
      idToNodeMap.set(id, n)
      if (parentId !== null && parentId !== undefined)
        idToParentIdMap.set(id, parentId)
      const children = (n as any)?.[childrenKey] as any[] | undefined
      if (children && children.length)
        traverse(children, id)
    }
  }
  traverse(treeData.value || [], null)
  return { idToNodeMap, idToParentIdMap }
})
function leftLineShow(item: number, node: TreeNode & { parent: any }) {
  if (item === 1) {
    return node.parent[props.childrenField].findIndex(i => i === node) < node.parent[props.childrenField].length - 1
  }
  else {
    return leftLineShow(item - 1, node.parent)
  }
}

function clearTreeCurrent() {
  const inst: any = treeRef.value
  if (!inst)
    return
  inst.setCurrentKey(null)
}

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
    }
    else {
      idToNodeMap.get(parentId)[childrenKey].push(node)
    }
  }
  return roots
}

function resolveButtonIcon(btn: ButtonsItem): VueComponent | string | undefined {
  if (btn.slot)
    return undefined
  if (btn.icon)
    return btn.icon
  switch (btn.btnType) {
    case 'add':
      console.log('add', Plus)
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
  // 级联选择逻辑
  if (props.levelSelect) {
    toggleLevelSelect(data)
  }

  // 按钮显示交互：仅在 showType=click 下处理
  if (props.showType === 'click') {
    activeNode.value = activeNode.value === data ? null : data
  }

  if (props.expandAllOnClickNode)
    toggleExpand(data, node)

  emit('nodeClick', data, node, e)
}

function getDescendantIds(id: any): any[] {
  const result: any[] = []
  const { idToNodeMap } = idMaps.value
  const childrenKey = props.childrenField
  const stack: any[] = []
  const start = idToNodeMap.get(id)
  if (!start)
    return result
  stack.push(start)
  while (stack.length) {
    const node = stack.pop()
    const nid = node?.[props.rowField]
    if (nid !== id)
      result.push(nid)
    const children = node?.[childrenKey] as any[] | undefined
    if (children && children.length) {
      for (let i = children.length - 1; i >= 0; i--) stack.push(children[i])
    }
  }
  return result
}
//#region 级联高亮
const highlightedKeySet = ref<Set<any>>(new Set())
function isHighlighted(row: any) {
  const idKey = props.rowField
  return highlightedKeySet.value.has((row as any)?.[idKey])
}

function hasAncestorHighlighted(id: any): boolean {
  const { idToParentIdMap } = idMaps.value
  let pid = idToParentIdMap.get(id)
  while (pid !== undefined && pid !== null) {
    if (highlightedKeySet.value.has(pid))
      return true
    pid = idToParentIdMap.get(pid)
  }
  return false
}

function emitChange() {
  const { idToNodeMap } = idMaps.value
  const rows: any[] = []
  highlightedKeySet.value.forEach((k) => {
    const n = idToNodeMap.get(k)
    if (n)
      rows.push(n)
  })
  emit('change', rows)
}
function toggleLevelSelect(data: TreeNodeData) {
  const id = (data as any)?.[props.rowField]
  const already = highlightedKeySet.value.has(id)
  const ancestorHighlighted = hasAncestorHighlighted(id)
  if (!already) {
    // 新点击：高亮自身与所有子孙
    highlightedKeySet.value = new Set<any>([id, ...getDescendantIds(id)])
  }
  else {
    if (ancestorHighlighted) {
      // 祖先已高亮：只保留当前节点及其子孙
      highlightedKeySet.value = new Set<any>([id, ...getDescendantIds(id)])
    }
    else {
      // 否则取消所有高亮并取消树选中
      highlightedKeySet.value = new Set<any>()
      clearTreeCurrent()
    }
  }
  emitChange()
}
//#endregion

//#region 跨级选择
function getNodeKeys(data?: TreeNodeData) {
  if (!data) {
    return new Set<any>(treeData.value.reduce((p, item) => p.concat([item[props.rowField], ...getDescendantIds(item[props.rowField])]), []))
  }
  else {
    return new Set<any>([data[props.rowField], ...getDescendantIds(data[props.rowField])])
  }
}
function toggleExpand(data?: TreeNodeData, node?: TreeNode) {
  const nodeKeys = getNodeKeys(data)
  let expanded
  if (!node) {
    expanded = treeData.value.some(item => treeRef.value?.getNode(item[props.rowField]).expanded)
  }
  else {
    expanded = node.expanded
  }
  if (!expanded) {
    treeRef.value?.setExpandedKeys(Array.from(nodeKeys))
  }
  else {
    nodeKeys.forEach((nodeKey) => {
      treeRef.value?.collapseNode(treeRef.value?.getNode(nodeKey))
    })
  }
}
onMounted(() => {
  if (props.defaultExpandAll) {
    toggleExpand()
  }
})
//#endregion

defineExpose({
  getTree() {
    return treeRef.value
  },
  toggleExpand,
  reload: updateHeight,
})
</script>

<style scoped lang="scss">
.wl-tree {
  :deep(.el-tree) {
    .el-icon {
      position: relative;
      z-index: 1;
    }

    .is-cascade {
      .el-tree-node__content {
        background-color: unset;
      }
    }
    .is-cascade-highlight {
      background-color: var(--el-color-primary-light-9);
    }
  }

  .wl-tree__row {
    position: relative;

    .wl-tree__buttons {
      :deep(.el-button) {
        margin-left: 4px;
      }

      &.wl-tree__buttons--hover {
        opacity: 0;
        transition: opacity 0.15s ease;
      }
    }

    .wl-tree_line {
      position: absolute;
      height: 100%;
      top: -50%;
      border-bottom: 1px dashed #dddddd;
      border-left: 1px dashed #dddddd;
    }

    .wl-tree_left_line {
      position: absolute;
      height: 100%;
      top: -50%;
      border-left: 1px dashed #dddddd;
    }
    .wl-right_line {
      border-top: 1px dashed #dddddd;
    }

    &:hover .wl-tree__buttons--hover {
      opacity: 1;
    }
  }
}
</style>
