export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-standard-less',
    'stylelint-config-standard-vue',
  ],
  ignoreFiles: ['src/components/ConfigForm/**'],
  // 明确要检查的文件扩展名（会覆盖其他配置）
  files: ['src/components/**/*.{css,scss,less,vue}'],
  // 自定义的规则，覆盖默认的规则
  rules: {
    // 禁用 是否应该满足小驼峰 规则
    'selector-class-pattern': null,
    // 禁用 双斜杠注释不应该有空格 规则
    'scss/double-slash-comment-whitespace-inside': null,
    // 禁用 空源文件
    'no-empty-source': null,
    // 禁用 scss 的 扩展检测
    'scss/load-partial-extension': null,
    'no-descending-specificity': null,
    'scss/dollar-variable-pattern': null,
    // 使 deep 可用
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep'],
      },
    ],
    // 使 tailwind 可用
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'forward', 'use', 'each'],
      },
    ],
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'forward', 'use', 'each'],
      },
    ],
  },
}
