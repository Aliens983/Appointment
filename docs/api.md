# 前端 → 后端 API 契约文档

> 后端实现者:开发者本人(Spring Boot)
> 文档目的:前端将严格按本文档定义的路径、方法、字段、状态码与后端对接;字段名、类型请保持一致,业务侧已写死的字段命名不要随意改动。

---

## 0. 通用约定

### 0.1 BaseURL
- 开发环境:`http://localhost:8080/api`
- 生产环境(打包后):`/api`(同源部署)
- 前端 axios 实例已配置,后端请把 Controller 的根路径放在 `/api` 下。

### 0.2 通用请求头
| Header | 必填 | 说明 |
| ---- | ---- | ---- |
| `Content-Type: application/json;charset=UTF-8` | 是 | 所有写接口 |
| `Authorization: Bearer <token>` | 否(登录接口除外) | 其余接口登录后必带;由前端拦截器自动注入 |

### 0.3 通用响应结构
**所有接口(除文件下载/上传流)统一返回**:
```json
{
  "code": 0,
  "message": "ok",
  "data": <T | null>
}
```
- `code: number`
  - `0` 成功
  - `1001` 未登录 / token 失效(前端应清 token 并跳 `/login`)
  - `1002` 无权限
  - `2001` 参数错误
  - `3001` 资源不存在
  - `4001` 业务冲突(如时段已被占用)
  - `5000` 服务异常
- `message: string`,前端 `ElMessage` 直接展示
- `data: T`,业务数据

### 0.4 分页约定
查询参数:
- `page: number`,从 **1** 开始,默认 1
- `pageSize: number`,默认 10,最大 50

返回 `data` 结构:
```json
{
  "list": [],
  "total": 0,
  "page": 1,
  "pageSize": 10
}
```

### 0.5 时间格式
- 所有时间字段统一 `ISO-8601` 字符串,精确到秒,带时区 `+08:00`
- 例:`"2026-06-10T14:00:00+08:00"`
- 纯日期字段(如 `date`)格式 `"2026-06-10"`

### 0.6 鉴权
- 不带 `Authorization` 访问受保护接口 → `code: 1001`
- 登录后 `localStorage` 存 `token`,在每次请求中由前端 axios 拦截器自动添加
- Token 有效期建议 7 天,过期返回 `1001`

### 0.7 匿名约定
- 匿名预约的"展示名"由后端统一处理,前端**不做任何替换**;后端在返回 `appointment` / `message` 时,如果 `isAnonymous=true`,则 `studentName` 字段直接返回 `"匿名同学"`,`studentAvatar` 返回 `null` 或固定占位图。
- 真实用户 id 仍存在 `studentId`,后端内部使用,前端无感。

---

## 1. 鉴权模块 `/api/auth`

### 1.1 用户注册 `POST /api/auth/register`
**请求体**:
```json
{
  "username": "zhangsan",
  "password": "Abcd@1234",
  "nickname": "张三",
  "email": "zs@school.edu.cn",
  "phone": "13800001111",
  "studentNo": "2021001001",
  "gender": "male"
}
```
| 字段 | 必填 | 类型 | 校验 |
| ---- | ---- | ---- | ---- |
| username | ✅ | string(4-20) | 字母数字下划线,唯一 |
| password | ✅ | string(8-20) | 至少含字母+数字 |
| nickname | ✅ | string(1-12) | 昵称 |
| email | ✅ | string | 邮箱格式 |
| phone | ❌ | string(11) | 手机号 |
| studentNo | ❌ | string | 学号 |
| gender | ❌ | enum: `male` / `female` / `other` | |

**成功响应** `data`:
```json
{
  "userId": 10001,
  "username": "zhangsan"
}
```

### 1.2 用户登录 `POST /api/auth/login`
**请求体**:
```json
{
  "username": "zhangsan",
  "password": "Abcd@1234"
}
```

