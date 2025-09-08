import { TreeNodeSymbol, useContext } from '../shared'

export function useTreeNode() {
  return useContext(TreeNodeSymbol)
}
