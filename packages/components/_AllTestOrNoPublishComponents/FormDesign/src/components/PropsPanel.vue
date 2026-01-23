<!-- FormDesign的PropsPanel组件 -->
<template>
  <div ref="editRight" class="editor_pages_right editor_pages_right_visible">
    <!-- 交互 -->
    <div v-if="column" class="editor_container" @mousedown="handleMouseDown">
      <ControllEditSize />
    </div>
    <ElTabs
      v-model="activeName"
      class="demo-tabs"
      style="height: 100%"
      @tab-click="handleClick"
    >
      <ElTabPane v-if="panel.includes('form')" label="组件配置" name="form">
        <ElScrollbar class="dynamic">
          <ElForm
            ref="ruleForm"
            :model="curControl && (curControl.data || {})"
            :rules="curControl && curControl.rules"
            label-width="120px"
            :status-icon="true"
          >
            <ElFormItem
              v-for="item in controlItems"
              :key="item.id"
              :control="item.ControlType"
              :prop="item.data.fieldName"
            >
              <component
                :is="item.ControlType"
                v-if="
                  (show && item.ControlType === 'JsonEditor')
                    || item.ControlType !== 'JsonEditor'
                "
                :drag="false"
                :data="curControl.data"
                :item="item"
                :size="globalDatas.size"
                :label-width="globalDatas.labelWidth"
                :labelalign="globalDatas.labelalign"
              />
            </ElFormItem>
          </ElForm>
          <ElEmpty
            v-if="!curControl || !curControl.data"
            :image-size="200"
            description="没有选中表单控件"
          />
        </ElScrollbar>
      </ElTabPane>
      <ElTabPane v-if="panel.includes('json')" label="JSON配置" name="json">
        <div v-if="activeName === 'json'" class="json">
          <!-- <div ref="jsonCenter"></div> -->
          <JsonEnter ref="jsonCenter" @editor="onEditor" />
        </div>
      </ElTabPane>
      <ElTabPane
        v-if="panel.includes('global')"
        label="表单配置"
        name="global"
      >
        <ElScrollbar v-if="activeName === 'global'" class="form_tab3">
          <GlobalFormComponent />
        </ElScrollbar>
      </ElTabPane>
    </ElTabs>

    <div class="editor_right_accept" @click="handleEditBtn">
      <ElIcon>
        <ArrowRight v-if="moduleIsHidden" />
        <ArrowLeft v-else />
      </ElIcon>
    </div>
  </div>
</template>

<script lang="ts">
import type {
  ComputedRef,
} from 'vue'
import type {
  AllFormItem,
  BaseComponentItem,
  BaseFormConfig,
  Controls,
} from '../type'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import {
  ElEmpty,
  ElForm,
  ElFormItem,
  ElIcon,
  ElNotification,
  ElScrollbar,
  ElTabPane,
  ElTabs,
} from 'element-plus'
import {
  computed,
  defineAsyncComponent,
  defineComponent,
  inject,
  nextTick,
  onMounted,
  ref,
  toRaw,
  watch,
} from 'vue'
import { globalFormList } from '../common/formJson'
import Loading from '../common/Loading.vue'
import { useFormDesignStore } from '../composables/useFormDesignStore'
import ControllEditSize from '../layouts/ControlEditSize.vue'