**成功响应** `data`:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": 10001,
  "nickname": "张三",
  "avatar": "https://..." 
}
```

### 1.3 退出登录 `POST /api/auth/logout`
> 前端直接清 token 也可,后端可在此处使 token 失效(可选)。

**成功响应** `data`: `null`

### 1.4 获取当前用户信息 `GET /api/auth/me`
**成功响应** `data`:
```json
{
  "userId": 10001,
  "username": "zhangsan",
  "nickname": "张三",
  "avatar": "https://...",
  "email": "zs@school.edu.cn",
  "phone": "13800001111",
  "studentNo": "2021001001",
  "gender": "male",
  "defaultAnonymous": false,
  "createdAt": "2026-03-01T10:00:00+08:00"
}
```

---

## 2. 咨询师模块 `/api/counselors`

### 2.1 咨询师列表 `GET /api/counselors`
**Query 参数**:
| 参数 | 必填 | 类型 | 说明 |
| ---- | ---- | ---- | ---- |
| keyword | ❌ | string | 姓名 / 简介模糊搜索 |
| specialty | ❌ | string | 专长标签,如 `焦虑`、`人际` |
| date | ❌ | string(YYYY-MM-DD) | 限定在该日期至少有 1 个可约时段的咨询师 |
| sort | ❌ | enum: `rating_desc` / `default` | 默认 `default` |
| page | ❌ | number | 默认 1 |
| pageSize | ❌ | number | 默认 10 |

**响应** `data.list[]`:
```json
{
  "list": [
    {
      "id": 201,
      "name": "李心怡",
      "title": "副教授",
      "avatar": "https://...",
      "specialties": ["焦虑", "学业压力", "人际关系"],
      "rating": 4.8,
      "ratingCount": 132,
      "availableSlotCount": 6,
      "intro": "擅长青少年情绪问题…"
    }
  ],
  "total": 12,
  "page": 1,
  "pageSize": 10
}
```

### 2.2 咨询师详情 `GET /api/counselors/{id}`
**路径参数**:`id` 咨询师 id

**响应** `data`:
```json
{
  "id": 201,
  "name": "李心怡",
  "title": "副教授",
  "avatar": "https://...",
  "specialties": ["焦虑", "学业压力", "人际关系"],
  "rating": 4.8,
  "ratingCount": 132,
  "intro": "简介…",
  "experiences": [
    { "period": "2018-至今", "desc": "XX 大学心理咨询中心" }
  ],
  "availableSlotCount": 6
}
```

### 2.3 咨询师可约时段 `GET /api/counselors/{id}/slots`
**Query 参数**:
| 参数 | 必填 | 类型 | 说明 |
| ---- | ---- | ---- | ---- |
| date | ❌ | string(YYYY-MM-DD) | 不传则返回未来 7 天所有可约时段 |
| from | ❌ | string(YYYY-MM-DD) | 区间查询起点 |
| to | ❌ | string(YYYY-MM-DD) | 区间查询终点(默认 `from + 7`) |

**响应** `data`:
```json
{
  "counselorId": 201,
  "days": [
    {
      "date": "2026-06-10",
      "slots": [
        { "slotId": 5001, "start": "2026-06-10T09:00:00+08:00", "end": "2026-06-10T10:00:00+08:00", "available": true },
        { "slotId": 5002, "start": "2026-06-10T10:00:00+08:00", "end": "2026-06-10T11:00:00+08:00", "available": false }
      ]
    }
  ]
}
```

### 2.4 咨询师评价列表 `GET /api/counselors/{id}/reviews`
**Query**:`page`、`pageSize`

**响应** `data`:
```json
{
  "list": [
    {
      "id": 9001,
      "score": 5,
      "content": "老师非常耐心…",
      "studentName": "匿名同学",
      "isAnonymous": true,
      "createdAt": "2026-05-30T15:00:00+08:00"
    }
  ],
  "total": 132
}
```

### 2.5 专长字典 `GET /api/counselors/specialties`
**响应** `data`:
```json
["焦虑", "抑郁", "学业压力", "人际关系", "情感", "家庭关系", "自我认知", "睡眠"]
```

---

## 3. 预约模块 `/api/appointments`

### 3.1 创建预约 `POST /api/appointments`
**请求体**:
```json
{
  "slotId": 5001,
  "topic": "近期睡眠质量差",
  "description": "近两周入睡困难,凌晨 3 点才睡…",
  "isAnonymous": true,
  "urgency": "normal",
  "contactPhone": "13800001111"
}
```
| 字段 | 必填 | 类型 | 说明 |
| ---- | ---- | ---- | ---- |
| slotId | ✅ | number | 必传;后端校验 `available === true` |
| topic | ✅ | string(1-30) | 主题 |
| description | ❌ | string(0-500) | 详细描述 |
| isAnonymous | ✅ | bool | |
| urgency | ✅ | enum: `normal` / `urgent` / `very_urgent` | 一般 / 较紧急 / 紧急 |
| contactPhone | ❌ | string | 匿名时可不填,后端落库也置空 |

**成功响应** `data`:
```json
{
  "appointmentId": 7001,
  "status": "upcoming"
}
```

**错误**:`4001` 时段已被占用 / `3001` 时段不存在。

### 3.2 我的预约列表 `GET /api/appointments`
**Query 参数**:
| 参数 | 必填 | 类型 | 说明 |
| ---- | ---- | ---- | ---- |
| status | ❌ | enum: `upcoming` / `completed` / `cancelled` / `all` | 默认 `all` |
| page / pageSize | ❌ | | 默认 1 / 10 |

**响应** `data.list[]`:
```json
{
  "id": 7001,
  "counselor": {
    "id": 201,
    "name": "李心怡",
    "avatar": "https://..."
  },
  "studentName": "匿名同学",
  "isAnonymous": true,
  "topic": "近期睡眠质量差",
  "start": "2026-06-10T09:00:00+08:00",
  "end": "2026-06-10T10:00:00+08:00",
  "status": "upcoming",
  "urgency": "normal",
  "score": null,
  "createdAt": "2026-06-08T12:30:00+08:00"
}
```

### 3.3 预约详情 `GET /api/appointments/{id}`
**响应** `data`:
```json
{
  "id": 7001,
  "counselor": {
    "id": 201,
    "name": "李心怡",
    "title": "副教授",
    "avatar": "https://...",
    "specialties": ["焦虑", "睡眠"]
  },
  "studentName": "匿名同学",
  "isAnonymous": true,
  "topic": "近期睡眠质量差",
  "description": "...",
  "urgency": "normal",
  "contactPhone": null,
  "start": "2026-06-10T09:00:00+08:00",
  "end": "2026-06-10T10:00:00+08:00",
  "status": "upcoming",
  "score": null,
  "review": null,
  "timeline": [
    { "time": "2026-06-08T12:30:00+08:00", "action": "已预约" },
    { "time": "2026-06-08T12:30:05+08:00", "action": "预约成功" }
  ],
  "createdAt": "2026-06-08T12:30:00+08:00"
}
```

### 3.4 取消预约 `PUT /api/appointments/{id}/cancel`
**请求体**:
```json
{ "reason": "临时有事" }
```

**成功响应** `data`:
```json
{ "id": 7001, "status": "cancelled" }
```

**错误**:`4001` 已完成的预约不可取消;`1002` 不可取消他人预约。

### 3.5 评价预约 `PUT /api/appointments/{id}/review`
**请求体**:
```json
{
  "score": 5,
  "content": "老师非常耐心,给出了很多建议"
}
```

**成功响应** `data`: `{ "id": 7001, "score": 5 }`

### 3.6 预约状态枚举
| 值 | 含义 | 前端标签颜色 |
| ---- | ---- | ---- |
| `upcoming` | 待咨询 | 蓝色 |
| `completed` | 已完成 | 绿色 |
| `cancelled` | 已取消 | 灰色 |
| `expired` | 已过期(咨询时间已过但未签到) | 黄色 |

> 暂只使用前三种,`expired` 留作后端定时任务产生的状态。

---

## 4. 在线留言模块 `/api/messages`

### 4.1 会话列表 `GET /api/messages/conversations`
**响应** `data.list[]`:
```json
{
  "id": 8001,
  "counselor": {
    "id": 201,
    "name": "李心怡",
    "avatar": "https://...",
    "online": true
  },
  "lastMessage": {
    "content": "收到,记得按时休息",
    "createdAt": "2026-06-09T18:00:00+08:00",
    "fromRole": "counselor"
  },
  "unreadCount": 2,
  "isAnonymous": true,
  "displayName": "匿名同学"
}
```

### 4.2 创建(获取)与某咨询师的会话 `POST /api/messages/conversations`
**请求体**:
```json
{ "counselorId": 201 }
```

**成功响应** `data`:
```json
{ "conversationId": 8001 }
```
> 重复创建应返回同一个 id(同一对 user + counselor 唯一会话)。

### 4.3 会话消息列表 `GET /api/messages/conversations/{id}/messages`
**Query**:`page`(默认 1)、`pageSize`(默认 20)、`before`(可选,游标分页,传 `lastId`)

**响应** `data`:
```json
{
  "list": [
    {
      "id": 91001,
      "fromRole": "student",
      "content": "老师您好,我最近压力很大",
      "createdAt": "2026-06-09T17:00:00+08:00",
      "isMine": true
    },
    {
      "id": 91002,
      "fromRole": "counselor",
      "content": "收到,方便说说主要来源吗?",
      "createdAt": "2026-06-09T17:05:00+08:00",
      "isMine": false
    }
  ],
  "total": 56,
  "hasMore": true
}
```

### 4.4 发送消息 `POST /api/messages/conversations/{id}/messages`
**请求体**:
```json
{ "content": "好的,主要是学业方面…" }
```

**成功响应** `data`:
```json
{
  "id": 91003,
  "fromRole": "student",
  "content": "好的,主要是学业方面…",
  "createdAt": "2026-06-09T17:10:00+08:00",
  "isMine": true
}
```

### 4.5 标记会话已读 `PUT /api/messages/conversations/{id}/read`
**请求体**:无

**成功响应** `data`:`{ "unreadCount": 0 }`

### 4.6 未读消息总数 `GET /api/messages/unread-count`
**响应** `data`:`{ "total": 5 }`

---

## 5. 心理测评模块 `/api/assessments`

### 5.1 问卷列表 `GET /api/assessments`
**响应** `data.list[]`:
```json
{
  "id": 301,
  "title": "焦虑自评量表(SAS)",
  "description": "用于评估近一周的焦虑水平",
  "questionCount": 20,
  "estimatedMinutes": 10,
  "dimensions": ["焦虑程度"],
  "completedCount": 2,
  "latestResult": {
    "recordId": 5001,
    "score": 42,
    "level": "轻度",
    "createdAt": "2026-05-20T10:00:00+08:00"
  }
}
```

### 5.2 问卷详情 `GET /api/assessments/{id}`
**响应** `data`:
```json
{
  "id": 301,
  "title": "焦虑自评量表(SAS)",
  "description": "用于评估近一周的焦虑水平",
  "instruction": "请根据您最近一周的实际情况作答。",
  "questions": [
    {
      "id": 1,
      "type": "single",
      "title": "我觉得比平时容易紧张或着急",
      "options": [
        { "value": 1, "label": "没有或很少时间" },
        { "value": 2, "label": "小部分时间" },
        { "value": 3, "label": "相当多时间" },
        { "value": 4, "label": "绝大部分或全部时间" }
      ]
    },
    {
      "id": 2,
      "type": "multi",
      "title": "以下哪些情况符合您(多选)",
      "options": [
        { "value": "A", "label": "入睡困难" },
        { "value": "B", "label": "多梦" },
        { "value": "C", "label": "早醒" }
      ]
    },
    {
      "id": 3,
      "type": "scale",
      "title": "我感到心情低落",
      "scaleMin": 1,
      "scaleMax": 5,
      "scaleMinLabel": "完全不符合",
      "scaleMaxLabel": "完全符合"
    }
  ]
}
```

题型枚举:
- `single`:单选
- `multi`:多选
- `scale`:量表(返回数值区间)

### 5.3 提交问卷 `POST /api/assessments/{id}/submit`
**请求体**:
```json
{
  "answers": [
    { "questionId": 1, "value": 3 },
    { "questionId": 2, "value": ["A", "C"] },
    { "questionId": 3, "value": 4 }
  ],
  "durationSeconds": 320
}
```
- `value` 字段类型随题型:
  - `single`:`number`
  - `multi`:`string[]`
  - `scale`:`number`

**成功响应** `data`:
```json
{
  "recordId": 5501,
  "score": 42,
  "level": "轻度"
}
```

### 5.4 我的测评记录 `GET /api/assessment-records`
**Query**:`page`、`pageSize`、`questionnaireId`(可选)

**响应** `data.list[]`:
```json
{
  "id": 5501,
  "questionnaireId": 301,
  "questionnaireTitle": "焦虑自评量表(SAS)",
  "score": 42,
  "level": "轻度",
  "createdAt": "2026-06-01T20:00:00+08:00"
}
```

### 5.5 测评记录详情 `GET /api/assessment-records/{id}`
**响应** `data`:
```json
{
  "id": 5501,
  "questionnaireId": 301,
  "questionnaireTitle": "焦虑自评量表(SAS)",
  "score": 42,
  "level": "轻度",
  "dimensionScores": [
    { "name": "焦虑程度", "score": 42, "level": "轻度" }
  ],
  "suggestion": "建议保持规律作息,适当运动…",
  "answers": [
    { "questionId": 1, "value": 3 }
  ],
  "createdAt": "2026-06-01T20:00:00+08:00"
}
```

---

## 6. 用户模块 `/api/users`

### 6.1 更新个人资料 `PUT /api/users/me`
**请求体**(全部可选,只传需要改的):
```json
{
  "nickname": "张三三",
  "avatar": "https://...",
  "email": "new@school.edu.cn",
  "phone": "13900001111",
  "gender": "male"
}
```

**成功响应** `data`:返回更新后的 `profile`(同 1.4)

### 6.2 修改密码 `PUT /api/users/me/password`
**请求体**:
```json
{
  "oldPassword": "Abcd@1234",
  "newPassword": "Abcd@5678"
}
```

**成功响应** `data`:`null`,前端收到 200 后**清 token 跳登录**。

### 6.3 隐私设置(默认匿名) `PUT /api/users/me/privacy`
**请求体**:
```json
{ "defaultAnonymous": true }
```

**成功响应** `data`:`{ "defaultAnonymous": true }`

### 6.4 上传头像 `POST /api/users/me/avatar`
- `multipart/form-data`,字段名 `file`
- 成功响应 `data`:`{ "avatar": "https://.../xxx.png" }`

---

## 7. 字典与公共接口 `/api/common`

### 7.1 紧急程度字典 `GET /api/common/enums/urgency`
**响应** `data`:
```json
[
  { "value": "normal", "label": "一般" },
  { "value": "urgent", "label": "较紧急" },
  { "value": "very_urgent", "label": "紧急" }
]
```

### 7.2 预约状态字典 `GET /api/common/enums/appointment-status`
**响应** `data`:
```json
[
  { "value": "upcoming", "label": "待咨询" },
  { "value": "completed", "label": "已完成" },
  { "value": "cancelled", "label": "已取消" }
]
```

### 7.3 站点配置 `GET /api/common/site-config`
**响应** `data`:
```json
{
  "siteName": "校园心理咨询预约系统",
  "announcement": "心理咨询热线:400-xxx-xxxx",
  "workHours": "工作日 9:00-21:00"
}
```

---

## 8. 文件 / 错误码汇总

### 8.1 业务错误码
| code | 含义 | 前端动作 |
| ---- | ---- | ---- |
| 0 | 成功 | - |
| 1001 | 未登录 / token 失效 | 清 token + 跳登录 |
| 1002 | 无权限 | 提示并跳首页 |
| 2001 | 参数错误 | 提示 message |
| 3001 | 资源不存在 | 提示 + 回退 |
| 4001 | 业务冲突(时段被占、重复评价等) | 提示 message |
| 5000 | 服务异常 | 通用提示 |

### 8.2 HTTP 层错误
- `401`:同 1001 处理
- `403`:同 1002
- `404`:同 3001
- `5xx`:同 5000

---

## 9. 接口清单速查表

| 模块 | 方法 | 路径 | 鉴权 |
| ---- | ---- | ---- | ---- |
| auth | POST | `/api/auth/register` | ❌ |
| auth | POST | `/api/auth/login` | ❌ |
| auth | POST | `/api/auth/logout` | ✅ |
| auth | GET  | `/api/auth/me` | ✅ |
| counselor | GET | `/api/counselors` | ❌ |
| counselor | GET | `/api/counselors/{id}` | ❌ |
| counselor | GET | `/api/counselors/{id}/slots` | ❌ |
| counselor | GET | `/api/counselors/{id}/reviews` | ❌ |
| counselor | GET | `/api/counselors/specialties` | ❌ |
| appointment | POST | `/api/appointments` | ✅ |
| appointment | GET  | `/api/appointments` | ✅ |
| appointment | GET  | `/api/appointments/{id}` | ✅ |
| appointment | PUT  | `/api/appointments/{id}/cancel` | ✅ |
| appointment | PUT  | `/api/appointments/{id}/review` | ✅ |
| message | GET  | `/api/messages/conversations` | ✅ |
| message | POST | `/api/messages/conversations` | ✅ |
| message | GET  | `/api/messages/conversations/{id}/messages` | ✅ |
| message | POST | `/api/messages/conversations/{id}/messages` | ✅ |
| message | PUT  | `/api/messages/conversations/{id}/read` | ✅ |
| message | GET  | `/api/messages/unread-count` | ✅ |
| assessment | GET  | `/api/assessments` | ❌ |
| assessment | GET  | `/api/assessments/{id}` | ❌ |
| assessment | POST | `/api/assessments/{id}/submit` | ✅ |
| assessment | GET  | `/api/assessment-records` | ✅ |
| assessment | GET  | `/api/assessment-records/{id}` | ✅ |
| user | PUT  | `/api/users/me` | ✅ |
| user | PUT  | `/api/users/me/password` | ✅ |
| user | PUT  | `/api/users/me/privacy` | ✅ |
| user | POST | `/api/users/me/avatar` | ✅ |
| common | GET  | `/api/common/enums/urgency` | ❌ |
| common | GET  | `/api/common/enums/appointment-status` | ❌ |
| common | GET  | `/api/common/site-config` | ❌ |

> 接口总数:**32 个**,远高于"至少 5 处"的要求,覆盖所有业务。

---

## 10. 联调建议

1. **跨域**:后端 Spring Boot 建议配置 `CorsRegistry` 允许 `http://localhost:8081`(Vue dev server 默认端口)。
2. **Mock**:在 Spring Boot 还没就绪时,前端会用 `mockjs` + axios 适配层拦截请求,以 `db.json` 形式提供示例数据,字段名与本文档保持一致;切到真实后端时只需关掉 mock 拦截器。
3. **联调顺序建议**:
   1. 鉴权(注册 / 登录 / me)
   2. 咨询师(列表 / 详情 / 时段)
   3. 预约(创建 / 列表 / 详情 / 取消 / 评价)
   4. 测评(列表 / 详情 / 提交 / 记录)
   5. 留言(会话 / 消息)

