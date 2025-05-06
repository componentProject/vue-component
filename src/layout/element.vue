<template>
  <el-config-provider :locale="zhCn" :namespace="systemCode" :empty-values="[undefined]">
    <div class="height-100" :style="`--el-color-primary: ${themeColor || '#3A77FF'};`">
      <el-container class="w-full h-full">
        <el-header>
          <div class="w-dvw h-full overflow-x-auto bg-[#327bff] flex justify-center">
              <el-menu :default-active="defaultTab" :ellipsis="false" mode="horizontal" router>
                <template v-for="(route, index) in routes" :key="index">
                  <el-menu-item v-if="!route.children?.length" :index="route.path">{{ route.name }}
                  </el-menu-item>
                  <template v-else>
                    <el-sub-menu v-for="(route, index) in routes" :key="index" :index="route.path">
                      <template #title>{{ route.name }}</template>
                      <template>
                        <el-menu-item
                          v-for="(child, i) in route.children"
                          :key="i"
                          :index="`${route.path}${child.path}`"
                        >
                          {{ child.meta?.title || child.name }}
                        </el-menu-item>
                      </template>
                    </el-sub-menu>
                  </template>
                </template>

              </el-menu>
          </div>
        </el-header>
        <el-main>
          <el-container>
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
import { computed, reactive } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useSystemStore } from '@/stores/system'

const router = useRouter()
const routes = reactive(router.options.routes[0].children)
const systemStore = useSystemStore()
const themeColor = computed(() => systemStore.themeColor)
const systemCode = computed(() => {
  console.log('systemStore.systemCode', systemStore.systemCode)
  return systemStore.systemCode
})
const defaultTab = computed(() => router.currentRoute.value.path)
</script>

<style lang="scss" scoped></style>
