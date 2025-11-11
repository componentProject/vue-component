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
      v-if="!isForm"
      class="label"
      :class="`label_${labelalign}`"
      :style="{ width: `${labelWidth}px` }"
    >
      <label>{{ item.data.label }}</label>
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
      <ElButton v-if="!isForm" style="width: 100%" @click="onAction">
        设置
      </ElButton>
      <CustomDialog ref="actionRef">
        <div class="common-layout">
          <ElContainer
            style="height: 100%; border: 1px solid rgb(238, 238, 238)"
          >
            <ElContainer>
              <ElAside width="300px" class="event-script-aside">
                <ElContainer class="is-vertical">
                  <header class="action-header">
                    <ElButton type="text" :size="size" @click="addAction">
                      +添加动作
                    </ElButton>
                  </header>
                  <ElMain>
                    <ElScrollbar>
                      <div class="action-list">
                        <div
                          v-for="(_item, index) in action"
                          :key="index"
                          class="action"
                          :class="
                            currentAction && _item.type == currentAction.type
                              ? 'selectAction'
                              : ''
                          "
                          @click="handleAction(_item)"
                        >
                          <span class="event-script-menu-i">Function</span>
                          <div class="event-script-menu-label">
                            {{ _item.funcName }}
                          </div>
                          <div
                            v-if="!_item.disabled"
                            class="event-script-menu-action"
                          >
                            <ElIcon title="复制" @click.stop="copyAction(_item)">
                              <CopyDocument />
                            </ElIcon>
                            <ElIcon title="删除" @click.stop="deleteAction(_item)">
                              <Delete />
                            </ElIcon>
                          </div>
                        </div>
                      </div>
                    </ElScrollbar>
                  </ElMain>
                </ElContainer>
              </ElAside>
              <ElMain class="event-script-main">
                <ElContainer class="is-vertical">
                  <header class="action-header event-script-main-header">
                    <ElButton type="primary" size="small" @click="onConfirm">
                      确定
                    </ElButton>
                    <ElButton type="primary" size="small" @click="onSave">
                      保存
                    </ElButton>
                    <ElButton size="small" @click="onCancel">
                      取消
                    </ElButton>
                  </header>
                  <ElMain v-if="currentAction" class="func_main">
                    <ElScrollbar>
                      <ElForm :model="currentAction" :rules="rules">
                        <ElFormItem label="Function Name" prop="funcName">
                          <ElInput
                            v-model="currentAction.funcName"
                            :disabled="currentAction.disabled"
                          />
                        </ElFormItem>
                        <ElFormItem prop="funcStr">
                          <div class="coding">
                            <div class="header">
                              function {{ currentAction.funcName }}({{
                                getField(currentAction.methods)
                              }}){
                            </div>
                            <Codemirror
                              v-model="currentAction.funcStr"
                              placeholder=""
                              :style="{ height: '400px' }"
                              mode="text/javascript"
                              :autofocus="true"
                              :indent-with-tab="true"
                              :tab-size="2"
                            />
                            <div class="footer">
                              }
                            </div>
                          </div>
                        </ElFormItem>
                      </ElForm>
                    </ElScrollbar>
                  </ElMain>
                </ElContainer>
              </ElMain>
            </ElContainer>
          </ElContainer>
        </div>
      </CustomDialog>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  inject,
  onMounted,
  reactive,
  ref,
} from 'vue'
// import { javascript } from "@codemirror/lang-javascript";
import { Codemirror } from 'vue-codemirror'
import {
  ElAside,
  ElButton,
  ElContainer,
  ElForm,
  ElFormItem,
  ElIcon,
  ElInput,
  ElMain,
  ElScrollbar,
  ElTooltip,
} from 'element-plus'
import { CopyDocument, Delete, QuestionFilled } from '@element-plus/icons-vue'
import { getFlex } from '../utils/customHooks'

