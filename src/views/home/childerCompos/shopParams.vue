<!--  -->
<template>
  <div class="shop-params">
   <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
  <el-breadcrumb-item>分类参数</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
   <el-alert
    title="注意:只允许为第三级分类设置相关参数"
    type="warning"
    show-icon
    :closable="false">
  </el-alert>
  <el-row >
    <el-col :span="8">
      选择商品分类:
      <el-cascader
    v-model="value"
    :options="options"
    :props="relation"
    @change="handleChange"></el-cascader>
    </el-col>
  </el-row>
   <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="动态参数" name="many">
      <el-row>
        <el-col>
          <el-button type="primary" :disabled=" ButtonDisable" @click="addAttr()">添加参数</el-button>
          <el-table :data="attr" border stripe>
             <el-table-column type="expand" >
               <template v-slot="scope">
                <el-row :gutter="20"   >
                  <el-col v-for="(item,index) in scope.row.attr_vals" :span="6" :key="item.attr_id">
                    <el-tag closable @close="tagclose(scope.row,index)">{{item}}</el-tag>
                  </el-col>
                </el-row>
               </template>
             </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
             <el-table-column label="操作">
               <template v-slot="scope">
                 <el-button type="primary" icon="el-icon-edit" size="mini" @click="editAttr(scope.row)">修改</el-button>
                 <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttr(scope.row)">删除</el-button>
                
               </template>
             </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="静态参数" name="only">
       <el-row>
        <el-col>
          <el-button type="primary" :disabled=" ButtonDisable" @click="addAttr()">添加参数</el-button>
          <el-table :data="attr" border stripe>
            <el-table-column type="expand" >
              <template v-slot="scope">
                <el-row :gutter="20"   >
                  <el-col v-for="(item,index) in scope.row.attr_vals" :span="6":key="item.attr_id">
                    <el-tag closable @close="tagclose(scope.row,index)">{{item}}</el-tag>
                  </el-col>
                </el-row>
               </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
             <el-table-column label="操作">
               <template v-slot="scope">
                 <el-button type="primary" icon="el-icon-edit" size="mini" @click="editAttr(scope.row)">修改</el-button>
                 <el-button type="danger" icon="el-icon-delete" size="mini"  @click="deleteAttr(scope.row)">删除</el-button>
                 
               </template>
             </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-tab-pane>
   </el-tabs>
