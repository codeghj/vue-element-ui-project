<!--  -->
<template>
  <div class="login">
      <div class="avatar">
          <img src="@/assets/imag/ghj.jpg" alt="">
      </div>
   <el-form ref="form" :model="form" label-width="0px" class="LoginFrom" :rules="rules">
  <el-form-item  prop="username">
    <el-input v-model="form.username" prefix-icon="el-icon-s-custom"></el-input>
  </el-form-item>
  <el-form-item prop="password" >
    <el-input v-model="form.password" type="password"  prefix-icon="el-icon-lock"></el-input>
  </el-form-item>
  <div class="LoginButton">
  <el-button type="primary" @click="islogin">登录</el-button>
  <el-button type="info" @click="changeInfo">重置</el-button>
  </div>
   </el-form>
  </div>
</template>

<script>
export default {
    name:"Login",
  data () {
    return {
        form:{
            username:'admin',
            password:'123456'
        },
        rules:{
            username:[
                { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            password:[
                { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 4, max: 16, message: '长度在 4 到 16个字符', trigger: 'blur' }
            ]

        }
    }
  },
  methods: {
      changeInfo(){
          this.$refs.form.resetFields()
      },
      islogin(){
          this.$refs.form.validate( async(valid)=>{
              if(!valid) return 
              const {data :res} =await this.$http.get('http://119.23.53.78:8888/api/private/v1/login',{params:this.form})
              if(res.meta.status!=200)
              return this.$message.error('登录失败!')
              console.log(res)
              window.sessionStorage.setItem('token',res.data.token)
              this.$router.push('/home')
            

          })
  },
}
}
</script>

<style  scoped>
.login{
    width: 350px;
    height: 300px;
    background-color: white;
    position: absolute;
    top:50%;
    left: 50%;
    transform: translate(-50%,-50%);
    border-radius: 3px;
}
.avatar{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    box-shadow: 0 0 10px #eee;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 999;
    background-color: #fff;

}
.avatar img{
    width: 100px;
    height: 100px;
    border-radius: 50%;
}
.LoginFrom{
    position: absolute;
    bottom: 20px;
    width: 100%;
    padding:0 20px;
    box-sizing: border-box;
}
.LoginButton{
    display: flex;
    justify-content: flex-end;
}
</style>
