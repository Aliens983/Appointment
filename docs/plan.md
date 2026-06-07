# 校园心理咨询预约系统 - 前端开发计划(实施版)

> 项目:`appointment_project`(Vue 3 + Vue CLI 5)
> 文档目的:记录项目的设计思路、页面/路由/状态/组件拆分、业务流程,以及"为什么这样设计"。
> 当前状态:**已完成**(`npm run build` 通过,产物在 `dist/`)。

---

## 1. 需求复述

### 1.1 业务功能(6 大模块)
| 编号 | 功能 | 说明 |
| ---- | ---- | ---- |
| F1 | 心理咨询师列表 | 支持按"专长 / 关键词"筛选与检索 |
| F2 | 预约时段选择 | 选中咨询师后,展示其未来 7 天的可预约时段 |
| F3 | 预约表单 | 主题、描述、紧急程度、**是否匿名**等 |
| F4 | 预约记录 | 查看 / 取消 / 评价预约 |
| F5 | 在线留言咨询 | 1v1 文字会话(会话列表 + 聊天详情) |
| F6 | 心理测评问卷 | 多种题型 + 报告生成 |

### 1.2 技术硬性要求达成情况
| 要求 | 实现方式 | 达成 |
| ---- | ---- | ---- |
| Vue 3 组合式 API | 全项目统一使用 `<script setup>` | ✅ |
| Vue CLI 5 | `vue create` 初始化 | ✅ |
| Vue Router ≥10 条 | **16 条**(含 7 条带参) | ✅ |
| Vuex 状态管理 | 5 个 module(user / counselor / appointment / message / assessment) | ✅ |
| Axios | 统一封装 + 请求/响应拦截器 + Mock 适配 | ✅ |
| UI 组件库 ≥4 种 | Element Plus,实际使用 20+ 种组件 | ✅ |
| 后端 RESTful | 32 个接口契约(见 [api.md](./api.md)) | ✅ |

---

## 2. 路由与页面设计

### 2.1 路由总览(16 条,带参 7 条)

| # | 路径 | 名称 | 页面文件 | 带参 | 鉴权 |
| - | ---- | ---- | ---- | ---- | ---- |
| 1 | `/` | Home | [views/Home.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/Home.vue) | ❌ | ❌ |
| 2 | `/login` | Login | [views/Login.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/Login.vue) | ❌ | ❌ |
| 3 | `/register` | Register | [views/Register.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/Register.vue) | ❌ | ❌ |
| 4 | `/counselors` | CounselorList | [views/counselor/List.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/counselor/List.vue) | ❌ | ❌ |
| 5 | `/counselors/:id` | CounselorDetail | [views/counselor/Detail.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/counselor/Detail.vue) | ✅ | ❌ |
| 6 | `/appointment/book/:counselorId` | AppointmentBook | [views/appointment/Book.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/appointment/Book.vue) | ✅ | ✅ |
| 7 | `/appointment/form/:slotId` | AppointmentForm | [views/appointment/Form.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/appointment/Form.vue) | ✅ | ✅ |
| 8 | `/appointment/records` | AppointmentRecords | [views/appointment/Records.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/appointment/Records.vue) | ❌ | ✅ |
| 9 | `/appointment/records/:id` | AppointmentDetail | [views/appointment/Detail.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/appointment/Detail.vue) | ✅ | ✅ |
| 10 | `/messages` | MessageList | [views/message/List.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/message/List.vue) | ❌ | ✅ |
| 11 | `/messages/:id` | MessageChat | [views/message/Chat.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/message/Chat.vue) | ✅ | ✅ |
| 12 | `/assessment` | AssessmentList | [views/assessment/List.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/assessment/List.vue) | ❌ | ❌ |
| 13 | `/assessment/:id` | AssessmentQuiz | [views/assessment/Quiz.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/assessment/Quiz.vue) | ✅ | ❌ |
| 14 | `/assessment/result/:recordId` | AssessmentResult | [views/assessment/Result.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/assessment/Result.vue) | ✅ | ✅ |
| 15 | `/profile` | Profile | [views/Profile.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/Profile.vue) | ❌ | ✅ |
| - | `/:pathMatch(.*)*` | NotFound | [views/NotFound.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/NotFound.vue) | ❌ | ❌ |

**带参路由共 7 条**(`/counselors/:id`、`/appointment/book/:counselorId`、`/appointment/form/:slotId`、`/appointment/records/:id`、`/messages/:id`、`/assessment/:id`、`/assessment/result/:recordId`),远超"≥3 条"要求。

### 2.2 业务流程图(用户视角)

