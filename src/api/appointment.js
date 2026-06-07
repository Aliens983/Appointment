import request from './request'

export function createAppointment(data) {
  return request({ url: '/api/appointments', method: 'post', data })
}

export function listAppointments(params) {
  return request({ url: '/api/appointments', method: 'get', params })
}

export function getAppointment(id) {
  return request({ url: `/api/appointments/${id}`, method: 'get' })
}

export function cancelAppointment(id, reason) {
  return request({ url: `/api/appointments/${id}/cancel`, method: 'put', data: { reason } })
}

export function reviewAppointment(id, data) {
  return request({ url: `/api/appointments/${id}/review`, method: 'put', data })
}
