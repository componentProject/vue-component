<!-- CardReader组件主文件 -->
<template>
  <ElInput
    v-bind="$attrs"
    v-model="inputValue"
    :placeholder="props.placeholder"
    @focus="handleInputFocus"
    @keydown.enter="handleInputEnter"
  >
    <template #append>
      <TsSelect
        v-model="selectedPluginType"
        :options="hardwareClassList"
        label="dictItem"
        value="dictValue"
        style="width: 118px"
        :clearable="false"
        @change="handleSelectChange"
      />
    </template>
  </ElInput>
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
import TsSelect from '@moluoxixi/components/TsSelect'
import BaseApi from '@moluoxixi/utils/AjaxPackage/class'
import { ElInput } from 'element-plus'
import { computed, ref, watch } from 'vue'

defineOptions({
  name: 'CardReader',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<propsType>(), {
  placeholder: '请输入或读卡',
  readType: 'enter',
})

const emit = defineEmits<emitsType>()

const inputValue = defineModel({
  type: String,
  default: '',
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

/** 操作系统对象 */
const systemInfo = ref<cardReaderSystemType | null>(null)

/** 硬件分类列表 */
const hardwareClassList = ref<cardReaderHardwareClassType[]>([])

/** 选中的插件类型 */
const selectedPluginType = ref<string>('')

/** 当前使用的插件类型（用于加载插件列表） */
const currentPluginType = computed(() => selectedPluginType.value || props.pluginType || '')

/** 插件列表 */
const pluginList = ref<cardReaderPluginType[]>([])

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
    const result
      = await httpService.get<cardReaderSystemType[]>(
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
    hardwareClassList.value = result || []
    // 如果没有传入 pluginType，则取列表第一个的 dictValue
    if (!props.pluginType && hardwareClassList.value.length > 0) {
      selectedPluginType.value = hardwareClassList.value[0].dictValue
    }
    else if (props.pluginType) {
      selectedPluginType.value = props.pluginType
    }
    return result
  }
  catch (error) {
    console.error('获取硬件分类列表失败:', error)
    return null
  }
}

/**
 * 获取插件列表
 */
async function getPluginList(osType: string) {
  const params: cardReaderPluginParamsType = {
    pageNo: 1,
    pageSize: 100,
    company: '',
    model: '',
    osType,
    pluginType: currentPluginType.value,
    searchKey: '',
  }

  try {
    const result = await httpService.get<cardReaderPluginType[]>(
      '/mini-portal/plugin',
      params,
    )
    pluginList.value = result || []
    return result
  }
  catch (error) {
    console.error('获取插件列表失败:', error)
    return null
  }
}

/**
 * 调用 CommonSdk 接口
 */
async function callCommonSdk(plugin: cardReaderPluginType) {
  // 构建参数：包含插件对象的所有属性、pluginType 和 props 中的所有插件相关属性
  const params: cardReaderCommonSdkParamsType = {
    ...plugin,
    pluginType: currentPluginType.value,
    // 合并 props 中的插件相关属性（如果存在）
    ...(Object.keys(props).reduce((acc, key) => {
      if (
        key !== 'placeholder'
        && key !== 'pluginType'
        && key !== 'readType'
        && props[key as keyof typeof props] !== undefined
      ) {
        acc[key] = props[key as keyof typeof props]
      }
      return acc
    }, {} as Record<string, any>)),
  }

  try {
    const result = await httpService.post('/commonSdk/index', params)
    return result
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
 * 监听 currentPluginType 和 systemInfo 的变化，都存在时调用 getPluginList
 */
watch(
  [() => currentPluginType.value, () => systemInfo.value],
  async () => {
    // 判断 systemInfo 和 pluginType 都有值才调用
    if (systemInfo.value?.dictValue && currentPluginType.value) {
      await getPluginList(systemInfo.value.dictValue)
    }
  },
  { immediate: true },
)

/**
 * 处理输入框聚焦事件
 */
function handleInputFocus() {
  if (props.readType === 'focus') {
    handleReadCard()
  }
}
/**
 * 处理输入框回车事件
 */
function handleInputEnter() {
  if (props.readType === 'enter') {
    handleReadCard()
  }
}

/**
 * 处理选择器变化事件
 */
function handleSelectChange() {
  if (props.readType === 'select') {
    handleReadCard()
  }
}

/**
 * 处理读卡
 */
async function handleReadCard() {
  // 使用 for await 遍历插件列表，调用 CommonSdk
  if (currentPluginType.value && pluginList.value && pluginList.value.length > 0) {
    for await (const plugin of pluginList.value) {
      await callCommonSdk(plugin)
    }
  }
}

// 暴露方法供外部调用
defineExpose({
  handleReadCard,
})
</script>

<style scoped>
</style>
