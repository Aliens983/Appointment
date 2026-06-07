# 项目结构与学习笔记

> 文档目的:梳理 `appointment_project` 当前的工程结构、关键文件、依赖、配置,以及对 Vue 3 / Vue CLI 工程化的理解。
> 当前状态:**项目已编码完成,`npm run build` 通过**。

---

## 1. 顶层目录(实施后)

```
appointment_project/
├── docs/                          # 文档(plan / api / structure / answer)
│   ├── plan.md                    # 实施版开发计划
│   ├── api.md                     # 前后端 API 契约(32 个接口)
│   ├── structure.md               # 当前文件
│   └── answer.md                  # 答辩预演问题与答案
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── api/                       # 5 个 API 模块
│   │   ├── request.js             # axios 封装 + 拦截器
│   │   ├── auth.js
│   │   ├── counselor.js
│   │   ├── appointment.js
│   │   ├── message.js
│   │   └── assessment.js
│   ├── assets/
│   │   └── logo.png
│   ├── components/                # 通用组件
│   │   ├── AppHeader.vue
│   │   ├── AppFooter.vue
│   │   ├── CounselorCard.vue
│   │   ├── AppointmentCard.vue
│   │   ├── MessageBubble.vue
│   │   └── EmptyState.vue
│   ├── layouts/
│   │   └── MainLayout.vue         # Header + <router-view/> + Footer
│   ├── mock/
│   │   ├── data.js                # 内存数据库
│   │   └── index.js               # axios-mock-adapter 拦截器
│   ├── router/
│   │   └── index.js               # 16 条路由 + 守卫
│   ├── store/
│   │   ├── index.js
│   │   └── modules/
│   │       ├── user.js
│   │       ├── counselor.js
│   │       ├── appointment.js
│   │       ├── message.js
│   │       └── assessment.js
│   ├── styles/
│   │   └── global.css
│   ├── utils/
│   │   ├── auth.js                # token / profile 持久化
│   │   ├── format.js              # dayjs 格式化
│   │   └── constants.js           # 业务枚举
│   ├── views/                     # 15 个页面
│   │   ├── Home.vue
│   │   ├── Login.vue
│   │   ├── Register.vue
│   │   ├── Profile.vue
│   │   ├── NotFound.vue
│   │   ├── counselor/
│   │   │   ├── List.vue
│   │   │   └── Detail.vue
│   │   ├── appointment/
│   │   │   ├── Book.vue
│   │   │   ├── Form.vue
│   │   │   ├── Records.vue
│   │   │   └── Detail.vue
│   │   ├── message/
│   │   │   ├── List.vue
│   │   │   └── Chat.vue
│   │   └── assessment/
│   │       ├── List.vue
│   │       ├── Quiz.vue
│   │       └── Result.vue
│   ├── App.vue                    # 根组件:挂载 MainLayout
│   └── main.js                    # 入口:注册 router / store / Element Plus
├── .env.development               # 开发环境变量
├── .env.production                # 生产环境变量
├── babel.config.js
├── jsconfig.json                  # @/* 别名
├── package.json
├── vue.config.js                  # 端口 8081 + @ 别名
└── README.md
```

---

## 2. package.json 关键信息

### 2.1 依赖
- `vue@^3.2.13`
- `vue-router@^4.6.4`
- `vuex@^4.1.0`
- `axios@^1.17.0`
- `axios-mock-adapter@^2.1.0`(开发期 Mock)
- `element-plus@^2.14.1`
- `@element-plus/icons-vue@^2.3.2`
- `dayjs@^1.11.21`
- `core-js@^3.8.3`

### 2.2 devDependencies
- `@vue/cli-service@~5.0.0`
- `@vue/cli-plugin-babel@~5.0.0`
- `@vue/cli-plugin-eslint@~5.0.0`
- `eslint@^7.32.0`
- `eslint-plugin-vue@^8.0.3`
- `@babel/core`、`@babel/eslint-parser`

### 2.3 scripts
- `npm run serve`:开发服务器
- `npm run build`:生产构建
- `npm run lint`:ESLint 检查

