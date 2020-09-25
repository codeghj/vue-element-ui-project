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
import ZkTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import '../src/assets/css/common.css'
import nprogress from'nprogress'
import 'nprogress/nprogress.css'

Vue.use(nprogress)
Vue.use(VueQuillEditor)
Vue.component(ZkTable.name, ZkTable)
Vue.use(Element)
Vue.component(Message.name,Message)
Vue.component(MessageBox.name,MessageBox)
Vue.prototype.$confirm=MessageBox
Vue.config.productionTip = false
Vue.prototype.$http=axios

Vue.prototype.$message=Message
axios.interceptors.request.use(config=>{
  nprogress.start()
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config=>{
  nprogress.done()
  return config
})
var app=new Vue({
  render: h => h(App),
  router
}).$mount('#app')