---

## 11. 待后端确认事项

1. 是否完全按本文档字段命名?
2. Token 形式(JWT?)与有效期?
3. 文件上传是直接 OSS 走前端,还是走后端中转?
4. 留言是否需要 WebSocket,还是前端轮询足够?(默认采用轮询 3s)
5. 预约时段后端是否由管理员配置,还是学生也可以释放?

> 上述 5 点确认后,前端即可开工。

---

## 12. 提示词(Prompt):让 AI 一键生成完整 Spring Boot 后端

> 文档目的:把以下**整段提示词**连同本文件**全文**一起发给 AI,AI 即可依据本契约,生成一个**可直接 `mvn spring-boot:run` 运行**的完整 Spring Boot 后端工程。
> 提示词为可独立使用的"指令",可以单独复制,也可以放在 `api.md` 末尾一并发送。

---

### 12.1 角色与任务

```
你是 KingCodeTool(企业级 Java 全栈架构师),熟悉 Spring Boot 3 + Spring Security + JPA/MyBatis-Plus + MySQL + Redis + JWT。

请你仔细阅读我上传的 `api.md`(已在前文),这是校园心理咨询预约系统的前后端 API 契约。
请按照契约中的 32 个 RESTful 接口、字段命名、响应结构、错误码,生成一个**完整、可直接运行、零 TODO** 的 Spring Boot 后端项目。

要求:
1. 字段名、类型、路径、HTTP 方法必须与 `api.md` **逐字一致**;
2. 统一响应结构 `{"code":0,"message":"ok","data":<T>}` 用 `R<T>` 包装类 + `GlobalResponseAdvice` 拦截;
3. 业务错误码(1001/1002/2001/3001/4001/5000)用自定义异常 `BizException` + `@RestControllerAdvice` 统一处理;
4. 时间字段统一 `LocalDateTime`(后端)/ `String(ISO-8601, +08:00)`(JSON 输出),用 Jackson 配 `JavaTimeModule` + 时区 `Asia/Shanghai`;
5. 鉴权用 JWT,Token 有效期 7 天,放 `Authorization: Bearer xxx`,无 Token 返回 1001,过期也返 1001;
6. 跨域:CorsRegistry 放行 `http://localhost:8081`、`http://localhost:8080`;
7. 匿名约定:返回预约 / 消息数据时,若 `isAnonymous=true` 则 `studentName` 替换为 "匿名同学"、`studentAvatar` 置空,真实 userId 仍保留,前端不感知;
8. 代码必须带中文 JavaDoc,关键业务逻辑带 `@Transactional`,每个 Service / Controller 单元测试用 JUnit 5 + Mockito;
9. 启动时自动建表 + 注入测试数据(咨询师 6 名、问卷 3 套、时段 7 天 × 6 段);
10. 提供 `init.sql`(MySQL 8 字符集 utf8mb4) + `application.yml`(dev / prod 两套 profile)。
```

### 12.2 技术栈

```
- Spring Boot: 3.2.x(JDK 17)
- Spring Web: 5.x(包含 spring-boot-starter-web)
- Spring Security 6 + jjwt 0.12.x(JWT 工具)
- MyBatis-Plus 3.5.x(国产 ORM,代码生成友好)
- MySQL 8.x(主数据库)
- Redis 7.x(可选,缓存字典与黑名单 token)
- Lombok(简化代码)
- springdoc-openapi-starter-webmvc-ui 2.x(Swagger 文档)
- Validation(参数校验,jakarta.validation)
- JUnit 5 + Mockito(单元测试)
- Maven 3.8+(构建工具)
```

### 12.3 项目结构

```
appointment_backend/
├── pom.xml
├── README.md
├── sql/
│   └── init.sql                    # 建库建表 + 初始数据
├── src/main/java/com/school/appointment/
│   ├── AppointmentApplication.java   # 启动类
│   ├── common/
│   │   ├── R.java                    # 统一响应包装
│   │   ├── BizException.java         # 业务异常
│   │   ├── BizErrorCode.java         # 错误码枚举
│   │   ├── GlobalExceptionHandler.java
│   │   ├── GlobalResponseAdvice.java # 包装非 R 返回
│   │   └── PageQuery.java            # 分页参数
│   ├── config/
│   │   ├── CorsConfig.java
│   │   ├── MybatisPlusConfig.java
│   │   ├── JwtConfig.java
│   │   ├── SecurityConfig.java
│   │   ├── OpenApiConfig.java
│   │   └── JacksonConfig.java
│   ├── security/
│   │   ├── JwtTokenProvider.java
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── UserDetailsServiceImpl.java
│   │   └── LoginUser.java
│   ├── util/
│   │   ├── SecurityUtil.java
│   │   ├── PasswordUtil.java
│   │   └── TimeUtil.java
│   ├── module/
│   │   ├── auth/
│   │   │   ├── controller/AuthController.java
│   │   │   ├── service/AuthService.java
│   │   │   ├── dto/LoginRequest.java
│   │   │   ├── dto/RegisterRequest.java
│   │   │   └── vo/LoginResponse.java
│   │   ├── counselor/
│   │   │   ├── controller/CounselorController.java
│   │   │   ├── service/CounselorService.java
│   │   │   ├── entity/Counselor.java
│   │   │   ├── entity/Slot.java
│   │   │   ├── entity/Review.java
│   │   │   ├── mapper/CounselorMapper.java
│   │   │   ├── mapper/SlotMapper.java
│   │   │   └── mapper/ReviewMapper.java
│   │   ├── appointment/
│   │   │   ├── controller/AppointmentController.java
│   │   │   ├── service/AppointmentService.java
│   │   │   ├── entity/Appointment.java
│   │   │   ├── mapper/AppointmentMapper.java
│   │   │   └── dto/CreateAppointmentRequest.java
│   │   ├── message/
│   │   │   ├── controller/MessageController.java
│   │   │   ├── service/MessageService.java
│   │   │   ├── entity/Conversation.java
│   │   │   ├── entity/Message.java
│   │   │   ├── mapper/ConversationMapper.java
│   │   │   └── mapper/MessageMapper.java
│   │   ├── assessment/
│   │   │   ├── controller/AssessmentController.java
│   │   │   ├── controller/AssessmentRecordController.java
│   │   │   ├── service/AssessmentService.java
│   │   │   ├── entity/Questionnaire.java
│   │   │   ├── entity/Question.java
│   │   │   ├── entity/QuestionnaireRecord.java
│   │   │   └── mapper/...
│   │   ├── user/
│   │   │   ├── controller/UserController.java
│   │   │   ├── service/UserService.java
│   │   │   └── entity/User.java
│   │   └── common/
│   │       ├── controller/CommonController.java
│   │       └── service/DictService.java
│   └── ...
├── src/main/resources/
│   ├── application.yml
│   ├── application-dev.yml
│   ├── application-prod.yml
│   ├── logback-spring.xml
│   └── mapper/                      # MyBatis-Plus XML(按需)
└── src/test/java/com/school/appointment/
    ├── AuthServiceTest.java
    ├── AppointmentServiceTest.java
    └── ...
