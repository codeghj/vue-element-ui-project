<template>
  <div id="app" :class="{'active':isactive}">
   <router-view></router-view>
  </div>
</template>


<script>


export default {
  name: "App",
  components: {
   
  },
  computed: {
    isactive(){
       if(this.$route.path=='/login')
       return true
    }
  },
};
</script>

<style>
#app {
  height: 100vh;
  min-width: 1366px;
  
}
.active{
  background-color: #2b4b6b;
}
</style>
