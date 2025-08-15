import type { Awaitable, OptionsConfig, TypedFlatConfigItem } from '@antfu/eslint-config'

export type optionsType = OptionsConfig & Omit<TypedFlatConfigItem, 'files'>
export type userConfigType = Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>
