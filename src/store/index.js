import { createStore } from 'vuex'
import user from './modules/user'
import counselor from './modules/counselor'
import appointment from './modules/appointment'
import message from './modules/message'
import assessment from './modules/assessment'

const store = createStore({
  modules: { user, counselor, appointment, message, assessment }
})

export default store
