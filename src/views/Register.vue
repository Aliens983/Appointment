<template>
  <div class="auth-page">
    <el-card class="auth-card">
      <h2 class="title">注册</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="0" size="large">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名(4-20 位)" :prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码" show-password :prefix-icon="Lock" />
        </el-form-item>
        <el-form-item prop="nickname">
          <el-input v-model="form.nickname" placeholder="昵称" :prefix-icon="Avatar" />
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="邮箱" :prefix-icon="Message" />
        </el-form-item>
        <el-button type="primary" size="large" class="submit" :loading="loading" @click="onSubmit">注册</el-button>
      </el-form>
      <div class="footer">
        已有账号?<router-link to="/login" class="link">立即登录</router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { User, Lock, Avatar, Message } from '@element-plus/icons-vue'

const router = useRouter()
const store = useStore()
const formRef = ref()
const loading = ref(false)

const form = reactive({ username: '', password: '', nickname: '', email: '' })
const rules = {
  username: [{ required: true, min: 4, max: 20, message: '4-20 位', trigger: 'blur' }],
  password: [{ required: true, min: 6, message: '至少 6 位', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [{ required: true, type: 'email', message: '邮箱格式不正确', trigger: 'blur' }]
}

async function onSubmit() {
  await formRef.value.validate(async valid => {
    if (!valid) return
    loading.value = true
    try {
      await store.dispatch('user/register', form)
      ElMessage.success('注册成功,请登录')
      router.push('/login')
    } catch (e) {} finally { loading.value = false }
  })
}
</script>

<style scoped>
.auth-page { min-height: calc(100vh - 60px - 80px); display: flex; align-items: center; justify-content: center; padding: 24px; }
.auth-card { width: 100%; max-width: 420px; }
.title { text-align: center; margin: 0 0 24px; }
.submit { width: 100%; }
.footer { text-align: center; margin-top: 16px; font-size: 13px; color: #606266; }
.link { color: #5b8def; }
</style>
