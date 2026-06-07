<template>
  <div class="auth-page">
    <el-card class="auth-card">
      <h2 class="title">登录</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="0" size="large">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" :prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码" :prefix-icon="Lock" show-password @keyup.enter="onSubmit" />
        </el-form-item>
        <el-button type="primary" size="large" class="submit" :loading="loading" @click="onSubmit">登录</el-button>
      </el-form>
      <div class="footer">
        还没有账号?<router-link to="/register" class="link">立即注册</router-link>
      </div>
      <div class="tip muted">测试账号:zhangsan / 123456</div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const store = useStore()
const formRef = ref()
const loading = ref(false)

const form = reactive({ username: 'zhangsan', password: '123456' })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

async function onSubmit() {
  if (!formRef.value) return
  await formRef.value.validate(async valid => {
    if (!valid) return
    loading.value = true
    try {
      await store.dispatch('user/login', form)
      ElMessage.success('登录成功')
      const redirect = route.query.redirect || '/'
      router.replace(redirect)
    } catch (e) {
      // 拦截器已提示
    } finally {
      loading.value = false
    }
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
.tip { text-align: center; margin-top: 12px; font-size: 12px; }
.muted { color: #909399; }
</style>
