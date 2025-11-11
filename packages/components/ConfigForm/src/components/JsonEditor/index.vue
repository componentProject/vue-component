<template>
  <div
    class="starfish-formitem"
    :class="{
      'formCover': drag,
      'starfish-vertical': labelalign != 'top',
      [item.data.csslist?.join(' ')]: !!item.data.csslist,
    }"
  >
    <div
      class="label"
      :class="`label_${labelalign}`"
      :style="{ width: `${labelWidth}px` }"
    >
      <label>{{ item.data.label }}{{ suffix }}</label>
      <span v-if="item.data.required" class="item_require">*</span>
      <ElTooltip
        v-if="item.data.tip"
        class="item"
        effect="dark"
        :content="item.data.tip"
        placement="top"
      >
        <ElIcon class="tip">
          <QuestionFilled />
        </ElIcon>
      </ElTooltip>
    </div>
    <div
      class="control"
      :style="{ marginLeft: labelalign != 'top' ? `${labelWidth}px` : '' }"
    >
      <div id="jsoneditor" ref="jsoneditor">
        <div class="fullScreen" @click="showCustomDialog">
          <ElIcon><FullScreen /></ElIcon>
        </div>
      </div>
    </div>
    <CustomDialog ref="myDialog" width="60%">
      <div style="padding: 0">
        <div style="height: 100%">
          <div class="my-pageMain" style="height: calc(100% - 60px); overflow: auto;">
            <div
              ref="JsonViewerDialogDom"
              style="height: 100%"
            />
          </div>
          <div
            class="my-Footer"
            style="height: 60px; padding-top: 10px; text-align: right"
          >
            <ElButton type="primary" @click="saveJson">
              保存
            </ElButton>
            <ElButton @click="closeDialog">
              关闭
            </ElButton>
          </div>
        </div>
      </div>
    </CustomDialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, watch } from 'vue'
import { getFormConfig } from '../../utils/fieldConfig'
import fieldProps from '../../utils/fieldProps'
import { useWatch } from '../../utils/customHooks'
import JSONEditor from 'jsoneditor'
import _ from '@moluoxixi/components/FormDesign/src/utils/_'
import { ElButton, ElIcon, ElTooltip } from 'element-plus'
import { FullScreen, QuestionFilled } from '@element-plus/icons-vue'

interface jsonEditor {
  [key: string]: any
}
export default defineComponent({
  ControlType: 'JsonEditor', // 必须与文件名匹配
  nameCn: 'JSON编辑',
  icon: 'icon-json-full',
  rule: _.getJsonValidate(),
  formConfig: getFormConfig('JsonEditor', [
    { fieldName: 'default', component: 'JsonEditor' },
  ]),
  components: {
    ElTooltip,
    ElButton,
    ElIcon,
    QuestionFilled,
    FullScreen,
  },
  props: {
    ...fieldProps,
  },
  actionType: ['onChange'],
  setup(props) {
    /**
     * json dom
     */
    const jsoneditor = ref<jsonEditor>({})
    /**
     * dialog 初始化jsoneditor对象
     */
    let jsonEditorDialog: any = null
    /**
     * jsoneditor对象
     */
    let jsonEditors: any = null
    /**
     * dialog dom
     */
    const JsonViewerDialogDom = ref<any>()
    const myDialog = ref<any>()
    useWatch(props)
    function initJson() {
      const container = jsoneditor.value
      const data: any = props.data
      const item: any = props.item
      const fieldName = item.data.fieldName
      const options = {
        modes: ['text', 'code', 'view'],
        mode: 'code',
        search: false,
        onChange() {
          data[fieldName] = jsonEditors?.getText()
        },
      }
      jsonEditors = new JSONEditor(container, options)
      if (props.drag) {
        jsonEditors?.set(_.tryParseJson(item.data.default))
      }
      else {
        jsonEditors?.set(_.tryParseJson(data[item.data.fieldName]))
      }
    }
    onMounted(() => {
      initJson()
    })
    watch(
      () => props.item,
      (newValue: any) => {
        if (props.drag) {
          jsonEditors?.set(_.tryParseJson(newValue.data.default))
        }
        else {
          const data: any = props.data
          const item: any = props.item
          jsonEditors?.set(_.tryParseJson(data[item.data.fieldName]))
        }
      },
    )
    return {
      myDialog,
      jsoneditor,
      JsonViewerDialogDom,
      async showCustomDialog() {
        const myDialogDom: any = myDialog.value
        myDialogDom.show()
        myDialogDom.init('JSON编辑', 'icon-json-full')
        await nextTick()
        const container = JsonViewerDialogDom.value
        const options = {
          modes: ['text', 'code', 'view'],
          mode: 'code',
          search: false,
        }
        jsonEditorDialog = new JSONEditor(container, options)
        jsonEditorDialog?.set(_.tryParseJson(jsonEditors.getText()))
      },
      closeDialog() {
        myDialog.value.close()
      },
      saveJson() {
        jsonEditors?.set(_.tryParseJson(jsonEditorDialog.getText()))
        const data: any = props.data
        const item: any = props.item
        const fieldName = item.data.fieldName
        data[fieldName] = jsonEditors?.getText()
        myDialog.value.close()
      },
    }
  },
})
</script>
