<template>
  <div class="example-container">
    <h3>基本用法（default：按钮常显）</h3>
    <div class="block">
      <Tree :data="treeList" children-field="children" label-field="name" :child-icon="ChildIcon" :parent-icon="ParentIcon" :buttons="renderButtons" show-type="default" />
    </div>

    <h3>hover：悬浮显示按钮</h3>
    <div class="block">
      <Tree :data="treeList" children-field="children" label-field="name" :buttons="renderButtons" show-type="hover" />
    </div>

    <h3>click：点击行显示按钮（再点收起）</h3>
    <div class="block">
      <Tree :data="treeList" children-field="children" label-field="name" :buttons="renderButtons" show-type="click" />
    </div>

    <h3>扁平数据（rowField + parentField 覆盖 childrenField）+ 函数 icon</h3>
    <div class="block">
      <Tree :data="flatList" row-field="id" parent-field="pid" label-field="name" :buttons="renderButtons" :icon="iconByType" show-type="default" />
    </div>

    <h3>自定义按钮：slot 名称和函数渲染</h3>
    <div class="block">
      <Tree :data="treeList" children-field="children" label-field="name" :buttons="renderCustomButtons" show-type="default">
        <template #customSlot="{ data }">
          <ElButton link size="small" @click.stop="() => alert('slot: ' + data.name)">自定义</ElButton>
        </template>
      </Tree>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tree from '@moluoxixi/components/Tree/index.ts'
import { Folder, Document } from '@element-plus/icons-vue'
import { ElButton } from 'element-plus'

const ChildIcon = Document
const ParentIcon = Folder

const treeList = [
  {
    id: 1,
    name: '根 1',
    children: [
      { id: 11, name: '子 1-1' },
      { id: 12, name: '子 1-2' },
    ],
  },
  {
    id: 2,
    name: '根 2',
    children: [
      { id: 21, name: '子 2-1' },
      { id: 22, name: '子 2-2' },
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

function renderButtons(row: any) {
  return [
    {
      type: 'add',
      tooltip: '新增子节点',
      event: () => alert('add: ' + row.name),
    },
    {
      type: 'edit',
      tooltip: '编辑',
      event: () => alert('edit: ' + row.name),
    },
    {
      type: 'delete',
      tooltip: '删除',
      event: () => alert('delete: ' + row.name),
    },
  ]
}

function renderCustomButtons(row: any) {
  return [
    {
      slot: 'customSlot',
    },
    {
      icon: Document,
      tooltip: '函数按钮',
      event: () => alert('function btn: ' + row.name),
    },
  ]
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


