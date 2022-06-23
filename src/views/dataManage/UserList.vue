<template>
  <div class="fillcontain">
    <HeadTop />
    <div class="table_container">
      <el-table
        :data="tableData"
        stripe
        height="800px"
        highlight-current-row
        :header-cell-style="{ 'background-color': '#EEF1F6' }"
        style="width: 100%; border: 1px solid #ebeef5"
      >
        <el-table-column prop="index" label="#" width="180" type="index">
        </el-table-column>
        <el-table-column prop="registe_time" label="注册日期" sortable>
        </el-table-column>
        <el-table-column prop="username" label="用户姓名"> </el-table-column>
        <el-table-column prop="city" label="注册地址"> </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="limit"
        layout="prev, pager, next, jumper"
        :total="userCount"
        class="pagination"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "UserList",
  data() {
    return {
      tableData: [],
      //获取数据数量（默认20）
      limit: 20,
      //跳过数据条数 默认 0
      offset: 0,
      //当前页 默认 1
      currentPage: 1,
    };
  },
  components: {},
  mounted() {
    this.getUserList();
    this.getUserCount();
  },
  computed: {
    ...mapState(["userList", "userCount"]),
  },
  methods: {
    //获取用户总数量
    async getUserCount() {
      await this.$store.dispatch("getUserCount");
    },
    async getUserList() {
      try {
        const { limit, offset } = this;
        //把之前的页面数据先清空,不然后面页数的数据后加在这个数组后面导致无法显示
        this.tableData = [];
        await this.$store.dispatch("getUserList", { offset, limit });
        this.userList.forEach((element) => {
          const userInfo = {};
          userInfo.registe_time = element.registe_time;
          userInfo.username = element.username;
          userInfo.city = element.city;
          this.tableData.push(userInfo);
        });
      } catch (error) {}
    },

    //分页器
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getUserList();
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