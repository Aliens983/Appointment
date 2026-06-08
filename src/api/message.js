import request from './request'

export function listConversations() {
  return request({ url: '/messages/conversations', method: 'get' })
}

export function createConversation(counselorId) {
  return request({ url: '/messages/conversations', method: 'post', data: { counselorId } })
}

export function listMessages(conversationId) {
  return request({ url: `/messages/conversations/${conversationId}/messages`, method: 'get' })
}

export function sendMessage(conversationId, content) {
  return request({ url: `/messages/conversations/${conversationId}/messages`, method: 'post', data: { content } })
}
