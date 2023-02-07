<template>
  <el-card class="box-card" style="margin:10px 0 ;">
    <div slot="header" class="clearfix">
      <!--左侧内容-->
      <el-tabs v-model="activeName" class="tab">
        <el-tab-pane label="销售额" name="xsa"></el-tab-pane>
        <el-tab-pane label="访问量" name="fwl"></el-tab-pane>
      </el-tabs>
      <!--右侧内容-->
      <div class="right-section">
        <span @click="setTime($event)" v-for="(a,index) in title_" :key="index">{{ a }}</span>
        <el-date-picker
          size="small"
          class="date-picker"
          v-model="dateValue"
          type="daterange"
          range-separator="-"
          value-format="yyyy-MM-dd"
          start-placeholder="start"
          end-placeholder="end">
        </el-date-picker>
      </div>
    </div>
    <!--内容部分-->
    <div class="content">
      <el-row :gutter="10">
        <!--左侧柱状图表-->
        <el-col :span="18" class="left-part">
          <div class="histogram-container" ref="bar"></div>
        </el-col>
        <!---->
        <el-col :span="6" class="right-part">
          <h3>门店{{ title }}排名</h3>
          <ul class="rank-list">
            <li v-for="(attr,index) in rankList" :key="index">
              <span :class="index < 3 ?n3 :void 0" class="rindex">{{ index + 1 }}</span>
              <span class="name">{{ attr.name }}</span>
              <span class="rate">{{ attr.rvalue }}</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as ECharts from 'echarts'
import dayjs from 'dayjs'
import { mapState } from 'vuex'

export default {
  name: "SalePart",
  data () {
    return {
      activeName: "xsa",
      title_: ['今日', '本周', '本月', '本年'],
      dateValue: '',
      rankList: [
        {name: '肯德基', rvalue: '￥951104'},
        {name: '必胜客', rvalue: '￥932874'},
        {name: '麦当劳', rvalue: '￥851104'},
        {name: '正新鸡排', rvalue: '￥841104'},
        {name: '唐老鸭', rvalue: '￥821104'},
        {name: '迪士尼', rvalue: '￥821004'},
        {name: '永和豆浆', rvalue: '￥811104'},
        {name: '沙县小吃', rvalue: '￥771104'}
      ],
      n3: 'n3',
      echarts: null,
    }
  },
  computed: {
    title () {
      return this.activeName === 'xsa' ?'销售额' :'访问量'
    },
    //获取图表数据
    ...mapState({
      data: state => state.home.data
    })
  },
  watch: {
    title: {
      handler () {
        this.setData()
      }
    },
    data () {
      this.setData()
    }
  },
  methods: {
    setData () {
      const {data} = this
      //修改title
      this.echarts.setOption({
        title: {
          text: `${ this.activeName === 'xsa' ?'销售额' :'访问量' }趋势`,
        },
        xAxis: {
          data: this.title === '销售额'
            ?data.orderFullYearAxis
            :data.userFullYearAxis
        },
        series: [
          {
            color: this.title === '销售额' ?'#e53d30' :'#e50',
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: this.title === '销售额'
              ?data.orderFullYear
              :data.userFullYear
          }
        ]
      })
    },
    //本年，本月，本日，本周···
    setTime ({target: {innerText}}) {
      //获取本日
      const day = dayjs().format('YYYY-MM-DD')
      switch (innerText) {
        case '本周':
          const wst = dayjs().day(1).format('YYYY-MM-DD')
          const wed = dayjs().day(7).format('YYYY-MM-DD')
          this.dateValue = [wst, wed]
          break
        case '本月':
          const mst = dayjs().startOf('month').format('YYYY-MM-DD')
          const med = dayjs().endOf('month').format('YYYY-MM-DD')
          this.dateValue = [mst, med]
          break
        case '今日':
          const day = dayjs().format('YYYY-MM-DD')
          this.dateValue = [day, day]
          break
        case '本年':
          const yst = dayjs().startOf('year').format('YYYY-MM-DD')
          const yed = dayjs().endOf('year').format('YYYY-MM-DD')
          this.dateValue = [yst, yed]
          break
      }
    },
    //点击事件
    initCharts () {
      //柱状图初始化
      this.echarts = ECharts.init(this.$refs.bar)
      this.echarts.setOption({
        title: {
          text: `${ this.activeName === 'xsa' ?'销售额' :'访问量' }趋势`,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            color: '#e53d30',
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: []
          }
        ]
      })
    }
  },
  mounted () {
    this.initCharts()
  }
}
</script>

<style lang="less">
/*.clearfix:before,*/
/*.clearfix:after {*/
/*  display: table;*/
/*  content: "";*/
/*}*/

/*.clearfix:after {*/
/*  clear: both*/
/*}*/
ul {
  list-style-type: none;
}

ul.rank-list {
  width: 100%;
  height: 300px;
  padding: 0;
  overflow: auto;
  
  li {
    padding: 0 4px;
    margin: 6px 0;
    
    .rindex {
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-right: 5px;
      line-height: 20px;
      text-align: center;
      border-radius: 50%;
      background-color: #eee;
      color: #444;
    }
    
    .rate {
      float: right;
    }
  }
}

.n3 {
  background-color: #444 !important;
  color: #eee !important;
}

.clearfix {
  display: flex;
  justify-content: space-between;
}

.tab {
  width: 100%;
}


.box-card {
  position: relative;
  
  .el-card__header {
    border-bottom: none;
  }
}

.right-section {
  position: absolute;
  top: 15px;
  right: 20px;
  
  span {
    cursor: pointer;
    display: inline-block;
    width: 52px;
    height: 32px;
    border-radius: 4px;
    margin: 0 2px;
    text-align: center;
    line-height: 32px;
    
    &:hover {
      color: #111;
      background-color: #eee;
    }
  }
}

.date-picker {
  width: 250px !important;
}

.histogram-container {
  width: 100%;
  height: 300px;
}

.right-part {
  height: 300px;
  padding: 0;
  margin: 0;
}
</style>
