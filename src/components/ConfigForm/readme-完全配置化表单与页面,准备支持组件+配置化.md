# 用法:

```
formOptions对应el-form配置项,
    formOptions.model对应表单数据,
    formOptions.model会传递给render函数和type对应的组件

rows对应每一行,
    rows中的成员属性,除formItems外,其余配置项会作为el-row配置项

    formItems其成员对应每一列,其成员属性:
        type用于指定使用的内置组件类型,

        render对应自定义jsx,
        renderSlot:'插槽名称',接受configForm的对应插槽,

        tooltipConfig,popoverConfig,popconfirmConfig,分别用来启用每一列是否启用tooltip，popover，popconfirm及其配置项

        slots用于自定义每一列自定义组件的插槽内容,

        colConfig作为el-col配置项,

        其余配置项会传递给el-form-item
```

# eg:

```vue
<template>
  <wlConfigForm ref="form" :form-options="formOptions" :rows.sync="rows">
    <template #aaa>
      <div>aaa</div>
    </template>
  </wlConfigForm>
</template>

<script>
import { formOptions, getRows } from "./data";
import {defineComponent} from 'vue'
export default defineComponent({
  data() {
    return {
      formOptions,
      rows: getRows.call(this)
    };
  }
};
</script>
```

```js
// ./data.js

export function getRows() {
  return [
    {
      formItems: [
        {
          prop: 'cmdName',
          label: '名称：',
          renderSlot: 'aaa',
        },
        {
          type: 'input',
          prop: 'a',
          label: '名称：',
          colConfig: { span: 4 },
          config: {
            placeholder: '请输入名称',
          },
        },
        {
          type: 'select',
          prop: 'b',
          label: '名称：',
          config: {
            options: [{ label: '测试', value: '1' }],
          },
        },
      ],
    },
  ]
}

export const formOptions = {
  required: true,
  model: {
    a: '',
  },
}
```

# 传递 slot 自定义列

```
rows:[
    {
        formItems: [
            {
              renderSlot: 'aaa' //aaa对应configForm的插槽名称
            }
        ]
    },
]
```

# 给指定组件传递slots

```
rows:[
    {
        formItems: [
            {
              type: 'button',
              config: {
                slots: {
                  default: 'aaa'  //aaa对应configForm的插槽名称
                },
              }
            }
        ]
    },
]
```

# 动态修改属性

```
this.$refs.form.setConfigByProp('a', 'xxx', 'placeholder');

this.$refs.form.setConfigByProp('b', [ {label: '测试',value: '1'}], true);
//等同于
this.$refs.form.setConfigByProp('b', [ {label: '测试',value: '1'}]);
this.$refs.form.setConfigByProp('b', [ {label: '测试',value: '1'}],'options');

this.$refs.form.setColConfigByProp('b', {span: 4});

this.$refs.form.setFormItemByProp('a', '你好', 'label');

```

# formItems

## el-select

```
{
  type: 'select',
  colConfig: {span: 4},
  // 可使用这个,将options的label和value映射到其他属性上
  optionsMap: {
    label: 'aaa'
  },
  prop: 'a',
  config: { options: [ {aaa: '测试',value: '1'}]}
},
```

## el-switch

```
{
  type: 'switch',
  colConfig: { span: 4},
  prop: 'b',
  config: {}
},
```

## el-input

```
{
  type: 'input',
  colConfig: {span: 4},
  prop: 'c',
  config: {}
},
```

## el-slider

```
{
  type: 'slider',
  colConfig: {span: 4},
  prop: 'c',
  config: {}
},
```

## el-table+el-table-column

```
{
  type: 'table',
  colConfig: {span: 4},
  prop: 'd',
  config: {columns: [{ label: '服务', width: '250', prop: 'serviceName' }]}
}
```

## el-checkbox

```
{
  type: 'checkbox',
  colConfig: {span: 4},
  prop: 'd',
  config: {}
}
```

## el-checkbox-group+el-checkbox

```
{
  type: 'checkboxGroup',
  colConfig: { span: 4},
  prop: 'b',
  config: {
    checkboxs:[{label:'1'}]
  }
},
```

## el-checkbox-group+el-checkbox-button

```
{
  type: 'checkboxGroup',
  colConfig: { span: 4},
  prop: 'b',
  config: {
    buttons:[{label:'1'}]
  }
},
```

# 待优化点:

```
目前只支持栅栏布局,
    做成支持flex布局,自己写宽度,剩余flex1
        rows中传一个type:flex,此时不使用el-row和el-col
    支持普通div,
        rows中传一个type:div,此时不使用el-row和el-col

稳定后,支持可视化生成

```
