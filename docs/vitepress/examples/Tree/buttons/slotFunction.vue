<!-- slotFunction.vue文件 -->
<template>
  <Tree :data="tree" label-field="name" children-field="children" :buttons="buttons" />
</template>

<script setup lang="tsx">
const tree = [
  { id: 1, name: '根 1', children: [
    { id: 11, name: '子 1-1' },
  ] },
]

function buttons(): any[] {
  return [
    {
      slot: (data: any) => (
        <button
          style="background:none;border:none;color:#67c23a;cursor:pointer"
          onClick={(e: any) => {
            e.stopPropagation()
            console.log(`fn ${data.name}`)
          }}
        >
          函数按钮
        </button>
      ) as any,
    },
  ]
}
</script>
