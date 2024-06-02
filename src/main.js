import './assets/main.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import i18n from './i18n'

const app = createApp(App)
app.config.globalProperties.$local_bikes = []

app.config.globalProperties.$normalizeStringForSearch = (str) => {
  if (!str) return ''
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

app.use(router)
app.use(i18n)
app.mount('#app')
