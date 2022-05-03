import { createApp } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import vClickOutside from "click-outside-vue3"
import App from './App.vue'
import router from './router'
import store from './store'

library.add(fas);
createApp(App)
  .component('FontAwesomeIcon', FontAwesomeIcon)
  .use(vClickOutside)
  .use(store)
  .use(router)
  .mount('#app')
