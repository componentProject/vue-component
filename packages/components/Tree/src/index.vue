<template>
  <div class="wl-tree">
    <ElTreeV2
      ref="treeRef"
      :data="treeData"
      :height="height"
      :indent="indent"
      :expand-on-click-node="false"
      highlight-current
      @node-click="onRowClick"
      :props="{
        class: treeClass,
        label: props.labelField,
        children: props.childrenField,
        value: props.rowField,
      }"
      v-bind="$attrs"
    >
      <template #default="{ node, data }">
        <slot name="default" v-bind="{ node, data }">
          <div
            class="wl-tree__row flex space-between items-center pr-8 h-full flex-1!"
            style="padding-right: 8px"
          >
            <template v-if="props.showLine" v-for="item in node.level -1" :key="item">
              <div v-if="item === 1" class="wl-tree_line" :style="{
              width: node.isLeaf?`${props.indent * 2 - 4}px` : `${props.indent - 2}px`,
              left:`${-props.indent * 2 + 2 }px`,
            }"/>
              <div v-else-if="leftLineShow(item,node)" class="wl-tree_left_line" :style="{
              left:`${-props.indent * (item + 1) + 2}px`
            }"/>
            </template>
            <div :class="{ 'flex-1-hidden': !props.showRowLine }" class="flex items-center">
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
            <div v-if="props.showRowLine" class="flex-1-hidden wl-right_line" />
            <span
              class="wl-tree__buttons h-full"
              :class="{
              'wl-tree__buttons--hover': props.showType === 'hover',
            }"
              v-show="props.showType !== 'click' || data[props.rowField] === activeNode?.[props.rowField]"
            >
              <template v-for="btn in getButtons(data)"
                        :key="btn.type || btn.tooltip || (typeof btn.slot === 'string' ? btn.slot : '') || (typeof btn.icon === 'string' ? btn.icon : '') || 'btn'">
                <ElTooltip :disabled="!btn.tooltip" :content="btn.tooltip" placement="top">
                  <slot v-if="typeof btn.slot === 'string' && btn.slot" :name="btn.slot as string"
                        :data="data" :node="node"/>
                  <Render v-else-if="typeof btn.slot === 'function'"
                          :render="() => (btn.slot as any)(data, node)"/>
                  <ElButton
                    v-else
                    link
                    size="small"
                    @click.stop="() => btn.event && btn.event(data, node)"
                  >
                    <ElIcon>
                      <component :is="resolveButtonIcon(btn)"/>
                    </ElIcon>
                  </ElButton>
                </ElTooltip>
              </template>
          </span>
          </div>
        </slot>
      </template>
    </ElTreeV2>
  </div>

</template>

<script setup lang="ts">
import {Component as VueComponent, useTemplateRef} from 'vue'
import {computed, defineComponent, ref} from 'vue'
import type {TreeNode, TreeNodeData} from 'element-plus'
import {ElButton, ElIcon, ElTooltip, ElTreeV2} from 'element-plus'
import type {ButtonsItem, TreeProps} from './types'
import {Delete, Edit, Plus} from '@element-plus/icons-vue'

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
  showLine: false,
  showRowLine: false
})

const emit = defineEmits<{
  (event: 'node-click', data: TreeNodeData, node: TreeNode, evt: MouseEvent): void
  (event: 'change', rows: any[]): void
}>()

const isLeaf = (nodeData: Record<string, any>) => {
  const list = nodeData?.[props.childrenField] as any[] | undefined
  return !list || list.length === 0
}

function treeClass(data: TreeNodeData){
  return {
    'is-cascade-highlight': isHighlighted(data),
    'is-cascade': props.levelSelect,
  }
}

function getButtons(nodeData: Record<string, any>): ButtonsItem[] {
  return props.buttons ? props.buttons(nodeData) || [] : []
}

const indent = props.indent
const height = props.height
const activeNode = ref<any | null>(null)
const treeRef = useTemplateRef('treeRef')

// 级联高亮相关
const highlightedKeySet = ref<Set<any>>(new Set())

