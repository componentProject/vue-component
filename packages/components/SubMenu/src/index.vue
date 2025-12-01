<template>
  <template
    v-for="(route, index) in props.routes"
    :key="getRouteKey(route, index)"
  >
    <ElSubMenu
      v-if="hasChildren(route)"
      :teleported="false"
      :index="getRouteIndex(route, index)"
    >
      <template #title>
        {{ getRouteTitle(route) }}
      </template>
      <div :style="`max-height: calc(100vh - ${props.menuHeight || 0}px - 30px);overflow: auto`">
        <SubMenu :routes="route.children ?? []" :menu-height="props.menuHeight" />
      </div>
    </ElSubMenu>

    <ElMenuItem
      v-else
      :index="getRouteIndex(route, index)"
    >
      {{ getRouteTitle(route) }}
    </ElMenuItem>
  </template>
</template>

<script setup lang="ts">
import type { propsType, subMenuRouteType } from './_types'

import { ElMenuItem, ElSubMenu } from 'element-plus'

defineOptions({
  name: 'SubMenu',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<propsType>(), {
  routes: () => [],
  menuHeight: 60,
})

/**
 * 获取节点的唯一 key
 * @param route
 * @param index
 */
function getRouteKey(route: subMenuRouteType, index: number): string {
  return route.path ?? `${index}`
}

/**
 * 获取菜单展示文案
 * @param route 当前节点
 */
function getRouteTitle(route: subMenuRouteType): string {
  const fallback = route.name ?? ''
  const metaTitle = route.meta?.title ?? ''
  return metaTitle || fallback
}

/**
 * 获取 Element Plus 组件要求的 index
 * @param route
 * @param index
 */
function getRouteIndex(route: subMenuRouteType, index: number): string {
  return route.path ?? `${index}`
}

/**
 * 判断节点是否存在子集
 * @param route
 */
function hasChildren(route: subMenuRouteType): boolean {
  return Array.isArray(route.children) && route.children.length > 0
}
</script>
