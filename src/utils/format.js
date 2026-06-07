// 简单的时间格式化工具,基于 dayjs
import dayjs from 'dayjs'

export function fmtDate(value, pattern = 'YYYY-MM-DD') {
  if (!value) return ''
  return dayjs(value).format(pattern)
}

export function fmtTime(value) {
  if (!value) return ''
  return dayjs(value).format('HH:mm')
}

export function fmtDateTime(value) {
  if (!value) return ''
  return dayjs(value).format('YYYY-MM-DD HH:mm')
}

// 把日期加 N 天,返回 YYYY-MM-DD
export function addDays(value, n) {
  return dayjs(value).add(n, 'day').format('YYYY-MM-DD')
}

// 是否过期(早于当前时间)
export function isPast(value) {
  return dayjs(value).isBefore(dayjs())
}
