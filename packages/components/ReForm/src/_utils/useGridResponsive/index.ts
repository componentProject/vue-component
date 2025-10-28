/** 导入 Vue 组合式 API */
import { computed, onScopeDispose, ref, unref, watch } from 'vue'
/** 导入 lodash 工具函数 */
import { isNumber, isObject, isUndefined } from 'lodash'
/** 导入 VueUse 工具函数 */
import { useResizeObserver } from '@vueuse/core'
/** 导入 Vue 类型定义 */
import type { Ref } from 'vue'

/** 导入响应式栅格类型 */
import type { ReGridResponsive } from './types'

/** 导入常量定义 */
import {
  CUSTOM_MEDIA_TYPE_REGEX,
  DEFAULT_CUSTOM_MEDIA_TYPE,
  DEFAULT_FORM_GRID_RESPONSIVE,
  DEFAULT_FORM_GRID_RESPONSIVE_ITEMS,
  MEDIA_RULE_REGEX,
} from './constants'

/** 导出常量 */
export {
  CUSTOM_MEDIA_TYPE_REGEX,
  DEFAULT_CUSTOM_MEDIA_TYPE,
  DEFAULT_FORM_GRID_RESPONSIVE,
  DEFAULT_FORM_GRID_RESPONSIVE_ITEMS,
  MEDIA_RULE_REGEX,
}

/** 导出类型 */
export type { ReGridResponsive }

/** 获取媒体查询字符串 */
export function getMedia(key: string) {
  /** 如果键存在于默认配置中，返回对应的媒体查询 */
  return Reflect.has(DEFAULT_FORM_GRID_RESPONSIVE_ITEMS, key)
    ? DEFAULT_FORM_GRID_RESPONSIVE_ITEMS[key]
    : key.replace('_', DEFAULT_CUSTOM_MEDIA_TYPE)
}

/** 排序响应式配置键名 */
export function sortResponsive(responsive: ReGridResponsive): string[] {
  /** 获取所有键名 */
  const allKeys = Object.keys(responsive)
  /** 按媒体查询值排序 */
  return allKeys.sort((a: string, b: string) => {
    /** 获取媒体查询字符串 */
    const aMedia = getMedia(a)
    const bMedia = getMedia(b)

    /** 匹配媒体查询规则 */
    const aMatch = aMedia.match(MEDIA_RULE_REGEX)
    const bMatch = bMedia.match(MEDIA_RULE_REGEX)
    /** 计算像素值差异 */
    const diff = Number.parseInt(aMatch[2]) - Number.parseInt(bMatch[2])
    /** 如果媒体查询值相同 */
    if (diff === 0) {
      /** 判断符号优先级 < <= >= > */
      if (aMatch[1] === bMatch[1])
        return 0
      if (aMatch[1] === '<')
        return -1
      if (aMatch[1] === '<=' && bMatch[1] !== '<')
        return -1
      if (aMatch[1] === '>=' && bMatch[1] === '>')
        return -1
      return 1
    }
    /** 返回像素值差异 */
    return diff
  })
}

/** 匹配响应式配置 */
export function matchResponsive(
  width: number,
  responsive: ReGridResponsive,
): number {
  /** 初始化匹配值 */
  let match = DEFAULT_FORM_GRID_RESPONSIVE
  /** 获取排序后的媒体查询键名 */
  const medias = sortResponsive(responsive).reverse()
  /** 标记是否匹配 */
  let isMatch = false
  /** 遍历媒体查询 */
  for (const item of medias) {
    /** 获取媒体查询字符串 */
    const media = getMedia(item)
    /** 匹配媒体查询规则 */
    const itemMatchs = media.match(MEDIA_RULE_REGEX)
    // if (!itemMatchs || !itemMatchs[0]) continue;
    /** 如果匹配成功 */
    if (itemMatchs[1] && itemMatchs[2]) {
      /** 获取像素值 */
      const size = Number.parseInt(itemMatchs[2])
      /** 根据比较符号执行不同的匹配逻辑 */
      switch (itemMatchs[1]) {
        case '>':
          /** 大于 */
          if (width > size) {
            match = responsive[item] ?? DEFAULT_FORM_GRID_RESPONSIVE
            isMatch = true
          }
          break
        case '>=':
          /** 大于等于 */
          if (width >= size) {
            match = responsive[item] ?? DEFAULT_FORM_GRID_RESPONSIVE
            isMatch = true
          }
          break
        case '<':
          /** 小于 */
          if (width < size) {
            match = responsive[item] ?? DEFAULT_FORM_GRID_RESPONSIVE
            isMatch = true
          }
          break
        case '<=':
          /** 小于等于 */
          if (width <= size) {
            match = responsive[item] ?? DEFAULT_FORM_GRID_RESPONSIVE
            isMatch = true
          }
          break
      }
      /** 如果匹配成功，跳出循环 */
      if (isMatch)
        break
    }
  }
  /** 返回匹配的栅格数 */
  return match
}

