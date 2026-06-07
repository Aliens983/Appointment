import { createAppointment, listAppointments, getAppointment, cancelAppointment, reviewAppointment } from '@/api/appointment'

const state = () => ({
  list: [],
  total: 0,
  current: null
})

const mutations = {
  SET_LIST(state, { list, total }) {
    state.list = list
    state.total = total
  },
  SET_CURRENT(state, data) {
    state.current = data
  }
}

const actions = {
  async fetchList({ commit }, params = {}) {
    const { list, total } = await listAppointments(params)
    commit('SET_LIST', { list, total })
    return { list, total }
  },
  async fetchDetail({ commit }, id) {
    const data = await getAppointment(id)
    commit('SET_CURRENT', data)
    return data
  },
  async create(_ctx, payload) {
    return createAppointment(payload)
  },
  async cancel(_ctx, id) {
    return cancelAppointment(id, '用户取消')
  },
  async review(_ctx, { id, score, content }) {
    return reviewAppointment(id, { score, content })
  }
}

export default { namespaced: true, state, mutations, actions }
