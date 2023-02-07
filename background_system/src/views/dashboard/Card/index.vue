<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <detail title="总销售额" count="￥12350">
            <!--图标插槽-->
            <template #charts>
              <span>周同比&nbsp;&nbsp;56.56%<svg t="1662344719905" class="icon" viewBox="0 0 1024 1024"
                                                 version="1.1"
                                                 xmlns="http://www.w3.org/2000/svg" p-id="4209"
                                                 width="16" height="16">
                <path d="M960 704L512 256l-448 448z" fill="#d81e06" p-id="4210"></path>
              </svg></span>
              <span>日同比&nbsp;&nbsp;19.16%<svg t="1662344904899" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                                 xmlns="http://www.w3.org/2000/svg" p-id="5237" width="16" height="16">
                <path d="M941.808046 195.931415 512 828.068585 82.191954 195.931415Z" p-id="5238" fill="#1296db"></path>
              </svg></span>
            </template>
            <!--底部内容插槽-->
            <template #footer>
              <span>日销售额&nbsp;&nbsp;￥1520</span>
            </template>
          </detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <detail title="访问量" count="1000">
            <template #charts>
              <!--折线图-->
              <line-chart/>
            </template>
            <!--底部内容插槽-->
            <template #footer>
              <span>日访问量&nbsp;&nbsp;1345</span>
            </template>
          </detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <detail title="支付笔数" count="1000">
            <template #charts>
              <!--柱状图-->
              <histogram/>
            </template>
            <!--底部内容插槽-->
            <template #footer>
              <span>转换率&nbsp;&nbsp;35%</span>
            </template>
          </detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <detail title="运营活动效果" count="78%">
            <template #charts>
              <!--进度图表-->
              <range-chart/>
            </template>
            <!--图表插槽-->
            <template #footer>
              <span>周同比&nbsp;&nbsp;56.56%<svg t="1662344719905" class="icon" viewBox="0 0 1024 1024"
                                                 version="1.1"
                                                 xmlns="http://www.w3.org/2000/svg" p-id="4209"
                                                 width="16" height="16">
                <path d="M960 704L512 256l-448 448z" fill="#d81e06" p-id="4210"></path>
              </svg></span>
              <span>日同比&nbsp;&nbsp;19.16%<svg t="1662344904899" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                                 xmlns="http://www.w3.org/2000/svg" p-id="5237" width="16" height="16">
                <path d="M941.808046 195.931415 512 828.068585 82.191954 195.931415Z" p-id="5238" fill="#1296db"></path>
              </svg></span>
            </template>
          </detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from '@/views/dashboard/Card/Detail'
import lineChart from '@/views/dashboard/Card/lineChart'
import Histogram from '@/views/dashboard/Card/Histogram'
import RangeChart from '@/views/dashboard/Card/RangeChart'

export default {
  name: "Card",
  components: {Detail, lineChart, Histogram, RangeChart},
}
</script>

<style scoped>

</style>
