<!--  -->
<template>
  <div class="user">
<el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card class="box-card">
    <el-row :gutter="20">
<el-col :span="8">
  <el-input placeholder="请输入内容" v-model="params.params.query" class="input-with-select">
    <el-button slot="append" icon="el-icon-search" @click="getuserlist()"></el-button>
  </el-input>
  </el-col>
  <el-col :span="4">
      <el-button type="primary" @click="adduser()">添加用户</el-button>
  </el-col>
</el-row>
 <el-table
      :data="user"
      style="width: 100%"
      stripe
      border>
     <el-table-column
     label="#"
        type="index"
       >
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="180">
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="角色"
        width="180">
        
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="状态"
        width="180">
       <template v-slot="scope">
            <el-switch
       v-model=" scope.row.mg_state"  @change="changeActive(scope.row)"
      >
    </el-switch>
       </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
        <template v-slot="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="changeUser(scope.row.id)"></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
         <el-tooltip class="item" effect="dark" content="角色控制" placement="top" :nterable="false" >
        <el-button type="warning" icon="el-icon-setting" size="mini"  @click="Action(scope.row)"></el-button>
        </el-tooltip>
        </template>
      </el-table-column>
      
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-sizes="[1, 3, 5, 7]"
      :page-size="1"
      layout="total, sizes, prev, pager, next, jumper"
      :total="4">
    </el-pagination>
</el-card>
<el-dialog
  title="添加用户"
  :visible.sync="dialogVisible"
  width="40%"
  @close="dialogClose()"
  >
  <el-form :model="addForm" :rules="Addrules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="SureAddUser()">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  title="修改信息"
  :visible.sync="dialogVisibles"
  width="40%"
  @close="editClose()"
  >
  <el-form :model="userItem" :rules="editrules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="userItem.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="userItem.email"></el-input>
  </el-form-item>
  <el-form-item label="电话" prop="mobile">
    <el-input v-model="userItem.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editChange()">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  title="分配角色"
  :visible.sync="dialogVisibleAction"
  width="40%"
>
  <div>当前用户:{{columnUser.username}}</div>
  <div>当前角色:{{columnUser.role_name}}</div>
  <el-select v-model="valueid" placeholder="请选择" :clearable="true">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisibleAction = false">取 消</el-button>
    <el-button type="primary" @click="changroles()">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
    name:'user',
  data () {
      var checkemail=(rule,value,callback)=>{
        const regex=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
          if(regex.test(value)){
          return callback() }
          callback(new Error('邮箱格式不正确'))
        };
        var checkmobile=(rule,value,callback)=>{
        const regex=/^1[3456789]\d{9}$/
          if(regex.test(value)){
          return callback() }
          callback(new Error('电话格式不正确'))
        };
    return {
        params:{
            params:
            {query:'',
            pagenum:1,
            pagesize:2,
            }
            },
        
        user:[],
        total:0,
        dialogVisible:false,
        addForm:{
         username:'',
         password:'',
         email:'',
         mobile:'',
        },
         dialogVisibleAction:false,
         valueid:'',
         
        Addrules:{
            username:[
             { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
             password:[
                { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 4, max: 16, message: '长度在 4 到 16个字符', trigger: 'blur' }
            ],
             email:[
                {required: true, message: '请输入邮箱', trigger: 'blur'  },
                { validator:checkemail , trigger: 'blur'}
            ],
             mobile:[
                { required: true, message: '请输入电话', trigger: 'blur' },
                {validator: checkmobile , trigger: 'blur' }
            ],

        },
        userItem:{},
        dialogVisibles:false,
        editrules:{
             email:[
                {required: true, message: '请输入邮箱', trigger: 'blur'  },
                { validator:checkemail , trigger: 'blur'}
            ],
             mobile:[
                { required: true, message: '请输入电话', trigger: 'blur' },
                {validator: checkmobile , trigger: 'blur' }
            ],
        },
        columnUser:{},
        options:[]
    };
  
  },
  created() {
      this.getuserlist()
  },
  methods: {
     async getuserlist(){
       const{data:res}= await  this.$http.get('http://timemeetyou.com:8889/api/private/v1/users',this.params)
       console.log(res)
       this.total=res.data.total
       this.user=res.data.users
      },
      handleSizeChange(newSize){
        this.params.params.pagesize=newSize
        console.log(newSize)
        this.getuserlist()
      },
      handleCurrentChange(newPage){
         this.params.params.pagenum=newPage
         this.getuserlist()
      },
     async changeActive(scop){
    const {data:res}=  await  this.$http.put(`http://timemeetyou.com:8889/api/private/v1/users/${scop.id}/state/${scop.mg_state}`)
    console.log(res)
    if(res.meta.status!=200) { 
        scop.mg_state=!sccop.mg_state 
         return this.$message('状态修改失败')
         }
        this.$message('状态修改成功')
      },
      adduser(){
          this.dialogVisible=true
      },
      dialogClose(){
          this.$refs.addFormRef.resetFields()

      },
      editClose(){
        this.$refs.editFormRef.resetFields()
      },
      SureAddUser(){
          this.$refs.addFormRef.validate( async(valid)=>{
              if(!valid)return
           const{data:res}= await  this.$http.post('http://timemeetyou.com:8889/api/private/v1/users',this.addForm)
            console.log(res)
            if(res.meta.status!=201)
            return this.$message.error('添加失败')
            this.dialogVisible=false
            this.getuserlist()
            this.$message.success('添加成功')
          })
      },
     async changeUser(id){
      const{data:res}=await this.$http.get(`http://timemeetyou.com:8889/api/private/v1/users/${id}`)
      console.log(res)
      if(res.meta.status!=200) {
          return
          }
       this.userItem=res.data
       this.dialogVisibles=true
      
      },
      editChange(){
          this.$refs.editFormRef.validate( async valid=>{
              if(!valid){ return this.$message.error('修改失败')}
         const{data:res} = await this.$http.put(`http://timemeetyou.com:8889/api/private/v1/users/${this.userItem.id}`,{email:this.userItem.email,mobile:this.userItem.mobile})
             console.log(res)
             if(res.meta.status!=200){
               return this.$message.error('更新失败')
             }
             this.dialogVisibles=false
             this.getuserlist()
             this.$message.success('更新成功')
          })
      },
     async deleteUser(id){
       this.$confirm('此操作将永久删除该用户信息, 是否继续?', '删除提示', {
         showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async ()=>{
      const{data:res}=await this.$http.delete(`http://timemeetyou.com:8889/api/private/v1/users/${id}`)
      console.log(res)
      if(res.meta.status!=200){return this.$message.error('删除失败')}
      this.getuserlist()
      this.$message.success(res.meta.msg)
        }).catch(()=>{
          this.$message.info('已取消删除')
        })
      },
    async  Action(user){
        this.columnUser=user
   const{data:res}=await  this.$http.get('http://timemeetyou.com:8889/api/private/v1/roles')
   if(res.meta.status!=200) return this.$message.error('获取失败')
   this.options=res.data
   console.log(res)
        this.dialogVisibleAction=true
      },
     async changroles(){
     const{data:res}=  await this.$http.put(`http://timemeetyou.com:8889/api/private/v1/users/${this.columnUser.id}/role`,{rid:this.valueid})
     console.log(res)
      }

  },
}
</script>

<style  scoped>
.box-card,.el-table,.el-pagination{
    margin-top: 20px;
}
</style>
