import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify, Dialog, QuasarUIConfiguration } from 'quasar'
import router from 'src/router'
import App from 'src/App.vue'
import Translator from 'src/lang'

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

const pinia = createPinia()
const quasarConfig: QuasarUIConfiguration = {
  // @ts-ignore (type definition is incomplete)
  ripple: false,
  dark: true,
  notify: {
    position: 'top-right',
  },
}
createApp(App)
  .use(pinia)
  .use(router)
  .use(Translator)
  .use(Quasar, {
    config: quasarConfig,
    plugins: {
      Notify,
      Dialog,
    },
  })
  .mount('#app')

import Storage from 'src/classes/Storage.ts'
import { BrowserStorage } from 'src/classes/drivers/browser/BrowserStorage.ts'

Storage.initialize(new BrowserStorage())
