module.exports = {
  types: [
    { value: 'fix', name: 'fix:      修复缺陷' },
    { value: 'feat', name: 'feat:     新增功能，迭代项目需求' },
    {
      value: 'style',
      name: 'style:    代码格式修改, 注意不是 css 修改',
    },
    {
      value: 'refactor',
      name: 'refactor: 重构代码，非新增功能也非修复缺陷',
    },
    {
      value: 'perf',
      name: 'perf:     优化相关，比如提升性能、体验',
    },
    {
      value: 'chore',
      name: 'chore:    其他修改, 比如改变构建流程、或者增加依赖库、工具等',
    },
    { value: 'revert', name: 'revert:   回滚版本，撤销某次代码提交' },
    { value: 'docs', name: 'docs:    更新文档，仅修改文档不修改代码' },
    { value: 'test', name: 'test:     新增测试，追加测试用例验证代码' },
    { value: 'ci', name: 'ci:      更新脚本，改动CI或执行脚本配置' },
  ],
  // 自定义消息提示
  messages: {
    type: '选择你要提交的更改类型:',
    scope: '此更改的范围是什么(例如组件或文件名)(可选):',
    customScope: '请输入自定义的更改范围(可选):',
    subject: '写一个简短的变更描述(必填):',
    body: '提供更详细的变更描述(可选按回车跳过):',
    breaking: '列出任何破坏性更改(可选按回车跳过):',
    footer: '列出此更改关闭的issues(可选按回车跳过):',
    confirmCommit: '确认提交上述内容?',
  },
  // 限制主题长度
  subjectLimit: 100,
  // // 跳过你想要的问题
  skipQuestions: ['scope', 'customScope', 'body', 'breaking', 'footer'],
  // // 定义可选范围
  // scopes: [{ name: 'accounts' }, { name: 'admin' }, { name: 'exampleScope' }, { name: 'changeMe' }],
  //
  // // 是否使用预备提交信息
  // usePreparedCommit: false, // 从./.git/COMMIT_EDITMSG中重用提交信息
  // // 是否允许票号
  // allowTicketNumber: false,
  // // 是否要求票号
  // isTicketNumberRequired: false,
  // // 票号前缀
  // ticketNumberPrefix: 'TICKET-',
  // // 票号正则表达式
  // ticketNumberRegExp: '\\d{1,5}',
  //
  // // 范围覆盖，需要与类型字段的值匹配。例如：'fix'
  // scopeOverrides: {
  //   fix: [
  //     {name: 'merge'},
  //     {name: 'style'},
  //     {name: 'e2eTest'},
  //     {name: 'unitTest'}
  //   ]
  // },
  // // 是否允许自定义范围
  // allowCustomScopes: true,
  // // 允许破坏性更改的类型
  // allowBreakingChanges: ['feat', 'fix'],

  // // 换行符，用于body和footer字段
  // breaklineChar: '|',
  // // 页脚前缀
  // footerPrefix : 'ISSUES CLOSED:',
  // // 是否首先询问破坏性更改，默认是false
  // askForBreakingChangeFirst : true,
}