export default defineComponent({
  ControlType: 'FormAction',
  isHide: true,
  components: {
    Codemirror,
    ElAside,
    ElButton,
    ElContainer,
    ElForm,
    ElFormItem,
    ElIcon,
    ElInput,
    ElMain,
    ElScrollbar,
    ElTooltip,
    QuestionFilled,
    CopyDocument,
    Delete,
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    drag: {
      type: Boolean,
      default: false,
    },
    labelalign: {
      type: String,
      default: 'top',
    },
    labelWidth: {
      type: Number,
    },
    size: {
      type: String,
    },
    isForm: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { actionContrl: actionStore } = inject<any>('control') || {}
    const actionRef = ref()
    // 从 Store 获取 $Flex
    const $Flex = getFlex()
    const action = ref($Flex?.deepClone(actionStore?.get('action')) || actionStore?.get('action'))
    const currentAction = ref(
      $Flex?.deepClone(actionStore?.get('currentAction')) || actionStore?.get('currentAction'),
    )
    const { proxy } = getCurrentInstance() as any
    // const extensions = [javascript()];
    let actionType = ''
    const rules = reactive({
      funcName: [
        {
          required: true,
          message: '函数名称必填',
          trigger: 'change',
        },
      ],
    })
    console.log(props)
    onMounted(() => {
      // props.data[props.item.data.fieldName] = action.value;
    })
    return {
      rules,
      actionRef,
      action,
      currentAction,
      getField(methods: string) {
        return $Flex?.getField(methods)
      },
      // extensions,
      onAction(type?: string) {
        action.value = $Flex?.deepClone(actionStore?.get('action')) || actionStore?.get('action')
        actionRef.value.init('动作设置', 'icon-icon-bianji')
        actionRef.value.show()
        if (type) {
          actionType = type
          const item = action.value.find((item: any) => {
            if (item.type == type) {
              return item
            }
            else {
              return null
            }
          })
          if (item) {
            currentAction.value = item
          }
          else {
            proxy.addAction(type)
          }
        }
      },
      onEditAction(key: any, type: string) {
        actionType = key
        action.value = $Flex?.deepClone(actionStore?.get('action')) || actionStore?.get('action')
        actionRef.value.init('动作设置', 'icon-icon-bianji')
        actionRef.value.show()
        const item = action.value.find((item: any) => {
          if (item.type == type) {
            return item
          }
          else {
            return null
          }
        })
        if (item) {
          currentAction.value = item
        }
      },
      handleAction(item: any) {
        currentAction.value = item
      },
      onSave() {
        actionStore?.set('action', action.value)
        actionRef.value.close()
      },
      onCancel() {
        actionRef.value.close()
      },
      copyAction(item: any) {
        const newAction = $Flex?.deepClone(item) || { ...item }
        newAction.funcName = `${newAction.funcName}_copy`
        newAction.type = $Flex?.generateMixed(5) || Date.now().toString()
        action.value.push(newAction)
        currentAction.value = newAction
      },
      deleteAction(item: any) {
        action.value = action.value.filter((actionItem: any) => {
          if (actionItem.type !== item.type) {
            return actionItem
          }
          else {
            return null
          }
        })
        if (currentAction.value && item.type == currentAction.value.type) {
          currentAction.value = null
        }
      },
      addAction(type?: string) {
        const addAction = {
          funcName: `${type || 'func'}_${$Flex?.generateMixed(5) || Date.now().toString()}`,
          type: $Flex?.generateMixed(5) || Date.now().toString(),
          funcStr: '',
          methods: type,
        }
        action.value.push(addAction)
        if (type) {
          currentAction.value = addAction
        }
      },
      onConfirm() {
        if (!props.data[props.item.data.fieldName]) {
          // eslint-disable-next-line vue/no-mutating-props
          props.data[props.item.data.fieldName] = {}
        }
        // eslint-disable-next-line vue/no-mutating-props
        props.data[props.item.data.fieldName][actionType] = JSON.stringify(
          currentAction.value,
        )
        proxy.onSave()
      },
    }
  },
})
</script>
