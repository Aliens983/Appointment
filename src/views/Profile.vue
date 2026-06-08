<template>
  <div class="container page" v-loading="loading">
    <h2 class="title">个人中心</h2>
    <el-row :gutter="16">
      <el-col :xs="24" :md="8">
        <el-card>
          <div class="profile-head">
            <el-avatar :size="72" :src="profile?.avatar">{{ profile?.nickname?.[0] }}</el-avatar>
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :http-request="onUploadAvatar"
              accept="image/*"
              :before-upload="beforeAvatar"
            >
              <el-button size="small" :loading="uploading">更换头像</el-button>
            </el-upload>
          </div>
          <el-descriptions :column="1" class="mt-16">
            <el-descriptions-item label="邮箱">{{ profile?.email || '-' }}</el-descriptions-item>
            <el-descriptions-item label="手机">{{ profile?.phone || '-' }}</el-descriptions-item>
            <el-descriptions-item label="学号">{{ profile?.studentNo || '-' }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ genderLabel }}</el-descriptions-item>
            <el-descriptions-item label="注册时间">{{ fmtDateTime(profile?.createdAt) }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="16">
        <el-card>
          <el-tabs v-model="tab">
            <el-tab-pane label="基本资料" name="info">
              <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" style="max-width: 480px">
                <el-form-item label="昵称" prop="nickname">
                  <el-input v-model="form.nickname" maxlength="12" show-word-limit />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="form.email" />
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                  <el-input v-model="form.phone" placeholder="11 位手机号" maxlength="11" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="saving" @click="onSave">保存</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="修改密码" name="pwd">
              <el-form :model="pwdForm" :rules="pwdRules" ref="pwdFormRef" label-width="100px" style="max-width: 480px">
                <el-form-item label="原密码" prop="oldPassword">
                  <el-input v-model="pwdForm.oldPassword" type="password" show-password />
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                  <el-input v-model="pwdForm.newPassword" type="password" show-password />
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirmPassword">
                  <el-input v-model="pwdForm.confirmPassword" type="password" show-password />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="pwdSaving" @click="onChangePwd">提交</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="隐私设置" name="privacy">
              <div class="privacy">
                <div>
                  <p>默认匿名预约</p>
                  <p class="muted">开启后,创建预约时默认使用匿名身份</p>
                </div>
                <el-switch :model-value="form.defaultAnonymous" :loading="privacySaving" @change="onTogglePrivacy" />
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { fmtDateTime } from '@/utils/format'

const store = useStore()
const router = useRouter()
const loading = ref(false)
const tab = ref('info')
const profile = computed(() => store.state.user.profile)

const formRef = ref()
const pwdFormRef = ref()
const saving = ref(false)
const pwdSaving = ref(false)
const privacySaving = ref(false)
const uploading = ref(false)

const form = reactive({ nickname: '', email: '', phone: '', defaultAnonymous: false })
const pwdForm = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })

const rules = {
  nickname: [{ required: true, min: 1, max: 12, message: '昵称 1-12 字', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^$|^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ]
}

const pwdRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, max: 20, message: '密码 8-20 位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (_r, value, cb) => {
        if (value !== pwdForm.newPassword) cb(new Error('两次输入的密码不一致'))
        else cb()
      },
      trigger: 'blur'
    }
  ]
}

const genderLabel = computed(() => {
  const g = profile.value?.gender
  if (g === 'male') return '男'
  if (g === 'female') return '女'
  if (g === 'other') return '其他'
  return '-'
})

watch(profile, p => {
  if (p) {
    Object.assign(form, {
      nickname: p.nickname || '',
      email: p.email || '',
      phone: p.phone || '',
      defaultAnonymous: !!p.defaultAnonymous
    })
  }
}, { immediate: true })

async function reload() {
  loading.value = true
  try { await store.dispatch('user/loadProfile') } finally { loading.value = false }
}

async function onSave() {
  if (!formRef.value) return
  await formRef.value.validate(async valid => {
    if (!valid) return
    saving.value = true
    try {
      await store.dispatch('user/updateProfile', {
        nickname: form.nickname,
        email: form.email,
        phone: form.phone
      })
      ElMessage.success('已保存')
    } finally { saving.value = false }
  })
}

async function onChangePwd() {
  if (!pwdFormRef.value) return
  await pwdFormRef.value.validate(async valid => {
    if (!valid) return
    pwdSaving.value = true
    try {
      await store.dispatch('user/updatePassword', {
        oldPassword: pwdForm.oldPassword,
        newPassword: pwdForm.newPassword
      })
      ElMessage.success('密码已修改,请重新登录')
      pwdFormRef.value.resetFields()
      // 修改密码成功后退出登录,跳到登录页
      await store.dispatch('user/logout')
      router.push('/login')
    } finally { pwdSaving.value = false }
  })
}

async function onTogglePrivacy(val) {
  privacySaving.value = true
  try {
    await store.dispatch('user/updatePrivacy', { defaultAnonymous: !!val })
    ElMessage.success('已更新')
  } finally { privacySaving.value = false }
}

function beforeAvatar(file) {
  const isImage = /^image\//.test(file.type)
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isImage) ElMessage.error('只支持图片文件')
  if (!isLt5M) ElMessage.error('图片不能超过 5MB')
  return isImage && isLt5M
}

async function onUploadAvatar({ file }) {
  uploading.value = true
  try {
    await store.dispatch('user/uploadAvatar', file)
    ElMessage.success('头像已更新')
  } finally { uploading.value = false }
}

onMounted(reload)
</script>

<style scoped>
.title { margin: 0 0 16px; }
.profile-head { display: flex; gap: 16px; align-items: center; }
.avatar-uploader { display: inline-block; }
.profile-head :deep(.el-avatar) { background: #ebeef5; color: #606266; }
.muted { color: #909399; font-size: 13px; }
.privacy { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; }
.privacy p { margin: 0; }
</style>