export default defineComponent({
  components: {
    ControllEditSize,
    ElTabs,
    ElTabPane,
    ElScrollbar,
    ElForm,
    ElFormItem,
    ElEmpty,
    ElIcon,
    ArrowRight,
    ArrowLeft,
    JsonEnter: defineAsyncComponent({
      loader: () => import('./jsonEditor.vue'),
      loadingComponent: Loading,
    }),
    GlobalFormComponent: defineAsyncComponent({
      loader: () => import('./globalFormList.vue'),
      loadingComponent: Loading,
    }),
  },
  props: {
    column: {
      type: Boolean,
      default: true,
    },
    panel: {
      type: Array,
      default: () => ['form', 'json', 'global'],
    },
  },
  emits: ['save'],
  setup(props, { emit }) {
    const { uiControl, hisContrl, formStore }
      = inject<Controls>('control') || {}
    const formDesignStore = useFormDesignStore()

    // 该模块是否隐藏 默认显示
    const moduleIsHidden = ref(true)
    const show = ref(true)
    const ruleForm = ref()
    const editRight = ref()
    const activeName = ref('form')
    const jsonCenter = ref()
    let jsonEditor: any = null
    const isTransition = ref(true) // 默认有补间动画
    const controlItems = computed(() => formStore?.getControlItems())
    const curControl = computed(() => formStore?.get('curControl'))
    const newCurControl = computed(() => {
      const $Flex = formDesignStore.$Flex
      return $Flex.deepClone(formStore?.get('curControl'))
    })
    const historyFlag = computed(() => hisContrl?.get('historyFlag'))
    const save = computed(() => formStore?.get('save'))
    const currentIndex = computed(() => formStore?.get('currentIndex'))
    const handleEditBtn = () => {
      moduleIsHidden.value = !moduleIsHidden.value
      if (moduleIsHidden.value) {
        uiControl?.set('columnWidth', { right: undefined })
      }
      else {
        uiControl?.set('columnWidth', { right: 0 })
      }
    }

    /**
     * 表单配置
     */
    const globalData = formStore?.getDynamicForm(globalFormList)
    formStore?.set('globalDatas', globalData)
    formStore?.set('globalFormList', globalFormList)
    const globalFormLists = computed(() => formStore?.get('globalFormList'))
    const globalDatas = computed(() => formStore?.get('globalDatas'))

    // 鼠标落下
    const handleMouseDown = async () => {
      formStore?.setFormCurrentId('')
      formStore?.setFormCurrentIndex(-1)
    }

    // 预览或保存时验证所有表单是否输入正确
    const preview = computed(() => formStore?.get('preview'))
    const allFormList: ComputedRef<AllFormItem[] | undefined> = computed(() =>
      formStore?.getAllFormList(),
    )
    const checkNowFormValidate = function (content: string) {
      return new Promise((resolve) => {
        ruleForm.value.validate((valid: boolean) => {
          if (!valid) {
            ElNotification({
              title: 'Error',
              message: content,
              type: 'error',
            })
            resolve(false)
          }
          else {
            resolve(true)
          }
        })
      })
    }

    async function checkLayoutForm(curControl: AllFormItem): Promise<boolean> {
      if (curControl.ControlType === 'TableLayout') {
        const trs = curControl.data.trs || []
        for (let i = 0; i < trs.length; i++) {
          const tds = trs[i].tds
          for (let j = 0; j < tds.length; j++) {
            const state = await checkFormValidate(tds[j].list)
            if (!state) {
              return state
            }
          }
        }
      }
      else if (curControl.ControlType === 'Grid') {
        const columns = curControl.data.columns || []
        for (let i = 0; i < columns.length; i++) {
          const list = columns[i].list
          const state = await checkFormValidate(list)
          if (!state) {
            return state
          }
        }
      }
      return true
    }

    const checkFormValidate = async (list: AllFormItem[] | undefined) => {
      if (!list)
        return
      const len = list.length
      for (let i = 0; i < len; ++i) {
        let validate = true
        const curControl: any = list[i]
        curControl.controlItems?.forEach((item: BaseFormConfig) => {
          if (item.data.required) {
            validate = !!curControl.data[item.data.fieldName]
          }
        })
        if (validate && curControl.layout) {
          validate = await checkLayoutForm(curControl)
        }
        if (!validate) {
          formStore?.setFormCurrentId(curControl.id)
          activeName.value = 'form'
          await nextTick()
          const valid = await checkNowFormValidate(
            '请检查动态表单输入格式问题',
          )
          if (!valid) {
            return false
          }
        }
      }
      return true
    }
    const formUpdate = computed(() => formStore?.get('formUpdate'))
    const newAllmainlist = computed(() => {
      const $Flex = formDesignStore.$Flex
      return $Flex.deepClone(formStore?.get('allFormList')) || []
    })

    const checkValidates = async (formSave = false, type?: string) => {
      const curControlIndex = formStore?.get('currentIndex')
      // 预览模式下不自动保存
      if (type && preview.value)
        return
      if (preview.value || save.value || formUpdate.value) {
        const ispreview = await checkFormValidate(allFormList.value)
        if (ispreview) {
          formStore?.setFormCurrentIndex(curControlIndex)
        }
        formStore?.setSave(true)
        formStore?.setFormUpdate(false)
        if (ispreview) {
          const result = initFormToJson(allFormList.value) as any[]
          formStore?.set('AllFormResult', result)
          formStore?.handleDynamicForm()
          emit('save')
        }
        if (!formSave) {
          formStore?.set('previewShow', ispreview)
          formStore?.set('preview', false)
        }
        else if (ispreview) {
          ElNotification({
            title: 'Success',
            message: type ? '已自动保存' : '保存成功',
            type: 'success',
          })
        }
      }
    }
    const initFormToJson = (formlist: AllFormItem[] | undefined) => {
      const $Flex = formDesignStore.$Flex
      return $Flex.initFormToJson(toRaw(formlist))
    }

    function complareControl(newControl: any, oldContrl: any) {
      if (newControl !== oldContrl)
        return false
      let same = true
      for (const key in newControl) {
        if (newControl[key] !== oldContrl[key]) {
          same = false
        }
      }
      return same
    }

    function initJsonToForm(list: BaseComponentItem[]) {
      return toRaw(list).map((item: BaseComponentItem) => {
        return formDesignStore.jsonToForm(item)
      })
    }

    function handleClick(tab: any) {
      const tabName = tab.props?.name || tab.paneName || tab.name
      if (tabName === 'json' && jsonCenter.value) {
        jsonEditor = jsonCenter.value.initJsonCenter()
      }
      else if (tabName === 'form' && jsonEditor) {
        try {
          const $Flex = formDesignStore.$Flex
          const list = $Flex.tryParseJson(jsonEditor.getText())
          const newAllList: AllFormItem[] = initJsonToForm(list)
          formStore?.updateAllFormList(newAllList)
        }
        catch (e) {
          console.error(e)
        }
      }
    }

    function onEditor(editor: any) {
      jsonEditor = editor
    }

    // 设置事件监听
    onMounted(() => {
      const eventBus = formDesignStore.$EventBus
      eventBus.on('openPreview', async () => {
        checkValidates()
      })
      eventBus.on('setSave', async (type?: string) => {
        checkValidates(true, type)
      })
    })

    watch(
      () => [newAllmainlist.value, newCurControl.value?.data],
      ([, b], [, d]) => {
        if (activeName.value === 'json' && jsonCenter.value) {
          jsonCenter.value.initJsonCenter()
        }
        if (historyFlag.value) {
          hisContrl?.set('historyFlag', false)
          return
        }
        if (!complareControl(b, d)) {
          formStore?.setHistory()
        }
      },
      {
        deep: true,
      },
    )

    watch(
      () => curControl.value?.data,
      async () => {
        if (!formUpdate.value) {
          // store.commit("setFormUpdate", true);
          formStore?.setFormUpdate(true)
        }
      },
      { deep: true },
    )

    return {
      globalFormLists,
      globalDatas,
      jsonCenter,
      handleClick,
      jsonEditor,
      onEditor,
      activeName,
      handleMouseDown,
      moduleIsHidden,
      handleEditBtn,
      isTransition,
      editRight,
      controlItems,
      curControl,
      ruleForm,
      show,
      currentIndex,
    }
  },
})
</script>
