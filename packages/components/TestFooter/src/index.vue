<template>
  <TsFooter v-if="items.length" :items="items" />
</template>

<script setup lang="ts">
import TsFooter from '@moluoxixi/components/TsFooter'
import { ref } from 'vue'

defineOptions({ name: 'TestFooter' })

const props = defineProps({
  /**
   * 是否显示测试数据
   */
  showTestData: {
    type: Boolean,
    default: true,
  },
  /**
   * 自定义测试数据
   */
  customData: {
    type: Object,
    default: () => ({}),
  },
})

const items = ref<any[]>([])

/**
 * 获取测试数据 - 不调用接口，使用写死的数据
 */
function getTestData() {
  // 默认测试数据
  const defaultTestData = {
    国家医疗机构个人编码: 'TEST001234567890',
    国家定点医疗机构编码: 'HOSPITAL001',
    医保类型: '城镇职工基本医疗保险',
    参保状态: '正常参保',
    个人账户余额: '¥1,234.56',
    最后更新时间: '2024-01-15 10:30:00',
  }

  // 合并自定义数据
  const testData = { ...defaultTestData, ...props.customData }

  // 清空现有数据
  items.value = []

  // 转换为显示格式
  items.value = Object.entries(testData).map(([key, value]) => ({
    text: `${key}: ${value}`,
  }))
}

// 初始化测试数据
if (props.showTestData) {
  getTestData()
}

defineExpose({
  items,
  getTestData,
})
</script>

<style scoped lang="scss"></style>
