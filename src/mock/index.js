// Mock 拦截器:在 axios 适配层处理所有请求,返回内存数据
// 仅当 VUE_APP_USE_MOCK=true 时启用
import MockAdapter from 'axios-mock-adapter'
import { db } from './data'
import dayjs from 'dayjs'

function ok(data, message = 'ok') {
  return [200, { code: 0, message, data }]
}

function fail(code, message) {
  return [200, { code, message, data: null }]
}

function paginate(list, page, pageSize) {
  page = Number(page) || 1
  pageSize = Number(pageSize) || 10
  const start = (page - 1) * pageSize
  return { list: list.slice(start, start + pageSize), total: list.length, page, pageSize }
}

export function setupMock(axiosInstance) {
  const mock = new MockAdapter(axiosInstance, { delayResponse: 200 })

  // ========== Auth ==========
  mock.onPost('/api/auth/login').reply(config => {
    const { username, password } = JSON.parse(config.data)
    const user = db.users.find(u => u.username === username && u.password === password)
    if (!user) return fail(2001, '用户名或密码错误')
    const { password: _p, ...profile } = user
    return ok({ token: 'mock-token-' + user.userId, ...profile })
  })

  mock.onPost('/api/auth/register').reply(config => {
    const body = JSON.parse(config.data)
    if (db.users.some(u => u.username === body.username)) return fail(2001, '用户名已存在')
    const user = { userId: db.genId(100), password: body.password, avatar: '', studentNo: '', phone: '', gender: 'other', defaultAnonymous: false, createdAt: dayjs().format('YYYY-MM-DDTHH:mm:ss+08:00'), ...body }
    db.users.push(user)
    const { password: _p, ...profile } = user
    return ok({ userId: user.userId, username: user.username })
  })

  mock.onGet('/api/auth/me').reply(config => {
    const token = config.headers.Authorization
    if (!token) return fail(1001, '未登录')
    const userId = Number(String(token).replace('mock-token-', ''))
    const user = db.users.find(u => u.userId === userId)
    if (!user) return fail(1001, 'token 失效')
    const { password: _p, ...profile } = user
    return ok(profile)
  })

  // ========== Counselors ==========
  mock.onGet('/api/counselors').reply(config => {
    const { keyword, specialty, page, pageSize } = config.params || {}
    let list = [...db.counselors]
    if (keyword) {
      const k = String(keyword).toLowerCase()
      list = list.filter(c => c.name.toLowerCase().includes(k) || (c.intro || '').toLowerCase().includes(k))
    }
    if (specialty) list = list.filter(c => c.specialties.includes(specialty))
    // 计算 availableSlotCount
    list = list.map(c => ({
      ...c,
      availableSlotCount: db.slots.filter(s => s.counselorId === c.id && s.available).length
    }))
    return ok(paginate(list, page, pageSize))
  })

  mock.onGet(/\/api\/counselors\/\d+$/).reply(config => {
    const id = Number(config.url.split('/').pop())
    const c = db.counselors.find(x => x.id === id)
    if (!c) return fail(3001, '咨询师不存在')
    return ok({ ...c, availableSlotCount: db.slots.filter(s => s.counselorId === id && s.available).length })
  })

  mock.onGet(/\/api\/counselors\/\d+\/slots$/).reply(config => {
    const id = Number(config.url.split('/')[3])
    const list = db.slots.filter(s => s.counselorId === id)
    // 按日期分组
    const map = new Map()
    list.forEach(s => {
      if (!map.has(s.date)) map.set(s.date, [])
      map.get(s.date).push({ slotId: s.slotId, start: s.start, end: s.end, available: s.available })
    })
    return ok({
      counselorId: id,
      days: Array.from(map.entries()).map(([date, slots]) => ({ date, slots }))
    })
  })

  mock.onGet('/api/counselors/specialties').reply(() => ok(['焦虑', '抑郁', '学业压力', '人际关系', '情感', '家庭关系', '自我认知', '睡眠']))

  // ========== Appointments ==========
  mock.onPost('/api/appointments').reply(config => {
    const body = JSON.parse(config.data)
    const slot = db.slots.find(s => s.slotId === body.slotId)
    if (!slot) return fail(3001, '时段不存在')
    if (!slot.available) return fail(4001, '该时段已被预约')
    const counselor = db.counselors.find(c => c.id === slot.counselorId)
    slot.available = false
    const id = db.genId(700)
    const ap = {
      id, counselorId: counselor.id,
      counselor: { id: counselor.id, name: counselor.name, title: counselor.title, avatar: counselor.avatar, specialties: counselor.specialties },
      studentId: 10001,
      studentName: body.isAnonymous ? '匿名同学' : '张三',
      isAnonymous: !!body.isAnonymous,
      topic: body.topic,
      description: body.description || '',
      urgency: body.urgency,
      contactPhone: body.isAnonymous ? '' : (body.contactPhone || ''),
      start: slot.start,
      end: slot.end,
      slotId: slot.slotId,
      status: 'upcoming',
      score: null,
      review: null,
      createdAt: dayjs().format('YYYY-MM-DDTHH:mm:ss+08:00')
    }
    db.appointments.unshift(ap)
    return ok({ appointmentId: id, status: 'upcoming' })
  })

  mock.onGet('/api/appointments').reply(config => {
    const { status, page, pageSize } = config.params || {}
    let list = db.appointments.filter(a => a.studentId === 10001)
    if (status && status !== 'all') list = list.filter(a => a.status === status)
    // 按 start 倒序
    list = list.sort((a, b) => (a.start < b.start ? 1 : -1))
    return ok(paginate(list, page, pageSize))
  })

  mock.onGet(/\/api\/appointments\/\d+$/).reply(config => {
    const id = Number(config.url.split('/').pop())
    const a = db.appointments.find(x => x.id === id)
    if (!a) return fail(3001, '预约不存在')
    return ok({
      ...a,
      timeline: [
        { time: a.createdAt, action: '已预约' },
        { time: a.createdAt, action: '预约成功' }
      ]
    })
  })

  mock.onPut(/\/api\/appointments\/\d+\/cancel$/).reply(config => {
    const id = Number(config.url.split('/')[3])
    const a = db.appointments.find(x => x.id === id)
    if (!a) return fail(3001, '预约不存在')
    if (a.status === 'completed') return fail(4001, '已完成的预约不可取消')
    a.status = 'cancelled'
    // 释放时段
    const slot = db.slots.find(s => s.slotId === a.slotId)
    if (slot) slot.available = true
    return ok({ id, status: 'cancelled' })
  })

  mock.onPut(/\/api\/appointments\/\d+\/review$/).reply(config => {
    const id = Number(config.url.split('/')[3])
    const { score, content } = JSON.parse(config.data)
    const a = db.appointments.find(x => x.id === id)
    if (!a) return fail(3001, '预约不存在')
    a.score = score
    a.review = content || ''
    return ok({ id, score })
  })

  // ========== Messages ==========
  mock.onGet('/api/messages/conversations').reply(() => {
    const list = db.conversations.map(c => ({
      id: c.id,
      counselor: c.counselor,
      isAnonymous: c.isAnonymous,
      displayName: c.displayName,
      lastMessage: c.messages.length ? { content: c.messages[c.messages.length - 1].content, createdAt: c.messages[c.messages.length - 1].createdAt, fromRole: c.messages[c.messages.length - 1].fromRole } : null,
      unreadCount: c.unreadCount || 0
    }))
    return ok(list)
  })

  mock.onPost('/api/messages/conversations').reply(config => {
    const { counselorId } = JSON.parse(config.data)
    let conv = db.conversations.find(c => c.counselorId === counselorId)
    if (!conv) {
      const counselor = db.counselors.find(c => c.id === counselorId)
      conv = { id: db.genId(800), counselorId, counselor: { id: counselor.id, name: counselor.name, avatar: counselor.avatar, online: false }, isAnonymous: false, displayName: '张三', messages: [], unreadCount: 0 }
      db.conversations.unshift(conv)
    }
    return ok({ conversationId: conv.id })
  })

  mock.onGet(/\/api\/messages\/conversations\/\d+\/messages$/).reply(config => {
    const id = Number(config.url.split('/')[4])
    const conv = db.conversations.find(c => c.id === id)
    if (!conv) return fail(3001, '会话不存在')
    const list = conv.messages.map(m => ({ ...m, isMine: m.fromRole === 'student' }))
    return ok({ list, total: list.length, hasMore: false })
  })

  mock.onPost(/\/api\/messages\/conversations\/\d+\/messages$/).reply(config => {
    const id = Number(config.url.split('/')[4])
    const conv = db.conversations.find(c => c.id === id)
    if (!conv) return fail(3001, '会话不存在')
    const { content } = JSON.parse(config.data)
    const msg = { id: db.genId(91), fromRole: 'student', content, createdAt: dayjs().format('YYYY-MM-DDTHH:mm:ss+08:00') }
    conv.messages.push(msg)
    return ok({ ...msg, isMine: true })
  })

  // ========== Assessments ==========
  mock.onGet('/api/assessments').reply(() => {
    const list = db.assessments.map(a => {
      const recs = db.assessmentRecords.filter(r => r.questionnaireId === a.id)
      return { id: a.id, title: a.title, description: a.description, questionCount: a.questionCount, estimatedMinutes: a.estimatedMinutes, dimensions: a.dimensions, completedCount: recs.length, latestResult: recs.length ? { recordId: recs[0].id, score: recs[0].score, level: recs[0].level, createdAt: recs[0].createdAt } : null }
    })
    return ok(list)
  })

  mock.onGet(/\/api\/assessments\/\d+$/).reply(config => {
    const id = Number(config.url.split('/').pop())
    const a = db.assessments.find(x => x.id === id)
    if (!a) return fail(3001, '问卷不存在')
    return ok(a)
  })

  mock.onPost(/\/api\/assessments\/\d+\/submit$/).reply(config => {
    const id = Number(config.url.split('/')[3])
    const a = db.assessments.find(x => x.id === id)
    if (!a) return fail(3001, '问卷不存在')
    const { answers } = JSON.parse(config.data)
    let score = 0
    answers.forEach(ans => {
      const q = a.questions.find(qq => qq.id === ans.questionId)
      if (!q) return
      if (q.type === 'single' || q.type === 'scale') score += Number(ans.value) || 0
      if (q.type === 'multi') score += (Array.isArray(ans.value) ? ans.value.length : 0)
    })
    let level = '正常'
    if (score >= 15) level = '中度'
    else if (score >= 10) level = '轻度'
    const rec = { id: db.genId(550), questionnaireId: a.id, questionnaireTitle: a.title, score, level, dimensionScores: [{ name: a.dimensions[0] || '综合', score, level }], suggestion: level === '正常' ? '当前状态良好,继续保持健康作息与社交。' : '建议预约专业咨询师进行一对一辅导。', answers, createdAt: dayjs().format('YYYY-MM-DDTHH:mm:ss+08:00') }
    db.assessmentRecords.unshift(rec)
    return ok({ recordId: rec.id, score, level })
  })

  mock.onGet('/api/assessment-records').reply(config => {
    const list = db.assessmentRecords.map(r => ({ id: r.id, questionnaireId: r.questionnaireId, questionnaireTitle: r.questionnaireTitle, score: r.score, level: r.level, createdAt: r.createdAt }))
    return ok(paginate(list, config.params?.page, config.params?.pageSize))
  })

  mock.onGet(/\/api\/assessment-records\/\d+$/).reply(config => {
    const id = Number(config.url.split('/').pop())
    const r = db.assessmentRecords.find(x => x.id === id)
    if (!r) return fail(3001, '记录不存在')
    return ok(r)
  })

  return mock
}
