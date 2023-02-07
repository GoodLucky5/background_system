<template>
  <div>
    <!--表格-->
    <el-table :data="records" border>
      <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
      <el-table-column label="名称" prop="skuName" width="width"></el-table-column>
      <el-table-column label="描述" prop="skuDesc" width="width"></el-table-column>
      <el-table-column label="默认图片" width="110px">
        <template v-slot="{row,$index}">
          <img :src="row.skuDefaultImg" style="width: 80px;height: 80px;" alt="">
        </template>
      </el-table-column>
      <el-table-column label="重量/KG" prop="weight" width="80"></el-table-column>
      <el-table-column label="价格" prop="price" width="80"></el-table-column>
      <el-table-column label="操作" prop="" width="width">
        <template v-slot="{row,$index}">
          <hint-button v-if="row.isSale != 0" @click="handleSoldout(row)" size="mini" type="success" title="下架"
                       icon="el-icon-sort-down"/>
          <hint-button v-else @click="handleOnSale(row)" size="mini" type="warning" title="上架"
                       icon="el-icon-sort-up"/>
          <hint-button size="mini" type="primary" title="编辑" icon="el-icon-edit"/>
          <hint-button @click="handleViewDetails(row)" size="mini" type="info" title="查看信息" icon="el-icon-info"/>
          <hint-button size="mini" type="danger" title="删除" icon="el-icon-delete"/>
        </template>
      </el-table-column>
    </el-table>
    <!--分页器-->
    <el-pagination
      :current-page="page"
      :page-sizes="['3','6','9','12']"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @current-change="getSkuList"
      @size-change="changePagesize"
      style="text-align: center;"/>
    <!--抽屉效果        :before-close="handleClose"-->
    <el-drawer
      size="50%"
      :show-close="false"
      :visible.sync="drawer"
      :direction="direction">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuDetail.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuDetail.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuDetail.price }}元人民币</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            style="margin: 0 4px;" type="success"
            v-for="(attr,index) in skuDetail.skuAttrValueList" :key="attr.id">
            {{ attr.attrId }}-{{ attr.valueId }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel v-if="hasImage">
            <el-carousel-item v-for="item in skuDetail.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="" style="width: 100%;">
            </el-carousel-item>
          </el-carousel>
          <empty v-else content="图片"/>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>
<script>
import HintButton from '@/components/HintButton'
import Empty from '@/components/Empty'

export default {
  name: "Sku",
  components: {HintButton, Empty},
  data () {
    return {
      page: 1,
      limit: 3,
      total: 0,
      records: [
        //存储sku列表的数据
      ],
      skuDetail: {},//存储sku信息
      drawer: false,//抽屉的显示与隐藏
      direction: 'rtl',//从右到左
      hasImage: false,//查看是否拥有图片
    }
  },
  methods: {
    //查看详情
    async handleViewDetails (sku) {
      const res = await this.$api.sku.reqSkuDetails(sku.id)
      if (res.code === 200) {
        this.skuDetail = res.data
        const {skuImageList} = this.skuDetail
        this.hasImage = skuImageList.length > 0 ?true :false
        this.drawer = true
      }
    },
    //处理上架
    async handleOnSale (sku) {
      const res = await this.$api.sku.reqOnSale(sku.id)
      if (res.code === 200) {
        sku.isSale = 1
        this.$message.success('上架成功')
      }
    },
    //处理下架
    async handleSoldout (sku) {
      const res = await this.$api.sku.reqSoldOut(sku.id)
      if (res.code === 200) {
        sku.isSale = 0
        this.$message.success('下架成功')
      }
    },
    //展示数量变化的回调
    changePagesize (limit) {
      this.limit = limit
      this.getSkuList()
    },
    //获取sku数据
    async getSkuList (pages = 1) {
      this.page = pages
      const {page, limit} = this
      const res = await this.$api.sku.reqAllSkuInfo({page, limit})
      if (res.code === 200) {
        this.total = res.data.total
        this.records = res.data.records
      }
    }
  },
  beforeMount () {
    this.getSkuList()
  }
}
</script>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}

.el-col {
  margin: 10px 10px;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>