### 2.4 eslintConfig
- `extends`: `plugin:vue/vue3-essential` + `eslint:recommended`
- `parser`: `@babel/eslint-parser`(`ecmaVersion: "latest"`)
- `globals`: 注册 `defineProps` / `defineEmits` / `defineExpose` 为 readonly
- `rules`: 关闭 `vue/multi-word-component-names`、关闭 `no-empty`、把 `no-unused-vars` 降为 warn

---

## 3. Vue 3 + Vue CLI 工程化理解

### 3.1 启动流程
```
npm run serve
  └─ vue-cli-service serve
       └─ webpack-dev-server
            └─ 读取 public/index.html 作为模板
                 └─ 编译 src/main.js 作为入口
                      └─ 加载 App.vue,挂载 MainLayout → #app
                           └─ 路由匹配 → 渲染对应 view
```

### 3.2 main.js 关键代码
[main.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/main.js) 完成四件事:
1. 启动时 `store.dispatch('user/loadProfile')` 校验 token
2. 全局注册 Element Plus 图标
3. `app.use(store).use(router).use(ElementPlus)`
4. `mount('#app')`

### 3.3 路由职责
[router/index.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/router/index.js) 用 `createRouter` + `createWebHashHistory`(便于静态部署不依赖服务器路由重写)。

`meta` 字段:
- `title`:页面标题(配合 `beforeEach` 设置 `document.title`)
- `requiresAuth: true`:需要登录
- `hideInMenu: true`:不在 Header 菜单显示

`beforeEach` 守卫核心:
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

### 3.4 Vuex 4 模块化
[store/index.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/store/index.js) 用 `createStore` 注入 5 个 module,均开启 `namespaced: true`。
组件中通过 `useStore()` 拿到根 store,访问形如:
- `store.dispatch('user/login', payload)`
- `store.commit('message/PUSH_MESSAGE', msg)`
- `store.getters['user/isLoggedIn']`

### 3.5 Axios 拦截器
[api/request.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/api/request.js):
- 请求拦截:从 `localStorage` 读 token,塞 `Authorization: Bearer xxx`
- 响应拦截:统一拆 `code` 字段;`code === 0` 直接 `return data`(业务侧少一层 unwrap)
- 业务 `code === 1001`(token 失效)→ 清 token + 跳登录(带 `redirect` 参数)
- HTTP 层异常:`ElMessage.error(msg)`,再 `Promise.reject`
- 动态 import mock,生产包不引入

### 3.6 路径别名
- [vue.config.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/vue.config.js) `configureWebpack.resolve.alias['@'] = 'src'`
- [jsconfig.json](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/jsconfig.json) `paths.@/* = src/*`(IDE 提示)
- 之后 `import xxx from '@/api/request'` 即可

### 3.7 环境变量
- [`.env.development`](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/.env.development):`VUE_APP_API_BASE=http://localhost:8080/api` + `VUE_APP_USE_MOCK=true`
- [`.env.production`](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/.env.production):`VUE_APP_API_BASE=/api` + `VUE_APP_USE_MOCK=false`
- 运行时通过 `process.env.VUE_APP_API_BASE` / `process.env.VUE_APP_USE_MOCK` 读取

### 3.8 UI 库:Element Plus
- 为什么选它:Vue 3 官方推荐、组件丰富(本项目用到 25+ 种)、文档完善
- 按需引入 vs 全局:本项目**全局注册**,代码简单
- 图标:用 `@element-plus/icons-vue`,遍历键值对 `app.component(name, comp)` 全局注册

### 3.9 Mock 策略
- 用 `axios-mock-adapter` 拦截 axios 请求,直接返回内存数据
- 优点:不依赖网络,刷新即可,切到真实后端时**只关掉 `VUE_APP_USE_MOCK` 即可**,业务代码零改动
- 默认账号:`zhangsan / 123456`

### 3.10 联调与打包
- 开发:`npm run serve` → 端口 8081(避免与 Spring Boot 8080 冲突)
- 打包:`npm run build` → 产物在 `dist/`
- 部署:`publicPath: './'`,可放到任意子路径

