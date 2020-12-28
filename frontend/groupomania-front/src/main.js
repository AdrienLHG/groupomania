import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Pour mise en forme date et heure
import moment from 'moment'

// Configuration de moment
Vue.filter('formatDate', function (value) {
  if (value) {
    moment.locale('fr');
    return moment(String(value)).format('LL - LT')
  }
})

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
