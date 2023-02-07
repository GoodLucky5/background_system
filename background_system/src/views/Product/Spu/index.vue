<template>
  <div>
    <el-card style="margin: 2px 0">
      <!--三级联动全局组件-->
      <CategorySelect :showTable="scene!==0" @getCategoryId="getCategoryId"/>
    </el-card>
    <!--底部具有三个模块进行切换-->
    <el-card>
      <!--展示sku列表结构-->
      <div v-show="scene === 0">
        <el-button
          @click="addSpu" icon="el-icon-plus" :disabled="!category3Id" type="primary" style="margin: 10px;">
          添加SPU
        </el-button>
        <el-table style="width: 100%;" border :data="records">
          <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
          <el-table-column prop="spuName" label="Spu名称" width="width"></el-table-column>
          <el-table-column prop="description" label="Spu描述" width="width"></el-table-column>
          <el-table-column label="操作" width="width">
            <template v-slot="{row,$index}">
              <!--hintbutton-->
              <!--添加-->
              <HintButton @click="addSku(row)" type="success" icon="el-icon-plus" size="mini" title="添加sku"/>
              <!--编辑按钮-->
              <HintButton @click="updateSpu(row)" type="warning" icon="el-icon-edit" size="mini" title="编辑spu"/>
              <!--详细-->
              <HintButton @click="showDialogTable(row)" type="info" icon="el-icon-info" size="mini" title="详细"/>
              <!--删除按钮-气泡确认框-->
              <el-popconfirm title="确认删除？" @onConfirm="deleteSpu(row)">
                <HintButton slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除spu"/>
              </el-popconfirm>
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
          @current-change="changePage"
          @size-change="changePagesize"
          style="text-align: center;"/>
      </div>
      <!--添加或修改spu-->
      <!--spu-->
      <spu-form v-show="scene === 1" @changeScene="changeScene" ref="spu"/>
      <!--sku-->
      <sku-form v-show="scene === 2" @changeScenes="changeScenes" ref="sku"/>
    </el-card>
    <!--详细列表的对话框-->
    <el-dialog :title="`${spu.spuName} 的列表`" :visible.sync="dialogTable" :before-close="beforeClose">
      <!--展示sku列表-->
      <el-table :data="skuList" v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
        <el-table-column prop="price" label="价格" width="width"></el-table-column>
        <el-table-column prop="weight" label="重量" width="width"></el-table-column>
        <el-table-column label="默认图片" width="width">
          <template v-slot="{row,$index}">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" alt="!">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from '@/views/Product/Spu/SpuForm'
import SkuForm from '@/views/Product/Spu/SkuForm'

export default {
  name: "Spu",
  components: {SkuForm, SpuForm},
  data () {
    return {
      loading: true,//加载效果
      dialogTable: false,//sku详细对话框显示
      showTable: true,//控制table隐藏显示
      category1Id: '',
      category2Id: '',
      category3Id: '',
      total: 0,//总条数
      page: 1,//当前第几页
      limit: 3,//每一页需要展示的数据
      records: [],//存储spu列表数据
      scene: 0,//0 代表展示spu列表 1修改 2添加
      spu: [],//存储查看详细列表的spu
      skuList: [],//存储详细列表的skuList
    }
  },
  methods: {
    //对话框关闭前的回调
    beforeClose (done) {
      this.loading = true
      //清除sku列表的数据
      this.skuList = []
      done()
    },
    //展示对话框
    async showDialogTable (spu) {
      this.dialogTable = true
      this.loading = true//加载ing
      //保存spu的信息
      this.spu = spu
      //发送请求获取sku列表的数据
      const res = await this.$api.sku.reqDetailSkuFormList(spu.id)
      console.log(res)
      if (res.code === 200) {
        this.skuList = res.data
        this.loading = false//加载结束
      } else {
        this.$message.info('网络错误')
      }
    },
    //skuform切换场景
    changeScenes (scene) {
      this.scene = scene
    },
    //添加sku按钮的回调
    addSku (spu) {
      this.scene = 2;
      //将父组件的1id和2id传给子组件
      this.$refs.sku.initSkuData({
        category1Id: this.category1Id,
        category2Id: this.category2Id,
        spu
      })
    },
    //删除spu
    async deleteSpu (row) {
      //删除spu请求
      try {
        await this.$api.spu.reqDeleteSpu(row.id);
        this.getSpuList(this.records.length > 1 ?this.page :this.page - 1);
        this.$message.success('删除成功');
      } catch (e) {
        console.error(e.response.status)
      }
    },
    //三级联动的自定义事件
    getCategoryId ({categoryId, level}) {
      if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = '';
        this.category3Id = '';
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = '';
      } else {
        this.category3Id = categoryId;
        //获取sku列表
        this.getSpuList();
      }
    },
    //获取sku列表
    async getSpuList () {
      const {page, limit} = this;
      //参数：page，limit，三级分类id
      const res = await this.$api.spu.reqSpuList(page, limit, this.category3Id);
      if (res.code === 200) {
        //获取到sku列表数据
        this.records = res.data.records;
        this.total = res.data.total;
      }
    },
    //分页器按钮的回调
    changePage (page) {
      this.page = page;
      this.getSpuList()
    },
    //展示数据变化
    changePagesize (limit) {
      this.limit = limit;
      this.getSpuList()
    },
    //添加SPU按钮回调
    addSpu () {
      //切换场景
      this.scene = 1;
      //通知子组件发请求获取全部销售属性，品牌属性
      this.$refs.spu.reqAllAttrAndBrand(this.category3Id);
    },
    //更新SPU按钮回调
    updateSpu (row) {
      const type = 'save';
      this.scene = 1;
      //获取子组件spuform
      //调用子组件的方法,并传递数据
      this.$refs.spu.initSpuData(row);
    },
    //取消操作
    changeScene ({scene, flag}) {
      this.scene = scene;
      //修改模式
      if (flag === 'modify') {
        this.getSpuList(this.page);
      }
      //添加模式
      else {
        this.getSpuList();
      }
    }
  },
}
</script>

<style scoped>

</style>
