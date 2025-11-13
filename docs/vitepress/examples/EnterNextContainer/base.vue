<template>
  <div class="container">
    <EnterNextContainer @no-next-input="handleNoNextInput">
      <ElInput v-model="form.name" class="ipt" placeholder="请输入姓名" />
      <ElInput v-model="form.phone" class="ipt" placeholder="请输入手机号" />
      <ElInput v-model="form.email" class="ipt" placeholder="请输入邮箱" />
      <ElInput v-model="form.address" class="ipt" placeholder="请输入地址" />
    </EnterNextContainer>
    <div class="msg">
      {{ noNextMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElInput } from 'element-plus'
import { ref } from 'vue'

const form = ref({ name: '', phone: '', email: '', address: '' })
const noNextMessage = ref('')

function handleNoNextInput() {
  noNextMessage.value = '已到达最后一个输入框，可以进行下一步操作'
  setTimeout(() => {
    noNextMessage.value = ''
  }, 1500)
}
</script>

<style scoped>
.ipt {
  display: block;
  margin-bottom: 8px;
}
.msg {
  margin-top: 6px;
  font-size: 12px;
  color: #555;
}
</style>
