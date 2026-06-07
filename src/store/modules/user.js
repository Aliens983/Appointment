import { login, register, fetchMe } from '@/api/auth'
import { getToken, setToken, clearToken, getProfile, setProfile, clearProfile } from '@/utils/auth'

const state = () => ({
  token: getToken(),
  profile: getProfile()
})

const getters = {
  isLoggedIn: state => !!state.token,
  isAnonymousDefault: state => !!state.profile?.defaultAnonymous
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
    const profile = { userId: data.userId, nickname: data.nickname, avatar: data.avatar }
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
  logout({ commit }) {
    commit('SET_TOKEN', '')
    commit('SET_PROFILE', null)
  }
}

export default { namespaced: true, state, getters, mutations, actions }
