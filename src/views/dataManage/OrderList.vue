<template>
  <div class="fillcontain">
    <HeadTop />
    <div class="table_container">
      <el-table
        :data="tableData"
        @expand-change="expandChange"
        :expand-row-keys="expendRowKey"
        :row-key="(row) => row.index"
        stripe
        height="800px"
        class="demo-table"
        :header-cell-style="{ 'background-color': '#EEF1F6' }"
      >
        <el-table-column width="100" type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="用户名">
                <span>{{ props.row.user_name }}</span>
              </el-form-item>
              <el-form-item label="店铺名称">
                <span>{{ props.row.restaurant_name }}</span>
              </el-form-item>
              <el-form-item label="收货地址">
                <span>{{ props.row.user_address }}</span>
              </el-form-item>
              <el-form-item label="店铺 ID">
                <span>{{ props.row.restaurant_id }}</span>
              </el-form-item>
              <el-form-item label="店铺地址">
                <span>{{ props.row.restaurant_address }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="订单ID" sortable> </el-table-column>
        <el-table-column prop="total_amount" label="总价格"> </el-table-column>
        <el-table-column prop="title" label="订单状态"> </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="limit"
        layout="prev, pager, next, jumper"
        :total="orderCount"
        class="pagination"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  reqOrderCount,
  reqOrderList,
  reqRestaurantsDetail,
  reqAddressById,
  reqUserInfoById,
} from "network/getData";

export default {
  name: "OrderList",
  data() {
    return {
      tableData: [
        {
          //该对象为示例，下面会清空
          id: "0001",
          total_amount: "100",
          title: "支付超时",
          restaurant_name: "肯德基",
          restaurant_id: "1",
          restaurant_address: "广东省广州市越秀区中山五路219号华联购物中心F1",
          user_address: "这是收货地址",
          user_name: "这是用户名",
          user_id: null,
          address_id: "这是地址id",
          index: "这是标示当前是第几条数据",
          imageUrl: "",
        },
      ],
      //获取数据数量（默认20）
      limit: 20,
      //跳过数据条数 默认 0
      offset: 0,
      //当前页 默认 1
      currentPage: 1,
      //订单总数
      orderCount: null,
      //用户id
      user_id: null,
      expendRowKey: [],
    };
  },
  mounted() {
    this.getOrderCount();
  },
  methods: {
    //获取订单总数
    async getOrderCount() {
      try {
        let result = await reqOrderCount();
        this.orderCount = result.count;
        this.getOrderList();
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message,
        });
      }
    },
    //获取订单列表
    async getOrderList() {
      try {
        const { limit, offset } = this;
        let result = await reqOrderList({ limit, offset });
        // console.log(result);
        this.tableData = [];
        result.forEach((element, index) => {
          const orderInfo = {};
          orderInfo.id = element.id;
          orderInfo.total_amount = element.total_amount;
          orderInfo.title = element.status_bar.title;
          orderInfo.restaurant_name = element.restaurant_name;
          orderInfo.restaurant_id = element.restaurant_id;
          orderInfo.user_id = element.user_id;
          orderInfo.address_id = element.address_id;
          orderInfo.index = index;
          this.tableData.push(orderInfo);
        });
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message,
        });
      }
    },

    async expandChange(row, expendRow) {
      //先判断当前点击的行是否已经展开
      //在expendRowKey中查找是否已经存在点击行的index
      if (this.expendRowKey.indexOf(row.index) != -1) {
        //若结果!= -1 ，说明能找到，即之前已经展开，此时再次点击应该关闭
        //所以找到当前点击行的index在expendRowKey中的位置并删除
        const index = this.expendRowKey.indexOf(row.index);
        this.expendRowKey.splice(index, 1);
      } else {
        //若结果为-1，说明不存在于expendRowKey当中，即之前没有展开，此时点击应该展开
        //将当前点击行的index加入到expendRowKey当中，即可展开
        // console.log(row.address_id);
        const restaurant = await reqRestaurantsDetail(row.restaurant_id);
        const address = await reqAddressById(row.address_id); //有部分数据的address_id有问题
        const userInfo = await reqUserInfoById(row.user_id);
        this.tableData.splice(row.index, 1, {
          ...row,
          restaurant_address: restaurant.address,
          user_address: address.address,
          user_name: userInfo.username,
        });
        this.$nextTick(() => {
          this.expendRowKey.push(row.index);
        });
      }
    },

    //分页器
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getOrderList();
    },
  },
};
</script>

<style lang="less" >
@import "@/style/mixin";
.table_container {
  padding: 20px;
}
.demo-table {
  width: 100%;
  border: 1px solid #ebeef5;
}

.demo-table-expand {
  padding: 20px 50px;
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
  // color: pink;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.el-table_header {
  color: pink;
  background-color: pink;
}

.pagination {
  text-align: center;
  margin-top: 20px;
}
</style>