import type { Engine } from '@designable/core'
import { TreeNode } from '@designable/core'

export type ComponentNameMatcher
  = | string
    | string[]
    | ((name: string, node: TreeNode, context?: any) => boolean)

export function matchComponent(node: TreeNode, name: ComponentNameMatcher, context?: any) {
  if (name === '*')
    return true
  const componentName = node?.props?.['x-component']
  if (typeof name === 'function')
    return name(componentName || '', node, context)
  if (Array.isArray(name))
    return name.includes(componentName)
  return componentName === name
}

export function matchChildComponent(node: TreeNode, name: ComponentNameMatcher, context?: any) {
  if (name === '*')
    return true
  const componentName = node?.props?.['x-component']
  if (!componentName)
    return false
  if (typeof name === 'function')
    return name(componentName || '', node, context)
  if (Array.isArray(name))
    return name.includes(componentName)
  return componentName.includes(`${name}.`)
}

export function includesComponent(node: TreeNode, names: ComponentNameMatcher[], target?: TreeNode) {
  return names.some(name => matchComponent(node, name, target))
}

export function queryNodesByComponentPath(node: TreeNode, path: ComponentNameMatcher[]): TreeNode[] {
  if (path?.length === 0)
    return []
  if (path?.length === 1) {
    if (matchComponent(node, path[0])) {
      return [node]
    }
  }
  const result = matchComponent(node, path[0])
    ? node.children.reduce((buf, child) => {
        return buf.concat(queryNodesByComponentPath(child, path.slice(1)))
      }, [])
    : []
  return result
}

export function findNodeByComponentPath(node: TreeNode, path: ComponentNameMatcher[]): TreeNode | undefined {
  if (path?.length === 0)
    return
  if (path?.length === 1) {
    if (matchComponent(node, path[0])) {
      return node
    }
  }
  if (matchComponent(node, path[0])) {
    for (let i = 0; i < node.children.length; i++) {
      const next = findNodeByComponentPath(node.children[i], path.slice(1))
      if (next) {
        return next
      }
    }
  }
}

export function hasNodeByComponentPath(node: TreeNode, path: ComponentNameMatcher[]) {
  return !!findNodeByComponentPath(node, path)
}

export function matchArrayItemsNode(node: TreeNode) {
  return (
    node?.parent?.props?.type === 'array'
    && node?.parent?.children?.[0] === node
  )
}

export function createNodeId(designer: Engine, id: string) {
  return {
    [designer.props.nodeIdAttrName!]: id,
  }
}

export function createEnsureTypeItemsNode(type: string) {
  return (node: TreeNode) => {
    const objectNode = node.children.find(child => child.props?.type === type)
    if (objectNode) {
      return objectNode
    }
    else {
      const newObjectNode = new TreeNode({
        componentName: 'Field',
        props: {
          type,
        },
      })
      node.prepend(newObjectNode)
      return newObjectNode
    }
  }
}
