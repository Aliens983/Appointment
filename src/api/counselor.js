import request from './request'

export function listCounselors(params) {
  return request({ url: '/counselors', method: 'get', params })
}

export function getCounselor(id) {
  return request({ url: `/counselors/${id}`, method: 'get' })
}

export function getCounselorSlots(id) {
  return request({ url: `/counselors/${id}/slots`, method: 'get' })
}

export function getSpecialties() {
  return request({ url: '/counselors/specialties', method: 'get' })
}
