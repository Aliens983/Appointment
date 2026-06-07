import request from './request'

export function listAssessments() {
  return request({ url: '/api/assessments', method: 'get' })
}

export function getAssessment(id) {
  return request({ url: `/api/assessments/${id}`, method: 'get' })
}

export function submitAssessment(id, data) {
  return request({ url: `/api/assessments/${id}/submit`, method: 'post', data })
}

export function listRecords(params) {
  return request({ url: '/api/assessment-records', method: 'get', params })
}

export function getRecord(id) {
  return request({ url: `/api/assessment-records/${id}`, method: 'get' })
}
