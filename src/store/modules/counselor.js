import { listCounselors, getCounselor, getCounselorSlots, getSpecialties } from '@/api/counselor'

const state = () => ({
  list: [],
  total: 0,
  filters: { keyword: '', specialty: '' },
  current: null,
  currentSlots: [],
  specialties: []
})

const mutations = {
  SET_LIST(state, { list, total }) {
    state.list = list
    state.total = total
  },
  SET_FILTERS(state, filters) {
    state.filters = { ...state.filters, ...filters }
  },
  SET_CURRENT(state, data) {
    state.current = data
  },
  SET_SLOTS(state, data) {
    state.currentSlots = data
  },
  SET_SPECIALTIES(state, list) {
    state.specialties = list
  }
}

const actions = {
  async fetchList({ commit, state }, extra = {}) {
    const params = { ...state.filters, ...extra }
    const { list, total } = await listCounselors(params)
    commit('SET_LIST', { list, total })
    return { list, total }
  },
  async fetchDetail({ commit }, id) {
    const data = await getCounselor(id)
    commit('SET_CURRENT', data)
    return data
  },
  async fetchSlots({ commit }, id) {
    const data = await getCounselorSlots(id)
    commit('SET_SLOTS', data.days || [])
    return data
  },
  async fetchSpecialties({ commit }) {
    const list = await getSpecialties()
    commit('SET_SPECIALTIES', list)
    return list
  }
}

export default { namespaced: true, state, mutations, actions }
