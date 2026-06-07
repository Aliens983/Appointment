<template>
  <header class="header">
    <div class="container flex-between">
      <div class="logo" @click="$router.push('/')">
        <el-icon :size="22" color="#fff"><FirstAidKit /></el-icon>
        <span class="logo-text">校园心理咨询预约</span>
      </div>
      <nav class="nav">
        <router-link
          v-for="m in menus"
          :key="m.path"
          :to="m.path"
          class="nav-item"
          :class="{ active: isActive(m.path) }"
        >
          <el-icon :size="16"><component :is="m.icon" /></el-icon>
          <span>{{ m.title }}</span>
        </router-link>
      </nav>
      <div class="user-area">
        <template v-if="isLoggedIn">
          <el-dropdown @command="onCommand">
            <span class="user-trigger">
              <el-avatar :size="28" :src="profile?.avatar">{{ profile?.nickname?.[0] || 'U' }}</el-avatar>
              <span class="nickname">{{ profile?.nickname || '用户' }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button type="primary" plain @click="$router.push('/login')">登录</el-button>
          <el-button @click="$router.push('/register')">注册</el-button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()
const store = useStore()

const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])
const profile = computed(() => store.state.user.profile)

const menus = [
  { path: '/', title: '首页', icon: 'HomeFilled' },
  { path: '/counselors', title: '咨询师', icon: 'UserFilled' },
  { path: '/appointment/records', title: '我的预约', icon: 'Calendar' },
  { path: '/messages', title: '在线留言', icon: 'ChatDotRound' },
  { path: '/assessment', title: '心理测评', icon: 'DataAnalysis' }
]

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function onCommand(cmd) {
  if (cmd === 'profile') router.push('/profile')
  if (cmd === 'logout') {
    store.dispatch('user/logout')
    router.push('/')
  }
}
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #5b8def, #6f7ee5);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.header .container {
  height: 60px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 18px;
}
.nav {
  display: flex;
  gap: 8px;
  flex: 1;
  margin-left: 48px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 16px;
  height: 60px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  transition: color 0.2s;
}
.nav-item:hover {
  color: #fff;
}
.nav-item.active {
  color: #fff;
  border-bottom: 2px solid #fff;
}
.user-area {
  display: flex;
  align-items: center;
  gap: 8px;
}
.user-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #fff;
  cursor: pointer;
}
.nickname {
  font-size: 14px;
}
</style>
