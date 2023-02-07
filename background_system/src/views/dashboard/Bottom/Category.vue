<template>
  <div>
    <el-card>
      <div slot="header" class="header-card">
        <span>销售额类别占比</span>
        <!--下拉框-->
        <el-radio-group
          style="-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;"
          v-model="radio" size="small">
          <el-radio-button label="allway">全部渠道</el-radio-button>
          <el-radio-button label="online">线上</el-radio-button>
          <el-radio-button label="store">门店</el-radio-button>
        </el-radio-group>
      </div>
      <!--饼状图-->
      <div class="pie-chart" ref="pie-chart"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts"

export default {
  name: "Category",
  components: {},
  data () {
    return {
      radio: 'allway',
      pieChart: {},
    }
  },
  methods: {
    resize () {
      this.pieChart.resize()
    }
  },
  mounted () {
    this.pieChart = echarts.init(this.$refs['pie-chart'])
    this.pieChart.setOption({
      title: {
        text: '视频',
        subtext: 1048,
        left: 'center',
        top: 'center',
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'outside',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: [
            {value: 1048, name: 'Search Engine'},
            {value: 735, name: 'Direct'},
            {value: 580, name: 'Email'},
            {value: 484, name: 'Union Ads'},
            {value: 300, name: 'Video Ads'}
          ]
        }
      ]
    })
    //绑定鼠标移动事件  获取指定的数据
    this.pieChart.on('mouseover', (params) => {
      const {name, value} = params
      this.pieChart.setOption({
        title: {
          text: name,
          subtext: value
        }
      })
    })
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy () {
    window.removeEventListener("resize", this.resize)
  }
}
</script>

<style scoped>
.header-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pie-chart {
  width: 100%;
  height: 350px;
}
</style>
