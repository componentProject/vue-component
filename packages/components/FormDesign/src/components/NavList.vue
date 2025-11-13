<template>
  <div class="nav_list">
    <div class="detailBtn">
      <ElTooltip
        v-if="btnIsShow('left', 'save')"
        class="box-item"
        effect="dark"
        content="保存"
        placement="top"
      >
        <ElIcon
          :class="clearIsDisable ? 'noactive' : ''"
          class="nav-icon"
          @click="handleFormSave()"
        >
          <DocumentChecked />
        </ElIcon>
      </ElTooltip>
      <ElTooltip
        v-if="btnIsShow('left', 'preview')"
        class="box-item"
        effect="dark"
        content="预览"
        placement="top"
      >
        <ElIcon
          :class="clearIsDisable ? 'noactive' : ''"
          class="nav-icon"
          @click="handleFormPre()"
        >
          <View />
        </ElIcon>
      </ElTooltip>
      <ElTooltip
        v-if="
          !fullscreen && btnIsShow('left', 'fullscreen') && supportFullScreen
        "
        class="box-item"
        effect="dark"
        content="全屏"
        placement="top"
      >
        <ElIcon class="nav-icon" @click="handleFullScreen()">
          <FullScreen />
        </ElIcon>
      </ElTooltip>
      <ElTooltip
        v-if="
          fullscreen && btnIsShow('left', 'fullscreen') && supportFullScreen
        "
        class="box-item"
        effect="dark"
        content="非全屏"
        placement="top"
      >
        <ElIcon class="nav-icon" @click="handleFullScreen()">
          <Minus />
        </ElIcon>
      </ElTooltip>
      <ElTooltip
        v-if="btnIsShow('left', 'delete')"
        class="box-item"
        effect="dark"
        content="清空"
        placement="top"
      >
        <ElIcon
          :class="clearIsDisable ? 'noactive' : ''"
          class="nav-icon"
          @click="handleClear()"
        >
          <Delete />
        </ElIcon>
      </ElTooltip>
      <ElTooltip
        v-if="btnIsShow('left', 'tree')"
        class="box-item"
        effect="dark"
        content="组件结构树"
        placement="top"
      >
        <ElIcon class="nav-icon" @click="handleTree()">
          <Operation />
        </ElIcon>
      </ElTooltip>
      <ElTooltip
        v-if="btnIsShow('left', 'undo')"
        class="box-item"
        effect="dark"
        content="撤销"
        placement="top"
      >
        <ElIcon
          :class="historyIndex == -1 ? 'noactive' : ''"
          class="nav-icon"
          @click="handleBack()"
        >
          <RefreshLeft />
        </ElIcon>
      </ElTooltip>
      <ElTooltip
        v-if="btnIsShow('left', 'redo')"
        class="box-item"
        effect="dark"
        content="重做"
        placement="top"
      >
        <ElIcon
          :class="historyIndex == historyLen - 1 ? 'noactive' : ''"
          class="nav-icon"
          @click="handleForward()"
        >
          <RefreshRight />
        </ElIcon>
      </ElTooltip>
      <!-- <el-button text @click="handleFormSave()" size="small" :disabled="clearIsDisable">保存</el-button>
      <el-button text @click="handleFormPre()" size="small" :disabled="clearIsDisable">预览</el-button>
      <el-button text @click="handleFullScreen()" size="small">全屏/非全屏</el-button>
      <el-button text @click="handleClear()" size="small" :disabled="clearIsDisable">清空</el-button>
      <el-button text @click="handleBack()" size="small" :disabled="historyIndex == -1">后退</el-button>
      <el-button text @click="handleForward()" size="small" :disabled="historyIndex == historyLen - 1">前进</el-button> -->
    </div>
    <div class="pageBtn">
      <div v-if="btnIsShow('right', 'viewport')" class="el-button-group">
        <ElTooltip
          v-if="btnIsShow('left', 'redo')"
          class="box-item"
          effect="dark"
          content="PC"
          placement="top"
        >
          <ElIcon
            :class="pageType == 'PC' ? 'info' : ''"
            class="nav-icon"
            @click="updatePageType('PC')"
          >
            <Monitor />
          </ElIcon>
        </ElTooltip>
        <ElTooltip
          v-if="btnIsShow('left', 'redo')"
          class="box-item"
          effect="dark"
          content="Pad"
          placement="top"
        >
          <ElIcon
            :class="pageType == 'Pad' ? 'info' : ''"
            class="nav-icon"
            @click="updatePageType('Pad')"
          >
            <Iphone />
          </ElIcon>
        </ElTooltip>
        <ElTooltip
          v-if="btnIsShow('left', 'redo')"
          class="box-item"
          effect="dark"
          content="H5"
          placement="top"
        >
          <ElIcon
            :class="pageType == 'H5' ? 'info' : ''"
            class="nav-icon"
            @click="updatePageType('H5')"
          >
            <Iphone />
          </ElIcon>
        </ElTooltip>
        <ElTooltip
          class="box-item"
          effect="dark"
          content="导入json"
          placement="top"
        >
          <ElIcon
            v-if="btnIsShow('right', 'json-import')"
            class="nav-icon"
            @click="ImportJson"
          >
            <Upload />
          </ElIcon>
        </ElTooltip>
        <ElTooltip
          class="box-item"
          effect="dark"
          content="导出json"
          placement="top"
        >
          <ElIcon
            v-if="btnIsShow('right', 'json-export')"
            class="nav-icon"
            @click="exportJson"
          >
            <Download />
          </ElIcon>
        </ElTooltip>
      </div>
    </div>
    <ElDrawer
      v-model="dialog"
      title="表单结构树"
      :before-close="handleClose"
      direction="ltr"
      custom-class="demo-drawer"
    >
      <div class="demo-drawer__content">
        <ElInput v-model="filterText" placeholder="Filter keyword" />
        <ElTree
          ref="treeRef"
          :data="tree"
          :props="propsData"
          default-expand-all
          :filter-node-method="filterNode"
          style="margin-top: 20px"
          @node-click="myClick"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <ElIcon style="font-size: 12px; margin-right: 5px">
                <component :is="getIconComponent(data.icon)" />
              </ElIcon>
              <span>{{ node.label }}</span>
              <!-- <span>
                <el-icon @click="remove(node, data)">
                  <Delete />
                </el-icon>
              </span> -->
            </span>
          </template>
        </ElTree>
      </div>
    </ElDrawer>
    <custom-dialog ref="jsonDialog" :width="800" dialogclass="codeDialog">
      <div class="custom_code">
        <!-- <codemirror
          v-model="code"
          placeholder="json导入"
          mode="text/json"
          :style="{ height: '400px' }"
          :extensions="extensions"
        /> -->
        <JsonCode v-model:value="code" />
        <ElUpload
          accept="application/json"
          class="upload-demo"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :on-change="handleChange"
        >
          <ElButton type="primary">
            导入json文件
          </ElButton>
        </ElUpload>
      </div>

      <div class="my-Footer" style="text-align: center; padding-top: 10px;">
        <ElButton type="primary" @click="saveJson">
          确定
        </ElButton>
        <ElButton @click="closeCodeDialog">
          关闭
        </ElButton>
      </div>
    </custom-dialog>
  </div>
