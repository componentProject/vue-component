export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-standard-less',
    'stylelint-config-standard-vue',
  ],
  // 自定义的规则，覆盖默认的规则
  rules: {
    // 禁用 是否应该满足小驼峰 规则
    'selector-class-pattern': null,
    // 禁用 双斜杠注释不应该有空格 规则
    'scss/double-slash-comment-whitespace-inside': null,
    // 使 deep 可用
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep'],
      },
    ],
  },
}
