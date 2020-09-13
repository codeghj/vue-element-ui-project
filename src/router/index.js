import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login/Login.vue'
import Home from '../views/home/Home.vue'
Vue.use(VueRouter)
const routes=[
    {
        path:"/",
        redirect:'/login'
    },
    {
      path:'/login',
      component:login
    },
    {
     path:'/home',
     component: Home
    }
]
const router=new VueRouter({
   routes,
   mode:'history'
})
router.beforeEach((to,from ,next)=>{
  if(to.path=='/login') return next()
  const tokenstr=window.sessionStorage.getItem('token')
  if(!tokenstr) return next('/login')
  next()
})
export default router