</template>

<script lang="ts">
import type { Component, PropType } from 'vue'
import type { AllFormItem, BaseComponentItem, Controls, MenuBarData } from '../type'
import {
  Brush,
  Calendar,
  Clock,
  Delete,
  Document,
  DocumentChecked,
  Download,
  Edit,
  FullScreen,
  Grid,
  Iphone,
  Minus,
  Monitor,
  Operation,
  RefreshLeft,
  RefreshRight,
  SwitchButton,
  Upload,
  View,
  Warning,
} from '@element-plus/icons-vue'
import {
  ElButton,
  ElDrawer,
  ElIcon,
  ElInput,
  ElMessage,
  ElTooltip,
  ElTree,
  ElUpload,
} from 'element-plus'
import {
  computed,
  defineAsyncComponent,
  defineComponent,
  inject,
  onMounted,
  onUnmounted,
  ref,
  toRaw,
  watch,
} from 'vue'
import { useFormDesignStore } from '../composables/useFormDesignStore'
import { clearCanvas } from '../utils/formKeycon'

export default defineComponent({
  components: {
    JsonCode: defineAsyncComponent(() => import('../common/jsonCode.vue')),
    ElTooltip,
    ElDrawer,
    ElInput,
    ElTree,
    ElUpload,
    ElButton,
    ElIcon,
    DocumentChecked,
    // eslint-disable-next-line vue/no-reserved-component-names
    View,
    FullScreen,
    Minus,
    Delete,
    Operation,
    RefreshLeft,
    RefreshRight,
    Monitor,
    Iphone,
    Upload,
    Download,
    Edit,
    SwitchButton,
    Calendar,
    Clock,
    Brush,
    Document,
    Warning,
    Grid,
  },
  props: {
    /** 顶部工具栏配置 */
    menu: {
      type: Object as PropType<MenuBarData>,
      default: () => ({ left: [], right: [], column: true }),
    },
  },
  setup(props) {
    const { hisContrl, uiControl, formStore }
      = inject<Controls>('control') || {}
    const formDesignStore = useFormDesignStore()

    // 图标名到 Element Plus 图标组件的映射
    const iconMap: Record<string, Component> = {
      'icon-wenbenkuang': Edit,
      'icon-fuxuankuang_xuanzhong': DocumentChecked,
      'icon-danxuankuang': Operation,
      'icon-xuanzeqi': Operation,
      'icon-kaiguanguan': SwitchButton,
      'icon-24gl-calendar': Calendar,
      'icon-riqishijian': Clock,
      'icon-shijian': Clock,
      'icon-sen103': Brush,
      'icon-icon_huakuai': Operation,
      'icon-textarea': Edit,
      'icon-textEdit': Edit,
      'icon-json-full': Document,
      'icon-jinggao': Warning,
      'icon-35zhage': Grid,
      'icon-biaoge1': Grid,
      'icon-fengexian1': Minus,
      'icon-zhediemianban': Operation,
      'icon-jishuqi': Operation,
      'icon-biaodan': DocumentChecked,
    }

    // 根据图标名获取图标组件
    const getIconComponent = (iconName: string): Component => {
      if (!iconName)
        return Operation
      return iconMap[iconName] || Operation
    }

    const clearIsDisable = computed(
      () => formStore?.get('allFormList')?.length == 0,
    )
    const historyIndex = computed(() => hisContrl?.get('index'))
    const historyLen = computed(
      () => hisContrl?.get<Array<any>>('historyList').length || 0,
    )
    const fullscreen = computed(() => uiControl?.get('isFullscreen'))
    const allFormList = computed(() => formStore?.get('allFormList'))
    const pageType = computed(() => uiControl?.get('pageType'))
    const supportFullScreen = ref(!!document.fullscreenEnabled)
    // const extensions = [json()];
    const jsonDialog = ref()
    const tree = ref()
    const treeRef = ref()
    const filterText = ref()
    const code = ref()
    const propsData = ref({
      value: 'id',
      label: 'label',
      children: 'children',
    })
    interface Tree {
      id: string
      label: string
      children?: Tree[]
      name?: string
    }
    const initTree = () => {
      if (allFormList.value && allFormList.value.length > 0) {
        return toRaw(allFormList.value).map((item: any): Tree => {
          return toTree(item)
        })
      }
      else {
        return []
      }
    }
    function toTree(item: any): any {
      if (!item.layout) {
        return {
          id: item.id,
          label: item.nameCn,
          icon: item.icon,
        }
      }
      else {
        let children
        if (item.ControlType == 'Grid') {
          children = item.data.columns.map(
            (colItem: { list: AllFormItem[] }) => {
              const children = colItem.list.map((listItem: AllFormItem) => {
                return toTree(listItem)
              })
              return {
                id: '',
                label: 'GridChild',
                children,
              }
            },
          )
        }
        else if (item.ControlType == 'TableLayout') {
          children = item.data.trs.map((trItem: any) => {
            const children = trItem.tds.map((tdItem: any) => {
              const children = tdItem.list.map((listItem: AllFormItem) => {
                return toTree(listItem)
              })
              return {
                id: '',
                label: '列',
                children,
              }
            })
            return {
              id: '',
              label: '行',
              children,
            }
          })
        }
        else if (
          item.ControlType == 'Collapse'
          || item.ControlType == 'Tabs'
        ) {
          children = item.data.items.map((colItem: any) => {
            const children = colItem.list.map((listItem: AllFormItem) => {
              return toTree(listItem)
            })
            return {
              id: '',
              label: `${item.nameCn}-child`,
              children,
            }
          })
        }
        return {
          id: item.id,
          label: item.nameCn,
          children,
        }
      }
    }
    const dialog = ref(false)
    const timer: unknown = null
    const filterNode = (value: string, data: Tree) => {
      if (!value)
        return true
      return data.label.includes(value)
    }
    const handleFormSave = (type?: string) => {
      formDesignStore.$EventBus.emit('setSave', type)
    }
    const handleFormPre = () => {
      formStore?.set('preview', true)
      formDesignStore.$EventBus.emit('openPreview')
    }

    const setTimeSave = () => {
      // timer = setInterval(() => {
      //   handleFormSave("auto");
      // }, 20000);
    }

    const handleImportJson = () => {
      try {
        const result = JSON.parse(code.value)
        const formList = result.map((item: BaseComponentItem) => {
          return formDesignStore.jsonToForm(item)
        })
        code.value = JSON.stringify(formList, null, 4)
      }
      catch (e) {
        code.value = JSON.stringify({})
        console.error(e)
        ElMessage({
          type: 'error',
          message: '导入失败，数据格式不对',
        })
      }
    }

    watch(filterText, (val) => {
      treeRef.value?.filter(val)
    })

    // 每隔一分钟判断是否更改了内容,如果有更改则自动保存
    onMounted(() => {
      setTimeSave()
    })
    onUnmounted(() => {
      clearInterval(timer as any)
    })

    return {
      // extensions,
      code,
      supportFullScreen,
      handleFormSave,
      handleFormPre,
      jsonDialog,
      pageType,
      historyIndex,
      historyLen,
      fullscreen,
      clearIsDisable,
      filterText,
      propsData,
      dialog,
      tree,
      treeRef,
      filterNode,
      btnIsShow(type: 'left' | 'right', btn: any) {
        if (props.menu[type].length == 0) {
          return true
        }
        return props.menu[type].includes(btn)
      },
      updatePageType(type: string) {
        uiControl?.set('pageType', type)
      },
      handleClear: () => {
        clearCanvas()
        formStore?.setFormCurrentId('')
      },
      handleBack: () => {
        hisContrl?.back()
      },
      handleForward: () => {
        hisContrl?.go()
      },
      handleFullScreen: () => {
        const value = !uiControl?.get('isFullscreen')
        uiControl?.set('isFullscreen', value)
        if (value) {
          const element: any = document.documentElement

          if (element.requestFullscreen) {
            element.requestFullscreen()
          }
          else if (element.mozRequestFullScreen) {
            // Firefox
            element.mozRequestFullScreen()
          }
          else if (element.webkitRequestFullscreen) {
            // Chrome, Safari and Opera
            element.webkitRequestFullscreen()
          }
          else if (element.msRequestFullscreen) {
            // IE/Edge
            element.msRequestFullscreen()
          }
        }
        else {
          const doc: any = document
          if (doc.exitFullscreen) {
            doc.exitFullscreen()
          }
          else if (doc.mozCancelFullScreen) {
            // Firefox
            doc.mozCancelFullScreen()
          }
          else if (doc.webkitExitFullscreen) {
            // Chrome, Safari and Opera
            doc.webkitExitFullscreen()
          }
          else if (doc.msExitFullscreen) {
            // IE/Edge
            doc.msExitFullscreen()
          }
        }
      },
      handleTree() {
        dialog.value = true
        tree.value = initTree()
      },
      handleClose() {
        dialog.value = false
      },
      myClick(currentNode: any) {
        formStore?.setFormCurrentId(currentNode.id)
      },
      ImportJson() {
        jsonDialog.value.show()
        jsonDialog.value.init('json导入', 'icon-biaodan')
      },
      handleChange(file: any) {
        const reader = new FileReader()
        reader.readAsText(file.raw)
        reader.onload = (e: any) => {
          code.value = e.currentTarget.result
          handleImportJson()
        }
      },
      closeCodeDialog() {
        jsonDialog.value.close()
      },
      saveJson() {
        formStore?.updateAllFormList(JSON.parse(code.value))
        jsonDialog.value.close()
      },
      exportJson(fileName = `demo.json`) {
        let content = 'data:application/json;charset=utf-8,'
        try {
          const result = JSON.stringify(
            formDesignStore.$Flex.initFormToJson(allFormList.value),
          )
          content += result
          const encodedUri = encodeURI(content)
          const actions = document.createElement('a')
          actions.setAttribute('href', encodedUri)
          actions.setAttribute('download', fileName)
          actions.click()
          ElMessage({
            type: 'success',
            message: '导出成功',
          })
        }
        catch (e) {
          ElMessage({
            type: 'error',
            message: '导出失败,数据格式不对',
          })
        }
      },
      handleImportJson,
      getIconComponent,
      // remove(node, data) {},
    }
  },
})
</script>
