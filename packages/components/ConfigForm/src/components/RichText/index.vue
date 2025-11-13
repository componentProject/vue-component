<!-- ConfigForm组件主文件 -->
<template>
  <div class="starfish-formitem" :class="{ 'formCover': drag, 'starfish-vertical': labelalign !== 'top', [item.data.csslist?.join(' ')]: !!item.data.csslist }">
    <div class="label" :class="`label_${labelalign}`" :style="{ width: `${labelWidth}px` }">
      <label>{{ item.data.label }}{{ suffix }}</label>
      <span v-if="item.data.required" class="item_require">*</span>
      <ElTooltip v-if="item.data.tip" class="item" effect="dark" :content="item.data.tip" placement="top">
        <ElIcon class="tip">
          <QuestionFilled />
        </ElIcon>
      </ElTooltip>
    </div>
    <div class="control" :style="{ marginLeft: labelalign !== 'top' ? `${labelWidth}px` : '' }">
      <div v-if="drag" ref="richText" />
      <div v-if="!drag" ref="richText" />
    </div>
  </div>
</template>

<script lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElIcon, ElTooltip } from 'element-plus'
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import E from 'wangeditor'
import { useWatch } from '../../utils/customHooks'
import { getFormConfig } from '../../utils/fieldConfig'
import fieldProps from '../../utils/fieldProps'

export default defineComponent({
  components: {
    ElTooltip,
    ElIcon,
    QuestionFilled,
  },
  ControlType: 'RichText', // 必须与文件名匹配
  nameCn: '富文本',
  icon: 'icon-textEdit',
  formConfig: getFormConfig('RichText'),
  props: {
    ...fieldProps,
  },
  setup(props) {
    const richText = ref()
    let editor: any = null
    useWatch(props)
    onMounted(() => {
      if (props.drag) {
        editor = new E(richText.value)
        editor.config.focus = false
        editor.create()
      }
      else {
        editor = new E(richText.value)
        editor.config.focus = false
        editor.create()
        const data: any = props.data
        const item: any = props.item
        editor.config.onchange = function (newHtml: string) {
          console.log('onblur', newHtml) // 获取最新的 html 内容
          data[item.data.fieldName] = newHtml
        }
      }
    })
    onUnmounted(() => {
      editor.destroy()
      editor = null
    })
    return {
      richText,
    }
  },
})
</script>
