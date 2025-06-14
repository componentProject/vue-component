<!--
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-05-07 14:08:20
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-05-09 19:32:19
 * @FilePath: \vue-template\src\layout\element.vue
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
-->
<template>
  <el-config-provider :locale="zhCn" :namespace="systemCode" :empty-values="[undefined]">
    <div
      class="h-full"
      :class="{ 'h-screen': !qiankunWindow.__POWERED_BY_QIANKUN__ }"
      :style="`--el-color-primary: ${themeColor || '#3A77FF'};`"
    >
      <el-container class="w-full h-full">
        <el-header v-if="!qiankunWindow.__POWERED_BY_QIANKUN__" height="30">
          <div class="w-full h-full bg-primary flex justify-center">
            <el-menu :default-active="defaultTab" :ellipsis="false" mode="horizontal" router>
              <subMenu :routes="routes" />
            </el-menu>
          </div>
        </el-header>
        <el-main>
          <el-container class="h-full w-full bg-white">
            <el-main>
              <transition name="fade">
                <router-view v-slot="{ Component, route }">
                  <keep-alive>
                    <component :is="Component" :key="route.path" v-if="route.meta.keep" />
                  </keep-alive>
                  <component :is="Component" :key="route.path" v-if="!route.meta.keep" />
                </router-view>
              </transition>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </div>
  </el-config-provider>
</template>
<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import subMenu from '@/components/subMenu.vue'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import { computed, reactive } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useSystemStore } from '@/stores/modules/system.js'

const router = useRouter()
const routes = reactive(router.options.routes[0].children)
console.log('routes', routes)
const systemStore = useSystemStore()
const themeColor = computed(() => systemStore.themeColor)
const systemCode = computed(() => {
  console.log('systemStore.systemCode', systemStore.systemCode)
  return systemStore.systemCode
})
const defaultTab = computed(() => router.currentRoute.value.path)
</script>

<style lang="scss" scoped></style>
