<template>
  <div class="example-container">
    <h3>基本用法（default：按钮常显）</h3>
    <div class="block" style="height: 100px !important;">
      <Tree :data="treeList" children-field="children" label-field="name" :child-icon="ChildIcon" :parent-icon="ParentIcon" :buttons="renderButtons" />
    </div>

    <h3>hover：悬浮显示按钮</h3>
    <div class="block">
      <Tree :data="treeList" children-field="children" label-field="name" :buttons="renderButtons" show-type="hover" />
    </div>

    <h3>click：点击行显示按钮（再点收起）</h3>
    <div class="block">
      <Tree :data="treeList" children-field="children" label-field="name" :buttons="renderButtons" show-type="click" />
    </div>

    <h3>显示虚线</h3>
    <div class="block">
      <Tree show-line show-row-line :data="treeList" children-field="children" label-field="name" :buttons="renderButtons" />
    </div>

    <h3>扁平数据（rowField + parentField 覆盖 childrenField）+ 函数 icon</h3>
    <div class="block">
      <Tree :data="flatList" row-field="id" parent-field="pid" label-field="name" :buttons="renderButtons" :icon="iconByType" />
    </div>

    <h3>自定义按钮：slot 名称和函数渲染</h3>
    <div class="block">
      <Tree :data="treeList" children-field="children" label-field="name" :buttons="renderCustomButtons">
        <template #customSlot="{ data }">
          <ElButton link size="small" @click.stop="() => onAlert(`slot: ${data.name}`)">
            自定义
          </ElButton>
        </template>
      </Tree>
    </div>

    <h3>级联选择（levelSelect）：点击节点高亮其及其子孙，通过 change 抛出高亮数组</h3>
    <div class="block">
      <Tree
        :data="treeList"
        children-field="children"
        label-field="name"
        level-select
        @change="onCascadeChange"
      />
      <div style="margin-top: 8px">
        已选节点（name）: {{ selectedNames }}
      </div>
      <pre style="margin-top: 8px">{{ selectedRows }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tree from './index.vue'
import { computed, ref } from 'vue'
import { Document, Folder } from '@element-plus/icons-vue'
import { ElButton } from 'element-plus'
import type { ButtonsItem } from './types/index.ts'

const ChildIcon = Document
const ParentIcon = Folder

const treeList = [
  {
    id: 1,
    name: '根 1',
    children: [
      {
        id: 11,
        name: '子 1-1',
        children: [
          {
            id: 111,
            name: '子 1-1-1',
          },
          {
            id: 112,
            name: '子 1-1-2',
            children: [
              {
                id: 1111,
                name: '子 1-1-1-1',
                children: [
                  { id: 11111, name: '子 1-1-1-1-1' },
                  { id: 11112, name: '子 1-1-1-1-2' },
                ],
              },
              {
                id: 1112,
                name: '子 1-1-1-2',
                children: [
                  { id: 11111, name: '子 1-1-1-1-1' },
                  { id: 11112, name: '子 1-1-1-1-2' },
                ],
              },
            ],
          },
          // {
          //   id: 113,
          //   name: '子 1-1-3',
          // },
        ],
      },
    ],
  },
]

const flatList = [
  { id: 1, pid: null, name: '根 1', type: 'dir' },
  { id: 11, pid: 1, name: '子 1-1', type: 'file' },
  { id: 12, pid: 1, name: '子 1-2', type: 'file' },
  { id: 2, pid: null, name: '根 2', type: 'dir' },
  { id: 21, pid: 2, name: '子 2-1', type: 'file' },
]

function iconByType(row: any) {
  return row.type === 'dir' ? Folder : Document
}

function renderButtons(row: any): ButtonsItem[] {
  return [
    {
      type: 'add',
      tooltip: '新增子节点',
      event: () => alert(`add: ${row.name}`),
    },
    {
      type: 'edit',
      tooltip: '编辑',
      event: () => alert(`edit: ${row.name}`),
    },
    {
      type: 'delete',
      tooltip: '删除',
      event: () => alert(`delete: ${row.name}`),
    },
  ]
}

function renderCustomButtons(row: any): ButtonsItem[] {
  return [
    {
      slot: 'customSlot',
    },
    {
      icon: Document,
      tooltip: '函数按钮',
      event: () => alert(`function btn: ${row.name}`),
    },
  ]
}

function onAlert(message: string) {
  // 使用显式函数避免在模板中直接访问全局对象导致的类型提示问题
  window.alert(message)
}

const selectedRows = ref<any[]>([])
const selectedNames = computed(() => selectedRows.value.map((r: any) => r?.name).filter(Boolean).join(', '))
function onCascadeChange(rows: any[]) {
  selectedRows.value = rows.map((item) => {
    const { children, ...i } = item
    return i
  })
}
</script>

<style scoped lang="scss">
.example-container {
  padding: 20px;
}
.block {
  padding: 12px;
  border: 1px solid #eee;
  margin-bottom: 16px;
}
</style>
