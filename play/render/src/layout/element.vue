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
  <ElConfigProvider :locale="zhCn" :namespace="systemCode" :empty-values="[undefined]">
    <div
      class="h-full"
      :class="{ 'h-screen': !qiankunWindow.__POWERED_BY_QIANKUN__ }"
      :style="`--el-color-primary: ${themeColor || '#3A77FF'};`"
    >
      <ElContainer class="w-full h-full">
        <ElHeader
          v-if="!qiankunWindow.__POWERED_BY_QIANKUN__"
          class="headerbox"
          style="padding: 0"
          height="30"
        >
          <div class="w-full h-full bg-primary flex justify-center">
            <ElMenu :default-active="defaultTab" :ellipsis="false" mode="horizontal" router>
              <subMenu :routes="routes" />
            </ElMenu>
          </div>
        </ElHeader>
        <ElMain>
          <ElContainer class="h-full w-full">
            <ElMain style="background-color: #fff">
              <transition name="fade">
                <RouterView v-slot="{ Component, route }">
                  <keep-alive>
                    <component :is="Component" v-if="route.meta.keep" :key="route.path" />
                  </keep-alive>
                  <component :is="Component" v-if="!route.meta.keep" :key="route.path" />
                </RouterView>
              </transition>
            </ElMain>
          </ElContainer>
        </ElMain>
      </ElContainer>
    </div>
  </ElConfigProvider>
</template>

<script lang="ts" setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { ElConfigProvider, ElContainer, ElHeader, ElMain, ElMenu } from 'element-plus'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import { computed, reactive } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import subMenu from '@moluoxixi/components/subMenu.vue'
import { useSystemStore } from '@/stores/modules/system.ts'

const router = useRouter()
const routes = reactive(router.options.routes[0].children!)
const systemStore = useSystemStore()
const themeColor = computed(() => systemStore.themeColor)
const systemCode = computed(() => {
  return systemStore.systemCode
})
const defaultTab = computed(() => router.currentRoute.value.path)
</script>

<style lang="scss" scoped>
@use 'element-plus/theme-chalk/el-header.css';
@use 'element-plus/theme-chalk/el-menu.css';
@use 'element-plus/theme-chalk/el-main.css';
@use 'element-plus/theme-chalk/el-container.css';
.bg-primary {
  background-color: var(--el-color-primary);
}
.headerbox {
  :deep(.el-menu) {
    background-color: var(--el-color-primary);

    .el-menu-item,
    .el-sub-menu {
      background-color: var(--el-color-primary);
      color: #fff !important;

      .el-sub-menu__title {
        background-color: var(--el-color-primary);
        color: #fff !important;
      }

      &.is-active,
      &:hover {
        background-color: #fff;
        color: var(--el-color-primary) !important;

        .el-sub-menu__title,
        .el-sub-menu__title:hover {
          background-color: #fff;
          color: var(--el-color-primary) !important;
        }
      }
    }

    &.el-menu--popup {
      background-color: #fff;

      .el-sub-menu,
      .el-menu-item {
        background-color: #fff !important;
        color: var(--el-color-primary) !important;

        .el-sub-menu__title {
          background-color: #fff;
          color: var(--el-color-primary) !important;
        }

        &.is-active,
        &:hover {
          background-color: var(--el-color-primary) !important;
          color: #fff !important;

          .el-sub-menu__title,
          .el-sub-menu__title:hover {
            background-color: var(--el-color-primary) !important;
            color: #fff !important;
          }
        }
      }
    }
  }

  :deep(.el-main) {
    --el-main-padding: 12px;
  }
}
</style>
