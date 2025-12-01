import type { Rule, UserConfig } from '@commitlint/types'
import type { Commit } from 'conventional-commits-parser'

// 自定义错误提示信息 - 使用模板字符串，与之前的格式保持一致
const COMMIT_ERROR_MESSAGE = `您的提交信息不符合规范！正确的格式为(示例)：
            'feat: 新增功能，迭代项目需求',
            'style: 代码格式修改, 注意不是 css 修改',
            'perf: 优化相关，比如提升性能、体验',
            'fix: 修复缺陷',
            'refactor: 重构代码，非新增功能也非修复缺陷',
            'test: 新增测试，追加测试用例验证代码',
            'revert: 回滚版本，撤销某次代码提交',
            'merge: 合并分支，合并分支代码到其他分支',
            'docs: 更新文档，仅修改文档不修改代码',
            'build: 编译相关的修改，例如发布版本、对项目构建或者依赖的改动',
            'chore: 其他修改, 比如改变构建流程、或者增加依赖库、工具等',
            'ci: 更新脚本，改动CI或执行脚本配置',`

// Angular 规范允许的提交类型（与 @commitlint/config-conventional 保持一致）
const VALID_TYPES = [
  'build',
  'chore',
  'ci',
  'docs',
  'feat',
  'fix',
  'perf',
  'refactor',
  'revert',
  'style',
  'test',
]

// 创建一个包装规则，复用 Angular 规范的验证逻辑但返回自定义错误消息
// 这个规则会检查所有关键验证点，并在失败时返回友好的中文提示
const customCommitRule: Rule = (parsed: Commit) => {
  const header = parsed.header || ''

  // 1. 检查是否为空
  if (!header.trim()) {
    return [false, COMMIT_ERROR_MESSAGE]
  }

  // 2. 检查基本格式：<type>: <description>
  const formatRegex = /^\w+(?:\(.+\))?:\s.+$/
  if (!formatRegex.test(header)) {
    return [false, COMMIT_ERROR_MESSAGE]
  }

  // 3. 提取并验证 type
  const typeMatch = header.match(/^(\w+)(?:\(.+\))?:/)
  if (!typeMatch) {
    return [false, COMMIT_ERROR_MESSAGE]
  }

  const type = typeMatch[1]
  if (!VALID_TYPES.includes(type)) {
    return [false, COMMIT_ERROR_MESSAGE]
  }

  // 4. 检查 subject 是否存在（使用更简单的正则避免回溯）
  const colonIndex = header.indexOf(':')
  if (colonIndex === -1) {
    return [false, COMMIT_ERROR_MESSAGE]
  }
  const subject = header.slice(colonIndex + 1).trim()
  if (!subject) {
    return [false, COMMIT_ERROR_MESSAGE]
  }

  // 验证通过，config-conventional 的其他规则会继续验证细节
  return [true]
}

const config: UserConfig = {
  ignores: [(commit: string) => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'custom-commit-format': customCommitRule,
      },
    },
  ],
  rules: {
    // 使用自定义规则作为额外的验证层，提供友好的中文错误提示
    // 它会先于 config-conventional 的规则执行，在格式错误时提供友好提示
    'custom-commit-format': [2, 'always'],
  },
}

export default config