</el-card>
<el-dialog
  :title="'添加'+getAttrName"
  :visible.sync="dialogVisible"
  width="40%"
  @cloese="dialogClose()"
  >
  <el-form :model="attrForm" :rules="attrrules" ref="attrFormRef" label-width="100px" class="demo-ruleForm">
  <el-form-item :label="getAttrName" prop="attr_name">
    <el-input v-model="attrForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addAttrSure()">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  :title="'修改'+getAttrName"
  :visible.sync="editdialogVisible"
  width="40%"
  @cloese="editdialogClose()"
  >
  <el-form :model="editattrForm" :rules="editattrrules" ref="editattrFormRef" label-width="100px" class="demo-ruleForm">
  <el-form-item :label="getAttrName" prop="attr_name">
    <el-input v-model="editattrForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editAttrSure()">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
    name:'shopParams',
  data () {
    return {
      value:[],
      options:[],
      relation:{
        label:'cat_name',
        value:'cat_id',
        children:'children',
        expandTrigger: 'hover'},
       activeName:'many',
       ButtonDisable:true,
       attr:[],
       dialogVisible:false,
       editdialogVisible:false,
       attrForm:{
         attr_name:'',
         },
          attrrules: {
          attr_name: [
            { required: true, message: '请输入参数名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],},
          editattrForm:{
             attr_name:'',
          },
          editattrrules:{
            attr_name: [
            { required: true, message: '请输入参数名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          },
          editSureattrid:'',

    }
  },
  created() {
    this.getcategory()
  },
  methods: {
  async  handleChange(){
    if(this.value.length==3){
      this.ButtonDisable=false
      this.getattr()
    }
    
    },
    handleClick(){
     this.getattr()
    },
   async getcategory(){
   const{data:res}= await this.$http.get('http://timemeetyou.com:8889/api/private/v1/categories',{params:{type:3}})
   console.log(res)
   if(res.meta.status!=200) return
   this.options=res.data
    },
   async getattr(){
     const{data:res}=await this.$http.get(`http://timemeetyou.com:8889/api/private/v1/categories/${this.value[this.value.length-1]}/attributes`,{params:{sel:this.activeName}})
    console.log(res)
    if(res.meta.status!=200) return
   res.data.forEach(element => {
     if(element.attr_vals){
  element.attr_vals= element.attr_vals.split(',')}
  else{
     element.attr_vals=[]
  }
   });
    this.attr=res.data
    },
   async tagclose(row,index){
    row.attr_vals.splice(index,1)
    console.log(row.attr_vals)
   row.attr_vals= row.attr_vals.join(',')
   console.log(row.attr_vals)

   const{data:res}=await this.$http.put(`http://timemeetyou.com:8889/api/private/v1/categories/${this.value[this.value.length-1]}/attributes/${row.attr_id}`,{attr_name:row.attr_name,attr_sel:this.activeName,attr_vals:row.attr_vals})
   console.log(res)
   if(res.meta.status!=200) return
   this.$message.success('删除扩展项中数据成功')
   this.getattr()
   },
    addAttr(){
      this.dialogVisible=true
    },
    dialogClose(){
      this.$refs.attrFormRef.resetFields()
    },
    addAttrSure(){
       this.$refs.attrFormRef.validate(async valid=>{
       console.log(this.activeName)
        const{data:res}=await this.$http.post(`http://timemeetyou.com:8889/api/private/v1/categories/${this.value[this.value.length-1]}/attributes`,{attr_name:this.attrForm.attr_name,
        attr_sel:this.activeName})
          console.log(res)
          if(res.meta.status!=201)return this.$message.error('添加参数失败')
          this.dialogVisible=false
          this.getattr()
          this.$message.success('添加参数成功')
       })
    },
    editAttr(row){
     this.geteditAttr(row)
      this.editdialogVisible=true
    },
   async geteditAttr(row){
   const{data:res}=await this.$http.get(`http://timemeetyou.com:8889/api/private/v1/categories/${this.value[this.value.length-1]}/attributes/${row.attr_id}`,{params:{
       attr_sel:this.activeName
     }})
     this.editattrForm.attr_name=res.data.attr_name
     this.editSureattrid=res.data.attr_id

    },
    editAttrSure(){
      this.$refs.editattrFormRef.validate(async valid=>{
     const{data:res}=await this.$http.put(`http://timemeetyou.com:8889/api/private/v1/categories/${this.value[this.value.length-1]}/attributes/${this.editSureattrid}`,{ attr_name:this.editattrForm.attr_name, attr_sel:this.activeName})
     console.log(res)
     if(res.meta.status!=200)return this.$message.error('修改失败')
     this.editdialogVisible=false
     this.getattr()
     this.$message.success('修改成功')
      })
    },
   deleteAttr(row){
       this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async ()=>{
        const{data:res}=await this.$http.delete(`http://timemeetyou.com:8889/api/private/v1/categories/${this.value[this.value.length-1]}/attributes/${row.attr_id}`)
        console.log(res)
        if(res.meta.status!=200) return this.$message.error('删除参数失败')
        this.getattr()
        this.$message.success('删除参数成功')

        }).catch(()=>{
            this.$message.info('已取消删除')
        })
      
    }
  },
  computed: {
    getAttrName(){
      return this.activeName=='many'?'动态参数':'静态参数'
    }
  },
}
</script>

<style  scoped>
.el-card,.el-table{
  margin-top: 20px;
}
.el-row{
  margin-top: 20px;
}
</style>
