<!--  -->
<template>
  <div class="order">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">订单管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/goods">订单列表</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="params.params.query" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orders" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="500px"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="100px"></el-table-column>
        <el-table-column label="是否付款" width="100px">
          <template v-slot="scope">
            <el-tag v-if="scope.row.order_pay==1">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="100px"></el-table-column>
        <el-table-column label="下单时间">
          <template v-slot="scope">{{scope.row.create_time| createFilters}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-tooltip class="item" effect="dark" content="修改地址" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="changeAdderess()"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="物流信息" placement="top">
              <el-button type="success" icon="el-icon-location" size="mini" @click="queryInfo()"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.params.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="params.params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog title="物流信息" :visible.sync="dialogVisibletwo" width="30%">
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in  orderinfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibletwo = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisibletwo = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改地址"
      :visible.sync="dialogVisibleone"
      width="40%"
    >
      <el-form
        :model="editForm"
        :rules="editrules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
      <el-form-item label="省市区/县" prop="firstAdress" width="100%">
        <el-cascader
          v-model="cityvalue"
          :options="datacity"
          :props="{ expandTrigger: 'hover' }"
          @change="handleChange"
         
        ></el-cascader>
      </el-form-item>
        <el-form-item label="详细地址" prop="secondAdress">
          <el-input v-model="editForm.secondAdress"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleone = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleone = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { time } from "@/common/utils.js";
import area from 'china-area-data'
export default {
  name: "order",
  data() {
    return {
      params: {
        params: {
          query: "",
          pagenum: 1,
          pagesize: 10,
        },
      },
      orders: [],
      total: 0,
      dialogVisibletwo: false,
      dialogVisibleone: false,
      orderinfo: [],
      reverse: true,
      editForm: {
        secondAdress: "",
      },
      editrules: {
        secondAdress: [{

        }],
        firstAdress:[{

        }]

      },
      datacity:area,
      cityvalue:[]
    };
  },
  created() {
    this.getordrs();
  },
  methods: {
    async getordrs() {
      const { data: res } = await this.$http.get(
        "http://timemeetyou.com:8889/api/private/v1/orders",
        this.params
      );
      if (res.meta.status != 200)
        return this.$message.error("订单数据加载失败");
      this.orders = res.data.goods;
      this.total = res.data.total;
      this.$message.success("订单数据加载成功");
      console.log(res);
    },
    handleSizeChange(newSize) {
      this.params.params.pagesize = newSize;
      this.getordrs();
    },
    handleCurrentChange(newPage) {
      this.params.params.pagenum = newPage;
      this.getordrs();
    },
    async queryInfo() {
      this.dialogVisibletwo = true;
      const { data: res } = await this.$http.get(
        `http://timemeetyou.com:8889/api/private/v1/kuaidi/804909574412544580`
      );
      if (res.meta.status != 200) return;
      this.orderinfo = res.data;

      console.log(res);
    },
    changeAdderess() {
        console.log(area)
      this.dialogVisibleone = true;
    },
    handleChange(){

    }
  },
  filters: {
    createFilters(value) {
      let date = new Date(value * 1000);
      return time(date, "yyyy-MM-dd hh:mm:ss");
    },
  },
};
</script>

<style  scoped>
.el-card,
.el-table,
.el-pagination {
  margin-top: 20px;
}
.el-cascader{
    width: 100%;
}
</style>
