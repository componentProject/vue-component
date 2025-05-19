import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { uniqueId, cloneDeep } from 'lodash-es'
import type { Component, PageSchema, OperationRecord } from '../types'
import { DEFAULT_PAGE_SCHEMA } from '../constants/schema'
import { validateComponentNesting } from '../utils/componentValidator'

/**
 * 低代码编辑器状态管理
 */
export const useEditorStore = defineStore('lowCodeEditor', () => {
  // 页面Schema
  const pageSchema = ref<PageSchema>(cloneDeep(DEFAULT_PAGE_SCHEMA))

  // 操作历史记录
  const operationHistory = ref<OperationRecord[]>([])

  // 当前历史记录位置
  const historyIndex = ref(-1)

  // 获取页面Schema
  const getPageSchema = computed(() => {
    return pageSchema.value
  })

  /**
   * 生成唯一ID
   */
  function generateUniqueId(prefix: string = 'comp'): string {
    try {
      return uniqueId(`${prefix}_${Date.now()}_`)
    } catch (error) {
      console.error('生成唯一ID失败:', error)
      return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  }

  /**
   * 根据ID查找组件
   */
  function findComponentById(
    id: string,
    components: Component[] = pageSchema.value.components,
  ): Component | null {
    try {
      for (const comp of components) {
        if (comp.id === id) {
          return comp
        }

        if (comp.children?.length) {
          const found = findComponentById(id, comp.children)
          if (found) return found
        }

        if (comp.slots?.length) {
          for (const slot of comp.slots) {
            if (slot.children?.length) {
              const found = findComponentById(id, slot.children)
              if (found) return found
            }
          }
        }
      }

      return null
    } catch (error) {
      console.error('查找组件失败:', error)
      return null
    }
  }

  /**
   * 获取组件索引
   */
  function getComponentIndex(id: string, components: Component[]): number {
    try {
      return components.findIndex((c) => c.id === id)
    } catch (error) {
      console.error('获取组件索引失败:', error)
      return -1
    }
  }

  /**
   * 获取组件所在的父组件
   */
  function findParentComponent(
    id: string,
    components: Component[] = pageSchema.value.components,
  ): { parent: Component[] | null; parentId: string | null } {
    try {
      // 检查顶层组件
      const index = components.findIndex((c) => c.id === id)
      if (index !== -1) {
        return { parent: components, parentId: pageSchema.value.rootId }
      }

      // 递归检查子组件
      for (const comp of components) {
        if (comp.children?.length) {
          const childIndex = comp.children.findIndex((c) => c.id === id)
          if (childIndex !== -1) {
            return { parent: comp.children, parentId: comp.id }
          }

          const result = findParentComponent(id, comp.children)
          if (result.parent) return result
        }

        // 检查插槽内组件
        if (comp.slots?.length) {
          for (const slot of comp.slots) {
            if (slot.children?.length) {
              const slotChildIndex = slot.children.findIndex((c) => c.id === id)
              if (slotChildIndex !== -1) {
                return { parent: slot.children, parentId: comp.id }
              }

              const result = findParentComponent(id, slot.children)
              if (result.parent) return result
            }
          }
        }
      }

      return { parent: null, parentId: null }
    } catch (error) {
      console.error('查找父组件失败:', error)
      return { parent: null, parentId: null }
    }
  }

  /**
   * 添加组件
   */
  function addComponent(
    component: Component,
    parentId: string = pageSchema.value.rootId,
    index: number = -1,
  ) {
    try {
      // 生成唯一ID
      const newComponent = cloneDeep(component)
      newComponent.id = newComponent.id || generateUniqueId(newComponent.type)
      newComponent.parentId = parentId

      const parent = findComponentById(parentId)

      // 验证组件嵌套规则
      if (parent && !validateComponentNesting(newComponent, parent)) {
        throw new Error(`组件 ${newComponent.type} 不允许添加到 ${parent.type} 中`)
      }

      if (parentId === pageSchema.value.rootId) {
        // 添加到根容器
        if (index >= 0) {
          pageSchema.value.components.splice(index, 0, newComponent)
        } else {
          pageSchema.value.components.push(newComponent)
        }
      } else {
        // 添加到指定父组件
        const parentComponent = findComponentById(parentId)
        if (!parentComponent) {
          throw new Error(`未找到父组件: ${parentId}`)
        }

        if (!parentComponent.children) {
          parentComponent.children = []
        }

        if (index >= 0) {
          parentComponent.children.splice(index, 0, newComponent)
        } else {
          parentComponent.children.push(newComponent)
        }
      }

      // 记录操作历史
      addHistoryRecord({
        id: generateUniqueId('op'),
        type: 'add',
        componentId: newComponent.id,
        timestamp: Date.now(),
        data: { component: newComponent, parentId, index },
      })

      return newComponent
    } catch (error) {
      console.error('添加组件失败:', error)
      throw error
    }
  }

  /**
   * 删除组件
   */
  function deleteComponent(componentId: string) {
    try {
      const { parent, parentId } = findParentComponent(componentId)

      if (!parent) {
        throw new Error(`未找到组件: ${componentId}`)
      }

      const index = getComponentIndex(componentId, parent)
      if (index === -1) {
        throw new Error(`未找到组件索引: ${componentId}`)
      }

      const component = parent[index]
      parent.splice(index, 1)

      // 记录操作历史
      addHistoryRecord({
        id: generateUniqueId('op'),
        type: 'delete',
        componentId,
        timestamp: Date.now(),
        data: { component, parentId, index },
      })
    } catch (error) {
      console.error('删除组件失败:', error)
      throw error
    }
  }

  /**
   * 移动组件
   */
  function moveComponent(componentId: string, targetParentId: string, targetIndex: number) {
    try {
      // 查找源组件及其父组件
      const { parent: sourceParent, parentId: sourceParentId } = findParentComponent(componentId)

      if (!sourceParent || !sourceParentId) {
        throw new Error(`未找到源组件或其父组件: ${componentId}`)
      }

      const sourceIndex = getComponentIndex(componentId, sourceParent)
      if (sourceIndex === -1) {
        throw new Error(`未找到组件索引: ${componentId}`)
      }

      const component = cloneDeep(sourceParent[sourceIndex])

      // 检查目标父组件
      const targetParent =
        targetParentId === pageSchema.value.rootId
          ? pageSchema.value.components
          : findComponentById(targetParentId)?.children

      if (!targetParent) {
        throw new Error(`未找到目标父组件: ${targetParentId}`)
      }

      // 验证组件嵌套规则
      const parentComponent = findComponentById(targetParentId)
      if (parentComponent && !validateComponentNesting(component, parentComponent)) {
        throw new Error(`组件 ${component.type} 不允许移动到 ${parentComponent.type} 中`)
      }

      // 从源位置移除
      sourceParent.splice(sourceIndex, 1)

      // 更新父级ID
      component.parentId = targetParentId

      // 添加到目标位置
      if (targetIndex >= 0 && targetIndex <= targetParent.length) {
        targetParent.splice(targetIndex, 0, component)
      } else {
        targetParent.push(component)
      }

      // 记录操作历史
      addHistoryRecord({
        id: generateUniqueId('op'),
        type: 'move',
        componentId,
        timestamp: Date.now(),
        data: {
          component,
          sourceParentId,
          sourceIndex,
          targetParentId,
          targetIndex,
        },
      })
    } catch (error) {
      console.error('移动组件失败:', error)
      throw error
    }
  }

  /**
   * 更新组件属性
   */
  function updateComponentProperty(componentId: string, propName: string, value: any) {
    try {
      const component = findComponentById(componentId)

      if (!component) {
        throw new Error(`未找到组件: ${componentId}`)
      }

      const oldValue = component.props[propName]

      // 更新属性
      if (propName.startsWith('style.')) {
        const styleProp = propName.split('.')[1]
        if (!component.style) {
          component.style = {}
        }
        component.style[styleProp] = value
      } else {
        component.props[propName] = value
      }

      // 记录操作历史
      addHistoryRecord({
        id: generateUniqueId('op'),
        type: 'update',
        componentId,
        timestamp: Date.now(),
        data: { propName, oldValue, newValue: value },
      })
    } catch (error) {
      console.error('更新组件属性失败:', error)
      throw error
    }
  }

  /**
   * 通过ID获取组件
   */
  function getComponentById(componentId: string): Component | null {
    try {
      return findComponentById(componentId)
    } catch (error) {
      console.error('获取组件失败:', error)
      return null
    }
  }

  /**
   * 导入页面Schema
   */
  function importSchema(schema: PageSchema) {
    try {
      pageSchema.value = cloneDeep(schema)
      // 清空历史记录
      operationHistory.value = []
      historyIndex.value = -1
    } catch (error) {
      console.error('导入Schema失败:', error)
      throw error
    }
  }

  /**
   * 导出页面Schema
   */
  function exportSchema(): PageSchema {
    try {
      return cloneDeep(pageSchema.value)
    } catch (error) {
      console.error('导出Schema失败:', error)
      throw error
    }
  }

  /**
   * 添加历史记录
   */
  function addHistoryRecord(record: OperationRecord) {
    try {
      // 清除当前位置之后的历史记录
      if (historyIndex.value < operationHistory.value.length - 1) {
        operationHistory.value = operationHistory.value.slice(0, historyIndex.value + 1)
      }

      // 添加新记录
      operationHistory.value.push(record)
      historyIndex.value = operationHistory.value.length - 1
    } catch (error) {
      console.error('添加历史记录失败:', error)
    }
  }

  /**
   * 撤销操作
   */
  function undo() {
    try {
      if (historyIndex.value < 0) {
        return false
      }

      const record = operationHistory.value[historyIndex.value]

      // 根据操作类型执行反向操作
      switch (record.type) {
        case 'add':
          deleteComponent(record.componentId)
          break

        case 'delete':
          const { component, parentId, index } = record.data
          addComponent(component, parentId, index)
          break

        case 'update':
          const { propName, oldValue } = record.data
          updateComponentProperty(record.componentId, propName, oldValue)
          break

        case 'move':
          const { sourceParentId, sourceIndex, targetParentId } = record.data
          moveComponent(record.componentId, sourceParentId, sourceIndex)
          break
      }

      // 回退历史位置
      historyIndex.value--
      return true
    } catch (error) {
      console.error('撤销操作失败:', error)
      return false
    }
  }

  /**
   * 重做操作
   */
  function redo() {
    try {
      if (historyIndex.value >= operationHistory.value.length - 1) {
        return false
      }

      historyIndex.value++
      const record = operationHistory.value[historyIndex.value]

      // 根据操作类型执行操作
      switch (record.type) {
        case 'add':
          const { component, parentId, index } = record.data
          addComponent(component, parentId, index)
          break

        case 'delete':
          deleteComponent(record.componentId)
          break

        case 'update':
          const { propName, newValue } = record.data
          updateComponentProperty(record.componentId, propName, newValue)
          break

        case 'move':
          const { targetParentId, targetIndex } = record.data
          moveComponent(record.componentId, targetParentId, targetIndex)
          break
      }

      return true
    } catch (error) {
      console.error('重做操作失败:', error)
      return false
    }
  }

  /**
   * 清空编辑器
   */
  function clearEditor() {
    try {
      pageSchema.value = cloneDeep(DEFAULT_PAGE_SCHEMA)
      operationHistory.value = []
      historyIndex.value = -1
    } catch (error) {
      console.error('清空编辑器失败:', error)
    }
  }

  return {
    pageSchema,
    operationHistory,
    historyIndex,
    getPageSchema,
    addComponent,
    deleteComponent,
    moveComponent,
    updateComponentProperty,
    getComponentById,
    importSchema,
    exportSchema,
    undo,
    redo,
    clearEditor,
    findComponentById,
  }
})
