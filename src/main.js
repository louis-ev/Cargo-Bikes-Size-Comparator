import './assets/main.css'

import { createApp, reactive } from 'vue'

import App from './App.vue'
import router from './router'
import i18n from './i18n'

import BikeName from './components/BikeName.vue'

import VueMatomo from 'vue-matomo'
const app = createApp(App)
app.config.globalProperties.$preview_bike = reactive({ id: null })
app.config.globalProperties.$loadBikeImages = async (paths) => {
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
}
app.config.globalProperties.$loadBikeImages2 = async (paths) => {
  const full_paths = []
  for (let [source, url] of Object.entries(paths)) {
    full_paths.push({
      url,
      original_filename: source.split('/').pop()
    })
  }
  return full_paths
}

app.config.globalProperties.$bikeTypesColors = {
  longtail: '#C5998C',
  midtail: '#118ab2',
  lowtail: '#ffd166',
  longjohn: '#9097C0',
  shortjohn: '#14A6D7',
  tricycle: '#ef476f',
  longdiamond: '#06d6a0'
}

app.config.globalProperties.$normalizeStringForSearch = (str) => {
  if (!str) return ''
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

app.use(VueMatomo, {
  host: 'https://sv.louiseveillard.com',
  siteId: 1,
  requireCookieConsent: true
})
app.component('BikeName', BikeName)
app.use(router)
app.use(i18n)
app.mount('#app')
