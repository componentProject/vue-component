/** 导入 Vue 组合式 API */
import { computed, unref } from 'vue'
/** 导入栅格响应式工具函数 */
import useGridResponsive, {
  DEFAULT_FORM_GRID_RESPONSIVE,
  matchResponsive,
  normalizeGridResponsive,
} from './useGridResponsive'
/** 导入 lodash 工具函数 */
import { isUndefined } from 'lodash'
/** 导入 Vue 类型定义 */
import type { MaybeRef } from 'vue'
/** 导入表单属性类型 */
import type { ReFormProps } from '../_types'

/** 栅格列数组合式函数 */
export default function useGridCols(
  cols: MaybeRef<ReFormProps['cols']>,
  btnSpan: MaybeRef<ReFormProps['btnSpan']>,
) {
  /** 计算栅格列数 */
  const colsComputed = computed(
    () => unref(cols) || DEFAULT_FORM_GRID_RESPONSIVE,
  )
  /** 使用栅格响应式工具 */
  const { gridResponsive, responsiveWidth } = useGridResponsive(colsComputed)

  /** 计算按钮组栅格占比 */
  const localBtnSpan = computed(() => {
    /** 如果未定义按钮占比 */
    if (isUndefined(unref(btnSpan)))
      return gridResponsive.value
    /** 规范化响应式按钮占比 */
    const responsiveBtnSpan = normalizeGridResponsive(unref(btnSpan))
    /** 匹配响应式按钮占比 */
    const span = matchResponsive(unref(responsiveWidth), responsiveBtnSpan)
    /** 返回按钮占比，不超过栅格响应式值 */
    return Math.min(span, gridResponsive.value)
  })

  /** 返回栅格相关状态 */
  return {
    colsComputed,
    gridResponsive,
    responsiveWidth,
    localBtnSpan,
  }
}
