<template>
  <div>
    <el-card>
      <div slot="header" class="header-card">
        <span>线上热门搜索</span>
        <!--下拉框-->
        <el-dropdown>
          <i class="el-icon-more el-dropdown-link"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item disabled>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!--折线图和表格-->
      <div class="charts">
        <el-row :gutter="10">
          <el-col :span="12">
            <line-chart/>
          </el-col>
          <el-col :span="12">
            <line-chart/>
          </el-col>
        </el-row>
        <el-table
          border
          :data="tableData"
          style="width: 100%;margin-top: 15px;"
          :default-sort="{prop: 'date', order: 'descending'}">
          <el-table-column type="index" label="排名" align="center" width="80"></el-table-column>
          <el-table-column prop="name" label="搜索关键字" width="180"></el-table-column>
          <el-table-column prop="address" label="用户数" sortable :formatter="formatter"></el-table-column>
          <el-table-column prop="address" label="周涨幅" sortable :formatter="formatter"></el-table-column>
        </el-table>
        <!--分页器-->
        <el-pagination
          align="right"
          layout="prev, pager, next"
          :total="1000">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import LineChart from '@/views/dashboard/Bottom/components/LineChart'

export default {
  name: "Search",
  components: {LineChart},
  data () {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }]
    }
  },
  methods: {
    formatter (row, column) {
      return row.address;
    }
  }
}
</script>

<style scoped>
.header-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-icon-arrow-down {
  font-size: 12px;
}
</style>
