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
    <el-aside width="200px" class="aside">
        <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>导航一</span>
        </template>
        <el-menu-item-group>
          <template slot="title">分组一</template>
          <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
          <el-menu-item index="1-3">选项3</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <template slot="title">选项4</template>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">导航二</span>
      </el-menu-item>
      <el-menu-item index="3" disabled>
        <i class="el-icon-document"></i>
        <span slot="title">导航三</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">导航四</span>
      </el-menu-item>
    </el-menu>
    </el-aside>
    <el-main class="main"></el-main>
  </el-container>
</el-container>
  </div>
</template>

<script>
export default {
    name:"Home",
  data () {
    return {
    }
  },
  methods: {
      homeout(){
          window.sessionStorage.clear()
          this.$router.push('/login')
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
    padding-left: 0;
}
.aside{
    background-color: #C9C9C9;
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
</style>