```

### 12.4 数据库设计(关键表)

```sql
-- 用户表
CREATE TABLE user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,           -- BCrypt 加密
    nickname VARCHAR(12) NOT NULL,
    avatar VARCHAR(255),
    email VARCHAR(64),
    phone VARCHAR(20),
    student_no VARCHAR(32),
    gender ENUM('male','female','other'),
    default_anonymous TINYINT(1) DEFAULT 0,
    role ENUM('student','counselor','admin') DEFAULT 'student',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username)
);

-- 咨询师表(1:1 复用 user)
CREATE TABLE counselor (
    id BIGINT PRIMARY KEY,                    -- 关联 user.id
    title VARCHAR(32),                        -- 副教授等
    intro TEXT,
    rating DECIMAL(2,1) DEFAULT 5.0,
    rating_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 咨询师专长(多对多)
CREATE TABLE counselor_specialty (
    counselor_id BIGINT,
    specialty VARCHAR(32),
    PRIMARY KEY (counselor_id, specialty)
);

-- 时段表
CREATE TABLE slot (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    counselor_id BIGINT NOT NULL,
    start_at DATETIME NOT NULL,
    end_at DATETIME NOT NULL,
    available TINYINT(1) DEFAULT 1,
    UNIQUE KEY uniq_counselor_start (counselor_id, start_at),
    INDEX idx_counselor (counselor_id)
);

-- 预约表
CREATE TABLE appointment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    counselor_id BIGINT NOT NULL,
    slot_id BIGINT NOT NULL UNIQUE,            -- 一个时段只能被预约一次
    topic VARCHAR(30) NOT NULL,
    description VARCHAR(500),
    is_anonymous TINYINT(1) DEFAULT 0,
    urgency ENUM('normal','urgent','very_urgent') DEFAULT 'normal',
    contact_phone VARCHAR(20),
    status ENUM('upcoming','completed','cancelled','expired') DEFAULT 'upcoming',
    score TINYINT,
    review_content VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_student (student_id),
    INDEX idx_counselor (counselor_id)
);

