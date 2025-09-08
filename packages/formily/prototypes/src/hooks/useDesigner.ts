import type { Engine } from '@designable/core'
import { DesignerEngineSymbol } from '../shared'
import { isFn } from '@designable/shared'
import type { Ref } from 'vue-demi'
import { inject, onBeforeUnmount, ref } from 'vue-demi'

export interface IEffects {
  (engine: Engine): void
}

export function useDesigner(effects?: IEffects): Ref<Engine> {
  const designer = window.__DESIGNABLE_ENGINE__
    ? ref(window.__DESIGNABLE_ENGINE__)
    : inject(DesignerEngineSymbol, ref())

  const unRef: any = isFn(effects) ? effects(designer.value) : undefined

  onBeforeUnmount(() => {
    unRef?.()
  })
  return designer
}
