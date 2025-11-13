<template>
  <div
    class="starfish-formitem starfish-formitem-rule"
    :class="{ 'formCover': drag, 'starfish-vertical': labelalign != 'top' }"
  >
    <div
      class="label"
      :class="`label_${labelalign}`"
      :style="{ width: `${labelWidth}px` }"
    >
      <label>{{ item.data.label }}</label>
      <span v-if="item.data.required" class="weight">*</span>
      <ElTooltip
        v-if="item.data.tip"
        class="item"
        effect="dark"
        :content="item.data.tip"
        placement="bottom-start"
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
      <ElCollapse
        v-if="
          Array.isArray(data[item.data.fieldName])
            && data[item.data.fieldName].length > 0
        "
      >
        <ElCollapseItem
          v-for="(itemList, index) in data[item.data.fieldName]"
          :key="index"
          :title="itemList.title"
          :name="itemList.title"
        >
          <div v-if="itemList.type == 'enum'" class="collapse_enums">
            <ElSelect
              v-model="itemList.value"
              placeholder="请选择"
              style="width: 100%"
              size="small"
            >
              <ElOption
                v-for="items in ruleList"
                :key="items.value"
                :label="items.label"
                :value="items.validator"
              />
            </ElSelect>
          </div>
          <div v-if="itemList.type == 'func'">
            <ElButton
              type="primary"
              size="small"
              @click="handleFuncEdit(itemList)"
            >
              函数编辑
            </ElButton>
          </div>
          <div v-if="itemList.type == 'high'">
            <ElButton
              type="primary"
              size="small"
              @click="handleFormEdit(itemList)"
            >
              规则表单编辑
            </ElButton>
          </div>
          <ElButton
            type="danger"
            circle
            style="margin-left: 10px"
            @click="deleteRule(index)"
          >
            <ElIcon><Delete /></ElIcon>
          </ElButton>
        </ElCollapseItem>
      </ElCollapse>
      <ElDropdown style="margin-top: 10px" @command="handleDropdown">
        <ElButton type="success">
          新增规则<i class="el-icon-arrow-down el-icon--right" />
        </ElButton>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem command="enum">
              默认枚举
            </ElDropdownItem>
            <ElDropdownItem command="func">
              自定义函数规则
            </ElDropdownItem>
            <ElDropdownItem command="high">
              高级模式
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
    </div>
    <CustomDialog ref="codeMyDialog">
      <div
        v-if="funcItem"
        class="sqlDialog"
        style="padding: 20px; height: 100%"
      >
        <ElSelect
          v-model="funcValue.trigger"
          placeholder="请选择"
          size="small"
          style="margin-bottom: 20px"
        >
          <ElOption label="blur" value="blur" />
          <ElOption label="change" value="change" />
        </ElSelect>
        <ElAlert
          title="rule是存放接收参数的对象;value是待校验的值;callback是回调函数(校验完后，要执行的操作，如抛错),mainData为表单数据"
          type="success"
          style="margin-bottom: 15px"
        />
        <div>(rule, value, callback, mainData) => {</div>
        <Codemirror
          v-model="funcValue.func"
          placeholder=""
          mode="text/javascript"
          :style="{ height: '320px' }"
          :autofocus="true"
          :indent-with-tab="true"
          :tab-size="2"
        />
        <div>}</div>
        <div class="my-Footer" style="height: 60px; text-align: center; margin-top: 20px">
          <ElButton type="primary" @click="saveFunc">
            保存
          </ElButton>
          <ElButton @click="closeDialog">
            关闭
          </ElButton>
        </div>
      </div>
    </CustomDialog>
    <CustomDialog ref="formRuleDialog">
      <div style="padding: 0; height: 100%; display: flex; flex-direction: column;">
        <div class="my-pageMain" style="overflow: hidden; flex: 1;">
          <Dynamicform
            ref="formdragger"
            :form-result="formValue"
            :all-form-list="ruleJson"
            :global-config="Object.assign({}, globalDatas, { size: 'large' })"
          />
        </div>
        <div class="my-Footer" style="height: 60px; text-align: right; padding-top: 10px;">
          <ElButton type="primary" @click="saveField">
            保存
          </ElButton>
          <ElButton @click="closeDialog">
            关闭
          </ElButton>
        </div>
      </div>
    </CustomDialog>
  </div>
</template>

<script lang="ts">
import { Delete, QuestionFilled } from '@element-plus/icons-vue'
import _ from '@moluoxixi/components/FormDesign/src/utils/_'
import { ElAlert, ElButton, ElCollapse, ElCollapseItem, ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon, ElOption, ElSelect, ElTooltip } from 'element-plus'
import {
  computed,
  defineComponent,
  getCurrentInstance,
  inject,
  ref,
} from 'vue'
// import Dynamicform from "../index.vue"; // 避免循环引用
import { Codemirror } from 'vue-codemirror'
import fieldProps from '../../utils/fieldProps'
import ruleJsonData from './ruleform.json'
import ruleListData from './rules'

