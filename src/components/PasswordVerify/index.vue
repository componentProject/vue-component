<template>
  <el-dialog style="width: 400px" :title="title" v-model="dialogVisible" @closed="closeDialog">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="mergedRules"
      label-width="80px"
      label-suffix="："
    >
      <!-- 前置插槽 -->
      <slot name="before"></slot>

      <!--执行时间-->
      <el-form-item :label="props.timeOptions.label" prop="time">
        <DateRangePicker
          v-model="formData.time"
          type="date"
          defaultToday
          v-bind="props.timeOptions"
          style="width: 100%"
        />
      </el-form-item>

      <!-- 账号 -->
      <el-form-item label="账号" prop="usercode">
        <el-input autocomplete="username" v-model="formData.usercode" @keyup.enter="keyUpEnter" />
      </el-form-item>

      <!-- 姓名 -->
      <el-form-item v-if="showName" label="姓名" prop="username">
        <el-input disabled v-model="formData.username" />
      </el-form-item>

      <!-- 中间插槽 -->
      <slot></slot>

      <!-- 密码 -->
      <el-form-item label="密码" prop="password">
        <el-input
          @focus="handleUserCodeChange"
          autocomplete="new-password"
          type="password"
          show-password
          v-model="formData.password"
        />
      </el-form-item>

      <!-- 后置插槽 -->
      <slot name="after"></slot>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="verifyHandler">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { verifyPassword } from '@/api/login.js'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user.js'
import moment from 'moment/moment.js'
import request from '@/utils/request.js'
import { queryMember } from '@/api/costProcess.js'
import { selectRelUser } from '@/api/selectRole.js'
import DateRangePicker from '@/components/DateRangePicker/index.vue'

const props = defineProps({
  title: {
    type: String,
    default: '密码校验',
  },
  rules: {
    type: Object,
    default: () => ({}),
  },
  form: {
    type: Object,
    default: () => ({}),
  },
  showName: {
    type: Boolean,
    default: () => true,
  },
  needTime: {
    type: Boolean,
    default: () => true,
  },
  timeOptions: {
    type: Object,
    default: () => ({
      label: '执行时间',
    }),
  },
})

const emit = defineEmits(['verified', 'close'])
// 表单引用
const formRef = ref(null)

function handleUserCodeChange(e) {
  queryMember([formData.usercode]).then((res) => {
    if (res.Code === 200) {
      formData.username = res.data.list?.[0].name
      Object.assign(formData, res.data.list?.[0])
      formData.deptId = res.data.list?.[0]?.memberDepts[0].deptId
      formData.deptname = res.data.list?.[0]?.memberDepts[0].deptName
    }
  })
}

const keyUpEnter = async () => {
  console.log(userInfo, 'userInfo')
  const res = await selectRelUser({ usercode: formData.usercode, orgId: userInfo?.orgId })
  console.log(res, 'res')
  if (res.statusCode === 200) {
    // debugger
    formData.username = res.object.username
    formData.usercode = res.object.usercode
  } else {
    ElMessage.error('该账号未关联角色')
    formData.username = ''
    formData.usercode = ''
  }
}

// 合并的表单数据
const formData = reactive({
  id: '',
  usercode: '',
  username: '',
  password: '',
  time: [],
})
// 使用 defineModel 替代手动实现 v-model
const dialogVisible = defineModel('modelValue')

const user = useUserStore()
const userInfo = user.getUserInfo

// 监听用户信息
watch(
  () => userInfo,
  () => {
    formData.id = userInfo.id
    formData.usercode = userInfo.usercode
    formData.username = userInfo.username
  },
  {
    immediate: true,
    deep: true,
  },
)

// 监听外部传入的表单数据
watch(
  () => props.form,
  (newForm) => {
    // 将外部表单数据合并到内部表单
    Object.keys(newForm).forEach((key) => {
      if (key !== 'usercode' && key !== 'password') {
        formData[key] = newForm[key]
      }
    })
  },
  {
    immediate: true,
    deep: true,
  },
)

// 默认验证规则
const defaultRules = computed(() => {
  return {
    time: [{ required: true, message: `请选择${props.timeOptions.label}`, trigger: 'change' }],
    username: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    usercode: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  }
})

// 合并默认规则和传入的规则
const mergedRules = computed(() => {
  const rules = { ...defaultRules.value }

  // 合并自定义规则
  Object.keys(props.rules).forEach((key) => {
    if (rules[key]) {
      // 如果已存在默认规则，则合并
      rules[key] = [...rules[key], ...props.rules[key]]
    } else {
      // 如果不存在默认规则，则直接使用自定义规则
      rules[key] = props.rules[key]
    }
  })

  return rules
})

// 关闭弹窗
const closeDialog = () => {
  dialogVisible.value = false
  emit('close')
  // 重置表单
  if (formRef.value) {
    formRef.value.resetFields()
  } else {
    formData.password = ''
  }
}

// 确认按钮处理
const verifyHandler = async () => {
  if (!formRef.value) return

  formRef.value.validate(async (valid) => {
    if (valid) {
      // 验证通过，触发verified事件
      const formDataObj = new FormData()
      formDataObj.append('usercode', formData.usercode)
      formDataObj.append('password', formData.password)
      const res = await verifyPassword(formDataObj)
      if (res.statusCode == 200) {
        if (props.form.types == 1) {
          ElMessage.success('发送成功')
        } else {
          ElMessage.success('校验通过')
        }
        closeDialog()
        emit('verified', {
          ...formData,
          time: formData.time[0],
        })
      } else {
        ElMessage.error(res.message)
      }
    } else {
      // 验证失败
      ElMessage.warning('请完善表单信息')
      return false
    }
  })
}
</script>

<style scoped>
/* 可以添加组件特定的样式 */
</style>