```
[首页 /]
  │
  ├─► 未登录 ──► [登录] / [注册]
  └─► 已登录
        ├─► [咨询师列表 /counselors] ──筛选/搜索──► [咨询师详情 /counselors/:id]
        │                                              ├── 立即预约 ──► [/appointment/book/:counselorId]
        │                                              │                        └─► [/appointment/form/:slotId]
        │                                              │                                  └─ 提交 ──► [/appointment/records]
        │                                              │                                                  └──► [/appointment/records/:id]
        │                                              └── 在线留言 ──► [/messages/:id]
        ├─► [在线留言 /messages] ──► [/messages/:id]
        ├─► [心理测评 /assessment] ──► [/assessment/:id] ──提交──► [/assessment/result/:recordId]
        └─► [个人中心 /profile]
```

---

## 3. 状态管理(Vuex 4 模块化)

> 设计原则:**只把"跨页面共享 / 需要缓存 / 异步数据"放进 Vuex,纯页面级状态用 `ref` / `reactive`**。

### 3.1 模块划分

| 模块 | state | 主要 actions | 文件 |
| ---- | ---- | ---- | ---- |
| **user** | `token`、`profile` | `login`、`register`、`loadProfile`、`logout` | [store/modules/user.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/store/modules/user.js) |
| **counselor** | `list`、`total`、`filters`、`current`、`currentSlots`、`specialties` | `fetchList`、`fetchDetail`、`fetchSlots`、`fetchSpecialties` | [store/modules/counselor.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/store/modules/counselor.js) |
| **appointment** | `list`、`total`、`current` | `fetchList`、`fetchDetail`、`create`、`cancel`、`review` | [store/modules/appointment.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/store/modules/appointment.js) |
| **message** | `conversations`、`currentMessages` | `fetchConversations`、`openConversation`、`fetchMessages`、`send` | [store/modules/message.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/store/modules/message.js) |
| **assessment** | `list`、`current`、`records` | `fetchList`、`fetchDetail`、`submit`、`fetchRecords`、`fetchRecord` | [store/modules/assessment.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/store/modules/assessment.js) |

### 3.2 持久化
- `token` 与 `profile` 通过 [utils/auth.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/utils/auth.js) 写入 `localStorage`,刷新页面不丢
- 应用启动时 `main.js` 主动 `dispatch('user/loadProfile')` 校验 token 有效性

---

## 4. 网络层设计

### 4.1 Axios 封装 ([src/api/request.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/api/request.js))
- `baseURL = '/api'`,`timeout = 15000`
- **请求拦截器**:从 `localStorage` 读 token,自动塞 `Authorization: Bearer xxx`
- **响应拦截器**:
  - 业务 `code === 0` → 直接 `return data`(业务侧拿到的就是 `data`,不需要再拆)
  - `code === 1001` → 清 token + 跳登录
  - 其它非 0 → `ElMessage.error(message)`
  - HTTP 层异常 → 统一提示
- **Mock 挂载**:当 `VUE_APP_USE_MOCK=true` 时,动态 `import('@/mock')` 注入 mock 拦截器(不进生产包)

### 4.2 API 模块(5 个)
- [src/api/auth.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/api/auth.js) — 登录 / 注册 / me
- [src/api/counselor.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/api/counselor.js) — 列表 / 详情 / 时段 / 专长
- [src/api/appointment.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/api/appointment.js) — 创建 / 列表 / 详情 / 取消 / 评价
- [src/api/message.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/api/message.js) — 会话 / 消息
- [src/api/assessment.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/api/assessment.js) — 问卷 / 提交 / 记录

### 4.3 Mock 数据 ([src/mock/](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/mock/))
- [data.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/mock/data.js):6 名咨询师、5×4×6 个时段、若干预约与测评数据
- [index.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/mock/index.js):axios-mock-adapter 拦截所有 `/api/**` 请求,返回 `{ code, message, data }` 统一结构
- 默认账号:`zhangsan / 123456`

---

## 5. UI 组件使用清单

