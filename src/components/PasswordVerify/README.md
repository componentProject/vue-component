# PasswordVerify 密码校验组件

一个可复用的密码校验弹窗组件，支持基本的账号和密码输入，并提供前置、中间和后置插槽以便扩展自定义字段。该组件使用 Vue 3 的 `defineModel` 实现 v-model 绑定，并支持表单校验。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| title | String | '密码校验' | 弹窗标题 |
| modelValue / v-model | Boolean | false | 控制弹窗显示/隐藏 |
| form | Object | {} | 外部表单数据，会与内部表单数据合并 |
| rules | Object | {} | 扩展校验规则，会与默认规则合并 |

## 事件

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| verified | 密码校验成功时触发 | (formData: object) - 包含所有表单数据的对象 |
| close | 弹窗关闭时触发 | - |

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| before | 账号字段之前的内容 |
| default | 账号和密码字段之间的内容 |
| after | 密码字段之后的内容 |

## 校验规则

组件内置了账号和密码的必填校验规则。您可以通过 `rules` 属性传递额外的校验规则，这些规则会与默认规则合并。

```js
// 默认校验规则
const defaultRules = {
  usercode: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}
```

## 表单数据合并

组件会自动监听外部传入的表单数据，并将其合并到内部的响应式表单对象中：

```js
// 监听外部传入的表单数据
watch(
  () => props.form,
  (newForm) => {
    // 将外部表单数据合并到内部表单
    Object.keys(newForm).forEach(key => {
      if (key !== 'usercode' && key !== 'password') {
        formData[key] = newForm[key]
      }
    })
  },
  {
    immediate: true,
    deep: true
  }
)
```

注意：账号和密码字段由组件内部管理，不会被外部表单的同名字段覆盖。

## 使用示例

### 基本使用

```vue
<template>
  <div>
    <el-button @click="dialogVisible = true">打开密码校验</el-button>
    
    <PasswordVerify 
      v-model="dialogVisible" 
      title="操作确认" 
      @verified="onVerified">
    </PasswordVerify>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PasswordVerify from '@/components/PasswordVerify'

const dialogVisible = ref(false)

const onVerified = (formData) => {
  console.log('验证成功', formData)
  // 继续执行后续操作
}
</script>
```

### 扩展字段和自定义校验规则

```vue
<template>
  <div>
    <el-button @click="dialogVisible = true">打开密码校验</el-button>
    
    <PasswordVerify 
      v-model="dialogVisible" 
      title="操作确认" 
      :form="formData"
      :rules="customRules"
      @verified="onVerified">
      <!-- 前置插槽内容 -->
      <template #before>
        <el-form-item label="部门" prop="department">
          <el-input v-model="formData.department" />
        </el-form-item>
      </template>
      
      <!-- 默认插槽（中间内容） -->
      <el-form-item label="执行时间" prop="executeTime">
        <el-date-picker
          style="width: 100%"
          v-model="formData.executeTime"
          type="date"
          placeholder="选择日期" />
      </el-form-item>
      
      <!-- 后置插槽内容 -->
      <template #after>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="formData.remark" />
        </el-form-item>
      </template>
    </PasswordVerify>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import PasswordVerify from '@/components/PasswordVerify'

const dialogVisible = ref(false)
const formData = reactive({
  department: '内科',
  executeTime: '',
  remark: ''
})

// 自定义校验规则
const customRules = {
  // 扩展密码校验规则
  password: [
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
  ],
  // 添加其他字段的校验规则
  department: [
    { required: true, message: '请选择部门', trigger: 'blur' }
  ],
  executeTime: [
    { required: true, message: '请选择执行时间', trigger: 'change' }
  ]
}

const onVerified = (formData) => {
  console.log('验证成功', formData)
  // 继续执行后续操作
}
</script> 