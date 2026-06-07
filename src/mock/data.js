// 内存数据库,用于 mock 拦截
// 真实后端就绪时,VUE_APP_USE_MOCK=false,本文件不生效
import dayjs from 'dayjs'

function genId(prefix) {
  return prefix + Math.floor(Math.random() * 1000000)
}

function futureISO(daysFromNow, hour, minute = 0) {
  return dayjs().add(daysFromNow, 'day').hour(hour).minute(minute).second(0).format('YYYY-MM-DDTHH:mm:ss+08:00')
}

// 咨询师
const counselors = [
  { id: 201, name: '李心怡', title: '副教授', avatar: '', specialties: ['焦虑', '学业压力', '人际关系'], rating: 4.8, ratingCount: 132, intro: '擅长青少年情绪问题、学业压力与人际关系困扰。', experiences: [{ period: '2018-至今', desc: 'XX 大学心理咨询中心' }] },
  { id: 202, name: '王明远', title: '讲师', avatar: '', specialties: ['抑郁', '自我认知'], rating: 4.6, ratingCount: 88, intro: '关注大学生自我认同与情绪低落问题。', experiences: [{ period: '2020-至今', desc: 'YY 学院心理辅导站' }] },
  { id: 203, name: '张晓敏', title: '教授', avatar: '', specialties: ['情感', '家庭关系'], rating: 4.9, ratingCount: 210, intro: '长期从事亲密关系与家庭关系研究。', experiences: [{ period: '2010-至今', desc: 'ZZ 大学心理学系' }] },
  { id: 204, name: '陈思雨', title: '助教', avatar: '', specialties: ['睡眠', '焦虑'], rating: 4.5, ratingCount: 56, intro: '专注于睡眠障碍与焦虑的整合干预。', experiences: [{ period: '2022-至今', desc: '校医院心理科' }] },
  { id: 205, name: '赵宇航', title: '副教授', avatar: '', specialties: ['学业压力', '自我认知'], rating: 4.7, ratingCount: 99, intro: '擅长学业规划与生涯辅导。', experiences: [{ period: '2015-至今', desc: '就业指导中心' }] },
  { id: 206, name: '孙文静', title: '讲师', avatar: '', specialties: ['人际关系', '情感'], rating: 4.6, ratingCount: 71, intro: '面向学生的人际沟通工作坊主讲。', experiences: [{ period: '2019-至今', desc: '心理健康教育中心' }] }
]

// 时段:每个咨询师未来 5 天的可约时段(每天 4 个)
const slots = []
let slotAutoId = 5001
counselors.forEach(c => {
  for (let d = 1; d <= 5; d++) {
    [9, 10, 14, 15].forEach((h, i) => {
      // 随机把一部分置为不可用,模拟已约
      const available = !(d === 1 && i === 0) && !(d === 3 && i === 2)
      slots.push({
        slotId: slotAutoId++,
        counselorId: c.id,
        date: dayjs().add(d, 'day').format('YYYY-MM-DD'),
        start: futureISO(d, h, 0),
        end: futureISO(d, h + 1, 0),
        available
      })
    })
  }
})

// 预约记录
const appointments = [
  {
    id: 7001,
    counselorId: 201,
    counselor: { id: 201, name: '李心怡', title: '副教授', avatar: '', specialties: ['焦虑', '学业压力'] },
    studentId: 10001,
    studentName: '张三',
    isAnonymous: false,
    topic: '近期睡眠质量差',
    description: '近两周入睡困难,凌晨 3 点才睡。',
    urgency: 'normal',
    contactPhone: '13800001111',
    start: futureISO(2, 9, 0),
    end: futureISO(2, 10, 0),
    slotId: slots[6].slotId,
    status: 'upcoming',
    score: null,
    review: null,
    createdAt: dayjs().subtract(1, 'day').format('YYYY-MM-DDTHH:mm:ss+08:00')
  },
  {
    id: 7002,
    counselorId: 203,
    counselor: { id: 203, name: '张晓敏', title: '教授', avatar: '', specialties: ['情感', '家庭关系'] },
    studentId: 10001,
    studentName: '匿名同学',
    isAnonymous: true,
    topic: '家庭关系紧张',
    description: '想寻求一些建议。',
    urgency: 'urgent',
    contactPhone: '',
    start: futureISO(-3, 14, 0),
    end: futureISO(-3, 15, 0),
    slotId: null,
    status: 'completed',
    score: 5,
    review: '老师非常耐心,给出了很多建议',
    createdAt: dayjs().subtract(5, 'day').format('YYYY-MM-DDTHH:mm:ss+08:00')
  }
]

