import request from './request'

// 更新个人资料
export function updateProfile(data) {
  return request({ url: '/users/me', method: 'put', data })
}

// 修改密码
export function updatePassword(data) {
  return request({ url: '/users/me/password', method: 'put', data })
}

// 隐私设置(默认匿名)
export function updatePrivacy(data) {
  return request({ url: '/users/me/privacy', method: 'put', data })
}

// 上传头像(multipart)
export function uploadAvatar(file) {
  const fd = new FormData()
  fd.append('file', file)
  return request({
    url: '/users/me/avatar',
    method: 'post',
    data: fd,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
