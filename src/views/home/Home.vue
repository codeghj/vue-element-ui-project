<!--  -->
<template>
  <div class="home">
  <el-container class="content">
  <el-header class="header">
      <div class="header-item-left">
        <img src="@/assets/imag/ghj.jpg" alt="">
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="homeout">退出</el-button>
  </el-header>
  <el-container>
    <el-aside :width="collapse?'64px':'200px'"class="aside">
      <div class="control-menu" @click="controlMenu">|||</div>
        <el-menu
        
        :unique-opened="true"
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :collapse="collapse"
      :collapse-transition="false"
      :router="true"
      :default-active="$route.path"
      >
      <el-submenu :index="item.id+''" v-for="item in menu" >
        <template slot="title">
          <i :class="fonticon[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
          <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children">
            <i class="el-icon-menu"></i>
            {{subitem.authName}}
            </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <el-main class="main">
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
  </div>
</template>

<script>
export default {
  created() {
  this.getMeus()
  },
    name:"Home",
  data () {
    return {
      menu:[],
      collapse:false,
      fonticon:{
        '125':'iconfont icon-yonghu ',
        '103':'iconfont icon-dingdan ',
        '101':'iconfont icon-shuju ',
        '102':'iconfont icon-shangpin ',
        '145':'iconfont icon-quanxian ',
      }
    }
  },
  methods: {
      homeout(){
          window.sessionStorage.clear()
          this.$router.push('/login')
      },
      async getMeus(){
     const{data:res}=await this.$http.get('http://timemeetyou.com:8889/api/private/v1/menus')
     console.log(res)
     this.menu.push(...res.data)
     console.log(this.menu)
      },
      controlMenu(){
        if(this.collapse==false)
          this.collapse=true
          else
          this.collapse=false

      }
  },
}
</script>

<style  scoped>
.home{
    height: 100%;
    
}
.content{
    height: 100%;
}
.header{
    background-color: #707070;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
    padding-left: 5px;
}
.aside{
    background-color: #545c64;
}
.main{
    background-color: #eee;
}
.header-item-left img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
}
.header-item-left{
    display: flex;
    align-items: center;
    
}
.control-menu{
  line-height: 30px;
  color: white;
  font-size: 20px;
  letter-spacing:5px;
  text-align: center;
  width: 100%;
}
.el-menu-vertical-demo{
  border-right: none;
}
.iconfont {
  margin-right: 10px;
  font-size: 20px;
  color:#fff;
}
</style>
