// _types入口文件
import type { Awaitable, OptionsConfig, TypedFlatConfigItem } from '@antfu/eslint-config'

/**
 * EslintConfig 配置选项类型
 */
export type optionsType = OptionsConfig & Omit<TypedFlatConfigItem, 'files'> & {
  /**
   * 需要忽略的文件模式
   */
  ignores?: string[]
}

/**
 * 用户自定义配置类型
 */
export type userConfigType = Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>

/**
 * createEslintConfig 函数返回类型
 */
export type createEslintConfigReturnType = Awaitable<TypedFlatConfigItem[]>
