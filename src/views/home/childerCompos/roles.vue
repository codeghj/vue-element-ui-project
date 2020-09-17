<!--  -->
<template>
  <div class="roles">
  <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card class="box-card">
    <el-row>
        <el-col :span="6">
            <el-button type="primary">添加角色</el-button>
        </el-col>
    </el-row>
</el-card>
<el-table :data="roles"
    style="width: 100%"
      stripe
      border>
      <el-table-column type="expand">
          <template v-slot=scoped>
             <el-row v-for="(item ,index) in scoped.row.children" :key="item.id" :class="['row','rows' ,index==0?'toprow':'']">
                 <el-col :span="5">
                  <el-tag  closable>{{item.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                 </el-col>
                 <el-col :span="19">
                    <el-row v-for="(item1,index) in item.children" :key="item1.id" :class="['rows',index==1?'toprow':'']">
                        <el-col :span="6">
                            <el-tag type="success" closable>{{item1.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i> 
                        </el-col>
                        <el-col :span="18">
                            <el-tag type="warning" closable v-for="item2 in item1.children" :key="item2.id" class="three-tag"@close="CloseEvent(scoped.row,item2.id)" >{{item2.authName}}</el-tag>
                        </el-col>
                    </el-row>
                 </el-col>
             </el-row>
          </template>
      </el-table-column>
       <el-table-column label="#" type="index"></el-table-column>
     <el-table-column label="角色名称" prop="roleName"></el-table-column>
     <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
     <el-table-column label="操作" >
         <template v-slot=scoped>
             <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
             <el-button type="warning" icon="el-icon-delete" size="mini">删除</el-button>
             <el-button type="danger" icon="el-icon-setting" size="mini" @click="Assignpermissions(scoped.row)">分配权限</el-button>
         </template>
     </el-table-column>
</el-table>
<el-dialog
  title="分配权限"
  :visible.sync="dialogVisible"
  width="40%"
  >
  <el-tree :data="tree" :props="defaultProps" :show-checkbox="true"  :default-expand-all="true"	 ref="treeRef" :default-checked-keys="defaultNodes" node-key="id"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="CloseDialogRoles()">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
    name:'roles',
  data () {
    return {
        roles:[],
        dialogVisible:false,
        tree:[],
         defaultProps: {
          children: 'children',
          label: 'authName',
         
        },
        node:[],
        defaultNodes:[],
        rolesid:'',
        
    }
  },
  created() {
      this.getroles()

  },
  methods: {
    async  getroles(){
      const{data:res}=await  this.$http.get('http://timemeetyou.com:8889/api/private/v1/roles')
      console.log(res)
      if(res.meta.status!=200) return this.$message('角色列表获取失败')
      this.roles=res.data
      },
      CloseEvent(rolesid,rightsid){
          this.$confirm('此操作将永久删除该角色权限, 是否继续?', '删除提示', {
         showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async()=>{
       const{data:res}= await this.$http.delete(`http://timemeetyou.com:8889/api/private/v1/roles/${rolesid.id}/rights/${rightsid}`)
       console.log(res)
       if(res.meta.status!=200) return this.$message('删除权限失败')
        rolesid.children=res.data
        this.$message.success('删除角色权限成功')
       
        }).catch(()=>{
            this.$message.info('已取消删除')
        })
      },
    async  Assignpermissions(node){
   const{data:res}= await  this.$http.get('http://timemeetyou.com:8889/api/private/v1/rights/tree')
      if(res.meta.status!=200) return
      this.tree=res.data
      this.defaultNodes=[]
      this.getnodes(node,this.defaultNodes)
      console.log(this.defaultNodes)
      console.log(node)
      this.dialogVisible=true
      this.rolesid=node.id
  },
    async  CloseDialogRoles(){
       const node=[ ...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
       const str=node.join(',')
    const{data:res}  =await this.$http.post(`http://timemeetyou.com:8889/api/private/v1/roles/${this.rolesid}/rights`,{rids:str})
    if(res.meta.status!=200) return this.$message.info('更新失败')
    this.getroles()
    console.log(res)
    this.dialogVisible=false
    this.$message.success('更新成功')
          
      },
     
      getnodes(node,arr){
         if(!node.children){
             return arr.push(node.id)
         }
        node.children.forEach(element =>this.getnodes(element,arr));
      }
  },
  

}
</script>

<style  scoped>
.el-card{
    margin-top: 20px;
}
.el-tag{
    margin: 4px;
}
.row{
    border-bottom: 1px solid #eee;
}
.rows{
    display: flex;
    align-items: center;
}
.toprow{
    border-top:  1px solid #eee;
}

</style>