-- 评价表(也可直接放 appointment 里,这里独立便于查询咨询师评价)
CREATE TABLE review (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    appointment_id BIGINT NOT NULL UNIQUE,
    counselor_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    score TINYINT NOT NULL,
    content VARCHAR(500),
    is_anonymous TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_counselor (counselor_id)
);

-- 会话表(同 user + counselor 唯一)
CREATE TABLE conversation (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    counselor_id BIGINT NOT NULL,
    is_anonymous TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_pair (student_id, counselor_id)
);

-- 消息表
CREATE TABLE message (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    conversation_id BIGINT NOT NULL,
    from_role ENUM('student','counselor') NOT NULL,
    content TEXT NOT NULL,
    read_flag TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_conv (conversation_id, created_at)
);

-- 问卷表
CREATE TABLE questionnaire (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(64) NOT NULL,
    description VARCHAR(255),
    instruction TEXT,
    question_count INT,
    estimated_minutes INT,
    dimensions VARCHAR(255),    -- JSON 字符串
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 题目表
CREATE TABLE question (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    questionnaire_id BIGINT NOT NULL,
    type ENUM('single','multi','scale') NOT NULL,
    title TEXT NOT NULL,
    options_json TEXT,         -- JSON 数组字符串
    scale_min INT,
    scale_max INT,
    scale_min_label VARCHAR(32),
    scale_max_label VARCHAR(32),
    seq INT DEFAULT 0,
    INDEX idx_q (questionnaire_id)
);

-- 测评记录表
CREATE TABLE questionnaire_record (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    questionnaire_id BIGINT NOT NULL,
    score INT,
    level VARCHAR(16),
    dimension_scores_json TEXT,  -- JSON
    suggestion TEXT,
    answers_json TEXT,
    duration_seconds INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id)
);
```

### 12.5 初始化数据(必须执行)

```
1. 至少 6 名咨询师账号(账号同 user.username,密码统一 `Test@123`):
   - zhouxin / 周心(焦虑 / 抑郁)
   - liyi / 李怡(学业压力 / 自我认知)
   - wanghe / 王和(人际关系 / 情感)
   - chenyan / 陈言(家庭关系 / 青少年)
   - zhaolei / 赵雷(睡眠 / 压力)
   - sunqing / 孙晴(自我认知 / 情绪管理)
