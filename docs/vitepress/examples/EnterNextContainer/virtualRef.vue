<template>
  <div class="container">
    <div ref="outer" class="box">
      <ElInput v-model="form.a" class="ipt" placeholder="输入1" />
      <ElInput v-model="form.b" class="ipt" placeholder="输入2" />
      <ElSelect v-model="form.sel" class="ipt" placeholder="请选择">
        <ElOption label="选项1" value="1" />
      </ElSelect>
      <ElInput v-model="form.c" class="ipt" placeholder="输入3" />
    </div>
    <EnterNextContainer :virtual-ref="outer" />
  </div>
</template>

<script setup lang="ts">
import { ElInput, ElOption, ElSelect } from 'element-plus'
import { ref } from 'vue'

const outer = ref<HTMLElement | null>(null)
const form = ref({ a: '', b: '', c: '', sel: '' })
</script>

<style scoped>
.box {
  padding: 8px;
  border: 1px solid #e5e7eb;
}
.ipt {
  display: block;
  margin-bottom: 8px;
  padding: 6px 8px;
}
</style>
