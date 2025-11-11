<template>
  <div class="space-y-6">
    <!-- 旧版本 tabList 模式示例 -->
    <div>
      <h3 class="text-lg font-semibold mb-4">
        旧版本 tabList 模式
      </h3>
      <Tabs v-model="activeTab" :tab-list="tabList">
        <template #用户管理>
          <div class="p-4">
            用户管理内容
          </div>
        </template>

        <template #配置管理>
          <div class="p-4">
            配置管理内容
          </div>
        </template>

        <template #角色管理>
          <div class="p-4">
            角色管理内容
          </div>
        </template>

        <template #任务调度>
          <div class="p-4">
            任务调度内容
          </div>
        </template>
      </Tabs>
    </div>

    <!-- 新版本 options 模式示例 -->
    <div>
      <h3 class="text-lg font-semibold mb-4">
        新版本 options 模式
      </h3>
      <Tabs v-model="activeTab2" :options="optionsData" label="title" value="id">
        <template #首页>
          <div class="p-4">
            首页内容
          </div>
        </template>

        <template #产品>
          <div class="p-4">
            产品内容
          </div>
        </template>

        <template #关于我们>
          <div class="p-4">
            关于我们内容
          </div>
        </template>

        <template #联系我们>
          <div class="p-4">
            联系我们内容
          </div>
        </template>
      </Tabs>
    </div>

    <!-- 带禁用功能的 options 模式示例 -->
    <div>
      <h3 class="text-lg font-semibold mb-4">
        带禁用功能的 options 模式
      </h3>
      <Tabs
        v-model="activeTab3"
        :options="optionsWithDisabled"
        label="name"
        value="code"
        :disabled-values="['disabled-tab']"
      >
        <template #正常标签页>
          <div class="p-4">
            这是正常的标签页
          </div>
        </template>

        <template #禁用标签页>
          <div class="p-4">
            这个标签页被禁用了
          </div>
        </template>

        <template #另一个正常标签页>
          <div class="p-4">
            这是另一个正常的标签页
          </div>
        </template>
      </Tabs>
    </div>

    <!-- 自定义字段名的 options 模式示例 -->
    <div>
      <h3 class="text-lg font-semibold mb-4">
        自定义字段名的 options 模式
      </h3>
      <Tabs
        v-model="activeTab4"
        :options="customFieldOptions"
        label-key="displayName"
        value-key="tabId"
      >
        <template #标签页A>
          <div class="p-4">
            标签页A的内容
          </div>
        </template>

        <template #标签页B>
          <div class="p-4">
            标签页B的内容
          </div>
        </template>

        <template #标签页C>
          <div class="p-4">
            标签页C的内容
          </div>
        </template>
      </Tabs>
    </div>

    <!-- 直接绑定item属性的示例 -->
    <div>
      <h3 class="text-lg font-semibold mb-4">
        直接绑定item属性的示例
      </h3>
      <Tabs
        v-model="activeTab5"
        :options="advancedOptions"
        label="title"
        value="id"
      >
        <template #懒加载标签页>
          <div class="p-4">
            这是懒加载的标签页内容
          </div>
        </template>

        <template #可关闭标签页>
          <div class="p-4">
            这是可关闭的标签页内容
          </div>
        </template>

        <template #普通标签页>
          <div class="p-4">
            这是普通的标签页内容
          </div>
        </template>
      </Tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Tabs from './index.vue'

// 旧版本 tabList 模式
const activeTab = ref('user')
const tabList = [
  { label: '用户管理', name: 'user' },
  { label: '配置管理', name: 'config' },
  { label: '角色管理', name: 'role' },
  { label: '任务调度', name: 'task' },
]

// 新版本 options 模式
const activeTab2 = ref('home')
const optionsData = [
  { id: 'home', title: '首页', lazy: true },
  { id: 'product', title: '产品', lazy: false },
  { id: 'about', title: '关于我们', lazy: true },
  { id: 'contact', title: '联系我们', lazy: false },
]

// 带禁用功能的 options 模式
const activeTab3 = ref('normal-tab')
const optionsWithDisabled = [
  { code: 'normal-tab', name: '正常标签页' },
  { code: 'disabled-tab', name: '禁用标签页' },
  { code: 'another-normal', name: '另一个正常标签页' },
]

// 自定义字段名的 options 模式
const activeTab4 = ref('tab-a')
const customFieldOptions = [
  { tabId: 'tab-a', displayName: '标签页A' },
  { tabId: 'tab-b', displayName: '标签页B' },
  { tabId: 'tab-c', displayName: '标签页C' },
]

// 直接绑定item属性的示例
const activeTab5 = ref('lazy-tab')
const advancedOptions = [
  {
    id: 'lazy-tab',
    title: '懒加载标签页',
    lazy: true, // 懒加载
  },
  {
    id: 'closable-tab',
    title: '可关闭标签页',
    closable: true, // 可关闭（如果ElTabPane支持）
  },
  {
    id: 'normal-tab',
    title: '普通标签页',
    lazy: false,
    closable: false,
  },
]
</script>