const idMaps = computed(() => {
  const idToNodeMap = new Map<any, any>()
  const idToParentIdMap = new Map<any, any>()
  const childrenKey = props.childrenField
  const idKey = props.rowField
  const traverse = (nodes: any[], parentId: any | null) => {
    for (const n of nodes || []) {
      const id = (n as any)?.[idKey]
      idToNodeMap.set(id, n)
      if (parentId !== null && parentId !== undefined) idToParentIdMap.set(id, parentId)
      const children = (n as any)?.[childrenKey] as any[] | undefined
      if (children && children.length) traverse(children, id)
    }
  }
  traverse(treeData.value || [], null)
  return { idToNodeMap, idToParentIdMap }
})
function leftLineShow(item:number,node: TreeNode & {parent: any }){
  if(item === 1){
    console.log('aaaaaaaa', node)
    return node.parent?.[props.childrenField]?.length > 1
  }else{
    return leftLineShow(item - 1,node.parent)
  }
}
function isHighlighted(row: any) {
  const idKey = props.rowField
  return highlightedKeySet.value.has((row as any)?.[idKey])
}

function getDescendantIds(id: any): any[] {
  const result: any[] = []
  const { idToNodeMap } = idMaps.value
  const childrenKey = props.childrenField
  const stack: any[] = []
  const start = idToNodeMap.get(id)
  if (!start) return result
  stack.push(start)
  while (stack.length) {
    const node = stack.pop()
    const nid = node?.[props.rowField]
    if (nid !== id) result.push(nid)
    const children = node?.[childrenKey] as any[] | undefined
    if (children && children.length) {
      for (let i = children.length - 1; i >= 0; i--) stack.push(children[i])
    }
  }
  return result
}

function hasAncestorHighlighted(id: any): boolean {
  const { idToParentIdMap } = idMaps.value
  let pid = idToParentIdMap.get(id)
  while (pid !== undefined && pid !== null) {
    if (highlightedKeySet.value.has(pid)) return true
    pid = idToParentIdMap.get(pid)
  }
  return false
}

function emitChange() {
  const { idToNodeMap } = idMaps.value
  const rows: any[] = []
  highlightedKeySet.value.forEach((k) => {
    const n = idToNodeMap.get(k)
    if (n) rows.push(n)
  })
  emit('change', rows)
}

function clearTreeCurrent() {
  const inst: any = treeRef.value
  if (!inst) return
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
  console.log('data',data,node)
  // 级联选择逻辑
  if (props.levelSelect) {
    const id = (data as any)?.[props.rowField]
    const already = highlightedKeySet.value.has(id)
    const ancestorHighlighted = hasAncestorHighlighted(id)
    if (!already) {
      // 新点击：高亮自身与所有子孙
      highlightedKeySet.value = new Set<any>([id, ...getDescendantIds(id)])
    } else {
      if (ancestorHighlighted) {
        // 祖先已高亮：只保留当前节点及其子孙
        highlightedKeySet.value = new Set<any>([id, ...getDescendantIds(id)])
      } else {
        // 否则取消所有高亮并取消树选中
        highlightedKeySet.value = new Set<any>()
        clearTreeCurrent()
      }
    }
    emitChange()
  }

  // 按钮显示交互：仅在 showType=click 下处理
  if (props.showType === 'click') {
    activeNode.value = activeNode.value === data ? null : data
  }
  emit('node-click', data, node, e)
}

// 占位，若后续扩展自定义插槽函数可复用
</script>

<style scoped lang="scss">
@forward '@moluoxixi/components/_assets/styles/tailwind.scss';


.wl-tree{
  :deep(.el-tree){
    .el-icon {
      position: relative;
      z-index: 1;
    }

    .is-cascade{
      .el-tree-node__content{
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
        transition: opacity .15s ease;
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
    .wl-right_line{
      border-top: 1px dashed #dddddd;
    }

    &:hover .wl-tree__buttons--hover {
      opacity: 1;
    }
  }

}
</style>


