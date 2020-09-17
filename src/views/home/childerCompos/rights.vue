<!--  -->
<template >
  <div class="rights">
    <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card class="box-card">
    <el-table
      :data="rights"
      style="width: 100%"
      stripe
      border>
     <el-table-column
     label="#"
        type="index"
       >
      </el-table-column>
      <el-table-column
     label="权限名称"
     prop="authName"
       >
      </el-table-column>
      <el-table-column
     label="路径"
     prop="path"
       >
      </el-table-column>
      <el-table-column
     label="权限等级"
       >
       <template v-slot=scoped>
          <el-tag v-if="scoped.row.level==0">一级</el-tag>
          <el-tag v-else-if="scoped.row.level==1" type="success">二级</el-tag>
          <el-tag v-else type="info">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
</el-card>
  </div>
</template>

<script>
export default {
    name:'rights',
  data () {
    return {
        rights:[]
    }
  },
  created() {
      this.getRights()
  },
  methods: {
    async  getRights(){
    const {data:res}= await  this.$http.get('http://timemeetyou.com:8889/api/private/v1/rights/list')
    console.log(res)
    if(res.meta.status!=200) return this.$message('获取列表数据失败')
    this.rights=res.data
      }
  },
}
</script>

<style  scoped>
.el-card{
    margin-top: 20px;
}
</style>
