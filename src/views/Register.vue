<template>
  <div class="auth-page">
    <el-card class="auth-card">
      <h2 class="title">注册</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="0" size="large">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名(4-20 位字母数字下划线)" :prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码(8-20 位)" show-password :prefix-icon="Lock" />
        </el-form-item>
        <el-form-item prop="nickname">
          <el-input v-model="form.nickname" placeholder="昵称(1-12 字)" :prefix-icon="Avatar" />
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="邮箱" :prefix-icon="Message" />
        </el-form-item>
        <el-form-item prop="phone">
          <el-input v-model="form.phone" placeholder="手机号(可选)" :prefix-icon="Phone" />
        </el-form-item>
        <el-form-item prop="studentNo">
          <el-input v-model="form.studentNo" placeholder="学号(可选)" :prefix-icon="Postcard" />
        </el-form-item>
        <el-form-item prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio value="male">男</el-radio>
            <el-radio value="female">女</el-radio>
            <el-radio value="other">其他</el-radio>
          </el-radio-group>
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
import { User, Lock, Avatar, Message, Phone, Postcard } from '@element-plus/icons-vue'

const router = useRouter()
const store = useStore()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
  nickname: '',
  email: '',
  phone: '',
  studentNo: '',
  gender: 'other'
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 20, message: '长度 4-20', trigger: 'blur' },
    { pattern: /^[A-Za-z0-9_]+$/, message: '仅允许字母数字下划线', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 20, message: '密码 8-20 位', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { max: 12, message: '昵称不超过 12 字', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^$|^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ]
}

async function onSubmit() {
  if (!formRef.value) return
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
.auth-card { width: 100%; max-width: 480px; }
.title { text-align: center; margin: 0 0 24px; }
.submit { width: 100%; }
.footer { text-align: center; margin-top: 16px; font-size: 13px; color: #606266; }
.link { color: #5b8def; }
</style>