---

## 4. 与需求逐条对照(实施结果)

| 需求 | 达成 | 证据 |
| ---- | ---- | ---- |
| Vue 3 | ✅ | `package.json` 中 `vue@^3.2.13` |
| Vue CLI 5 | ✅ | `@vue/cli-service@~5.0.0` |
| Vue Router ≥10 条 | ✅ | [router/index.js](file:///c:/Users/25516/Desktop/前端交互/Appointment/appointment_project/src/router/index.js) 16 条 |
| Vue Router ≥3 条带参 | ✅ | 7 条带参(详见 plan.md §2.1) |
| Vuex | ✅ | 5 个 module + namespaced |
| Axios | ✅ | 统一封装 + 拦截器 |
| UI 组件库 ≥4 种 | ✅ | Element Plus,实际使用 25+ 种组件 |
| ≥8 页 | ✅ | 15 个页面 + 404 兜底 |
| 后端 RESTful | ✅ | 32 个接口契约(见 [api.md](./api.md)) |
| JSON 数据 | ✅ | axios 默认 JSON;Mock 期用内存对象 |

---

## 5. 设计决策记录(为什么这样写)

### 5.1 为什么用 `<script setup>` 不用 Options API?
- 更少的样板代码,逻辑按"职责"分组而非"选项"分组
- 编译期宏(`defineProps` / `defineEmits`)对 TypeScript 友好,后续可平滑迁移
- Vue 3 官方推荐

### 5.2 为什么用 `<el-form>` 而不是手写校验?
- 业务侧 4 个表单(Login / Register / Appointment / Profile)都需要校验
- Element Plus 自带 `rules` + `validate`,减少重复代码
- UI 风格统一

### 5.3 为什么 Vuex 而不用 Pinia?
- 题目明确要求 Vuex
- Pinia 是 Vuex 的下一代替代,但本项目用 Vuex 4 已经足够

### 5.4 为什么 5 个 module 拆分?
- user:登录态全局共享,几乎所有受保护页都依赖
- counselor:咨询师列表筛选条件、当前详情、当前可约时段都要跨页共享
- appointment:我的预约 + 当前详情
- message:会话列表 + 当前消息
- assessment:问卷 + 当前答题 + 历史记录
- 5 个 module 各司其职,避免"一个 store 装全部"

### 5.5 为什么用 axios-mock-adapter 而非 mockjs?
- axios-mock-adapter 在 axios 适配层拦截,业务代码看到的仍是"真实请求"
- 字段名 / 路径与 `api.md` 严格一致,后端就绪时几乎零改动
- mockjs 是"修改响应内容",与 axios 拦截更底层,需要更多胶水代码

### 5.6 为什么路由用 hash 模式(`createWebHashHistory`)?
- 静态部署时不依赖服务器 rewrite 规则
- URL 形如 `#/counselors/201`,刷新不丢页
- 代价:URL 略丑,但本项目对 SEO 无要求,无关紧要

---

## 6. 风险与已规避

- **端口冲突**:Spring Boot 8080 / Vue dev 8081,后端需放行 CORS
- **Element Plus 体积**:`chunk-vendors.js` 1.32 MiB(全量注册);若要瘦身用 `unplugin-vue-components` 按需
- **token 安全**:当前存 `localStorage`,XSS 风险;若需更高安全性改 `httpOnly cookie`,但本项目场景下可接受
- **时间一致性**:统一使用 `dayjs` + ISO-8601 字符串,避免 Date 对象跨时区误差

---

## 7. 与 `plan.md` 的对应关系

| structure.md 章节 | 对应 plan.md 章节 |
| ---- | ---- |
| §1 目录结构 | §7 目录结构(实施版) |
| §2 package.json | §2 技术选型 |
| §3 Vue 3 工程化 | §3 路由 / §4 状态 / §5 状态 / §6 关键实现 |
| §4 需求对照 | §1 需求复述 |
| §5 设计决策 | §6 关键业务实现 |
| §6 风险 | §9 后续可优化 |
