/**
 * 组件规则钩子
 * 提供组件嵌套规则验证相关功能
 */
import { componentRegistry } from '../utils/componentRegistry';
import type { Component } from '../types';
import { logInfo, logError } from '../utils/logger';

/**
 * 组件放置验证结果接口
 */
interface ValidationResult {
  valid: boolean;
  message: string;
  parentId?: string;
}

/**
 * 使用组件规则hook
 * 提供组件嵌套规则的验证方法
 */
export function useComponentRules() {
  /**
   * 验证组件放置是否符合规则
   * @param component 要放置的组件
   * @param componentList 当前组件列表
   * @returns 验证结果
   */
  const validateComponentPlacement = (
    component: Component,
    componentList: Component[]
  ): ValidationResult => {
    try {
      // 获取组件定义
      const componentDef = componentRegistry.getComponent(component.type);
      if (!componentDef) {
        return {
          valid: false,
          message: `未知的组件类型: ${component.type}`
        };
      }
      
      // 检查组件是否有嵌套规则
      if (!componentDef.rules) {
        return { valid: true, message: '组件没有特定的放置规则' };
      }
      
      // 如果组件需要特定的父组件
      if (componentDef.rules.requiredParentComponents?.length) {
        // 查找符合要求的父组件
        const validParent = findValidParent(
          componentList,
          componentDef.rules.requiredParentComponents
        );
        
        if (!validParent) {
          return {
            valid: false,
            message: `组件 ${component.type} 必须放置在 ${componentDef.rules.requiredParentComponents.join(', ')} 内`
          };
        }
        
        // 检查父组件是否已达到子组件数量上限
        if (validParent.children) {
          const parentDef = componentRegistry.getComponent(validParent.type);
          if (
            parentDef?.rules?.maxChildren &&
            validParent.children.length >= parentDef.rules.maxChildren
          ) {
            return {
              valid: false,
              message: `父组件 ${validParent.type} 已达到最大子组件数量 ${parentDef.rules.maxChildren}`
            };
          }
        }
        
        // 验证通过，返回有效父组件ID
        return {
          valid: true,
          message: '组件放置符合规则',
          parentId: validParent.id
        };
      }
      
      // 如果组件只允许在特定的父组件中
      if (componentDef.rules.allowedParentComponents?.length) {
        // 查找符合要求的父组件
        const validParent = findValidParent(
          componentList,
          componentDef.rules.allowedParentComponents
        );
        
        if (validParent) {
          return {
            valid: true,
            message: '组件放置符合规则',
            parentId: validParent.id
          };
        }
      }
      
      // 默认允许放置
      return {
        valid: true,
        message: '组件放置符合规则'
      };
    } catch (error) {
      logError('Failed to validate component placement', error);
      return {
        valid: false,
        message: '验证组件放置规则时发生错误'
      };
    }
  };
  
  /**
   * 查找符合要求的父组件
   * @param componentList 组件列表
   * @param parentTypes 允许的父组件类型
   * @returns 找到的父组件，若未找到则返回undefined
   */
  const findValidParent = (
    componentList: Component[],
    parentTypes: string[]
  ): Component | undefined => {
    try {
      for (const component of componentList) {
        // 检查当前组件是否是有效的父组件类型
        if (parentTypes.includes(component.type)) {
          return component;
        }
        
        // 递归检查子组件
        if (component.children && component.children.length > 0) {
          const found = findValidParent(component.children, parentTypes);
          if (found) return found;
        }
        
        // 递归检查插槽中的组件
        if (component.slots) {
          for (const slotName in component.slots) {
            const found = findValidParent(component.slots[slotName], parentTypes);
            if (found) return found;
          }
        }
      }
      
      return undefined;
    } catch (error) {
      logError('Failed to find valid parent component', error);
      return undefined;
    }
  };
  
  /**
   * 验证组件嵌套关系
   * @param componentList 组件列表
   * @returns 是否符合嵌套规则
   */
  const validateComponentNesting = (componentList: Component[]): boolean => {
    try {
      for (const component of componentList) {
        // 获取组件定义
        const componentDef = componentRegistry.getComponent(component.type);
        if (!componentDef) {
          logError('Unknown component type', { type: component.type });
          continue;
        }
        
        // 验证子组件
        if (component.children && component.children.length > 0) {
          // 检查子组件数量上限
          if (
            componentDef.rules?.maxChildren &&
            component.children.length > componentDef.rules.maxChildren
          ) {
            logError('Component exceeds maximum children', {
              type: component.type,
              childrenCount: component.children.length,
              maxChildren: componentDef.rules.maxChildren
            });
            return false;
          }
          
          // 递归验证子组件
          if (!validateComponentNesting(component.children)) {
            return false;
          }
        }
        
        // 验证插槽中的组件
        if (component.slots) {
          for (const slotName in component.slots) {
            if (!validateComponentNesting(component.slots[slotName])) {
              return false;
            }
          }
        }
      }
      
      return true;
    } catch (error) {
      logError('Failed to validate component nesting', error);
      return false;
    }
  };
  
  return {
    validateComponentPlacement,
    validateComponentNesting
  };
} 