<template>
  <div id="visitor-pie" style="width: 90%; height: 450px"></div>
</template>

<script>
import * as echarts from "echarts/core";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { PieChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);

export default {
  name: "VisitorPie",
  props: ["pieData"],
  mounted() {
    this.myChart = echarts.init(document.getElementById("visitor-pie"));
    this.initData();
  },
  methods: {
    initData() {
      const option = {
        title: {
          text: "用户分布",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "50%",
            data: [
              { value: this.pieData.beijing, name: "北京" },
              { value: this.pieData.hangzhou, name: "杭州" },
              { value: this.pieData.shanghai, name: "上海" },
              { value: this.pieData.shenzhen, name: "深圳" },
              { value: this.pieData.qita, name: "其他" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      this.myChart.setOption(option);
    },
  },
  watch: {
    pieData: function () {
      this.initData();
    },
  },
};
</script>

<style>
#visitor-pie {
  margin-top: 20px;
  padding: 0 20px;
}
</style>