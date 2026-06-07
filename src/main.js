import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './styles/global.css'

// 启动时拉取用户信息(若有 token)
store.dispatch('user/loadProfile').catch(() => {})

const app = createApp(App)
for (const [name, comp] of Object.entries(ElementPlusIconsVue)) {
  app.component(name, comp)
}
app.use(store).use(router).use(ElementPlus).mount('#app')
