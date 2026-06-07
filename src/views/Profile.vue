<template>
  <div class="container page" v-loading="loading">
    <h2 class="title">个人中心</h2>
    <el-row :gutter="16">
      <el-col :xs="24" :md="8">
        <el-card>
          <div class="profile-head">
            <el-avatar :size="72" :src="profile?.avatar">{{ profile?.nickname?.[0] }}</el-avatar>
            <div>
              <h3>{{ profile?.nickname }}</h3>
              <p class="muted">@{{ profile?.username }}</p>
            </div>
          </div>
          <el-descriptions :column="1" class="mt-16">
            <el-descriptions-item label="邮箱">{{ profile?.email }}</el-descriptions-item>
            <el-descriptions-item label="手机">{{ profile?.phone || '-' }}</el-descriptions-item>
            <el-descriptions-item label="学号">{{ profile?.studentNo || '-' }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ profile?.gender === 'male' ? '男' : profile?.gender === 'female' ? '女' : '其他' }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="16">
        <el-card>
          <el-tabs v-model="tab">
            <el-tab-pane label="基本资料" name="info">
              <el-form :model="form" label-width="100px" style="max-width: 480px">
                <el-form-item label="昵称">
                  <el-input v-model="form.nickname" />
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-model="form.email" />
                </el-form-item>
                <el-form-item label="手机">
                  <el-input v-model="form.phone" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="saving" @click="onSave">保存</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="pwd">
              <el-form :model="pwdForm" label-width="100px" style="max-width: 480px">
                <el-form-item label="原密码">
                  <el-input v-model="pwdForm.oldPassword" type="password" show-password />
                </el-form-item>
                <el-form-item label="新密码">
                  <el-input v-model="pwdForm.newPassword" type="password" show-password />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onChangePwd">提交</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="隐私设置" name="privacy">
              <div class="privacy">
                <div>
                  <p>默认匿名预约</p>
                  <p class="muted">开启后,创建预约时默认使用匿名身份</p>
                </div>
                <el-switch v-model="form.defaultAnonymous" />
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
import { ElMessage } from 'element-plus'

const store = useStore()
const loading = ref(false)
const tab = ref('info')
const profile = computed(() => store.state.user.profile)
const saving = ref(false)

const form = reactive({ nickname: '', email: '', phone: '', defaultAnonymous: false })
const pwdForm = reactive({ oldPassword: '', newPassword: '' })

watch(profile, p => {
  if (p) Object.assign(form, { nickname: p.nickname, email: p.email, phone: p.phone, defaultAnonymous: p.defaultAnonymous })
}, { immediate: true })

async function reload() {
  loading.value = true
  try { await store.dispatch('user/loadProfile') } finally { loading.value = false }
}

async function onSave() {
  saving.value = true
  try {
    // 简化:仅前端提示,真实后端对接
    ElMessage.success('已保存(mock)')
  } finally { saving.value = false }
}

function onChangePwd() {
  if (!pwdForm.oldPassword || !pwdForm.newPassword) { ElMessage.warning('请填写完整'); return }
  ElMessage.success('密码已修改(mock),请重新登录')
}

onMounted(reload)
</script>

<style scoped>
.title { margin: 0 0 16px; }
.profile-head { display: flex; gap: 16px; align-items: center; }
.profile-head h3 { margin: 0 0 4px; }
.muted { color: #909399; font-size: 13px; }
.privacy { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; }
.privacy p { margin: 0; }
</style>