/** 规范化响应式栅格配置 */
export function normalizeGridResponsive(
  span: number | ReGridResponsive,
): ReGridResponsive {
  /** 初始化响应式配置对象 */
  const responsive: ReGridResponsive = {}
  /** 获取默认响应式键名 */
  const responsiveItems = Object.keys(DEFAULT_FORM_GRID_RESPONSIVE_ITEMS)
  /** 遍历默认响应式键名 */
  for (const item of responsiveItems) {
    /** 设置响应式值 */
    responsive[item] = isUndefined(span)
      ? DEFAULT_FORM_GRID_RESPONSIVE
      : isNumber(span)
        ? span
        : span[item]
  }

  /** 自动补充缺少的响应字段 */
  // 优先向上寻找
  for (const item of responsiveItems) {
    /** 如果已定义，跳过 */
    if (!isUndefined(responsive[item]))
      continue
    /** 获取当前项索引 */
    const index = responsiveItems.indexOf(item)
    /** 向上查找 */
    let target = responsiveItems
      .slice(index, -1)
      .find(target => !isUndefined(responsive[target]))
    /** 如果向上没找到 */
    if (isUndefined(target)) {
      /** 向下查找 */
      target = responsiveItems
        .slice(0, index)
        .reverse()
        .find(target => !isUndefined(responsive[target]))
    }
    /** 设置响应式值 */
    responsive[item] = isUndefined(target)
      ? DEFAULT_FORM_GRID_RESPONSIVE
      : responsive[target]
  }

  /** 匹配自定义size响应，默认都按 >= 处理 */
  if (isObject(span)) {
    /** 获取所有键名 */
    const keys = Object.keys(span)
    /** 过滤自定义键名 */
    const customKeys = keys.filter(
      (key: string) =>
        !responsiveItems.includes(key) && CUSTOM_MEDIA_TYPE_REGEX.test(key),
    )
    /** 添加自定义键名 */
    for (const key of customKeys) {
      responsive[key] = span[key]
    }
  }

  /** 返回规范化后的响应式配置 */
  return responsive
}

/** 栅格响应式组合式函数 */
export default function useGridResponsive(
  cols: Ref<number | ReGridResponsive>,
  targetDOM = document.body,
  defaultGrid = 0,
) {
  /** 计算响应式配置 */
  const responsive = computed<ReGridResponsive>(() =>
    normalizeGridResponsive(unref(cols)),
  )

  /** 栅格响应式值 */
  const gridResponsive = ref(defaultGrid)

  /** 响应式宽度 */
  const responsiveWidth = ref(0)
  /** 响应式高度 */
  const responsiveHeight = ref(0)

  /** 监听响应式配置变化 */
  watch(responsive, () => {
    /** 更新栅格响应式值 */
    gridResponsive.value = matchResponsive(
      responsiveWidth.value,
      responsive.value,
    )
  })

  /** 响应监听 */
  const { stop } = useResizeObserver(targetDOM, (entries) => {
    /** 获取尺寸信息 */
    const entry = entries[0]
    const { width, height } = entry.contentRect
    /** 更新响应式尺寸 */
    responsiveWidth.value = width
    responsiveHeight.value = height
    /** 更新栅格响应式值 */
    gridResponsive.value = matchResponsive(width, responsive.value)
  })

  /** 组件卸载时停止监听 */
  onScopeDispose(() => {
    stop()
  })

  /** 返回响应式相关状态 */
  return {
    responsive,
    gridResponsive,
    responsiveWidth,
    responsiveHeight,
  }
}
