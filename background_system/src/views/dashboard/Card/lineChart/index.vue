<template>
  <div class="line-charts" ref="line-charts"></div>
</template>

<script>
import * as echarts from "echarts"

export default {
  name: "LineChart",
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
    this.lineChart = echarts.init(this.$refs['line-charts'])
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
          type: "line",
          data: [10, 8, 33, 13, 53, 29, 19, 44],
          //拐点样式设置
          itemStyle: {
            opacity: 0
          },
          //线条样式
          lineStyle: {
            color: 'purple',
          },
          //填充颜色
          areaStyle: {
            color: {
              //渐变色
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0, color: 'purple',
                },
                {
                  offset: 1, color: '#fff'
                }
              ],
              global: false,
            },
          }
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
