// token 工具:与 utils/auth 配合使用
const TOKEN_KEY = 'cp_token'
const PROFILE_KEY = 'cp_profile'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function getProfile() {
  const raw = localStorage.getItem(PROFILE_KEY)
  return raw ? JSON.parse(raw) : null
}

export function setProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function clearProfile() {
  localStorage.removeItem(PROFILE_KEY)
}
