import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import './assets/main.css'

import { createApp } from 'vue'

import App from './App.vue'
import i18n from './locale'

import '@arco-design/web-vue/dist/arco.css'

const app = createApp(App)

app.use(i18n)
app.use(ArcoVueIcon)

app.mount('#app')

let prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
if (prefersDarkMode) {
  document.body.setAttribute('arco-theme', 'dark')
}
