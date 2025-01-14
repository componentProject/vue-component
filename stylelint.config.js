export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-standard-less',
    'stylelint-config-standard-vue',
  ],
  rules: {
    // 在这里可以自定义的规则，覆盖默认的规则
    'selector-class-pattern': null,
  },
}
