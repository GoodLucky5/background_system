<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spuInfo">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spuInfo.spuName"/>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spuInfo.tmId" placeholder="请选择品牌" label-width="80px">
          <el-option :label="tm.tmName" v-for="(tm,index) in tmlist" :key="tm.id" :value="tm.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" rows="4" placeholder="SPU描述" v-model="spuInfo.description"/>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!--
            action图片上传地址
            list-type文件类型
            on-success图片上传成功回调，拥有三个参数，response有关服务器相应的信息,file上传成功的图片,filelist所有图片
            on-preview预览回调
            on-remove删除回调
            :file-list绑定含有图片name和url的数组的对象
        -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="imglist"
          :on-success="handleUploadSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <!--select选择框-->
        <el-select v-model="unselectAttr" :placeholder="`还有${unselectSaleAttr.length}项未选择`">
          <el-option :label="unselect.name" :value="`${unselect.id}-${unselect.name}`"
                     v-for="(unselect,index) in unselectSaleAttr" :key="unselect.id"/>
        </el-select>
        <el-button style="margin: 0 5px;" @click="addSaleAttr" :disabled="!unselectAttr" type="primary"
                   icon="el-icon-plus">
          添加销售属性
        </el-button>
        <!--展示的是当前spu的专属的属性-->
        <el-table style="width: 100%;" border :data="spuInfo.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
          <el-table-column label="属性名" prop="saleAttrName" width="width"></el-table-column>
          <el-table-column label="属性值名称列表" prop="prop" width="width">
            <!--row是销售属性-->
            <template v-slot="{row,$index}">
              <!--@close="handleClose(tag)"-->
              <el-tag
                @close="handleTagCancel(row,index)"
                :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList"
                closable :disable-transitions="false">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!--下方结构当作input和span切换-->
              <!--@keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"-->
              <el-input
                v-focus
                class="input-new-tag" size="small"
                @blur="handleInputConfirm(row)"
                v-if="row.inputVisible" v-model.trim="row.inputValue" ref="saveTagInput">
              </el-input>
              <!--@click="showInput"-->
              <el-button @click="handleTagAdding(row)" v-else class="button-new-tag" size="small">+ 添加</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template v-slot="{row,$index}">
              <el-button @click="handleRowCancel($index)" type="danger" icon="el-icon-delete" size="small"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleSaving" type="primary">OK</el-button>
        <el-button @click="cancelHandling">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  props: ['scene'],
  data () {
    return {
      unselectAttr: '',//手机未选择的销售属性id
      //inputValue: '',//添加动态标签的内容
      //inputVisible: true,//控制动态标签的添加状态
      dynamicTags: [],//动态标签
      dialogImageUrl: '',//图片的url
      dialogVisible: false,
      spuInfo: {
        category3Id: 0,//三级分类ID
        tmId: '',//品牌ID
        description: "",//spu描述
        spuName: "",//spu名称
        spuImageList: [ //spu图片列表
          /*{
              id: 0,
              imgName: "",
              imgUrl: "",
              spuId: 0
          }*/
        ],
        spuSaleAttrList: [//平台属性与属性值
          /*{
              baseSaleAttrId: 0,
              id: 0,
              saleAttrName: "",
              spuId: 0,
              spuSaleAttrValueList: [
                  {
                      baseSaleAttrId: 0,
                      id: 0,
                      isChecked: "",
                      saleAttrName: "",
                      saleAttrValueName: "",
                      spuId: 0
                  }
              ]
          }*/
        ],
      },//spu信息属性，初始化的时候是一个空对象
      tmlist: [],//品牌信息
      imglist: [],//图片列表
      allsaleattr: [],//全部销售信息
      category3Id: '',//收集三级分类id
    }
  },
  computed: {
    //还未选择的销售属性
    //全部属性减去已有的销售属性
    unselectSaleAttr () {
      return this.allsaleattr
        .filter(item => this.spuInfo.spuSaleAttrList
          .every(foo => item.name !== foo.saleAttrName)
        )
    }
  },
  methods: {
    //取消按钮操作
    cancelHandling () {
      this.$emit('changeScene', {scene: 0, flag: ''});
      //清除数据
      //this._data响应式数据，this.$options组件配置对象，$options.data()函数返回一个空对象
      Object.assign(this._data, this.$options.data());
    },
    //保存操作
    async handleSaving () {
      //处理图片的携带参数imgName,imgUrl
      this.spuInfo.spuImageList = this.imglist.map(item => {
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url,
        }
      })
      const res = await this.$api.spu.reqSaveOrAddspu(this.spuInfo);
      if (res.code === 200) {
        this.$message.success('上传成功');
        //scene区分场景 flag区分模式
        this.$emit('changeScene', {scene: 0, flag: this.spuInfo.id ?'modify' :'add'});
      }
      //清除数据
      Object.assign(this._data, this.$options.data());
    },
    //删除行
    handleRowCancel (index) {
      const {spuSaleAttrList} = this.spuInfo;
      spuSaleAttrList.splice(index, 1);
    },
    //删除销售属性tag
    handleTagCancel (row, index) {
      row.spuSaleAttrValueList.splice(index, 1)
    },
    //动态添加标签的inputblur事件
    handleInputConfirm (row) {
      if (row.inputValue) {
        //解构出销售属性中收集的数据
        const {baseSaleAttrId, inputValue} = row;
        //判断属性重复
        const boo = row.spuSaleAttrValueList.some(item => item.saleAttrValueName == inputValue)
        if (boo) {
          this.$message.error('不能添加重复项！');
          return
        }
        //服务器上传的数据
        const newSaleAttr = {
          baseSaleAttrId,
          saleAttrValueName: inputValue,
        }
        //新增
        row.spuSaleAttrValueList.push(newSaleAttr);
        //console.log()
        row.inputVisible = false;
      } else {
        this.$notify({
          type: 'error',
          message: '非法属性'
        })
        row.inputVisible = false;
      }
    },
    //动态添加tag标签
    handleTagAdding (row) {
      //使用自定义属性控制input和button的显互斥
      console.log(row)
      this.$set(row, 'inputVisible', true);
      //通过响应式添加inputValue属性
      this.$set(row, 'inputValue', '');
    },
    //添加新的销售属性
    addSaleAttr () {
      //处理收集销售属性信息 id-attr
      const [baseSaleAttrId, saleAttrName] = this.unselectAttr.split('-')
      //spuSaleAttrList追加属性
      this.spuInfo.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      })
      //清空已选择的销售属性
      this.unselectAttr = '';
    },
    //图片上传成功的回调
    handleUploadSuccess (res, file, fileList) {
      //收集图片的信息
      this.imglist = fileList;
    },
    //照片墙删除图片的回调
    //file：删除的照片
    handleRemove (file, fileList) {
      console.log(file, fileList);
      //收集被删除图片,照片墙需要拥有name和url属性的数据
      //服务器不需要name和url
      this.imglist = fileList;
    },
    //图片预览的回调
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //初始化spu数据
    async initSpuData (spu) {
      //获取spu信息属性
      const res = await this.$api.spu.reqSpuInfoById(spu.id);
      if (res.code === 200) {
        this.spuInfo = res.data;
      }
      //获取spu品牌信息
      const tmres = await this.$api.spu.reqSpuBrandInfo()
      if (tmres.code === 200) {
        this.tmlist = tmres.data;
      }
      //获取spu图片的数据
      const imgres = await this.$api.spu.reqSpuImageList(spu.id)
      if (imgres.code === 200) {
        //为了与ElementUI配合，对数据进行预处理
        const imgarr = imgres.data;
        //由于照片墙显示图片的数据必须要是数组 [ name:'',url:'' ]
        imgarr.forEach(img => {
          img.name = img.imgName;
          img.url = img.imgUrl
        })
        this.imglist = imgarr;
      }
      //获取全平台销售属性
      const allres = await this.$api.spu.reqAllAttr()
      if (allres.code === 200) {
        this.allsaleattr = allres.data;
      }
    },
    //获取全部销售属性和品牌属性
    async reqAllAttrAndBrand (id3) {
      //添加spu时收集三级分类的id
      this.spuInfo.category3Id = id3;
      //获取全平台销售属性
      const allres = await this.$api.spu.reqAllAttr()
      if (allres.code === 200) {
        this.allsaleattr = allres.data;
      }
      //获取spu品牌信息
      const tmres = await this.$api.spu.reqSpuBrandInfo()
      if (tmres.code === 200) {
        this.tmlist = tmres.data;
      }
    }
  },
  beforeMount () {
  
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
