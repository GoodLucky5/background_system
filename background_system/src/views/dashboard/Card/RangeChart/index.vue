<template>
  <div class="line-charts" ref="range-charts"></div>
</template>

<script>
import * as echarts from "echarts"

export default {
  name: "RangeChart",
  data () {
    return {
      lineChart: {}
    }
  },
  methods: {
    resize () {
      this.lineChart.resize();
    }
  },
  mounted () {
    //初始化echarts实例
    this.lineChart = echarts.init(this.$refs['range-charts'])
    //配置数据
    this.lineChart.setOption({
      //x轴
      xAxis: {
        show: false,
        //最大值最小值设置
        min: 0,
        max: 100,
      },
      //y轴
      yAxis: {
        show: false,
        type: 'category',
      },
      //系列
      series: [
        {
          color: '#f8c327',
          smooth: true,
          type: "bar",
          data: [78],
          barWidth: '25',//柱状图宽度设置
          showBackground: true,
          backgroundStyle: {
            color: '#eee'
          },
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
