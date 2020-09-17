import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import './assets/css/base.css'
import Element from 'element-ui'
import {Message} from 'element-ui'
import{MessageBox} from 'element-ui'
import '../node_modules/element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import '../src/assets/css/font/iconfont.css'
Vue.use(Element)
Vue.component(Message.name,Message)
Vue.component(MessageBox.name,MessageBox)
Vue.prototype.$confirm=MessageBox
Vue.config.productionTip = false
Vue.prototype.$http=axios
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$message=Message

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