2. 1 名测试学生账号:`zhangsan / 123456`(同前端 mock 默认)
3. 每位咨询师生成未来 7 天 × 每天 6 个时段(09:00-12:00, 14:00-17:00,每小时一段)
4. 3 套问卷:
   - 301 焦虑自评量表(SAS,20 题 single)
   - 302 抑郁自评量表(SDS,20 题 single)
   - 303 睡眠质量指数(PSQI,15 题 mixed)
5. 测试预约数据:zhangsan 已有 1 条 upcoming(咨询师 201)+ 1 条 completed(咨询师 202)
6. 测试消息数据:zhangsan 与咨询师 201 已有 3 条对话
7. 测试测评记录:zhangsan 已有 1 条 SAS 记录(分 42, 轻度)
```

### 12.6 Controller / Service 实现要求

```
- 每个 Controller 必须有完整 JavaDoc,标注路由、权限、字段
- 用 MyBatis-Plus 的 IService / BaseMapper,ServiceImpl 模式
- 复杂查询用 LambdaQueryWrapper,分页用 IPage<T>
- 写操作(@Transactional)、读操作不加
- 业务异常统一抛 BizException(BizErrorCode.XXX, "用户友好消息")
- 鉴权:@PreAuthorize("hasRole('STUDENT')") 或自定义 @RequireLogin
- Controller 全部返回 R<T>,Service 可返回 R<T> 或裸 T(GlobalResponseAdvice 兜底)
- 字段命名 Java camelCase、DB snake_case,MyBatis-Plus mapUnderscoreToCamelCase=true
```

### 12.7 关键业务实现细节

```
1. 预约创建:
   - 事务开始
   - SELECT slot ... FOR UPDATE(悲观锁)防并发占用
   - 校验 slot.available == true
   - UPDATE slot SET available = 0
   - INSERT appointment
   - 返回 R.ok({appointmentId, status:"upcoming"})

