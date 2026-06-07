import { listConversations, createConversation, listMessages, sendMessage } from '@/api/message'

const state = () => ({
  conversations: [],
  currentMessages: []
})

const mutations = {
  SET_CONVERSATIONS(state, list) {
    state.conversations = list
  },
  SET_MESSAGES(state, list) {
    state.currentMessages = list
  },
  PUSH_MESSAGE(state, msg) {
    state.currentMessages.push(msg)
  }
}

const actions = {
  async fetchConversations({ commit }) {
    const list = await listConversations()
    commit('SET_CONVERSATIONS', list)
    return list
  },
  async openConversation(_ctx, counselorId) {
    const { conversationId } = await createConversation(counselorId)
    return conversationId
  },
  async fetchMessages({ commit }, id) {
    const { list } = await listMessages(id)
    commit('SET_MESSAGES', list)
    return list
  },
  async send({ commit }, { id, content }) {
    const msg = await sendMessage(id, content)
    commit('PUSH_MESSAGE', msg)
    return msg
  }
}

export default { namespaced: true, state, mutations, actions }
