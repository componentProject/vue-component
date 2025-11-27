<!-- CardReader组件主文件 -->
<template>
  <div style="display: flex">
    <template
      v-for="showType in props.showTypes"
      :key="showType"
    >
      <ElInput
        v-if="showType === 'card'"
        v-bind="$attrs"
        v-model="inputValue"
        clearable
        style="margin-right: 12px"
        :placeholder="props.placeholder"
        @focus="handleInputFocus"
        @blur="handleInputBlur"
        @keydown.enter="handleInputEnter"
      />
      <ElButton v-if="showType === 'qrcode'" type="primary" @click="medicalInsuranceQRCodeHandler">
        医保扫码
      </ElButton>
      <ElButton v-if="showType === 'face'" type="primary" @click="medicalInsuranceFaceScanningHandler">
        医保扫脸
      </ElButton>
    </template>
  </div>
</template>

<script setup lang="ts">
import type {
  cardReaderCommonSdkParamsType,
  cardReaderDictDetailParamsType,
  cardReaderHardwareClassType,
  cardReaderPluginParamsType,
  cardReaderPluginType,
  cardReaderSystemType,
  emitsType,
  propsType,
} from './_types'
// import TsSelect from '@moluoxixi/components/TsSelect'
import BaseApi from '@moluoxixi/utils/AjaxPackage/class'
import { ElButton, ElInput, ElMessage } from 'element-plus'
import { isEmpty } from 'radash'
import { ref } from 'vue'

defineOptions({
  name: 'CardReader',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<propsType>(), {
  placeholder: '点击读取身份证/社保卡',
  readTypes: ['focus'],
  showTypes: ['card', 'qrcode', 'face'],
})

const emit = defineEmits<emitsType>()

const inputValue = defineModel({
  type: String,
  default: '',
})
const isBlur = ref(false)
/** HTTP 服务实例 */
const httpService = new BaseApi({
  baseURL: 'http://localhost:26784',
  responseFields: {
    code: 'statusCode',
    message: 'message',
    data: 'rows',
  },
})

/** HTTP 服务实例 */
const readService = new BaseApi({
  baseURL: 'http://localhost:26784',
  timeout: 500000,
  responseFields: {
    code: 'statusCode',
    message: 'message',
    data: 'object',
  },
})

async function medicalInsuranceQRCodeHandler() {
  const res = await baseHandler(['medicalInsurance'], 'medicalInsuranceQRCode')
  inputValue.value = res?.authCheckedObj?.idNo || res?.authObj?.idNo
}
async function medicalInsuranceFaceScanningHandler() {
  const res = await baseHandler(['medicalInsurance'], 'faceScanning')
  inputValue.value = res?.authCheckedObj?.idNo || res?.authObj?.idNo
}

/** 操作系统对象 */
const systemInfo = ref<cardReaderSystemType | null>(null)

/** 硬件分类列表 */
const hardwareClassList = ref<cardReaderHardwareClassType[]>([])

/**
 * 获取操作系统信息
 */
async function getSystemInfo() {
  const params: cardReaderDictDetailParamsType = {
    searchKey: 'windows',
    dictCode: 'mini_system',
    pageNo: 1,
    pageSize: 100,
  }

  try {
    const result = await httpService.get<cardReaderSystemType[]>(
      '/mini-portal/dict/page/detail',
      params,
    )
    // 取 rows 中的第一个对象
    systemInfo.value = result?.[0] || null
    return systemInfo.value
  }
  catch (error) {
    console.error('获取操作系统信息失败:', error)
    return null
  }
}

/**
 * 获取硬件分类列表
 */
async function getHardwareClassList() {
  const params: cardReaderDictDetailParamsType = {
    dictCode: 'mini_hardware_class',
    pageNo: 1,
    pageSize: 100,
  }

  try {
    const result = await httpService.get<cardReaderHardwareClassType[]>(
      '/mini-portal/dict/page/detail',
      params,
    )
    hardwareClassList.value = (result || [])
  }
  catch (error) {
    console.error('获取硬件分类列表失败:', error)
    return null
  }
}

/**
 * 获取插件列表
 */
async function getPluginList(osType: string, pluginType: string) {
  const params: cardReaderPluginParamsType = {
    pageNo: 1,
    pageSize: 100,
    company: '',
    model: '',
    osType,
    pluginType,
    searchKey: '',
  }

  try {
    // pluginList.value = result || []
    return await httpService.get<cardReaderPluginType[]>(
      '/mini-portal/plugin',
      params,
    )
  }
  catch (error) {
    console.error('获取插件列表失败:', error)
    return null
  }
}
function JoinldcardAlias(item) {
  return `${item.pluginType}_${item.pluginName}_${item.code}_${item.company}_${item.model}`
}
async function getCallCommonSdk(osType: string, pluginType: string, funName: string) {
  const pluginList = await getPluginList(osType, pluginType)
  for (const plugin of pluginList) {
    const ioType = plugin.ioType ? JSON.parse(plugin.ioType) : []
    for (const ioTypeElement of ioType) {
      const result = await callCommonSdk(plugin, pluginType, funName || ioTypeElement, ioType)
      const res = {}
      if (result) {
        Object.keys(result).forEach((key) => {
          if (!isEmpty(res[key])) {
            res[key] = result[key]
          }
        })
      }

      if (!isEmpty(res)) {
        return res
        break
      }
    }
  }
}

/**
 * 调用 CommonSdk 接口
 */
async function callCommonSdk(plugin: cardReaderPluginType, pluginType: string, funName: string, ioType: string[]) {
  // 构建参数：包含插件对象的所有属性、pluginType 和 props 中的所有插件相关属性
  const params: cardReaderCommonSdkParamsType = {
    ...plugin,
    pluginType,
    funName,
    ioType,
    alias: JoinldcardAlias(plugin),
  }

  try {
    return await readService.post('/commonSdk/index', params)
  }
  catch (error) {
    console.error('调用 CommonSdk 失败:', error)
    return null
  }
}

// 直接调用获取操作系统信息和硬件分类列表
getSystemInfo()
getHardwareClassList()

/**
 * 处理输入框聚焦事件
 */
function handleInputFocus() {
  isBlur.value = false
  if (props.readTypes.includes('focus')) {
    queueReadCard()
  }
  emit('focus')
}

function handleInputBlur() {
  isBlur.value = true
  emit('blur')
}

/**
 * 处理输入框回车事件
 */
function handleInputEnter() {
  if (props.readTypes.includes('enter')) {
    queueReadCard()
  }
  emit('enter')
}

async function queueReadCard() {
  const startTime = Date.now()
  while (Date.now() - startTime < 3000 && !isBlur.value) {
    const res = await handleReadCard()
    if (res?.CardNo && !isBlur.value) {
      inputValue.value = res.CardNo
      break
    }
  }
}

/**
 * 处理读卡
 */
async function handleReadCard() {
  return await baseHandler(['idCard', 'socialWelfareCard'])
}
async function baseHandler(idCards: string[] = [], funName?: string) {
  const list = hardwareClassList.value?.filter(item => idCards.includes(item.dictValue)) || []
  if (!list?.length) {
    ElMessage.warning('请等待插件分类请求')
    return
  }
  for (const hardwareClass of list) {
    const res = await getCallCommonSdk(systemInfo.value.dictValue, hardwareClass.dictValue, funName)

    if (!isEmpty(res)) {
      // console.log('res', res, isEmpty(res))
      emit('readSuccess', res)
      return res
      break
    }
  }
}
// 暴露方法供外部调用
defineExpose({
  queueReadCard,
})
</script>

<style scoped>
</style>
