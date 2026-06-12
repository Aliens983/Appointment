import request from './request'

export function createAppointment(data) {
  return request({ url: '/appointments', method: 'post', data })
}

export function listAppointments(params) {
  return request({ url: '/appointments', method: 'get', params })
}

export function getAppointment(id) {
  return request({ url: `/appointments/${id}`, method: 'get' })
}

export function cancelAppointment(id, reason) {
  return request({ url: `/appointments/${id}/cancel`, method: 'put', data: { reason } })
}

export function reviewAppointment(id, data) {
  return request({ url: `/appointments/${id}/review`, method: 'put', data })
}