| 组件 | 用处 | 出现页/位置 |
| ---- | ---- | ---- |
| `el-button` | 全局按钮 | 大量 |
| `el-input` / `el-input type=textarea` | 表单输入、聊天输入 | Login/Register/Form/Chat |
| `el-form` / `el-form-item` | 表单校验 | Login/Register/Form/Profile |
| `el-card` | 卡片容器 | List/Detail/Records/Profile/Home |
| `el-tag` | 状态、专长、紧急 | Records/CounselorCard/AppointmentCard |
| `el-rate` | 评分 | CounselorCard/Profile |
| `el-pagination` | 列表分页 | CounselorList/Records |
| `el-dialog` | 弹窗 | Records(评价) |
| `el-message` / `el-message-box` | 全局提示、确认 | 多处 |
| `el-date-picker` | 日期选择 | Book |
| `el-tabs` | 标签页切换 | CounselorDetail/Records/Profile |
| `el-steps` | 步骤条 | Book/Form |
| `el-progress` | 进度 | Quiz |
| `el-avatar` | 头像 | AppHeader/CounselorCard/MessageBubble |
| `el-switch` | 开关(匿名) | Form/Profile |
| `el-radio-group` / `el-checkbox-group` | 单/多选 | Form/Quiz |
| `el-badge` | 未读红点 | message/List |
| `el-empty` | 空状态 | 多处 |
| `el-page-header` | 页面头部 | 详情页 |
| `el-result` | 404 | NotFound |
| `el-timeline` | 时间线 | CounselorDetail/AppointmentDetail |
| `el-descriptions` | 描述列表 | AppointmentDetail/Profile |
| `el-table` | 表格 | AssessmentResult |
| `el-dropdown` | 下拉菜单 | AppHeader |
| `el-icon` + `@element-plus/icons-vue` | 图标 | 全局 |

**实际使用 Element Plus 组件 25+ 种**,远超"≥4 种"要求。

---

## 6. 关键业务实现细节

### 6.1 匿名预约
- 表单用 `el-switch` 暴露 `isAnonymous`,开启后联系电话字段隐藏
- 提交时透传 `isAnonymous: true` 给后端,由后端在所有展示场景把姓名替换为"匿名同学"
- 前端不做任何字符串替换,避免在多个组件里散落逻辑

### 6.2 登录守卫
- [src/router/index.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/router/index.js) 的 `beforeEach` 统一处理
- `meta.requiresAuth === true` 且 `!store.getters['user/isLoggedIn']` → 跳 `/login?redirect=当前完整路径`
- 登录成功后 [Login.vue](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/views/Login.vue) `router.replace(route.query.redirect || '/')`

### 6.3 预约流程
1. `CounselorDetail.vue` 点"立即预约" → 鉴权 → 跳 `/appointment/book/:counselorId`
2. `Book.vue` 选日期(`el-date-picker`,限制未来 7 天) + 选时段
3. 下一步 → `/appointment/form/:slotId`,`Form.vue` 填表单
4. 提交 → `store.dispatch('appointment/create', payload)` → 成功 → 跳 `/appointment/records?status=upcoming`
5. 评价:`el-dialog` 弹窗,`store.dispatch('appointment/review', {id, score, content})`

### 6.4 心理测评
- `Quiz.vue` 顶部 `el-progress` 展示进度,中部根据 `current.type` 渲染 `single` / `multi` / `scale` 三种题型
- 答案用 `answers[questionId]` 对象存储,支持各种数据形态
- 提交后跳 `/assessment/result/:recordId`,后端返回分数 + 等级 + 建议

### 6.5 在线留言
- 简化方案:不做 WebSocket,**采用 axios 拉取**(后续可升级为长连接)
- `MessageBubble.vue` 接收 `isMine` 控制左右气泡
- 发送消息后本地 `PUSH_MESSAGE` 即时追加,`scrollBottom()` 滚到底部

### 6.6 个人中心
- `Profile.vue` 用 `el-tabs` 切分"基本资料 / 修改密码 / 隐私设置"
- 表单用 `watch(profile, ..., { immediate: true })` 反向同步 Vuex 中的 profile

---

## 7. 工程配置

### 7.1 [vue.config.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/vue.config.js)
- 端口改 `8081`(避免与 Spring Boot 8080 冲突)
- `publicPath: './'`,方便部署到子路径
- `@` 别名指向 `src`

### 7.2 环境变量
- [.env.development](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/.env.development):开发期 baseURL + `VUE_APP_USE_MOCK=true`
- [.env.production](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/.env.production):生产期用同源 `/api`,关闭 mock

### 7.3 ESLint
- 在 [package.json](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/package.json) 的 `eslintConfig` 中:
  - 注册 `defineProps` / `defineEmits` / `defineExpose` 为全局宏
  - 关闭 `vue/multi-word-component-names`(业务组件单字名合理)
  - `no-empty` 关闭、`no-unused-vars` 降为 warn

---

## 8. 验证

```bash
npm run build     # ✅ 通过,0 error
npm run serve     # 开发服务器,端口 8081
```

构建产物 `dist/`,体积:
- `app.js`:16.88 KiB(gzip 6.27 KiB)
- `chunk-vendors.js`:1.32 MiB(gzip 404 KiB)— 主要是 Element Plus

---

## 9. 后续可优化(未做但可演进)
- WebSocket 实时聊天(目前 HTTP 拉取)
- 测评答题的 sessionStorage 草稿恢复
- 咨询师评价子页 + 评价提交
- 单元测试(Jest + Vue Test Utils)
- 国际化 vue-i18n
- TypeScript 改造
