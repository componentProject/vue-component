# ConfigForm 完全配置化表单与页面组件

（以下为原文档内容，详细用法、参数、示例等）

用法:

formOptions对应el-form配置项,
    formOptions.model对应表单数据,
    formOptions.model会传递给render函数和type对应的组件

rows对应每一行,
    rows中的成员属性,除formItems外,其余配置项会作为el-row配置项
    formItems其成员对应每一列,其成员属性:
        type用于指定使用的内置组件类型,
        render对应自定义jsx,
        renderSlot:'插槽名称',接收configForm的对应插槽,
        tooltipConfig,popoverConfig,popconfirmConfig,分别用于启用每一列是否启用tooltip,popover,popconfirm及其配置项
        slots用于自定义每一列自定义组件的插槽内容,
        colConfig作为el-col配置项,
        其余配置项会传递给el-form-item

（其余内容略，详见原文档） 