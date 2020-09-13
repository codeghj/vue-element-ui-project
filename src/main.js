import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import './assets/css/base.css'
import Element from 'element-ui'
import {Message} from 'element-ui'
import '../node_modules/element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
Vue.use(Element)
Vue.use(Message)
Vue.config.productionTip = false
Vue.prototype.$http=axios
Vue.prototype.$message=Message
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
