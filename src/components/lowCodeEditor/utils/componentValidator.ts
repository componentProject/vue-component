import type { Component } from '../types'

/**
 * 组件嵌套规则验证
 * 验证子组件是否可以放置在父组件中
 */
export function validateComponentNesting(
  childComponent: Component,
  parentComponent: Component,
): boolean {
  try {
    // 检查父组件是否有规则限制
    if (!parentComponent.rules?.length) {
      return true // 没有规则限制，允许任何组件嵌套
    }

    // 获取父组件允许的子组件类型
    const allowedChildren = parentComponent.rules.flatMap((rule) => rule.childrenType || [])

    // 检查是否达到最大子组件限制
    const maxChildrenRule = parentComponent.rules.find((rule) => rule.maxChildren !== undefined)
    if (maxChildrenRule && maxChildrenRule.maxChildren !== undefined) {
      const currentChildrenCount = parentComponent.children?.length || 0
      if (currentChildrenCount >= maxChildrenRule.maxChildren) {
        return false // 超过最大子组件数量限制
      }
    }

    // 如果没有明确指定允许的子组件类型，则默认允许
    if (allowedChildren.length === 0) {
      return true
    }

    // 检查子组件类型是否在允许列表中
    return allowedChildren.includes(childComponent.type)
  } catch (error) {
    console.error('组件嵌套规则验证失败:', error)
    return false
  }
}

/**
 * 检查特定组件嵌套规则
 * 用于验证布局组件等特殊组件的嵌套关系
 */
export function checkSpecialNestingRules(childType: string, parentType: string): boolean {
  try {
    // el-col只能放在el-row中
    if (childType === 'el-col' && parentType !== 'el-row') {
      return false
    }

    // 基础组件和图表组件只能放在布局组件中
    const layoutComponents = [
      'el-row',
      'el-col',
      'el-container',
      'el-header',
      'el-aside',
      'el-main',
      'el-footer',
    ]
    const isChildBasicOrChart = !layoutComponents.includes(childType)
    const isParentLayout = layoutComponents.includes(parentType)

    if (isChildBasicOrChart && !isParentLayout) {
      return false
    }

    return true
  } catch (error) {
    console.error('特殊嵌套规则检查失败:', error)
    return false
  }
}