2. 匿名处理(关键!):
   - 在 Service 拼装返回 VO 时统一过一道 `maskAnonymous(apptVO)` 方法
   - 若 apptVO.isAnonymous == true,则 studentName = "匿名同学", studentAvatar = null
   - userId 保留真实值,供后端内部使用,VO 仅在 controller 出口处覆盖
   - 前端不感知,字段名保持 studentName

3. JWT 鉴权:
   - JwtAuthenticationFilter 从 Authorization 头解析
   - 解析成功 → SecurityContextHolder.setAuthentication(...)
   - 解析失败 / 过期 → 抛 BizException(1001)
   - SecurityConfig 放行 /api/auth/login、/api/auth/register、Swagger、OPTIONS

4. 消息轮询(替代 WebSocket):
   - 暂时不实现 WebSocket,前端每 3s 轮询 /api/messages/unread-count 与 /conversations
   - 接口都返回最新数据即可

5. 测评自动判分:
   - 单选 / 量表:每题 1~4 分(SAS)或 1~5 分(通用)
   - 总分 → 等级(SAS: <50 正常, 50-59 轻度, 60-69 中度, ≥70 重度)
   - 维度分:同总分逻辑
   - 建议:按 level 套预设建议文本
```

### 12.8 验证标准(必须通过)

```
1. mvn clean package -DskipTests  编译通过,无 ERROR
2. mvn spring-boot:run            启动成功,无 ERROR 日志
3. 启动日志打印: "==> 校园心理咨询后端启动成功 <=="
4. 访问 http://localhost:8080/api/common/site-config  返回 R.ok({...})
5. POST /api/auth/login {username:"zhangsan", password:"123456"}  返回 R.ok({token, userId, ...})
6. 用返回的 token 调 GET /api/auth/me  返回当前用户
7. GET /api/counselors?keyword=李&page=1&pageSize=10  返回分页数据
8. POST /api/appointments {slotId, topic, isAnonymous:true, urgency:"normal"}  返回 R.ok({appointmentId, status:"upcoming"})
9. 再次提交同一 slotId → 返回 R.fail(4001, "该时段已被预约")
10. GET /api/appointments?status=upcoming  返回刚才创建的预约
11. GET /api/assessments  返回 3 套问卷
12. mvn test  全部单元测试通过
```

### 12.9 输出格式

```
请按以下顺序输出完整工程:
1. pom.xml
2. application.yml / application-dev.yml / application-prod.yml
3. sql/init.sql
4. 启动类 AppointmentApplication.java
5. common 包(全部)
6. config 包(全部)
7. security 包(全部)
8. util 包(全部)
9. module/auth
10. module/counselor
11. module/appointment
12. module/message
13. module/assessment
14. module/user
15. module/common
16. resources/mapper/*.xml(如有)
17. src/test/java/... 单元测试
18. README.md(部署、测试账号、Swagger URL)

每个文件给出**完整、可直接复制运行**的代码,严禁出现 TODO / FIXME / 待实现 占位。
代码风格遵循阿里巴巴 Java 开发手册,缩进 4 空格,import 不要用通配符。
```

### 12.10 一句话指令(可直接复制)

```
请阅读我上传的 api.md,严格按其中的 32 个 RESTful 接口、字段命名、统一响应结构 {code, message, data}、业务错误码(1001/1002/2001/3001/4001/5000),生成一个 Spring Boot 3 + JDK 17 + MyBatis-Plus + MySQL 8 + JWT 的完整后端项目。要求:(1) 字段名、路径、HTTP 方法与 api.md 逐字一致;(2) 统一用 R<T> 包装 + GlobalResponseAdvice + GlobalExceptionHandler;(3) 鉴权用 JWT,放 Authorization: Bearer xxx,过期返 1001;(4) 匿名预约时后端统一把 studentName 替换为"匿名同学"、studentAvatar 置空,前端不感知;(5) 启动时自动建表 + 注入 6 名咨询师、3 套问卷、未来 7 天时段、测试预约 / 消息 / 测评数据;(6) 提供 init.sql、application.yml(dev/prod 两套 profile)、完整单元测试;(7) 严禁 TODO / FIXME 占位,mvn spring-boot:run 可直接启动,Swagger 可访问 http://localhost:8080/swagger-ui.html。
```

---

> 整段提示词从 §12.1 到 §12.10 完整发送,即可让 AI 一次性生成可运行的 Spring Boot 后端工程。
