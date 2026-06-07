import request from './request'

export function listCounselors(params) {
  return request({ url: '/api/counselors', method: 'get', params })
}

export function getCounselor(id) {
  return request({ url: `/api/counselors/${id}`, method: 'get' })
}

export function getCounselorSlots(id) {
  return request({ url: `/api/counselors/${id}/slots`, method: 'get' })
}

export function getSpecialties() {
  return request({ url: '/api/counselors/specialties', method: 'get' })
}
