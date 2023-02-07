<template>
  <div>
    <!--sku表单-->
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        <h1>{{ spu.spuName }}</h1>
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="sku name" v-model.trim="skuInfo.skuName"/>
      </el-form-item>
      <el-form-item label="价格/元">
        <el-input placeholder="price" type="number" v-model.trim="skuInfo.price"/>
      </el-form-item>
      <el-form-item label="重量/千克">
        <el-input placeholder="weight" v-model.trim="skuInfo.weight"/>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" placeholder="description" v-model.trim="skuInfo.skuDesc" rows="5"/>
      </el-form-item>
      <el-form-item label="平台属性">
        <!--行内form :inline="true"-->
        <el-form :inline="true">
          <el-form-item :label="attr.attrName" v-for="(attr,index) in attrInfoList" :keu="attr.id">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <!--收集属性id和属性值id-->
              <el-option
                :label="value.valueName"
                v-for="(value,index) in attr.attrValueList" :key="value.id"
                :value="`${attr.id}-${value.id}`"/>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <!--行内form :inline="true"-->
        <el-form :inline="true">
          <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr,index) in spuSaleAttrList" :key="saleAttr.id">
            <!--收集属性id和属性值id-->
            <el-select v-model="saleAttr.saleattrIdAndValueId" placeholder="请选择">
              <el-option
                :label="value.saleAttrValueName"
                v-for="(value,index) in saleAttr.spuSaleAttrValueList" :key="value.id"
                :value="`${saleAttr.id}-${value.id}`"/>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <!--展示图片
          @selection-change 单选框勾选的事件 注入了selection的参数
        -->
        <el-table
          border style="width: 100%;"
          :data="spuImageList"
          @selection-change="handleSelectionChange">
          <el-table-column prop="prop" label="label" align="center" type="selection" width="80"></el-table-column>
          <el-table-column prop="prop" label="图片" width="width" align="center">
            <!--作用域插槽接收数据-->
            <template v-slot="{row,$index}">
              <img :src="row.imgUrl" style="width: 100px;height: 100px;" alt="!">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width" align="center">
            <template v-slot="{row,$index}">
              <el-button v-if="row.isDefault === 0" @click="changeDefault(row)" size="small" type="primary">
                设为默认
              </el-button>
              <el-button v-else size="small">默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSave">OK</el-button>
        <el-button @click="cancelHandling">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data () {
    return {
      spuImageList: [],//图片信息
      spuSaleAttrList: [],//销售属性
      attrInfoList: [],//平台数据
      skuInfo: {
        /*第一类数据，通过父组件获取*/
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        /*第二类数据，通过双向绑定获取*/
        price: 0,
        skuName: "",
        weight: "",
        skuDesc: "",
        /*第三类数据，通过代码收集*/
        //平台属性
        skuAttrValueList: [
          /*{
            attrId: 0,//平台属性id
            attrName: "",
            id: 0,
            skuId: 0,
            valueId: 0,//平台属性值id
            valueName: ""
          }*/
        ],
        //默认图片
        skuDefaultImg: "",
        //收集图片信息
        skuImageList: [
          /*{
            id: 0,
            imgName: "",
            imgUrl: "",
            isDefault: "",
            skuId: 0,
            spuImgId: 0
          }*/
        ],
        //sku销售属性
        skuSaleAttrValueList: [
          /*{
            id: 0,
            saleAttrId: 0,
            saleAttrName: "",
            saleAttrValueId: 0,
            saleAttrValueName: "",
            skuId: 0,
            spuId: 0
          }*/
        ],
      },
      spu: {},//存储spu
      imageList: [],//复制一份图片数据以便上传服务器，给信息添加isDefault字段
    }
  },
  methods: {
    //保存操作
    async handleSave () {
      //整理参数-平台属性
      const {attrInfoList, skuInfo, spuSaleAttrList, imageList} = this
      /*方式一*/
      /*let arr = []
      // 将收集到的数据进行整理
      attrInfoList.forEach(item => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split('-')
          const obj = {attrId, valueId}
          arr.push(obj)
        }
      })
      skuInfo.skuAttrValueList = arr*/
      /*方式二*/
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split('-')
          prev.push({attrId, valueId})
        }
        return prev
      }, [])
      //整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.saleattrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.saleattrIdAndValueId.split('-')
          prev.push({saleAttrId, saleAttrValueId})
        }
        return prev
      }, [])
      //整理图片的数据-整理选中的图片
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImageId: item.id
        }
      })
      /*发请求*/
      try {
        const res = await this.$api.sku.reqAddSku(skuInfo)
        if (res.code === 200) {
          this.$message.success('保存成功')
          //切换场景
          this.$emit('changeScenes', 0)
        }
      } catch (e) {
        e && this.$message.info('请完善信息')
      }
    },
    //默认图片切换
    changeDefault (row) {
      //排他
      this.spuImageList.forEach(item => item.isDefault = 0)
      row.isDefault = 1
      //设置默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    //单选框勾选事件
    handleSelectionChange (selection) {
      this.imageList = selection
    },
    //取消操作
    cancelHandling () {
      this.$emit('changeScenes', 0)
      Object.assign(this._data, this.$options.data())
    },
    //数据初始化
    async initSkuData ({category1Id, category2Id, spu}) {
      const {category3Id, id, tmId} = spu;
      this.skuInfo.category3Id = category3Id;
      this.skuInfo.spuId = id;
      this.skuInfo.tmId = tmId;
      this.spu = spu;
      //获取图片数据
      const res = await this.$api.sku.reqSpuImageList(spu.id);
      //获取销售属性
      const attrres = await this.$api.sku.reqSpuSaleAttrList(spu.id);
      //获取平台属性数据
      const platformres = await this.$api.sku.reqAttrInfoList({
        category1Id,
        category2Id,
        category3Id: spu.category3Id
      })
      //判定
      if ([res.code, attrres.code, platformres.code].every(c => c === 200)) {
        //数据初始化
        /*图片信息预处理，添加isDefault字段，判断图片是否为默认*/
        const list = res.data;
        list.forEach(item => item.isDefault = 0)
        this.spuImageList = list;
        this.spuSaleAttrList = attrres.data;
        this.attrInfoList = platformres.data;
      } else {
        this.$message.error('网络错误');
      }
    }
  }
}
</script>

<style scoped>

</style>
