import request from './request'

// 获取字典全集
export function getDicts() {
  return request({ url: '/dicts', method: 'get' })
}

// 获取站点配置
export function getSiteConfig() {
  return request({ url: '/site-config', method: 'get' })
}

// 更新站点配置(管理端)
export function updateSiteConfig(data) {
  return request({ url: '/site-config', method: 'put', data })
}
