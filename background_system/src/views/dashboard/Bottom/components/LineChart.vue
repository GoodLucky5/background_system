<template>
  <div>
    <div class="header">
      <!--标题-->
      <span class="header-title">搜索用户数</span>
      <!--info图表-->
      <svg t="1662343162256" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
           p-id="3120" width="20" height="20">
        <path
          d="M512 958.016C266.08 958.016 65.984 757.952 65.984 512 65.984 266.08 266.08 65.984 512 65.984c245.952 0 446.016 200.064 446.016 446.016C958.016 757.952 757.952 958.016 512 958.016zM512 129.984C301.344 129.984 129.984 301.344 129.984 512c0 210.624 171.36 382.016 382.016 382.016 210.624 0 382.016-171.36 382.016-382.016C894.016 301.344 722.624 129.984 512 129.984z"
          p-id="3121" fill="#d9d9d9"></path>
        <path d="M512 304m-48 0a1.5 1.5 0 1 0 96 0 1.5 1.5 0 1 0-96 0Z" p-id="3122" fill="#d9d9d9"></path>
        <path
          d="M512 768c-17.664 0-32-14.304-32-32l0-288c0-17.664 14.336-32 32-32s32 14.336 32 32l0 288C544 753.696 529.664 768 512 768z"
          p-id="3123" fill="#d9d9d9"></path>
      </svg>
    </div>
    <div class="article">
      <span class="article-title">12321</span>
      <span>
        <span class="article-value">17.1</span>
        <svg t="1662344719905" class="icon" viewBox="0 0 1024 1024"
             version="1.1"
             xmlns="http://www.w3.org/2000/svg" p-id="4209"
             width="16" height="16">
                <path d="M960 704L512 256l-448 448z" fill="#d81e06" p-id="4210"></path>
              </svg>
        <svg t="1662344904899" class="icon" viewBox="0 0 1024 1024" version="1.1"
             xmlns="http://www.w3.org/2000/svg" p-id="5237" width="16" height="16">
                <path d="M941.808046 195.931415 512 828.068585 82.191954 195.931415Z" p-id="5238" fill="#1296db"></path>
              </svg>
      </span>
    </div>
    <!--图表区域-->
    <div class="footer">
      <div class="charts" ref="line-chart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

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
    this.lineChart = echarts.init(this.$refs['line-chart'])
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
            color: '#269545',
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
                  offset: 0, color: '#269545',
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

<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  
  .header-title {
    margin-right: 20px;
    color: #777;
  }
  
}

.article {
  margin: 10px 0;
  
  .article-title {
    margin-right: 30px;
  }
  
  .article-value {
    margin-right: 20px;
  }
}

.footer {
  height: 100px;
  
  .charts {
    width: 100%;
    height: 100%;
  }
}
</style>
