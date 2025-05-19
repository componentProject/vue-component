/**
 * 组件注册表
 * 管理低代码编辑器中可用的组件定义
 */
import type { ComponentDefinition } from '../types';
import { ComponentCategory } from '../types';
import { logInfo, logError } from './logger';
import { basicComponents } from './components/basicComponents';
import { layoutComponents } from './components/layoutComponents';
import { chartComponents } from './components/chartComponents';

/**
 * 组件注册表类
 * 负责管理和提供组件定义
 */
class ComponentRegistry {
  private components: Map<string, ComponentDefinition> = new Map();

  /**
   * 构造函数
   * 初始化组件注册表
   */
  constructor() {
    try {
      this.registerBuiltInComponents();
    } catch (error) {
      logError('Failed to initialize component registry', error);
    }
  }

  /**
   * 注册内置组件
   * 将预定义的组件添加到注册表中
   */
  private registerBuiltInComponents(): void {
    try {
      // 注册基础组件
      basicComponents.forEach(component => {
        this.registerComponent(component);
      });

      // 注册布局组件
      layoutComponents.forEach(component => {
        this.registerComponent(component);
      });

      // 注册图表组件
      chartComponents.forEach(component => {
        this.registerComponent(component);
      });

      logInfo('Built-in components registered', { 
        count: this.components.size 
      });
    } catch (error) {
      logError('Failed to register built-in components', error);
    }
  }

  /**
   * 注册单个组件
   * @param component 组件定义
   * @returns 是否注册成功
   */
  public registerComponent(component: ComponentDefinition): boolean {
    try {
      if (!component.type) {
        logError('Cannot register component without type', { component });
        return false;
      }

      this.components.set(component.type, component);
      logInfo('Component registered', { type: component.type });
      return true;
    } catch (error) {
      logError('Failed to register component', error);
      return false;
    }
  }

  /**
   * 取消注册组件
   * @param componentType 组件类型
   * @returns 是否成功取消注册
   */
  public unregisterComponent(componentType: string): boolean {
    try {
      const result = this.components.delete(componentType);
      logInfo('Component unregistered', { 
        type: componentType,
        success: result
      });
      return result;
    } catch (error) {
      logError('Failed to unregister component', error);
      return false;
    }
  }

  /**
   * 获取指定组件的定义
   * @param componentType 组件类型
   * @returns 组件定义，如果不存在则返回undefined
   */
  public getComponent(componentType: string): ComponentDefinition | undefined {
    try {
      return this.components.get(componentType);
    } catch (error) {
      logError('Failed to get component', error);
      return undefined;
    }
  }

  /**
   * 获取所有注册的组件
   * @returns 组件定义数组
   */
  public getComponents(): ComponentDefinition[] {
    try {
      return Array.from(this.components.values());
    } catch (error) {
      logError('Failed to get all components', error);
      return [];
    }
  }

  /**
   * 获取指定分类的组件
   * @param category 组件分类
   * @returns 该分类的组件定义数组
   */
  public getComponentsByCategory(category: ComponentCategory): ComponentDefinition[] {
    try {
      return Array.from(this.components.values())
        .filter(component => component.category === category);
    } catch (error) {
      logError('Failed to get components by category', error);
      return [];
    }
  }

  /**
   * 清空组件注册表
   */
  public clearRegistry(): void {
    try {
      this.components.clear();
      logInfo('Component registry cleared');
    } catch (error) {
      logError('Failed to clear component registry', error);
    }
  }

  /**
   * 重置组件注册表到初始状态
   */
  public resetRegistry(): void {
    try {
      this.clearRegistry();
      this.registerBuiltInComponents();
      logInfo('Component registry reset');
    } catch (error) {
      logError('Failed to reset component registry', error);
    }
  }
}

// 导出组件注册表单例
export const componentRegistry = new ComponentRegistry(); 