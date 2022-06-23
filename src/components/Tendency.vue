<template>
  <div class="tendency">
    <div id="tendency" style="width: 90%; height: 500px"></div>
  </div>
</template>

<script>
import * as echarts from "echarts/core";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkPointComponent,
} from "echarts/components";
import { LineChart, BarChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  MarkPointComponent,
  BarChart,
]);

export default {
  name: "Tendency",
  props: ["sevenData", "sevenDay"],
  mounted() {
    this.myChart = echarts.init(document.getElementById("tendency"));
    this.initData();
  },
  methods: {
    initData() {
      const option = {
        title: {
          text: "走势图",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["新增用户", "新增订单", "新增管理员"],
        },
        grid: {
          left: "3%",
          right: "4%",
          top: "20%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            dataView: { readOnly: false },
            magicType: { type: ["line", "bar"] },
            restore: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.sevenDay,
        },
        yAxis: {
          type: "value",
          name: "新增数量",
          position: "left",
          axisLine: {
            lineStyle: {
              color: "#999",
            },
          },
          axisLabel: {
            formatter: "{value}",
          },
        },

        series: [
          {
            name: "新增用户",
            type: "line",
            data: this.sevenData[0],

            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" },
              ],
            },
          },
          {
            name: "新增订单",
            type: "line",
            data: this.sevenData[1],

            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" },
              ],
            },
          },
          {
            name: "新增管理员",
            type: "line",
            data: this.sevenData[2],

            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" },
              ],
            },
          },
        ],
      };
      this.myChart.setOption(option);
    },
  },
  watch: {
    sevenData: function () {
      this.initData();
    },
    sevenDay: function () {
      this.initData();
    },
  },
};
</script>

<style>
.tendency {
  display: flex;
  justify-content: center;
  margin-top: 60px;
}
</style>