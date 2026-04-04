import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 初始化认证状态
import { useAuthStore } from './stores/auth'
const auth = useAuthStore()
auth.init()

app.mount('#app')
