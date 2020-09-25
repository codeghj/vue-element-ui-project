<!--  -->
<template>
  <div class="goods">
   <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
    <el-row :gutter="20">
        <el-col :span="8">
             <el-input placeholder="请输入内容" v-model="params.params.query" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="findgoods()"></el-button>
         </el-input>
        </el-col>
        <el-col :span="6">
            <el-button type="primary" @click="addgoods()">添加商品</el-button>
        </el-col>
    </el-row>
    <el-table :data="goodslist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="600px"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="110px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80px"></el-table-column>
        <el-table-column  label="创建时间" width="200px">
            <template v-slot="scope">
            {{scope.row.add_time| createFilters}}
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
             <el-button type="danger" icon="el-icon-delete" size="mini" @click="deletegoods(scope.row)"></el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="params.params.pagenum"
      :page-sizes="[1, 2, 7, 10]"
      :page-size="params.params.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
  </div>
</template>

<script>
import {time} from '@/common/utils.js'
export default {
    name:'goods',
    created() {
        this.getgoods()
    },
    filters:{
      createFilters(value){
        let date=new Date(value*1000)
        return time(date,'yyyy-MM-dd hh:mm:ss')
        
    }
    },
  data () {
    return {
        params:{
            params:{
                query:'',
                pagenum:1,
                pagesize:2
            }
        },
        goodslist:[],
        total:0,
    }
  },
  methods: {
    async  getgoods(){
      const{data:res}=await this.$http.get('http://timemeetyou.com:8889/api/private/v1/goods',this.params)
      console.log(res)
      if(res.meta.status!=200) return this.$message.error('获取商品数据失败')
    this.goodslist=res.data.goods
    this.total=res.data.total
      },
      handleSizeChange(newSize){
       this.params.params.pagesize=newSize
       this.getgoods()
      },
      handleCurrentChange(newPage){
          this.params.params.pagenum=newPage
          this.getgoods()

      },
      findgoods(){
          this.getgoods()
      },
      deletegoods(row){
           this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async()=>{
       const{data:res}=await this.$http.delete(`http://timemeetyou.com:8889/api/private/v1/goods/${row.goods_id}`)
       if(res.meta.status!=200) return this.$message.error('删除商品失败')
       this.getgoods()
       this.$message.success('商品删除成功')
        }).catch(()=>{
        this.$message.error('已取消商品的删除')
        })
      },
      addgoods(){
          this.$router.push('/goods/add')
      }
  },
}
</script>

<style  scoped>
.el-card,.el-table,.el-pagination{
    margin-top: 20px;
}
</style>
