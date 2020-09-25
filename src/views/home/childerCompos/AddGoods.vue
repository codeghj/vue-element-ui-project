<!--  -->
<template>
  <div class="add-goods">
 <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
  <el-breadcrumb-item><a href="/goods">商品列表</a> </el-breadcrumb-item>
  <el-breadcrumb-item>添加商品</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
    <el-alert
    title="添加商品信息"
    type="info"
    center
    show-icon>
  </el-alert>
  <el-steps :active="activeName-0" align-center>
  <el-step title="基本信息" ></el-step>
  <el-step title="商品参数" ></el-step>
  <el-step title="商品属性" ></el-step>
  <el-step title="商品图片" ></el-step>
  <el-step title="商品内容" ></el-step>
  <el-step title="完成" ></el-step>
</el-steps>
<el-form :model="addForm" :rules="addrules" ref="addFormRef" label-width="100px" class="demo-ruleForm" label-position="top">
<el-tabs :tab-position="'left'" v-model="activeName" @tab-click="handleClick"  :before-leave="beforchangetab">
    <el-tab-pane label="基本信息" name="0">
 <el-form-item label="商品名称" prop="goods_name">
    <el-input v-model="addForm.goods_name"></el-input>
  </el-form-item>
  <el-form-item label="商品价格" prop="goods_price">
    <el-input v-model="addForm.goods_price"></el-input>
  </el-form-item>
  <el-form-item label="商品重量" prop="goods_weight">
    <el-input v-model="addForm.goods_weight"></el-input>
  </el-form-item>
  <el-form-item label="商品数量" prop="goods_number">
    <el-input v-model="addForm.goods_number"></el-input>
  </el-form-item>
   <el-form-item label="商品分类" prop="goods_cat">
    <el-cascader
    v-model="addForm.goods_cat"
    :options="options"
    :props="relation"
    @change="handleChange"></el-cascader>
  </el-form-item>

    </el-tab-pane>
    <el-tab-pane label="商品参数" name="1">
    <el-form-item  v-for="item in manydata" :label="item.attr_name" prop="goods_cat" :key="item.attr_id">
     <el-checkbox-group v-model="item.attr_vals">
    <el-checkbox v-for="(items,index) in item.attr_vals" :label="items" :key="index" border checked></el-checkbox>
  </el-checkbox-group>
    </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品属性" name="2">
      <el-form-item  v-for="item in onlydata " :label="item.attr_name" prop="" :key="item.attr_id">
        <el-input v-model="item.attr_vals"></el-input>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="3">
     <el-upload
  class="upload-demo"
  action="http://timemeetyou.com:8889/api/private/v1/upload"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :file-list="fileList"
  list-type="picture"
  :headers="imgheader"
  :on-success="imgsuccess">
  <el-button size="small" type="primary">点击上传</el-button>
</el-upload>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name="4">
    <quill-editor
    ref="myQuillEditor"
    v-model="addForm.goods_introduce"
    
  />
  <el-button type="primary" @click="sureAddgoods()">确认添加商品</el-button>
    </el-tab-pane>
  </el-tabs>
</el-form>
</el-card>
<el-dialog
  title="图片"
  :visible.sync="dialogVisible"
  width="40%"
  >
 <img :src="imgurl" alt="">
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
    name:'addgoods',
  data () {
    return {
        activeName:'0',
        addForm:{
            goods_name:'',
            goods_price:'',
            goods_weight:'',
            goods_number:'',
            goods_cat:[],
            pics:[],
            attrs:[],
            goods_introduce:''
        },
        addrules:{
         goods_name:[
             { required: true, message: '请输入活动名称', trigger: 'blur' },
         ],
          goods_price:[
              { required: true, message: '请输入活动名称', trigger: 'blur' },
          ],
           goods_weight:[
              { required: true, message: '请输入活动名称', trigger: 'blur' },
           ],
            goods_number:[
               { required: true, message: '请输入活动名称', trigger: 'blur' },
            ]
        },
        options:[],
        relation:{
            label:'cat_name',
            value:'cat_id',
            children:'children',
             expandTrigger: 'hover' 
        },
        manydata:[],
        manycheckList:'',
        onlydata:[],
        fileList:[],
        imgheader:{
            Authorization:window.sessionStorage.getItem('token')
        },
        imgurl:'',
        dialogVisible:false,
    
    }
  },
  created() {
      this.getcatergory()
  },
  methods: {
  async  handleClick(){
         if(this.activeName=='1'){
         const{data:res}= await  this.$http.get(`http://timemeetyou.com:8889/api/private/v1/categories/${this.addForm.goods_cat[this.addForm.goods_cat.length-1]}/attributes`,{params:{sel:'many'}})
          console.log(res)
          res.data.forEach(element => {
            if(typeof( element.attr_vals)!==Array)
            element.attr_vals=element.attr_vals==''?[]:element.attr_vals.split(' ')
        });
         if(res.meta.status!=200) return
         this.manydata=res.data
         console.log(this.manydata)
          }else if(this.activeName=='2'){
              const{data:res}= await  this.$http.get(`http://timemeetyou.com:8889/api/private/v1/categories/${this.addForm.goods_cat[this.addForm.goods_cat.length-1]}/attributes`,{params:{sel:'only'}})
              console.log(res)
              if(res.meta.status!=200) return 
              this.onlydata=res.data
         }
      },
     async getcatergory(){
           if(this.activeName=='0'){
             const{data:res}=await this.$http.get('http://timemeetyou.com:8889/api/private/v1/categories',{params:{type:3}})
             console.log(res)
             if(res.meta.status!=200) return
             this.options=res.data
             
          }
      },
      handleChange(value){
        
      },
      beforchangetab(activeName,oldActiveName){ 
          if(this.activeName=='0'&&this.addForm.goods_cat.length!=3){
              this.$message.error('请先选择商分类')
              return false
          }
      },
      handlePreview(file){
        console.log(file)
        this.imgurl=file.response.data.url
        this.dialogVisible=true

      },
      handleRemove(file, fileList){
      let paths=file.response.data.tmp_path
     const x=this.addForm.pics.findIndex(item=>item.pic==paths)
      this.addForm.pics.splice(x,1)
      },
      imgsuccess(response, file, fileList){
          if(response.meta.status!=200) return this.$message.error('图片上传失败')
          this.fileList=fileList
          console.log(response)
          const pics={pic:response.data.tmp_path}
          this.addForm.pics.push(pics)
          console.log(this.addForm)

      },
      sureAddgoods(){
        this.$refs.addFormRef.validate(async valid=>{
      this.manydata.forEach(item=>{
       item.attr_vals= item.attr_vals.join(' ')
        const attr={attr_id:item.attr_id,attr_value:item.attr_vals}
        this.addForm.attrs.push(attr)
      })
      this.onlydata.forEach(item=>{
        item.attr_vals= item.attr_vals.join(' ')
        const attr={attr_id:item.attr_id,attr_value:item.attr_vals}
        this.addForm.attrs.push(attr)
      })
      const from =_.clone(this.addForm)
     
      from.goods_cat=from.goods_cat.join(',')
       console.log(from)
      const{data:res}=await this.$http.post('http://timemeetyou.com:8889/api/private/v1/goods',from)
      console.log(res)
      if(res.meta.status!=201) return this.$message.error('商品添加失败')
      this.$router.push('/goods')
      this.$message.success('商品添加成功')
      })
      }

  },
}
</script>

<style  scoped>
.el-card,.el-steps,.el-button{
    margin-top: 20px;
}
.el-dialog img{
    width: 100%;
}

</style>
