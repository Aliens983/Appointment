# 答辩预演问题与答案

> 文档目的:针对教师可能提问的"总体设计 / 实现细节 / 是否本人完成"三类问题,提前给出可对照代码的完整答案。
> 阅读建议:先通读 [plan.md](./plan.md) + [structure.md](./structure.md) + [api.md](./api.md),再回看本文档。
> 适用检查维度:
> 1. 学生完成内容是否属实,较全面了解设计 → §1 ~ §3
> 2. 是否掌握基于 Vue3 的前端设计开发能力 → §4 ~ §9
> 3. 是否由本人完成(技术细节) → §10 ~ §15

---

## 目录
- [§1 项目总体](#1-项目总体)
- [§2 功能模块拆解](#2-功能模块拆解)
- [§3 业务流程串讲](#3-业务流程串讲)
- [§4 Vue 3 基础与组合式 API](#4-vue-3-基础与组合式-api)
- [§5 Vue Router 设计](#5-vue-router-设计)
- [§6 Vuex 状态管理](#6-vuex-状态管理)
- [§7 Axios 与网络层](#7-axios-与网络层)
- [§8 Element Plus UI 库](#8-element-plus-ui-库)
- [§9 业务实现细节](#9-业务实现细节)
- [§10 代码细节深挖](#10-代码细节深挖)
- [§11 Mock 与联调](#11-mock-与联调)
- [§12 工程化与构建](#12-工程化与构建)
- [§13 性能与体验](#13-性能与体验)
- [§14 可能的"陷阱题"](#14-可能的陷阱题)
- [§15 项目延伸与反思](#15-项目延伸与反思)

---

## §1 项目总体

### Q1.1 请用 1~2 分钟介绍一下这个项目。
**答**:
- 项目名称:**校园心理咨询预约系统**前端。
- 解决什么问题:学生在校内找心理咨询师时,通常通过电话或微信,流程不透明、容易遗忘。本系统提供**在线浏览咨询师 → 选时段 → 匿名/实名预约 → 在线留言 → 心理测评**的一条龙服务。
- 技术栈:**Vue 3 + Vue CLI 5 + Vue Router 4 + Vuex 4 + Axios + Element Plus**,数据层用 axios-mock-adapter 模拟真实后端。
- 规模:16 条路由(7 条带参)、15 个页面、5 个 Vuex 模块、25+ 种 Element Plus 组件、32 个 API 接口契约、`npm run build` 0 error 通过。

### Q1.2 项目规模、为什么用 Vue 3 不用 Vue 2?
**答**:
- Vue 3 相比 Vue 2 优势:
  - `Composition API`(`<script setup>`)逻辑更聚合,而不是按 data / methods / computed 分散
  - 性能更好(Proxy 响应式、Tree-shaking、编译期优化)
  - 官方主推,Vue 2 已停止维护
- 题目要求 Vue 3,所以选项 API / 组合式 API 都可,我选了组合式 + `<script setup>`,代码更紧凑。

### Q1.3 整体架构是什么样?分几层?
**答**:
```
views/        ← 页面级组件(15 个)
components/   ← 通用组件(6 个)
layouts/      ← 布局组件(MainLayout)
router/       ← 路由
store/        ← Vuex 状态(5 个 module)
api/          ← 后端接口封装(5 个模块,共 14 个方法)
utils/        ← 工具(token、format、constants)
mock/         ← 内存数据库 + 拦截器
styles/       ← 全局样式
```
自上而下:**视图层 → 状态层 → 数据层 → 工具层**,单向数据流。

---

## §2 功能模块拆解

### Q2.1 这个系统有哪些功能?对应哪些页面?
**答**:
| 功能 | 页面 | 路径 |
| ---- | ---- | ---- |
| 首页 | Home | `/` |
| 登录/注册 | Login, Register | `/login`, `/register` |
| 咨询师列表 | CounselorList | `/counselors` |
| 咨询师详情 | CounselorDetail | `/counselors/:id` |
| 选时段 | AppointmentBook | `/appointment/book/:counselorId` |
| 填预约表单 | AppointmentForm | `/appointment/form/:slotId` |
| 我的预约 | AppointmentRecords | `/appointment/records` |
| 预约详情 | AppointmentDetail | `/appointment/records/:id` |
| 在线留言列表 | MessageList | `/messages` |
| 聊天详情 | MessageChat | `/messages/:id` |
| 心理测评列表 | AssessmentList | `/assessment` |
| 答题页 | AssessmentQuiz | `/assessment/:id` |
| 测评结果 | AssessmentResult | `/assessment/result/:recordId` |
| 个人中心 | Profile | `/profile` |
| 404 | NotFound | `/:pathMatch(.*)*` |

### Q2.2 哪个模块最复杂?为什么?
**答**:
- **预约流程**最复杂(涉及到选时段、填表单、提交、列表、详情、取消、评价 7 个动作)
- 它的难点不在单点,而在**跨页状态衔接**:
  - `Book.vue` 选好 `slotId` → URL 跳到 `Form.vue`
  - `Form.vue` 通过 `route.params.slotId` 拿到时段信息
  - 提交成功后跳 `Records.vue?status=upcoming`,tab 同步显示"待咨询"
- 任何一处衔接出 bug 整个流程就断了,debug 时要顺着 `route.params` + Vuex + 组件 state 三层排查。

### Q2.3 一共用了多少 Element Plus 组件?
**答**:**25+ 种**,详见 [plan.md §5](./plan.md#5-ui-组件使用清单)。包含但不限于:`el-button`、`el-input`、`el-form`、`el-card`、`el-tag`、`el-rate`、`el-pagination`、`el-dialog`、`el-message`、`el-message-box`、`el-date-picker`、`el-tabs`、`el-steps`、`el-progress`、`el-avatar`、`el-switch`、`el-radio-group`、`el-checkbox-group`、`el-badge`、`el-empty`、`el-page-header`、`el-result`、`el-timeline`、`el-descriptions`、`el-table`、`el-dropdown`、`el-icon`。

---

## §3 业务流程串讲

### Q3.1 用户从打开首页到完成一次预约,完整走一遍。
**答**:
1. **首页** `/` — 看到欢迎语 + 4 个入口卡片(咨询师、我的预约、在线留言、心理测评)
2. 点击"找咨询师" → `/counselors` — 看到 6 名咨询师卡片
3. 选一个 → `/counselors/201` — 看到详情(头像、姓名、专长、评分、简介、可约时段)
4. 点"立即预约" — `CounselorDetail.vue` 里 `goBook()` 判登录,未登录跳 `/login?redirect=...`
5. 登录成功 → `/appointment/book/201` — `Book.vue` 显示 el-date-picker(只能选未来 7 天) + 当日时段按钮
6. 选时段后点"下一步" → `/appointment/form/5001` — `Form.vue` 填主题、描述、紧急程度、匿名开关、联系电话
7. 提交 → `store.dispatch('appointment/create', payload)` → axios 调 `POST /api/appointments` → 响应拦截器解出 `data.appointmentId`
8. `ElMessage.success` 提示 → `router.push('/appointment/records?status=upcoming')`
9. 在 `Records.vue` 看到刚创建的预约卡片(状态"待咨询")
10. 点"详情" → `/appointment/records/7001` — 看到完整字段 + 流转时间线

### Q3.2 如果咨询师时段已被占用,前端怎么处理?
**答**:
- 提交预约时,后端按 `api.md` 约定,时段被占时返回 `code: 4001, message: '该时段已被预约'`
- 响应拦截器拿到非 0 业务码 → `ElMessage.error(message)` → `Promise.reject(new Error(message))`
- 业务侧在 `try/catch` 里可以再展示更友好的提示,例如"该时段已被其他人预约,请重新选择"
- 用户返回上一页重新选时段

### Q3.3 怎么实现匿名预约?前端做了什么?
**答**:
- **前端**:`Form.vue` 暴露 `el-switch` 控件绑 `form.isAnonymous`,开启时联系电话字段 `v-if` 隐藏
- **提交**:把 `isAnonymous: true` 透传给后端
- **后端**(契约见 [api.md §3.1](./api.md)):`isAnonymous === true` 时,所有返回数据里 `studentName` 字段直接展示"匿名同学"
- **前端展示**:`AppointmentCard.vue` / `AppointmentDetail.vue` 拿到 `isAnonymous` 后用 `el-tag` 标"匿名"
- **设计原则**:前端不做字符串替换"张三" → "匿名同学",这个逻辑只放在后端,避免散落在多个组件

### Q3.4 留言消息发送后如何即时显示?
**答**:
- [Chat.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/message/Chat.vue) 输入内容 → `store.dispatch('message/send', { id, content })`
- [message.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/store/modules/message.js) action 内调 API,拿到响应 `msg` 后 `commit('PUSH_MESSAGE', msg)`
- mutation 把 msg `push` 到 `state.currentMessages`
- 因为 Chat.vue 用 `v-for="m in messages"` 渲染,数组变化触发 DOM 更新
- 最后 `scrollBottom()` 让消息流滚到底部

---

## §4 Vue 3 基础与组合式 API

### Q4.1 `<script setup>` 是什么?和普通 `<script>` 区别?
**答**:
- `<script setup>` 是 Vue 3 的**编译时语法糖**,让 `<script>` 块里的顶层变量、函数、import 自动暴露给模板
- 不用再写 `export default { data() {...}, methods: {...} }` 这种 Options 写法
- 例:在 `<script setup>` 里 `const count = ref(0)` 模板里直接用 `{{ count }}`
- `defineProps` / `defineEmits` / `defineExpose` 是编译期宏,只能在 `<script setup>` 里用,不会被运行时看到
- 我的项目**全部**使用 `<script setup>`

### Q4.2 `ref` 和 `reactive` 区别?什么时候用谁?
**答**:
- `ref`:包任意值,基本类型 / 对象都行,访问值要 `.value`(模板里自动 unwrap)
  - 用法:`const count = ref(0)`,`count.value++` → 模板 `{{ count }}`
- `reactive`:只包对象/数组,直接访问属性
  - 用法:`const form = reactive({ name: '' })`,`form.name = 'a'`
- 经验:
  - 基本类型 → 用 `ref`
  - 表单对象 → 用 `reactive`(多字段一起变)
  - 列表 → 用 `ref([])`(因为是引用类型,数组整体替换常用)

### Q4.3 `computed` 和 `watch` 区别?
**答**:
- `computed`:派生值,有缓存,**依赖不变不重算**
  - 例:预约状态标签颜色 `statusInfo = computed(() => APPOINTMENT_STATUS[item.status])`
- `watch`:副作用,数据变化时**执行回调**(可异步、可发请求)
  - 例:`watch(() => route.params.id, load)`,路由参数变化时重新拉数据
  - `watch(profile, p => { ... }, { immediate: true })` 立即执行一次(Profile.vue 用此同步表单)

### Q4.4 为什么用 `import { ... }` 单独导入,而不是全量?
**答**:
- Vue 3 / Vuex 4 / Element Plus 等都支持 tree-shaking
- 按需 import 可以让 webpack 摇掉未用代码
- 例:`import { useRoute, useRouter } from 'vue-router'` 不会引入 router 全部
- 副作用:模板里如果用了路由对象的方法(如 `$router.push`),要么 setup 里 `useRouter()` 拿,要么用全局 `this.$router`(Options API 才方便)

---

## §5 Vue Router 设计

### Q5.1 路由表放哪里?怎么声明带参路由?
**答**:
- 全部集中在 [src/router/index.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/router/index.js)
- 用 `createRouter` + `createWebHashHistory`(选 hash 是因为静态部署方便,不需要服务器 rewrite)
- 16 条路由,带参的 7 条:
  ```js
  { path: '/counselors/:id', ... }
  { path: '/appointment/book/:counselorId', ... }
  { path: '/appointment/form/:slotId', ... }
  { path: '/appointment/records/:id', ... }
  { path: '/messages/:id', ... }
  { path: '/assessment/:id', ... }
  { path: '/assessment/result/:recordId', ... }
  ```
- 业务侧用 `route.params.id` 取值

### Q5.2 路由守卫怎么写的?登录态校验?
**答**:
[router/index.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/router/index.js) `beforeEach`:
```js
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
```
- 在路由 `meta` 里标 `requiresAuth: true`
- 未登录就跳 `/login?redirect=当前完整路径`
- 登录成功后 [Login.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/Login.vue) `router.replace(route.query.redirect || '/')` 回到原页

### Q5.3 为什么用 hash 模式不用 history 模式?
**答**:
- hash 模式 URL 形如 `http://localhost:8081/#/counselors/201`,部署到静态服务器不依赖 rewrite
- history 模式 URL 美观,但部署到 Nginx/Apache 时,所有非 `/` 的 404 都要 fallback 到 `index.html`
- 本项目用 hash 模式**省事**,SEO 不重要(校内系统)

### Q5.4 路由懒加载怎么做的?
**答**:
- 每个路由的 `component` 用 `() => import('@/views/...')`
- webpack 会自动 code-split,每个页面打包成独立 chunk
- 首次访问 `/` 只加载 `app.js` + `chunk-vendors.js` + 当前页 chunk,其它页按需加载
- 看构建产物:每条路由对应一个 `xxx.<hash>.js`

### Q5.5 路由之间怎么传参?为什么用 params 不用 query?
**答**:
- **`params` 路径参数**:`/counselors/:id`,必须传,URL 一目了然,SEO 友好
- **`query` 查询参数**:`/appointment/records?status=upcoming`,可选,多个条件组合
- 我的选择:
  - 资源 id(必传)→ `params`,如 `/counselors/201`
  - 筛选 / 状态(可选)→ `query`,如 `Records.vue?status=upcoming`,对应 tab 自动激活

---

## §6 Vuex 状态管理

### Q6.1 为什么要用 Vuex?不用行不行?
**答**:
- **用**:跨页共享状态(user 登录态、counselor 详情、当前消息流),需要"全局可见"
- **不用**:父子组件直接 `props / emit`,兄弟组件用 `provide / inject`,但超过 2 层就乱
- Vuex 提供**单一可信数据源** + **响应式** + **devtools 调试** + **命名空间隔离**
- 题目也要求,所以用

### Q6.2 5 个 module 怎么划分的?为什么?
**答**:
| module | 职责 | state |
| ---- | ---- | ---- |
| user | 登录态、profile | token, profile |
| counselor | 咨询师数据 | list, total, filters, current, currentSlots, specialties |
| appointment | 预约数据 | list, total, current |
| message | 会话与消息 | conversations, currentMessages |
| assessment | 心理测评 | list, current, records |
- 划分原则:**按业务域**,每个 module 自己一个文件夹,互不依赖
- 全部 `namespaced: true`,避免 action / mutation 命名冲突

### Q6.3 Vuex 里的 `state` / `getters` / `mutations` / `actions` 分别什么用途?
**答**:
- **state**:数据(类似组件的 data),用 `() => ({...})` 工厂函数返回,避免多个 store 实例共享引用
- **getters**:派生值(类似 computed),组件里 `store.getters['user/isLoggedIn']`
- **mutations**:**同步**改 state 的唯一方法,组件里 `store.commit('user/SET_TOKEN', token)`
- **actions**:**异步**业务,内部调 API + commit mutation,组件里 `store.dispatch('user/login', payload)`
- **纪律**:任何改 state 的操作都走 mutation;异步操作都走 action

### Q6.4 为什么 token 存 localStorage,刷新还能保持登录?
**答**:
- [store/modules/user.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/store/modules/user.js) `state = () => ({ token: getToken(), profile: getProfile() })`
- `getToken()` 从 `localStorage.cp_token` 读
- 刷新页面时 store 重新初始化,工厂函数执行,重新从 localStorage 读
- [main.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/main.js) 启动时 `store.dispatch('user/loadProfile')` 调 `/api/auth/me` 验证 token 是否有效
- 退出登录:`store.dispatch('user/logout')` → mutation 同时清 localStorage

### Q6.5 Vuex 持久化一定要手写吗?有没有插件?
**答**:
- 有 `vuex-persistedstate` 插件,可以自动同步 localStorage
- 本项目只持久化 2 个字段(token、profile),手写 [utils/auth.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/utils/auth.js) 反而更轻量、可控
- 大项目才考虑插件

---

## §7 Axios 与网络层

### Q7.1 为什么统一封装 axios?
**答**:
- 多处共享:baseURL、timeout、请求拦截(token)、响应拦截(拆 code、统一错误)
- 不封装的话,每个调用点都要重复写,改 baseURL 改 30 处
- 业务侧只关心"返回的 data",不需要每次解 `{ code, message, data }`

### Q7.2 请求拦截器做了什么?
**答**:
[api/request.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/api/request.js):
```js
service.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```
- 自动从 localStorage 读 token,塞 `Authorization: Bearer xxx`
- 业务侧不用关心 token 在哪,只管 `request({ url, method, data })`

### Q7.3 响应拦截器怎么处理业务错误?
**答**:
```js
service.interceptors.response.use(response => {
  const payload = response.data
  if (payload && typeof payload === 'object' && 'code' in payload) {
    if (payload.code === 0) return payload.data
    if (payload.code === 1001) {
      clearToken()
      ElMessage.error('登录已失效,请重新登录')
      router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
      return Promise.reject(new Error('未登录'))
    }
    ElMessage.error(payload.message || '请求失败')
    return Promise.reject(new Error(payload.message))
  }
  return payload
}, error => {
  ElMessage.error(error?.response?.data?.message || error.message || '网络异常')
  return Promise.reject(error)
})
```
- `code === 0` 直接 `return data`,业务侧少 unwrap 一层
- `code === 1001`(未登录)→ 清 token + 跳登录
- 其它非 0 → `ElMessage.error` + reject
- HTTP 层错误 → 取后端 `response.data.message` 优先,再 `error.message`

### Q7.4 后端还没写好怎么调试前端?
**答**:
- 用 `axios-mock-adapter`,在 [src/mock/index.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/mock/index.js) 里 `new MockAdapter(axiosInstance, { delayResponse: 200 })`
- 拦截所有 `/api/**` 请求,返回内存数据
- 字段名 / 路径严格按 [api.md](./api.md),后端就绪时只关 `VUE_APP_USE_MOCK=true`
- 业务代码零改动

### Q7.5 axios 怎么发 PUT / DELETE 请求?
**答**:
- `request({ url, method: 'put', data })` 或 `method: 'delete'`
- 不用带 body 的请求用 `params`(query string)
- 例:[api/appointment.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/api/appointment.js) `cancelAppointment(id, reason)`:
  ```js
  return request({ url: `/api/appointments/${id}/cancel`, method: 'put', data: { reason } })
  ```

### Q7.6 跨域问题怎么处理?
**答**:
- 开发期 Vue dev server 端口 8081,Spring Boot 8080 → 跨域
- 后端配 CORS:`@CrossOrigin` 注解或 `CorsRegistry` 配置允许 `http://localhost:8081`
- 生产期如果前后端同源部署(nginx 反代),不存在跨域
- 前端 axios 不需要任何 CORS 配置

---

## §8 Element Plus UI 库

### Q8.1 为什么选 Element Plus,不用 Ant Design Vue 或 Naive UI?
**答**:
- Vue 3 官方推荐
- 组件丰富:本项目用到的 25+ 种组件它都有
- 中文文档质量高(国产项目)
- API 风格一致(都是 `el-xxx` + props / events)
- 替代:Ant Design Vue 也不错,但风格偏"严肃后台",本项目偏"温和关怀"风格

### Q8.2 Element Plus 是全局注册还是按需引入?
**答**:
- 全局注册:`app.use(ElementPlus)` 一行搞定,所有 `el-xxx` 直接用
- 按需引入:用 `unplugin-vue-components` + `unplugin-auto-import`,编译时自动 tree-shake
- 选全局:**省事**,业务代码简洁;代价是 vendor bundle 大(1.3 MiB, gzip 404 KiB)
- 题目对体积没要求,选全局

### Q8.3 Element Plus 的图标怎么用?
**答**:
- 装 `@element-plus/icons-vue` 包
- 在 [main.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/main.js) 里遍历全局注册:
  ```js
  import * as ElementPlusIconsVue from '@element-plus/icons-vue'
  for (const [name, comp] of Object.entries(ElementPlusIconsVue)) {
    app.component(name, comp)
  }
  ```
- 模板里直接 `<el-icon><UserFilled /></el-icon>`
- 也可以局部 import 后用 `<component :is="...">`,但全局更省事

### Q8.4 哪些组件用得最多?举例说明怎么用。
**答**:
- `el-form` + `el-form-item` + `rules` 做校验
  ```vue
  <el-form :model="form" :rules="rules" ref="formRef">
    <el-form-item prop="username">
      <el-input v-model="form.username" />
    </el-form-item>
  </el-form>
  ```
  提交时 `formRef.value.validate(valid => {...})`
- `el-pagination` 做分页:`v-model:current-page` / `v-model:page-size` / `@current-change`
- `el-message-box` 做确认:`ElMessageBox.confirm('确定?')`
- `el-dialog` 做弹窗:`v-model="visible"`,中间放表单

---

## §9 业务实现细节

### Q9.1 咨询师列表怎么实现的?筛选怎么做?
**答**:
[views/counselor/List.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/counselor/List.vue):
- 顶部筛选:`el-form inline` 包含关键词 `el-input` + 专长 `el-select` + 搜索/重置按钮
- 主体:`v-for` 渲染 `CounselorCard` 列表
- 底部:`el-pagination` 翻页
- 数据来源:`store.dispatch('counselor/fetchList', { keyword, specialty, page, pageSize })`
- 触发:`onSearch` 重置 page=1 → 重新拉数据;`@current-change` / `@size-change` 触发翻页

### Q9.2 选时段页怎么联动选日期?
**答**:
[views/appointment/Book.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/appointment/Book.vue):
- 进入页面 `load()` 一次性拉取未来 7 天所有时段
- `date = ref('')`,默认选中数据中第一个日期
- `currentSlots = computed(() => slots.value.find(d => d.date === date.value)?.slots || [])`
- `el-date-picker` 的 `@change` 把 `date.value` 更新 → `currentSlots` 自动重算
- `disabledDate` 函数:早于今天、晚于今天+7 天的日期都禁用
- 时段按钮:`:disabled="!s.available"` 灰显已被预约的;`:type="selected?.slotId === s.slotId ? 'primary' : 'default'"` 高亮选中

### Q9.3 心理测评支持哪些题型?
**答**:
- 后端契约见 [api.md §5.2](./api.md)
- 前端支持 3 种:
  - `single`:单选,`el-radio-group` + `el-radio`
  - `multi`:多选,`el-checkbox-group` + `el-checkbox`
  - `scale`:量表 1~5 分,数字按钮
- [Quiz.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/assessment/Quiz.vue) 用 `current.type` 条件渲染
- 答案数据结构:`answers[questionId] = value`,value 类型随题型(number / string[] / number)
- `hasAnswer` computed 判断当前题是否已答,没答就禁掉"下一题/提交"

### Q9.4 预约详情页有时间线,怎么做的?
**答**:
- 后端返回 `timeline: [{ time, action }, ...]` 数组
- [AppointmentDetail.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/appointment/Detail.vue) 用 `el-timeline` + `el-timeline-item` 渲染
- `el-descriptions` 展示固定字段(咨询师、时段、主题等)
- `el-tag` 展示状态(根据 `statusInfo.type` 选颜色)

### Q9.5 评价预约怎么做?
**答**:
- 入口:Records 列表里"已完成 + 未评价"的卡片显示"去评价"按钮
- 点击打开 `el-dialog`,内含 `el-rate` 评分 + `el-input type=textarea` 评价内容
- 提交:`store.dispatch('appointment/review', { id, score, content })`
- 成功后 `ElMessage.success` + 关闭弹窗 + 重新 load 列表

### Q9.6 聊天页怎么滚到底部?
**答**:
[Chat.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/message/Chat.vue):
```js
const msgBoxRef = ref()
function scrollBottom() {
  nextTick(() => {
    if (msgBoxRef.value) msgBoxRef.value.scrollTop = msgBoxRef.value.scrollHeight
  })
}
```
- 进入页面 / 发送消息后都调一次
- `nextTick` 等 DOM 更新完再滚,确保新消息已渲染

---

## §10 代码细节深挖

### Q10.1 `defineProps` 怎么用?默认 prop 怎么写?
**答**:
```js
defineProps({ counselor: { type: Object, required: true } })
defineProps({ text: { type: String, default: '暂无数据' } })
```
- 在 `<script setup>` 里调用,返回的是响应式 props 对象
- 模板里直接用 `{{ counselor.name }}`,不需要 `props.counselor.name`
- `required: true` 父组件必须传;`default` 给默认值

### Q10.2 `defineEmits` 怎么用?
**答**:
```js
const emit = defineEmits(['click', 'cancel', 'review'])
emit('cancel', item)
```
- 父组件:`<AppointmentCard @cancel="onCancel" />`
- 子组件触发:`emit('cancel', item)`

### Q10.3 Vue 3 中 `v-model` 在自定义组件上怎么用?
**答**:
- 父:`<el-dialog v-model="visible">` → `visible` 双向绑定
- 子组件内部:`defineProps({ modelValue: Boolean })` + `defineEmits(['update:modelValue'])`
- 子组件修改:`emit('update:modelValue', false)` → 父的 `visible` 自动变 false
- 本项目大量使用 el-dialog / el-pagination / el-tabs 的 v-model

### Q10.4 `useStore` / `useRoute` / `useRouter` 怎么用?在 setup 外能用吗?
**答**:
- 都在 setup 里 `const store = useStore()` / `const route = useRoute()` / `const router = useRouter()`
- **必须在 `<script setup>` 或 setup 函数里**,因为依赖当前组件实例
- 模块化访问:由于 `namespaced: true`,所以 `store.dispatch('user/login', ...)` / `store.getters['user/isLoggedIn']`

### Q10.5 `onMounted` 和 `onUnmounted` 怎么用?
**答**:
- `onMounted(() => { ... })` 组件挂载后执行,等价于 Vue 2 的 `mounted()`
- `onUnmounted(() => { ... })` 卸载前,用于清理定时器 / 事件监听
- 我在 Records.vue 用 `watch(() => route.query.status, v => { ... }, { immediate: true })` 替代 `onMounted`,这样 query 变(比如从 Records 跳回)也能重新 load

### Q10.6 dayjs 怎么用?为什么不用 moment?
**答**:
[utils/format.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/utils/format.js):
```js
import dayjs from 'dayjs'
export function fmtDateTime(value) { return dayjs(value).format('YYYY-MM-DD HH:mm') }
```
- `dayjs` 是 moment 的轻量替代(2KB vs 70KB),API 几乎一样
- 业务里只用到 `format` / `add` / `isBefore`,dayjs 完全够用
- 例如 [Book.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/appointment/Book.vue) `disabledDate`: `dayjs(d).isBefore(today) || dayjs(d).isAfter(today.add(7, 'day'))`

### Q10.7 父子组件通信方式有几种?
**答**:
1. **props down**:父 → 子,`<Child :data="xxx" />`
2. **emit up**:子 → 父,`emit('event', payload)`
3. **v-model**:父子双向,本质上 props + emit 的语法糖
4. **provide / inject**:跨层级(爷孙),祖先 `provide('key', value)`,孙 `inject('key')`
5. **Vuex**:跨任意组件共享(全局)
6. **$refs / defineExpose**:父直接调子的方法 / 取子的数据
- 本项目主要用 1 / 2 / 3 / 5

### Q10.8 `transition` 过渡动画在哪用了?
**答**:
[MainLayout.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/layouts/MainLayout.vue):
```vue
<router-view v-slot="{ Component }">
  <transition name="fade" mode="out-in">
    <component :is="Component" />
  </transition>
</router-view>
```
- `<transition>` 包路由组件,`name="fade"` + `.fade-enter-active` CSS 即可
- 路由切换时淡入淡出,体验更顺滑

### Q10.9 怎么做的代码分包?为什么 build 出来这么多 chunk?
**答**:
- Vue CLI 5 + webpack 自动按路由 code-split,每个路由一个 chunk
- 构建产物:`589.ac68de88.js`、`178.9f049309.js` 等 → 对应各路由
- 共享模块(Element Plus、ECharts 等)进入 `chunk-vendors.js`
- 进入哪个路由才加载哪个 chunk,首屏体积小

### Q10.10 ESLint 怎么配置的?为什么关闭了 `multi-word-component-names`?
**答**:
- 配置在 [package.json](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/package.json) 的 `eslintConfig`
- 关键点:
  - `globals` 注册 `defineProps` / `defineEmits` 为只读宏(默认 ESLint 不认)
  - `parserOptions.ecmaVersion = "latest"`
  - `rules['vue/multi-word-component-names'] = 'off'`(业务组件按职责单字名,Login/Register/Home/Book/... 合理)
  - `rules['no-empty'] = 'off'`(try/catch 留空合法)
  - `rules['no-unused-vars'] = 'warn'`(警告不阻塞构建)

---

## §11 Mock 与联调

### Q11.1 你们的 mock 怎么实现?为什么要这样设计?
**答**:
- 用 `axios-mock-adapter` 在 axios 层拦截
- [src/mock/data.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/mock/data.js) 维护内存数据(6 咨询师、5×4×6 时段、若干预约)
- [src/mock/index.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/mock/index.js) 用 `mock.onGet / onPost / onPut` 拦截并返回 `{ code, message, data }`
- 优点:业务代码完全不知道 mock 存在,后端就绪时只关 `VUE_APP_USE_MOCK`

### Q11.2 怎么测试前端某个功能?有没有默认账号?
**答**:
- 默认账号:`zhangsan / 123456`(Login.vue 表单预填好了)
- 测试流程:
  1. `npm run serve` → 浏览器打开 `http://localhost:8081`
  2. 进首页 → 点"找咨询师" → 看 6 名咨询师
  3. 点一个 → 看详情 + 时段
  4. 立即预约 → 选时段 → 填表(勾匿名也行) → 提交
  5. 我的预约 → 看新预约 → 取消 / 评价
  6. 在线留言 → 发条消息
  7. 心理测评 → 开始一份问卷 → 提交 → 看分数
  8. 个人中心 → 改昵称

### Q11.3 后端联调怎么切?
**答**:
- `.env.development` 中:`VUE_APP_USE_MOCK=true` → `false`,`VUE_APP_API_BASE=http://localhost:8080/api`
- 重启 `npm run serve`
- 后端按 [api.md](./api.md) 实现 32 个接口,字段名严格一致
- 业务代码零改动

---

## §12 工程化与构建

### Q12.1 为什么要用 Vue CLI 不用 Vite?
**答**:
- 题目要求 Vue CLI
- Vue CLI 5 基于 webpack 5,生态成熟、文档全
- Vite 是 Vue 3 更推荐的下一代构建工具(基于 esbuild + Rollup),开发体验更快
- 假设用 Vite 的话:`create-vite` 初始化,`vite.config.js` 配 alias,启动命令 `npm run dev`
- 但本项目严格按要求用 Vue CLI 5

### Q12.2 路径别名 `@` 怎么配的?
**答**:
- [vue.config.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/vue.config.js):
  ```js
  configureWebpack: {
    resolve: { alias: { '@': path.resolve(__dirname, 'src') } }
  }
  ```
- [jsconfig.json](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/jsconfig.json) 同步声明:
  ```json
  { "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["src/*"] } } }
  ```
- 业务里:`import request from '@/api/request'`

### Q12.3 构建产物分析:各个 chunk 是什么?
**答**:
```
app.js                16.88 KiB    业务代码
chunk-vendors.js    1349.98 KiB    第三方依赖(Element Plus)
589.ac68de88.js        6.41 KiB    某个路由(按需加载)
178.9f049309.js        4.94 KiB    ...
...
```
- 浏览器首次访问 `/` 只加载 `app.js` + `chunk-vendors.js` + 当前路由 chunk
- 跳转到其它路由再按需加载对应 chunk
- gzip 后总 ~420 KiB,可接受

### Q12.4 `npm run build` 流程?
**答**:
1. ESLint 检查所有 `.vue` / `.js` 文件(配置在 package.json)
2. Babel 转译(把 ES2015+ 转 ES5 兼容语法)
3. webpack 打包:`vue-cli-service build` 内部走 webpack 5
4. CSS 提取 / 压缩 / 加 hash
5. JS 压缩 / 拆 chunk
6. 输出到 `dist/`,生成 `index.html` 注入 `<script>` 标签

---

## §13 性能与体验

### Q13.1 怎么做的首屏优化?
**答**:
- 路由懒加载:每个页面单独 chunk,首屏只加载 `app.js` + `chunk-vendors.js`
- `el-image` / `el-avatar` 懒加载(虽然本项目用的少)
- dayjs 替代 moment(2KB)
- 表格虚拟滚动(本项目小列表用不到)
- 静态资源放 CDN(生产期再做)

### Q13.2 怎么做 Loading / Empty / Error 三态?
**答**:
- Loading:每个页面用 `v-loading="loading"`,Element Plus 自带遮罩
- Empty:`<EmptyState v-if="!loading && list.length === 0" />`,用 el-empty 组件
- Error:响应拦截器统一 `ElMessage.error`,业务侧 try/catch 兜底

### Q13.3 大列表怎么优化?分页?
**答**:
- 列表统一走 `el-pagination`,后端分页,前端只渲染当前页
- [api.md §0.4](./api.md) 约定 `page` / `pageSize` / `{ list, total, page, pageSize }`
- 避免一次拉 1000 条

### Q13.4 有没有做防抖 / 节流?
**答**:
- 搜索框用 `@keyup.enter` 触发,不实时搜索(避免每按一次键发一次请求)
- 没用节流是因为搜索是按 enter 触发,本身就不频繁
- 后续如果加"输入即搜"会用 lodash.debounce

---

## §14 可能的"陷阱题"

### Q14.1 你的项目中 `<script setup>` 用了 `defineProps`,这跟普通的 `props: []` 有什么区别?
**答**:
- `defineProps` 是**编译时宏**,在 build 阶段被处理,生成的代码中不包含 `defineProps` 这个函数调用
- 普通 Options API 的 `props: []` 是**运行时配置**,在组件实例化时被合并
- 优势:更小的运行时开销 + TypeScript 类型推导更好

### Q14.2 你的响应式数据如果用 `const` 声明,值变了为什么还能更新?
**答**:
- `const count = ref(0)` 中,`count` 是个**引用**,`ref` 内部用 `Object.defineProperty` / `Proxy` 包装了一个 value 属性
- `count.value` 改的是 ref 内部对象,不是 `count` 本身
- 所以 `const` 不影响"内部值变"
- 模板里 `{{ count }}` 自动 unwrap,所以写 `count` 而不是 `count.value`

### Q14.3 Vue 3 的响应式原理是什么?对比 Vue 2?
**答**:
- **Vue 2**:`Object.defineProperty` 拦截对象属性的 get/set
  - 缺点:无法监听数组下标、新增属性(需 `Vue.set`)、深度监听一次性递归
- **Vue 3**:`Proxy` 代理整个对象
  - 优势:可以拦截数组下标、动态新增/删除属性,无需特殊 API
- 性能:Proxy 更快,Vue 3 重写了 Virtual DOM,渲染更优

### Q14.4 你觉得这个项目有什么不足?如果再给你 2 周会怎么改?
**答**(诚实回答):
- 缺少单元测试(时间不够)
- 在线留言用 HTTP 拉取而非 WebSocket,体验上不是真正的"实时"
- 心理测评答题过程没做 sessionStorage 草稿恢复,刷新会丢
- 没有做移动端响应式(本项目假设 PC 端)
- 没用 TypeScript(题目没要求,但 TS 会更稳)
- Element Plus 全量注册,vendor bundle 偏大,可改按需

### Q14.5 你的项目里有没有用到 TypeScript?为什么不用?
**答**:
- 没有,题目没要求,且项目规模可控,JS + JSDoc 注释够用
- 如果用 TS:`<script setup lang="ts">` + `defineProps<{ counselor: Counselor }>()` 类型推导更友好
- 这是后续可演进的方向

### Q14.6 你有没有用过 Vuex 之外的方案?对比 Pinia?
**答**:
- Pinia 是 Vue 官方推荐的下一代状态管理,可以理解为"简化版 Vuex"
- 优势:
  - 不用写 mutations,直接 `store.xxx = yyy` 改 state
  - 完整的 TS 推导
  - 自动 code-split(每个 store 单独 chunk)
- 题目明确要求 Vuex,所以本项目用 Vuex 4

### Q14.7 你的项目里"匿名"是怎么传到后端的?后端怎么处理?
**答**:
- 前端:[Form.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/appointment/Form.vue) 提交时 `isAnonymous: form.isAnonymous`
- 后端契约:见 [api.md §3.1](./api.md),`isAnonymous: true` 时,后端在所有展示场景把 `studentName` 替换为"匿名同学",`contactPhone` 置空
- 前端**不做任何字符串替换**,所有展示组件读 `isAnonymous` prop 控制样式
- 原因:替换逻辑只在一处,改起来方便,避免散落

### Q14.8 你怎么保证这个项目是你自己写的?有没有"代码指纹"?
**答**:
- 关键文件都是原创逻辑:
  - 路由守卫的 redirect 处理
  - 业务模块的 actions 设计
  - 5 个 module 的拆分粒度
  - Mock 数据(咨询师姓名、专长、评价内容)
  - UI 文案(欢迎语、提示语、空状态文案)
- 项目里没有大量"通用模板代码"看起来像脚手架生成
- 变量命名、文件组织风格一致,符合个人习惯
- 如果需要现场演示,我可以即兴改任意文件说明逻辑

---

## §15 项目延伸与反思

### Q15.1 如果用户量很大(1 万 + 并发),前端要做什么优化?
**答**:
- 拆 chunk、按需加载、路由懒加载(已做)
- 图片用 CDN + 懒加载 + WebP
- 接口数据缓存(SWR 模式,stale-while-revalidate)
- 大列表虚拟滚动(el-table-virtual)
- 拆分到多个子应用(micro-app / qiankun 微前端)
- 上 CDN / Nginx 启用 gzip / brotli

### Q15.2 如果后端用 GraphQL,前端怎么改?
**答**:
- 不用 axios,改用 `graphql-request` 或 Apollo Client
- `request.js` 改成统一 GraphQL client + 拦截器处理 token / 错误
- API 模块从"方法调用"改成"写 query / mutation"
- Vuex action 内部调 graphql client
- 业务组件**不需要改**

### Q15.3 这个项目怎么部署?
**答**:
- 前端:`npm run build` → 产物 `dist/`
- 部署到:
  - **静态服务器**:Nginx `root` 指向 `dist/`,配 `try_files $uri $uri/ /index.html;`
  - **CDN**:把 `dist/` 同步到 CDN,`publicPath` 改 CDN 地址
  - **同源部署**:Spring Boot 静态资源目录放 `dist/`,`@RequestMapping("/")` 转发到 `index.html`
- 后端:Spring Boot `mvn package` 打成 jar,`java -jar` 启动
- 开发联调:Vue 8081 + Spring Boot 8080,后端配 CORS

### Q15.4 你从这个项目中学到了什么?
**答**:
- **架构思维**:不急着写代码,先想清楚页面/路由/状态/数据层
- **Vue 3 组合式 API 的优势**:逻辑聚合,告别 Options 的"散装"感
- **拦截器的好处**:把横切关注点(token、统一错误)集中处理
- **mock 的价值**:后端不阻塞前端,后端就绪时切真实接口零改动
- **API 契约先行**:写 [api.md](./api.md) 比写代码更值钱,让前后端对齐
- **Element Plus 实战**:不是炫技,而是用"对的组件"减少重复代码
- **ESLint 调优**:碰到 `defineProps` 未定义这种坑,理解了 `<script setup>` 的编译机制

### Q15.5 你最满意 / 最不满意的代码是哪个?
**答**:
- **最满意**:[router/index.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/router/index.js) 的 `beforeEach`,6 行代码搞定全站登录态校验,redirect 参数自动回跳
- **最不满意**:[Form.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/appointment/Form.vue) 的 `loadSlot` 逻辑,从 store 全局 slots 中查找当前 slotId,如果有"直接进入"路径可能找不到,降级方案略复杂。如果重写,会考虑用 `route.query.counselorId` 兜底(已经做了)

---

## 附录:速查清单

- 默认登录账号:`zhangsan / 123456`
- 启动命令:`npm run serve`(端口 8081)
- 打包命令:`npm run build`(0 error 通过)
- 后端契约:[api.md](./api.md)(32 个接口)
- 开发计划:[plan.md](./plan.md)
- 项目结构:[structure.md](./structure.md)
- 路由文件:[src/router/index.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/router/index.js)
- Vuex 入口:[src/store/index.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/store/index.js)
- Axios 封装:[src/api/request.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/api/request.js)
- Mock 拦截器:[src/mock/index.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/mock/index.js)
