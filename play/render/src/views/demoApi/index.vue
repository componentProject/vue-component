<template>
  <div class="demo-api">
    <h2>用户管理</h2>

    <!-- 创建用户表单 -->
    <div class="create-form">
      <h3>创建用户</h3>
      <input v-model="newUser.name" placeholder="用户名">
      <input v-model="newUser.email" placeholder="邮箱">
      <button @click="handleCreate">
        创建
      </button>
    </div>

    <!-- 用户列表 -->
    <div class="user-list">
      <h3>用户列表</h3>
      <div v-for="user in users" :key="user.id" class="user-item">
        <span>{{ user.name }}</span>
        <span>{{ user.email }}</span>
        <button @click="handleDelete(user.id)">
          删除
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreateUserDto, User } from '@/api/services/demo.ts'
import { onMounted, ref } from 'vue'
import { UserApi } from '@/api'

const userApi = new UserApi()
const users = ref<User[]>([])
const newUser = ref<CreateUserDto>({
  name: '',
  email: '',
})

// 获取用户列表
async function fetchUsers() {
  try {
    users.value = await userApi.getUsers()
  }
  catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

// 创建用户
async function handleCreate() {
  try {
    await userApi.createUser(newUser.value)
    newUser.value = { name: '', email: '' }
    await fetchUsers()
  }
  catch (error) {
    console.error('创建用户失败:', error)
  }
}

// 删除用户
async function handleDelete(id: number) {
  try {
    await userApi.deleteUser(id)
    await fetchUsers()
  }
  catch (error) {
    console.error('删除用户失败:', error)
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.demo-api {
  padding: 20px;
}

.create-form {
  margin-bottom: 20px;
}

.create-form input {
  margin-right: 10px;
  padding: 5px;
}

.user-list {
  border: 1px solid #eee;
  padding: 10px;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.user-item span {
  margin-right: 20px;
}

button {
  padding: 5px 10px;
  cursor: pointer;
}
</style>
