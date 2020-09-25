import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login/Login.vue'
import Home from '../views/home/Home.vue'
import welcome from '../views/home/childerCompos/welcom.vue'
import user from '../views/home/childerCompos/user.vue'
import rights from '../views/home/childerCompos/rights.vue'
import roles from '../views/home/childerCompos/roles.vue'
import shopcategory from '../views/home/childerCompos/shopCategory.vue'
import shopParams from '../views/home/childerCompos/shopParams.vue'
import goods from '../views/home/childerCompos/goods.vue'
import addgoods from '../views/home/childerCompos/AddGoods.vue'
import orders from '../views/home/childerCompos/Orders.vue'
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
     component: Home,
     redirect:'/welcome',
     children:[
       {
         path:'/welcome',
         component: welcome
       },
       {
         path:'/users',
         component:user
         
       },
       {
         path:'/rights',
         component:rights
       },
       {
         path:'/roles',
         component:roles
       },
       {
         path:'/categories',
         component:shopcategory
       },
       {
         path:'/params',
         component:shopParams
       },
       {
         path:'/goods',
         component:goods
       },
       {
         path:'/goods/add',
         component:addgoods
       },
       {
         path:'/orders',
         component:orders
       }
     ]
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