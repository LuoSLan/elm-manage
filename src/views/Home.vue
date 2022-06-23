<template>
  <div class="home">
    <HeadTop />
    <section class="data_section">
      <header class="section_header">统计数据</header>
      <el-row style="margin: 15px 0">
        <el-col :span="6">
          <div class="data_list today_head"><span>当日数据：</span></div>
        </el-col>
        <el-col :span="6">
          <div class="data_list">
            <span class="data_num">{{ userDayCount }}</span
            >新增用户
          </div>
        </el-col>
        <el-col :span="6">
          <div class="data_list">
            <span class="data_num">{{ orderDayCount }}</span
            >新增订单
          </div>
        </el-col>
        <el-col :span="6">
          <div class="data_list">
            <span class="data_num">{{ adminDayCount }}</span
            >新增管理员
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="data_list all_head"><span>总数据：</span></div>
        </el-col>
        <el-col :span="6">
          <div class="data_list">
            <span class="data_num">{{ userCount }}</span
            >注册用户
          </div>
        </el-col>
        <el-col :span="6">
          <div class="data_list">
            <span class="data_num">{{ orderCount }}</span
            >订单
          </div>
        </el-col>
        <el-col :span="6">
          <div class="data_list">
            <span class="data_num">{{ adminCount }}</span
            >管理员
          </div>
        </el-col>
      </el-row>
    </section>
    <Tendency :sevenData="sevenData" :sevenDay="sevenDay" />
  </div>
</template>

<script>
// @ is an alias to /src
import time from "time-formater";
import {
  reqUserCount,
  reqUserCountByDate,
  reqOrderCount,
  reqOrderCountByDate,
  reqAdminCount,
  reqAdminCountByDate,
} from "network/getData";
import Tendency from "components/Tendency";
export default {
  name: "Home",
  components: { Tendency },
  data() {
    return {
      userCount: null,
      userDayCount: null,
      orderCount: null,
      orderDayCount: null,
      adminCount: null,
      adminDayCount: null,
      tendencyData: {},
      sevenDay: [],
      sevenData: [[], [], []], //0：新增用户、1：新增订单、2：新增管理员
    };
  },
  computed: {},
  mounted() {
    this.initDate();
    this.getSevenDay();
    this.getSevenData();
  },
  methods: {
    initDate() {
      const today = time().format("YYYY-MM-DD");
      // console.log(today);
      Promise.all([
        reqUserCount(),
        reqUserCountByDate(today),
        reqOrderCount(),
        reqOrderCountByDate(today),
        reqAdminCount(),
        reqAdminCountByDate(today),
      ]).then((result) => {
        this.userCount = result[0].count;
        this.userDayCount = result[1].count;
        this.orderCount = result[2].count;
        this.orderDayCount = result[3].count;
        this.adminCount = result[4].count;
        this.adminDayCount = result[5].count;
        this.$bus.$emit("adminCount", result[4].count);
      });
    },
    getSevenDay() {
      for (let i = 6; i > -1; i--) {
        const date = time(new Date().getTime() - 86400000 * i).format(
          "YYYY-MM-DD"
        );
        // console.log(date);
        this.sevenDay.push(date);
      }
    },
    getSevenData() {
      this.sevenDay.forEach((element) => {
        Promise.all([
          reqUserCountByDate(element),
          reqOrderCountByDate(element),
          reqAdminCountByDate(element),
        ]).then((result) => {
          // console.log(result);

          this.sevenData[0].push(result[0].count);
          this.sevenData[1].push(result[1].count);
          this.sevenData[2].push(result[2].count);
        });
      });
    },
  },
};
</script>


<style scoped>
.section_header {
  margin-bottom: 10px;
  font-size: 30px;
  text-align: center;
}
.data_list {
  width: 300px;
  height: 40px;
  border-radius: 10px;
  text-align: center;
  margin: auto;
  background-color: #d9ecff;
  font-size: 16px;
  color: #666;
  /* padding: 0 10px; */
}
.today_head,
.all_head {
  background-color: #409eff;
  font-size: 22px;
  color: #fff;
  line-height: 40px;
}

.data_num {
  padding-right: 10px;
  font-size: 26px;
  color: #333;
}
</style>
