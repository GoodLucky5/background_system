<template>
  <div class="line-charts" ref="histogram"></div>
</template>

<script>
import * as echarts from "echarts"

export default {
  name: "Histogram",
  data () {
    return {
      lineChart: {}
    }
  },
  methods: {
    resize () {
      this.lineChart.resize()
    }
  },
  mounted () {
    //初始化echarts实例
    this.lineChart = echarts.init(this.$refs.histogram)
    //配置数据
    this.lineChart.setOption({
      //x轴
      xAxis: {
        show: false,
        type: 'category'
      },
      //y轴
      yAxis: {
        show: false
      },
      //系列
      series: [
        {
          smooth: true,
          type: "bar",
          data: [10, 8, 33, 13, 53, 29, 19, 44, 45, 80, 23, 45],
          color: "#84adea"
        }
      ],
      //布局调试
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      tooltip: {}
    })
    window.addEventListener("resize", this.resize)
  },
  beforeDestroy () {
    window.removeEventListener("resize", this.resize)
  }
}
</script>

<style scoped>
.line-charts {
  width: 100%;
  height: 100%;
}
</style>
