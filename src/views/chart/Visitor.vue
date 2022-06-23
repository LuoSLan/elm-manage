<template>
  <div>
    <HeadTop />
    <VisitorPie :pieData="pieData" />
  </div>
</template>

<script>
import { reqUserCityChart } from "network/getData";
import VisitorPie from "components/VisitorPie";

export default {
  name: "Visitor",
  components: { VisitorPie },
  data() {
    return {
      pieData: {},
    };
  },
  created() {
    this.getUserCityChart();
  },
  methods: {
    async getUserCityChart() {
      let result = await reqUserCityChart();
      console.log(result);
      this.pieData = result.user_city;
    },
  },
};
</script>

<style>
</style>