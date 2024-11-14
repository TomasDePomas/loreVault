import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify, Dialog, QuasarUIConfiguration } from 'quasar'
import router from 'src/router'
import App from 'src/App.vue'
import Translator from 'src/lang'
import { LoreVault } from 'src/plugins/LoreVault'

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
  .use(LoreVault)
  .mount('#app')
