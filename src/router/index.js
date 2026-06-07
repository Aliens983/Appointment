import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'

// 14 条路由(含 5 条带参)
const routes = [
  { path: '/', name: 'Home', component: () => import('@/views/Home.vue'), meta: { title: '首页' } },
  { path: '/login', name: 'Login', component: () => import('@/views/Login.vue'), meta: { title: '登录', hideInMenu: true } },
  { path: '/register', name: 'Register', component: () => import('@/views/Register.vue'), meta: { title: '注册', hideInMenu: true } },

  { path: '/counselors', name: 'CounselorList', component: () => import('@/views/counselor/List.vue'), meta: { title: '咨询师' } },
  { path: '/counselors/:id', name: 'CounselorDetail', component: () => import('@/views/counselor/Detail.vue'), meta: { title: '咨询师详情' } },

  { path: '/appointment/book/:counselorId', name: 'AppointmentBook', component: () => import('@/views/appointment/Book.vue'), meta: { title: '选择时段', requiresAuth: true, hideInMenu: true } },
  { path: '/appointment/form/:slotId', name: 'AppointmentForm', component: () => import('@/views/appointment/Form.vue'), meta: { title: '填写预约', requiresAuth: true, hideInMenu: true } },
  { path: '/appointment/records', name: 'AppointmentRecords', component: () => import('@/views/appointment/Records.vue'), meta: { title: '我的预约', requiresAuth: true } },
  { path: '/appointment/records/:id', name: 'AppointmentDetail', component: () => import('@/views/appointment/Detail.vue'), meta: { title: '预约详情', requiresAuth: true, hideInMenu: true } },

  { path: '/messages', name: 'MessageList', component: () => import('@/views/message/List.vue'), meta: { title: '在线留言', requiresAuth: true } },
  { path: '/messages/:id', name: 'MessageChat', component: () => import('@/views/message/Chat.vue'), meta: { title: '聊天', requiresAuth: true, hideInMenu: true } },

  { path: '/assessment', name: 'AssessmentList', component: () => import('@/views/assessment/List.vue'), meta: { title: '心理测评' } },
  { path: '/assessment/:id', name: 'AssessmentQuiz', component: () => import('@/views/assessment/Quiz.vue'), meta: { title: '测评答题', hideInMenu: true } },
  { path: '/assessment/result/:recordId', name: 'AssessmentResult', component: () => import('@/views/assessment/Result.vue'), meta: { title: '测评结果', hideInMenu: true } },

  { path: '/profile', name: 'Profile', component: () => import('@/views/Profile.vue'), meta: { title: '个人中心', requiresAuth: true } },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/NotFound.vue'), meta: { title: '404', hideInMenu: true } }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to, from, next) => {
  if (to.meta?.title) document.title = `${to.meta.title} - 校园心理咨询预约系统`
  const requiresAuth = to.matched.some(r => r.meta?.requiresAuth)
  const isLoggedIn = store.getters['user/isLoggedIn']
  if (requiresAuth && !isLoggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
