import type { TreeNode } from '@designable/core'
import { AppendNodeEvent } from '@designable/core'
import { useDesigner } from '@moluoxixi/element-prototypes'
import { matchChildComponent, matchComponent } from '../shared'

export function useDropTemplate(name: string, getChildren: (source: TreeNode[]) => TreeNode[]) {
  return useDesigner((designer) => {
    return designer.subscribeTo(AppendNodeEvent, (event) => {
      const { source, target } = event.data
      if (Array.isArray(target))
        return
      if (!Array.isArray(source))
        return
      if (
        matchComponent(
          target,
          key =>
            key === name
            && source.every(child => !matchChildComponent(child, name)),
        )
        && target.children.length === 0
      ) {
        target.setChildren(...getChildren(source))
        return false
      }
    })
  })
}
