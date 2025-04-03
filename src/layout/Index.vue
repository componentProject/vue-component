<template>
  <!--   :ellipsis="false" mode="horizontal"-->
  <!--    <el-header></el-header>-->
  <el-container class="w-full h-full">
    <el-aside width="200px" class="h-full">
      <el-scrollbar class="h-full">
        <el-menu class="h-screen" :default-active="defaultTab" router>
          <div v-for="(route, index) in routes" :key="index">
            <el-menu-item v-if="!route.children?.length" :index="`${route.path}`">
              <span>{{ route.meta?.title || route.name }}</span>
            </el-menu-item>
            <el-sub-menu v-else :index="index + ''">
              <template #title>{{ route.name }}</template>
              <el-menu-item
                v-for="(child, i) in route.children"
                :key="i"
                :index="`${route.path}${child.path}`"
              >
                {{ child.meta?.title || child.name }}
              </el-menu-item>
            </el-sub-menu>
          </div>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-main class="mian-content">
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
</template>
<script setup>
import { computed, reactive } from 'vue'
import { RouterView, useRouter } from 'vue-router'

const router = useRouter()
const routes = reactive(router.options.routes[0].children)
console.log('routes', routes)
const defaultTab = computed(() => router.currentRoute.value.path)
</script>

<style lang="scss" scoped></style>
