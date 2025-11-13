/** 导入 Vue 类型定义 */
import type { ComputedRef, MaybeRef } from 'vue'
/** 导入表单属性类型 */
import type { ReFormProps } from '../_types'
/** 导入 lodash 工具函数 */
import { isUndefined } from 'lodash'
/** 导入 Vue 组合式 API */
import { computed, unref } from 'vue'
/** 导入栅格响应式工具函数 */
import useGridResponsive, {
  DEFAULT_FORM_GRID_RESPONSIVE,
  matchResponsive,
  normalizeGridResponsive,
} from './useGridResponsive'

/**
 * useGridCols 返回值类型
 */
export interface UseGridColsResult {
  /**
   * 规范化后的列数配置（数字或响应式对象）。
   * 用于断点匹配，决定当前屏幕下应当切分为几列。
   */
  colsComputed: ComputedRef<any>
  /**
   * 当前屏幕宽度档位下一行被切分的列数。
   * grid 模式用于 grid-template-columns，flex 模式用于百分比宽度计算。
   */
  gridResponsive: any
  /**
   * 当前命中的屏幕宽度档位标识（如 'xl' | 'lg' | 'md' | 'sm'）。
   * 供外部在需要时依据此信息做自适应处理。
   */
  responsiveWidth: any
  /**
   * 当前档位下按钮区域应占的列数，且不会超过 gridResponsive。
   * grid 模式用于 `grid-column-start: span X`，flex 模式用于百分比宽度计算。
   */
  localBtnSpan: ComputedRef<any>
}

//#region useGridCols
/**
 * 栅格列数与按钮占比的聚合计算
 * - 输入：列数配置 cols（数字或响应式对象）、按钮区占比 btnSpan（数字或响应式对象）
 * - 输出：当前断点下的实际列数 gridResponsive、断点 responsiveWidth、按钮占比 localBtnSpan
 */
/**
 * 将列数配置与按钮区域占比配置进行聚合，基于当前屏幕宽度档位计算出：
 * - 一行的实际列数（gridResponsive）
 * - 当前档位标识（responsiveWidth）
 * - 按钮区在当前档位下的占比（localBtnSpan）
 *
 * @param cols 列数配置，支持数字或按屏宽档位的响应式对象；为空时使用 DEFAULT_FORM_GRID_RESPONSIVE
 * @param btnSpan 按钮区占比，支持数字或按屏宽档位的响应式对象
 * @returns UseGridColsResult 详见类型注释
 */
export default function useGridCols(
  cols: MaybeRef<ReFormProps['cols']>,
  btnSpan: MaybeRef<ReFormProps['btnSpan']>,
): UseGridColsResult {
  //#region 列数配置计算
  /** 列数配置（空则回落到默认响应式配置） */
  const colsComputed = computed(() => unref(cols) || DEFAULT_FORM_GRID_RESPONSIVE)
  /** 结合断点计算实际列数 */
  const { gridResponsive, responsiveWidth } = useGridResponsive(colsComputed)
  //#endregion

  /** 当前断点下按钮区占比（不超过容器列数） */
  const localBtnSpan = computed(() => {
    const rawBtnSpan = unref(btnSpan)
    if (isUndefined(rawBtnSpan))
      return gridResponsive.value
    const responsiveBtnSpan = normalizeGridResponsive(rawBtnSpan)
    const span = matchResponsive(unref(responsiveWidth), responsiveBtnSpan)
    return Math.min(span, gridResponsive.value)
  })
  return { colsComputed, gridResponsive, responsiveWidth, localBtnSpan }
}
//#endregion useGridCols
