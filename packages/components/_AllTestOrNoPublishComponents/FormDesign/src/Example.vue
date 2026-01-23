<!-- FormDesign的示例文件 -->
<template>
  <div class="container">
    <FormDesign
      ref="formDesignRef"
      class="form-design"
      :menu="menu"
      :panel="panel"
      @save="onSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FormDesign from './index.vue'

const formDesignRef = ref()

const menu = ref({
  left: [],
  right: [],
  column: false,
})

const panel = ref(['form', 'json', 'global'])

function onSave(res: any[]) {
  console.log('保存的表单配置:', res)
}

function goSave() {
  formDesignRef.value?.getJson()
}

function setJson() {
  formDesignRef.value?.setJson([
    {
      ControlType: 'Text',
      nameCn: '文本框',
      id: 'fPgb7Xb_w6HXixCAyA4k4',
      layout: false,
      data: {
        fieldName: 'Text_n6SZkfztwMLHMr1A0GX5B',
        label: '标签名称',
        tip: '',
        placeholder: '',
        showRule: '{}',
        required: false,
        rule: '[]',
        default: '',
      },
    },
  ])
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  position: relative;

  .form-design {
    width: 100%;
    height: 100%;
  }
}
</style>
