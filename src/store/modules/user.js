import { login, register, fetchMe, logout as apiLogout } from '@/api/auth'
import { updateProfile, updatePassword, updatePrivacy, uploadAvatar } from '@/api/user'
import { getToken, setToken, clearToken, getProfile, setProfile, clearProfile } from '@/utils/auth'

const state = () => ({
  token: getToken(),
  profile: getProfile()
})

const getters = {
  isLoggedIn: state => !!state.token,
  isAnonymousDefault: state => !!state.profile?.defaultAnonymous,
  userId: state => state.profile?.userId || null
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
    if (token) setToken(token)
    else clearToken()
  },
  SET_PROFILE(state, profile) {
    state.profile = profile
    if (profile) setProfile(profile)
    else clearProfile()
  }
}

const actions = {
  async login({ commit }, payload) {
    const data = await login(payload)
    commit('SET_TOKEN', data.token)
    const profile = {
      userId: data.userId,
      nickname: data.nickname,
      avatar: data.avatar
    }
    commit('SET_PROFILE', profile)
    return data
  },

  async register(_ctx, payload) {
    return register(payload)
  },

  async loadProfile({ commit, state }) {
    if (!state.token) return null
    const data = await fetchMe()
    commit('SET_PROFILE', data)
    return data
  },

  async updateProfile({ commit }, payload) {
    const data = await updateProfile(payload)
    commit('SET_PROFILE', data)
    return data
  },

  async updatePassword(_ctx, payload) {
    await updatePassword(payload)
  },

  async updatePrivacy({ commit }, payload) {
    await updatePrivacy(payload)
    // 同步本地隐私设置
    const cur = JSON.parse(localStorage.getItem('cp_profile') || '{}')
    if (Object.prototype.hasOwnProperty.call(payload, 'defaultAnonymous')) {
      cur.defaultAnonymous = !!payload.defaultAnonymous
    }
    localStorage.setItem('cp_profile', JSON.stringify(cur))
    // 重新拉取确保与服务端一致
    return fetchMe().then(data => { commit('SET_PROFILE', data); return data })
  },

  async uploadAvatar({ commit }, file) {
    const { avatar } = await uploadAvatar(file)
    const cur = JSON.parse(localStorage.getItem('cp_profile') || '{}')
    cur.avatar = avatar
    localStorage.setItem('cp_profile', JSON.stringify(cur))
    // 重新拉取最新 profile
    const data = await fetchMe()
    commit('SET_PROFILE', data)
    return avatar
  },

  async logout({ commit, state }) {
    if (state.token) {
      try { await apiLogout() } catch (e) { /* 忽略,前端兜底清 token */ }
    }
    commit('SET_TOKEN', '')
    commit('SET_PROFILE', null)
  }
}

export default { namespaced: true, state, getters, mutations, actions }
