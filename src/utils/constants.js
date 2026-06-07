// 业务枚举常量(与 api.md 保持一致)

export const APPOINTMENT_STATUS = {
  upcoming: { label: '待咨询', type: 'primary' },
  completed: { label: '已完成', type: 'success' },
  cancelled: { label: '已取消', type: 'info' }
}

export const URGENCY = {
  normal: { label: '一般', type: 'info' },
  urgent: { label: '较紧急', type: 'warning' },
  very_urgent: { label: '紧急', type: 'danger' }
}

export const SPECIALTIES = [
  '焦虑', '抑郁', '学业压力', '人际关系',
  '情感', '家庭关系', '自我认知', '睡眠'
]
