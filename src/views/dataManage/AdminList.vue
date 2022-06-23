<template>
  <div class="fillcontain">
    <HeadTop />
    <div class="table_container">
      <el-table
        :data="tableData"
        stripe
        height="800px"
        :header-cell-style="{ 'background-color': '#EEF1F6' }"
        style="width: 100%; border: 1px solid #ebeef5"
      >
        <el-table-column prop="user_name" label="姓名"> </el-table-column>
        <el-table-column prop="create_time" label="注册日期"> </el-table-column>
        <el-table-column prop="city" label="地址"> </el-table-column>
        <el-table-column prop="admin" label="权限" width="180">
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="limit"
        layout="prev, pager, next, jumper"
        :total="adminCount"
        class="pagination"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { reqAdminList, reqAdminCount } from "network/getData";

export default {
  name: "AdminList",
  data() {
    return {
      tableData: [],
      //获取数据数量（默认20）
      limit: 20,
      //跳过数据条数 默认 0
      offset: 0,
      //当前页 默认 1
      currentPage: 1,
      //管理员总数
      adminCount: null,
    };
  },
  mounted() {
    // this.$bus.$on("adminCount", (count) => {
    //   this.adminCount = count;
    // });
    this.getAdminCount();
    this.getAdminList();
  },
  methods: {
    async getAdminCount() {
      try {
        let result = await reqAdminCount();
        this.adminCount = result.count;
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message,
        });
      }
    },
    //获取管理员列表
    async getAdminList() {
      try {
        const { limit, offset } = this;
        //把之前的页面数据先清空,不然后面页数的数据后加在这个数组后面导致无法显示
        this.tableData = [];
        let result = await reqAdminList(limit, offset);
        if (result.status == 1) {
          console.log(result.data);
          let adminArray = result.data;
          adminArray.forEach((element) => {
            const adminInfo = {};
            adminInfo.user_name = element.user_name;
            adminInfo.create_time = element.create_time;
            adminInfo.city = element.city;
            adminInfo.admin = element.admin;
            this.tableData.push(adminInfo);
          });
        }
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message,
        });
      }
    },

    //分页器
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getAdminList();
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/style/mixin";
.table_container {
  padding: 20px;
}

.pagination {
  text-align: center;
  margin-top: 20px;
}
</style>