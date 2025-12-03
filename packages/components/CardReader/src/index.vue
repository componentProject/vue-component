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
        医保扫码
      </ElButton>
      <ElButton
        v-if="showType === 'face'"
        type="primary"
        v-bind="props.faceButtonProps"
        @click="medicalInsuranceFaceScanningHandler"
      >
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
  faceButtonProps: () => ({}),
  customDropdownOptions: () => [],
  enablePolling: false,
  pollingInterval: 1000,
})

const emit = defineEmits<emitsType>()

/** 当前选中的下拉选项值 */
const selectedDropdownValue = ref<string>('')

/** 轮询标志 */
let isPolling = false

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
    .filter(item => allowedHardwareClassValues.includes(item.dictValue))
    .map(item => ({
      label: item.dictItem,
      value: item.dictValue,
      isCustom: false,
      data: item,
    }))

  const customOptions = (props.customDropdownOptions || []).map(item => ({
    ...item,
    isCustom: true,
    data: item,
  }))

  return [...hardwareOptions, ...customOptions]
})

/** 当前选中项的label */
const currentSelectedLabel = computed(() => {
  if (selectedDropdownValue.value) {
    const selectedOption = filteredDropdownOptions.value.find(option => option.value === selectedDropdownValue.value)
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
  await baseHandler(['medicalInsurance'], 'medicalInsuranceQRCode')
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

  // 如果选中值为空或在不支持轮询的数组中，停止轮询
  if (!selectedDropdownValue.value || noPollingValues.includes(selectedDropdownValue.value)) {
    stopPolling()
    return
  }

  // 执行读卡
  await handleReadCardByType(selectedDropdownValue.value)

  // 等待指定时间后继续下一次轮询
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
 */
function startPolling() {
  if (isPolling) {
    return
  }
  isPolling = true
  executePolling()
}

/**
 * 停止轮询
 */
function stopPolling() {
  isPolling = false
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
    startPolling()
  }
  else {
    // 否则只读一次卡
    await handleReadCardByType(value)
  }
}

/**
 * 根据类型处理读卡
 * @param cardType - 卡片类型
 */
async function handleReadCardByType(cardType: string) {
  await baseHandler([cardType])
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
  return null
}
// 暴露方法供外部调用
defineExpose({
  handleCardTypeChange,
})
</script>

<style scoped>
</style>
