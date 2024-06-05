import './assets/main.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import i18n from './i18n'

import VueMatomo from 'vue-matomo'
const app = createApp(App)
app.config.globalProperties.$local_bikes = []
;(app.config.globalProperties.$loadBikeImages = async (paths) => {
  const full_paths = []
  for (let [source, full_path] of Object.entries(paths)) {
    const import_statment = full_path()
    const url = (await import_statment).default
    const original_filename = source.split('/').pop()
    full_paths.push({
      url,
      original_filename
    })
  }
  return full_paths
}),
  (app.config.globalProperties.$normalizeStringForSearch = (str) => {
    if (!str) return ''
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  })

app.use(VueMatomo, {
  host: 'https://sv.louiseveillard.com',
  siteId: 1,
  requireCookieConsent: true
})
app.use(router)
app.use(i18n)
app.mount('#app')
