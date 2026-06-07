import { listAssessments, getAssessment, submitAssessment, listRecords, getRecord } from '@/api/assessment'

const state = () => ({
  list: [],
  current: null,
  records: []
})

const mutations = {
  SET_LIST(state, list) {
    state.list = list
  },
  SET_CURRENT(state, data) {
    state.current = data
  },
  SET_RECORDS(state, list) {
    state.records = list
  }
}

const actions = {
  async fetchList({ commit }) {
    const list = await listAssessments()
    commit('SET_LIST', list)
    return list
  },
  async fetchDetail({ commit }, id) {
    const data = await getAssessment(id)
    commit('SET_CURRENT', data)
    return data
  },
  async submit(_ctx, { id, answers, durationSeconds }) {
    return submitAssessment(id, { answers, durationSeconds: durationSeconds || 0 })
  },
  async fetchRecords({ commit }, params = {}) {
    const { list } = await listRecords(params)
    commit('SET_RECORDS', list)
    return list
  },
  async fetchRecord(_ctx, id) {
    return getRecord(id)
  }
}

export default { namespaced: true, state, mutations, actions }