export default defineComponent({
  ControlType: 'Rule', // 必须与文件名匹配
  rule: _.getJsonValidate(),
  components: {
    Delete,
    QuestionFilled,
    ElIcon,
    Dynamicform: () => import('../../index.vue'),
    Codemirror,
    ElTooltip,
    ElCollapse,
    ElCollapseItem,
    ElSelect,
    ElOption,
    ElButton,
    ElAlert,
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem,
  },
  props: {
    ...fieldProps,
  },
  setup(props) {
    const { proxy } = getCurrentInstance() as any
    const { formStore } = inject<any>('control') || {}
    const globalDatas = computed(() => formStore?.get('globalDatas'))
    const rules = ref([])
    const ruleList = ref(ruleListData)
    const funcItem: any = ref({})
    const funcValue: any = ref({})
    const highItem: any = ref({})
    const formValue: any = ref({})
    const ruleJson = ref(ruleJsonData.ruleJson)
    const IsShow = ref(true)
    const codeMyDialog = ref()
    const formRuleDialog = ref()
    const formdragger = ref()
    return {
      IsShow,
      rules,
      ruleList,
      globalDatas,
      funcItem,
      funcValue,
      highItem,
      formValue,
      ruleJson,
      codeMyDialog,
      formRuleDialog,
      formdragger,
      handleDropdown(type: string) {
        let title = ''
        if (type == 'enum') {
          title = '自定义枚举'
        }
        else if (type == 'func') {
          title = '自定义函数规则'
        }
        else if (type == 'high') {
          title = '高级模式'
        }
        if (Array.isArray(props.data[props.item.data.fieldName])) {
          // eslint-disable-next-line vue/no-mutating-props
          props.data[props.item.data.fieldName].push({
            type,
            title,
            value: '',
          })
        }
        else {
          // eslint-disable-next-line vue/no-mutating-props
          props.data[props.item.data.fieldName] = []
          // eslint-disable-next-line vue/no-mutating-props
          props.data[props.item.data.fieldName].push({
            type,
            title,
            value: '',
          })
        }
      },
      handleFuncEdit(item: any) {
        funcItem.value = item
        funcValue.value = item.value
          ? JSON.parse(JSON.stringify(item.value))
          : {
              trigger: 'blur',
              func: `/** if (value === "" || value == null) {
*  callback(new Error("请输入"));
*} else if (!/^[0-9]*$/.test(value)) {
*  callback(new Error("必须为数字"));
*}
*callback();
*/`,
            }
        codeMyDialog.value.init('函数编辑', 'icon-icon-bianji')
        codeMyDialog.value.show()
      },
      saveFunc() {
        funcItem.value.value = funcValue.value
        proxy.closeDialog()
      },
      closeDialog() {
        codeMyDialog.value.close()
        formRuleDialog.value.close()
      },
      deleteRule(index: number) {
        // eslint-disable-next-line vue/no-mutating-props
        props.data[props.item.data.fieldName].splice(index, 1)
      },
      async handleFormEdit(item: any) {
        highItem.value = item
        formValue.value = item.value || proxy.getDefaultData(ruleJson.value)
        formRuleDialog.value.init('规则表单编辑', 'icon-icon-bianji')
        formRuleDialog.value.show()
        // await nextTick();
        // formdragger.value.initForm(false, false, [], ruleJson.value, formValue.value, {});
      },

      getDefaultData(items: any) {
        const maindata: any = {}
        items.forEach((item: any) => {
          maindata[item.data.fieldName] = item.data.default
          if (item.data.getDefault) {
            maindata[item.data.fieldName] = item.data.getDefault()
          }
          if (item.data.itemConfig) {
            maindata[item.data.fieldName] = item.data.itemConfig.value
          }
          maindata[item.data.fieldName]
            = maindata[item.data.fieldName] != undefined
              ? JSON.parse(JSON.stringify(maindata[item.data.fieldName]))
              : undefined
        })
        return maindata
      },
      saveField() {
        const newFormValue: any = {}
        const map: any = {
          1: {
            fields: ['required', 'trigger', 'message'],
          },
          2: {
            fields: ['trigger', 'min', 'max', 'message'],
          },
          3: {
            fields: ['required', 'trigger', 'type', 'message'],
          },
          4: {
            fields: ['required', 'trigger', 'patternTemp', 'message'],
          },
          5: {
            fields: ['trigger', 'minValue', 'maxValue', 'message'],
          },
        }
        for (const key in formValue.value) {
          if (map[formValue.value.ruleType || '1'].fields.includes(key)) {
            newFormValue[key] = formValue.value[key]
          }
        }
        if (formValue.value.ruleType == 2) {
          newFormValue.min = Number.parseInt(newFormValue.min)
          newFormValue.max = Number.parseInt(newFormValue.max)
        }
        else if (formValue.value.ruleType == 4) {
          newFormValue.pattern = new RegExp(newFormValue.patternTemp)
        }
        else if (formValue.value.ruleType == 5) {
          newFormValue.validor = `(rule, value, callback) => {
            if (!/(^[1-9]*$)/.test(value)) {
              callback(new Error("请输入数字值"))
            } else {
              if (value > ${newFormValue.maxValue}) {
                callback(new Error("${newFormValue.message}"))
              } else if(value < ${newFormValue.minValue}){
                callback(new Error("${newFormValue.message}"))
              }else {
                callback()
              }
            }
          }`
        }
        newFormValue.ruleType = formValue.value.ruleType
        highItem.value.value = newFormValue
        formRuleDialog.value.close()
      },
    }
  },
})
</script>

<style lang="scss">
.el-collapse-item {
  border: 1px solid #ebeef5;
  border-bottom-color: #e1e1e1;
  .el-collapse-item__header {
    background: #ebeef5;
    height: 20px;
    line-height: 20px;
    padding: 5px;
    font-size: 12px;
    &.is-active {
      border-bottom-color: transparent;
    }
  }
  .el-collapse-item__content {
    padding: 5px;
    display: flex;
    justify-content: space-between;
    .el-button + .el-button {
      margin-left: 5px;
    }
  }
}
.starfish-formitem-rule {
  .label {
    align-self: flex-start;
  }
}
</style>
