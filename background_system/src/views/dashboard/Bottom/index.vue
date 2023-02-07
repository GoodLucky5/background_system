<template>
  <div>
    <el-row :gutter="30">
      <!--搜索模块-->
      <el-col :span="12">
          <search></search>
      </el-col>
      <!--商品模块-->
      <el-col :span="12">
          <category></category>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Category from '@/views/dashboard/Bottom/Category'
import Search from '@/views/dashboard/Bottom/Search'

export default {
  name: "Bottom",
  components: {Category, Search}
}
</script>

<style scoped>

</style>
