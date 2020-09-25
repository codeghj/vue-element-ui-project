<template>
  <div class="shop-category">
    <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
    <el-row>
        <el-col>
            <el-button type="primary" @click="addCategory()">添加分类</el-button>
        </el-col>
    </el-row>
    <zk-table 
  :data="category"
  :columns="columns"
  :show-index="true"
  :selection-type="false"
  :expand-type="false"
  index-text="#"
  border>
  <template slot="likes" scope="scope">
   <i class="el-icon-success" v-if="scope.row.cat_deleted==true"></i>
   <i class="el-icon-error" v-else></i>
  </template>
  <template slot="order" scope="scope">
   <el-tag v-if="scope.row.cat_level==0">一级</el-tag>
    <el-tag type="success" v-else-if="scope.row.cat_level==1">二级</el-tag>
     <el-tag type="warning" v-else="scope.row.cat_level==2">三级</el-tag>

  </template>
   <template slot="options" scope="scope">
   <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
   <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
  </template>

    </zk-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="params.params.pagenum"
      :page-sizes="[1, 3, 5, 7]"
      :page-size="params.params.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totals">
    </el-pagination>
</el-card>
<el-dialog
  title="添加分类"
  :visible.sync="dialogVisible"
  width="40%"
  @close="deleteform()"
 >
  <el-form :model="addForm" :rules="rules" ref="addFormRfe" label-width="100px" class="demo-ruleForm">
  <el-form-item label="分类名称" prop="cate_name">
    <el-input v-model="addForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类" >
   <el-cascader
    v-model="Categoryvalue"
    :options="options"
    :props="relations"
    @change="handleChange" change-on-select clearable ></el-cascader>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addcategoryFinish()">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
    name:'shopcategory',
  data () {
    return {
        params:{
            params:{
             type:3,
             pagenum:1,
             pagesize:5,
            }
        },
        Categoryvalue:[],
        options:[],
        optionsid:[],
        relations:{
            value:'cat_id',
            label:'cat_name',
            children:'children',
            expandTrigger: 'hover'
        },
        addForm:{
        cat_name:'',
        cat_pid:'',
        cat_level:''
        },
        rules:{
          cat_name:[
              { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        },
        totals:0,
        category:[],
        dialogVisible:false,
        columns: [
          {
            label: '商品分类',
            prop: 'cat_name',
            width: '400px',
          },
          {
            label: '是否有效',
            minWidth: '200px',
            type: 'template',
            template: 'likes',
          },
          {
            label: '排序',
            minWidth: '200px',
            type: 'template',
            template: 'order',
          },
          {
            label: '操作',
            minWidth: '200px',
            type: 'template',
            template: 'options',
          }]
    }
  },
  created() {
      this.getcategory()
  },
  methods: {
     async getcategory(){
     const{data:res} =  await  this.$http.get('http://timemeetyou.com:8889/api/private/v1/categories',this.params)
     console.log(res)
     if(res.meta.status!=200) return this.$message.error('获取分类数据失败')
     this.category=res.data.result
     this.totals=res.data.total
      },
      handleSizeChange(newsize){
         this.params.params.pagesize=newsize
         this.getcategory()
      },
       handleCurrentChange(newpage){
           this.params.params.pagenum=newpage
           this.getcategory()

          },
          addCategory(){
              this.getfatherType()
              this.dialogVisible=true
          },
         async getfatherType(){
           const{data:res} = await this.$http.get('http://timemeetyou.com:8889/api/private/v1/categories',{params:{type:2}})
           console.log(res)
           if(res.meta.status!=200) return this.$message.error('获取失败')
           this.options=res.data
          },
          handleChange(value){
            if(value.length==0){
              this.addForm.cat_pid=0
             this.addForm.cat_level=value.length
            }else if(value.length==1){
             this.addForm.cat_pid=value[value.length-1]
             this.addForm.cat_level=value.length
            }else if(value.length==2){
            this.addForm.cat_pid=value[value.length-1]
             this.addForm.cat_level=value.length
            }
          },
          deleteform(){
          this.$refs.addFormRfe.resetFields()
          this.Categoryvalue=[]

          },
          addcategoryFinish(){
              this.$refs.addFormRfe.validate(async valid=>{
             const{data:res}=await this.$http.post('http://timemeetyou.com:8889/api/private/v1/categories',this.addForm)
             console.log(this.addForm)
             console.log(res)
             if(res.meta.status!=201) return this.$message.error('添加失败')
             this.dialogVisible=false
             this.getcategory()
             this.$message.success('添加分类成功')
              })
          }


  },
}
</script>

<style  scoped>
.el-card{
    margin-top: 20px;
}
.zk-table {
    margin-top: 20px;
}
.el-pagination{
    margin-top: 20px;
}
.el-cascader{
    width: 100%;
}
</style>