// 测评问卷
const assessments = [
  {
    id: 301,
    title: '焦虑自评量表(SAS)',
    description: '用于评估近一周的焦虑水平',
    questionCount: 5,
    estimatedMinutes: 5,
    dimensions: ['焦虑程度'],
    instruction: '请根据您最近一周的实际情况作答。',
    questions: [
      { id: 1, type: 'single', title: '我觉得比平时容易紧张或着急', options: [
        { value: 1, label: '没有或很少时间' },
        { value: 2, label: '小部分时间' },
        { value: 3, label: '相当多时间' },
        { value: 4, label: '绝大部分或全部时间' }
      ]},
      { id: 2, type: 'single', title: '我无缘无故地感到害怕', options: [
        { value: 1, label: '没有或很少时间' },
        { value: 2, label: '小部分时间' },
        { value: 3, label: '相当多时间' },
        { value: 4, label: '绝大部分或全部时间' }
      ]},
      { id: 3, type: 'single', title: '我容易心里烦乱或觉得惊恐', options: [
        { value: 1, label: '没有或很少时间' },
        { value: 2, label: '小部分时间' },
        { value: 3, label: '相当多时间' },
        { value: 4, label: '绝大部分或全部时间' }
      ]},
      { id: 4, type: 'single', title: '我觉得我可能将要发疯', options: [
        { value: 1, label: '没有或很少时间' },
        { value: 2, label: '小部分时间' },
        { value: 3, label: '相当多时间' },
        { value: 4, label: '绝大部分或全部时间' }
      ]},
      { id: 5, type: 'scale', title: '我感到心情低落', scaleMin: 1, scaleMax: 5, scaleMinLabel: '完全不符合', scaleMaxLabel: '完全符合' }
    ]
  },
  {
    id: 302,
    title: '抑郁自评量表(SDS)',
    description: '用于评估抑郁情绪的严重程度',
    questionCount: 4,
    estimatedMinutes: 4,
    dimensions: ['抑郁程度'],
    instruction: '请根据您最近一周的实际情况作答。',
    questions: [
      { id: 1, type: 'single', title: '我感到情绪沮丧、郁闷', options: [
        { value: 1, label: '没有或很少时间' },
        { value: 2, label: '小部分时间' },
        { value: 3, label: '相当多时间' },
        { value: 4, label: '绝大部分或全部时间' }
      ]},
      { id: 2, type: 'single', title: '我感到早晨心情最好', options: [
        { value: 1, label: '没有或很少时间' },
        { value: 2, label: '小部分时间' },
        { value: 3, label: '相当多时间' },
        { value: 4, label: '绝大部分或全部时间' }
      ]},
      { id: 3, type: 'single', title: '我要哭或想哭', options: [
        { value: 1, label: '没有或很少时间' },
        { value: 2, label: '小部分时间' },
        { value: 3, label: '相当多时间' },
        { value: 4, label: '绝大部分或全部时间' }
      ]},
      { id: 4, type: 'scale', title: '我无故感到疲劳', scaleMin: 1, scaleMax: 5, scaleMinLabel: '完全不符合', scaleMaxLabel: '完全符合' }
    ]
  }
]

// 测评记录
const assessmentRecords = []

// 会话
const conversations = [
  {
    id: 8001,
    counselorId: 201,
    counselor: { id: 201, name: '李心怡', avatar: '', online: true },
    isAnonymous: false,
    displayName: '张三',
    messages: [
      { id: 91001, fromRole: 'student', content: '老师您好,我最近压力很大', createdAt: dayjs().subtract(2, 'hour').format('YYYY-MM-DDTHH:mm:ss+08:00') },
      { id: 91002, fromRole: 'counselor', content: '收到,方便说说主要来源吗?', createdAt: dayjs().subtract(1, 'hour').format('YYYY-MM-DDTHH:mm:ss+08:00') }
    ],
    unreadCount: 1
  },
  {
    id: 8002,
    counselorId: 203,
    counselor: { id: 203, name: '张晓敏', avatar: '', online: false },
    isAnonymous: true,
    displayName: '匿名同学',
    messages: [
      { id: 92001, fromRole: 'counselor', content: '记得按时休息', createdAt: dayjs().subtract(1, 'day').format('YYYY-MM-DDTHH:mm:ss+08:00') }
    ],
    unreadCount: 0
  }
]

// 用户(单用户,简化)
const users = [
  { userId: 10001, username: 'zhangsan', password: '123456', nickname: '张三', avatar: '', email: 'zs@school.edu.cn', phone: '13800001111', studentNo: '2021001001', gender: 'male', defaultAnonymous: false, createdAt: '2026-03-01T10:00:00+08:00' }
]

export const db = {
  counselors, slots, appointments, assessments, assessmentRecords, conversations, users,
  genId
}
