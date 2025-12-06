<!-- CardReader组件主文件 -->
<template>
  <div style="display: flex">
    <template
      v-for="showType in props.showTypes"
      :key="showType"
    >
      <ElDropdown
        v-if="showType === 'dropdown'"
        style="margin-right: 12px"
        @command="handleCardTypeChange"
      >
        <ElButton type="primary" @click="handleDropdownClick">
          {{ currentSelectedLabel }} <ElIcon><ArrowDown /></ElIcon>
        </ElButton>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem
              v-for="option in filteredDropdownOptions"
              :key="option.value"
              :command="option.value"
            >
              {{ option.label }}
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
      <ElButton
        v-if="showType === 'qrcode'"
        type="primary"
        v-bind="props.qrcodeButtonProps"
        @click="medicalInsuranceQRCodeHandler"
      >
        {{ props.qrcodeButtonText }}
      </ElButton>
      <ElButton
        v-if="showType === 'face'"
        type="primary"
        v-bind="props.faceButtonProps"
        @click="medicalInsuranceFaceScanningHandler"
      >
        {{ props.faceButtonText }}
      </ElButton>
    </template>
  </div>
</template>

<script setup lang="ts">
import type {
  cardReaderCommonSdkParamsType,
  cardReaderCustomDropdownOptionType,
  cardReaderDictDetailParamsType,
  cardReaderHardwareClassType,
  cardReaderPluginParamsType,
  cardReaderPluginType,
  cardReaderSystemType,
  emitsType,
  propsType,
} from './_types'
// import TsSelect from '@moluoxixi/components/TsSelect'
import { ArrowDown } from '@element-plus/icons-vue'
import BaseApi from '@moluoxixi/utils/AjaxPackage/class'
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon, ElMessage } from 'element-plus'
import { isEmpty } from 'radash'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

defineOptions({
  name: 'CardReader',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<propsType>(), {
  placeholder: '点击读取身份证/社保卡',
  showTypes: () => ['dropdown', 'qrcode', 'face'],
  qrcodeButtonProps: () => ({}),
  qrcodeButtonText: '医保扫码',
  faceButtonProps: () => ({}),
  faceButtonText: '医保扫脸',
  customDropdownOptions: () => [],
  enablePolling: false,
  pollingInterval: 1000,
})

const emit = defineEmits<emitsType>()

/** 当前选中的下拉选项值 */
const selectedDropdownValue = ref<string>('')

/** 轮询标志 */
let isPolling = false

/** 轮询类型队列 */
const pollingTypes = ref<string[]>([])

/** 当前轮询的索引 */
const currentPollingIndex = ref<number>(0)

/** 不支持轮询的选项值数组 */
const noPollingValues = ['medicalInsurance', 'medicalInsuranceElectronicVoucher']

/** 过滤后的下拉选项列表 */
const filteredDropdownOptions = computed(() => {
  /** 允许的硬件分类值 */
  const allowedHardwareClassValues = [
    // 身份证
    'idCard',
    // 医保扫脸
    'medicalInsurance',
    // 医保扫码
    'medicalInsuranceElectronicVoucher',
    // 社会保障卡
    'socialWelfareCard',
    // 诊疗卡
    'hospitalCard',
  ]

  const hardwareOptions = hardwareClassList.value
    .filter((item: cardReaderHardwareClassType) => allowedHardwareClassValues.includes(item.dictValue))
    .map((item: cardReaderHardwareClassType) => ({
      label: item.dictItem,
      value: item.dictValue,
      isCustom: false,
      data: item,
    }))

  const customOptions = (props.customDropdownOptions || []).map((item: cardReaderCustomDropdownOptionType) => ({
    ...item,
    isCustom: true,
    data: item,
  }))

  return [...hardwareOptions, ...customOptions]
})

/** 下拉选项类型 */
interface DropdownOptionType {
  value: string
  label: string
  isCustom: boolean
  data: any
}

/** 当前选中项的label */
const currentSelectedLabel = computed(() => {
  if (selectedDropdownValue.value) {
    const selectedOption = filteredDropdownOptions.value.find((option: DropdownOptionType) => option.value === selectedDropdownValue.value)
    return selectedOption?.label || '请选择'
  }
  // 默认显示第一个选项的label
  return filteredDropdownOptions.value[0]?.label || '请选择'
})
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

/**
 * 医保扫码处理函数
 */
async function medicalInsuranceQRCodeHandler() {
  await baseHandler(['medicalInsuranceElectronicVoucher'], 'medicalInsuranceQRCode')
}

/**
 * 医保扫脸处理函数
 */
async function medicalInsuranceFaceScanningHandler() {
  await baseHandler(['medicalInsurance'], 'faceScanning')
}

/** 操作系统对象 */
const systemInfo = ref<cardReaderSystemType | null>(null)

/** 硬件分类列表 */
const hardwareClassList = ref<cardReaderHardwareClassType[]>([])
/** 方法名称列表 */
const funNameList = ref([])

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
 * 获取方法名称列表
 */
async function getFunNameList() {
  const params: cardReaderDictDetailParamsType = {
    dictCode: 'ioType',
    pageNo: 1,
    pageSize: 100,
  }

  try {
    const result = await httpService.get<cardReaderHardwareClassType[]>(
      '/mini-portal/dict/page/detail',
      params,
    )
    funNameList.value = (result || [])
  }
  catch (error) {
    console.error('获取方法名称列表失败:', error)
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
/**
 * 生成插件别名
 * @param item - 插件对象
 * @returns 插件别名
 */
function JoinldcardAlias(item: cardReaderPluginType): string {
  return `${item.pluginType}_${item.pluginName}_${item.code}_${item.company}_${item.model}`
}

/**
 * 调用通用SDK
 * @param osType - 操作系统类型
 * @param pluginType - 插件类型
 * @param funName - 函数名称
 * @returns 调用结果
 */
async function getCallCommonSdk(osType: string, pluginType: string, funName: string) {
  const pluginList = await getPluginList(osType, pluginType)
  if (!pluginList || pluginList.length === 0) {
    return null
  }

  // 先调用 /commonSdk/device/active 接口，入参为 pluginType
  let activeDevice: { alias?: string } | null = null
  try {
    activeDevice = await readService.get<{ alias?: string }>('/commonSdk/device/active', { pluginType })
  }
  catch (error) {
    console.error('调用 /commonSdk/device/active 失败:', error)
  }

  // 根据返回值的 alias 找到对应的 plugin，否则使用第一个
  let selectedPlugin: cardReaderPluginType | null = null
  if (activeDevice?.alias) {
    // 查找 alias 匹配的 plugin
    selectedPlugin = pluginList.find((plugin: cardReaderPluginType) => JoinldcardAlias(plugin) === activeDevice!.alias) || null
  }

  // 如果没有找到匹配的，使用第一个
  if (!selectedPlugin) {
    selectedPlugin = pluginList[0]
  }

  // 对选中的 plugin 执行后续逻辑
  const ioType = selectedPlugin.ioType ? JSON.parse(selectedPlugin.ioType) : []
  for (const ioTypeElement of ioType) {
    const result = await callCommonSdk(selectedPlugin, pluginType, funName || ioTypeElement, ioType)
    const res: Record<string, any> = {}
    if (result) {
      Object.keys(result).forEach((key) => {
        if (!isEmpty((result as any)[key])) {
          res[key] = (result as any)[key]
        }
      })
    }

    if (!isEmpty(res)) {
      return res
    }
  }
  return null
}

/**
 * 调用 CommonSdk 接口
 * @param plugin - 插件对象
 * @param pluginType - 插件类型
 * @param funName - 函数名称
 * @param ioType - IO类型数组
 * @returns 调用结果
 */
async function callCommonSdk(plugin: cardReaderPluginType, pluginType: string, funName: string, ioType: string[]) {
  // 构建参数：包含插件对象的所有属性、pluginType 和 props 中的所有插件相关属性
  const params: cardReaderCommonSdkParamsType = {
    ...plugin,
    pluginType,
    funName,
    ioType: JSON.stringify(ioType),
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
// getFunNameList()

// 监听下拉选项列表变化，默认选中第一个选项
watch(
  filteredDropdownOptions,
  (options: any[]) => {
    if (options.length > 0 && !selectedDropdownValue.value) {
      selectedDropdownValue.value = options[0].value
    }
  },
  { immediate: true },
)

/**
 * 执行轮询
 */
async function executePolling() {
  if (!props.enablePolling || !isPolling) {
    return
  }

  // 如果轮询队列为空，停止轮询
  if (pollingTypes.value.length === 0) {
    stopPolling()
    return
  }

  // 过滤掉不支持轮询的类型（医保的两个类型不轮询）
  const validTypes = pollingTypes.value.filter((type: string) => !noPollingValues.includes(type))

  if (validTypes.length === 0) {
    stopPolling()
    return
  }

  // 依次执行每个类型的读卡，只要有一个成功就停止轮询
  for (let i = 0; i < validTypes.length; i++) {
    if (!isPolling) {
      // 如果轮询被停止，中断循环
      break
    }

    currentPollingIndex.value = i
    const cardType = validTypes[i]

    // 执行读卡
    const result = await handleReadCardByType([cardType])

    // 如果读卡成功，停止轮询
    if (result && !isEmpty(result)) {
      stopPolling()
      return
    }
  }

  // 重置索引，准备下一轮循环
  currentPollingIndex.value = 0

  // 等待指定时间后继续下一次轮询循环
  if (isPolling) {
    setTimeout(() => {
      if (isPolling) {
        executePolling()
      }
    }, props.pollingInterval)
  }
}

/**
 * 启动轮询
 * @param types - 要轮询的卡片类型数组，如果不传则使用当前选中的类型
 */
function startPolling(types?: string[]) {
  if (isPolling) {
    return
  }

  // 如果传入了类型数组，使用传入的类型；否则使用当前选中的类型
  if (types && types.length > 0) {
    pollingTypes.value = types
  }
  else if (selectedDropdownValue.value) {
    pollingTypes.value = [selectedDropdownValue.value]
  }
  else {
    return
  }

  // 过滤掉不支持轮询的类型
  pollingTypes.value = pollingTypes.value.filter((type: string) => !noPollingValues.includes(type))

  if (pollingTypes.value.length === 0) {
    return
  }

  isPolling = true
  currentPollingIndex.value = 0
  executePolling()
}

/**
 * 停止轮询
 */
function stopPolling() {
  isPolling = false
  pollingTypes.value = []
  currentPollingIndex.value = 0
  emit('pollingStopped')
}

// 监听轮询配置变化，当禁用轮询时停止轮询
watch(
  () => props.enablePolling,
  (newValue: boolean) => {
    if (!newValue) {
      stopPolling()
    }
  },
)

// 组件卸载时清理定时器
onBeforeUnmount(() => {
  stopPolling()
})

/**
 * 处理下拉按钮点击事件
 */
function handleDropdownClick() {
  if (selectedDropdownValue.value) {
    handleCardTypeChange(selectedDropdownValue.value)
  }
}

/**
 * 处理下拉选择变化事件
 */
async function handleCardTypeChange(value: string) {
  selectedDropdownValue.value = value
  const selectedOption = filteredDropdownOptions.value.find((option: any) => option.value === value)
  if (!selectedOption) {
    return
  }

  // 如果是自定义选项，直接触发读卡成功事件
  if (selectedOption.isCustom) {
    emit('readSuccess', selectedOption.data)
    return
  }

  // 如果是硬件分类选项
  // 如果启用轮询且不在不支持轮询的数组中，启动轮询（轮询中会读卡）
  if (props.enablePolling && value && !noPollingValues.includes(value)) {
    startPolling([value])
  }
  else {
    // 否则只读一次卡
    // handleReadCardByType内部已经处理了失败情况的emit
    await handleReadCardByType([value])
  }
}

/**
 * 根据类型处理读卡
 * @param cardTypes - 卡片类型或类型数组
 * @returns 读卡结果，如果传入多个类型，返回第一个成功的结果，只要有一个成功就返回
 */
async function handleReadCardByType(cardTypes: string | string[]) {
  const types = Array.isArray(cardTypes) ? cardTypes : [cardTypes]
  // 检查前置条件
  if (!hardwareClassList.value?.length) {
    const error = new Error('请等待插件分类请求')
    emit('readError', error)
    return null
  }
  if (!systemInfo.value?.dictValue) {
    const error = new Error('请等待系统信息请求')
    emit('readError', error)
    return null
  }
  // 如果传入多个类型，依次尝试，只要有一个成功就返回
  for (const cardType of types) {
    const result = await baseHandler([cardType])
    if (result && !isEmpty(result)) {
      return result
    }
  }
  // 所有类型都读卡失败，emit失败事件
  emit('readError', new Error('读卡失败：所有卡片类型均未读取到数据'))
  return null
}
/**
 * 基础处理函数
 * @param idCards - 身份证类型数组
 * @param funName - 函数名称
 * @returns 处理结果
 */
async function baseHandler(idCards: string[] = [], funName?: string) {
  const list = hardwareClassList.value?.filter((item: cardReaderHardwareClassType) => idCards.includes(item.dictValue)) || []
  if (!list?.length) {
    ElMessage.warning('请等待插件分类请求')
    return null
  }
  if (!systemInfo.value?.dictValue) {
    ElMessage.warning('请等待系统信息请求')
    return null
  }
  for (const hardwareClass of list) {
    const res = await getCallCommonSdk(systemInfo.value.dictValue, hardwareClass.dictValue, funName || '')

    if (!isEmpty(res)) {
      emit('readSuccess', res)
      return res
    }
  }
  // 所有硬件分类都读卡失败，但不在这里emit，由调用方统一处理
  return null
}
// 暴露方法供外部调用
defineExpose({
  handleReadCardByType,
  startPolling,
  stopPolling,
})
</script>

<style scoped>
</style>
