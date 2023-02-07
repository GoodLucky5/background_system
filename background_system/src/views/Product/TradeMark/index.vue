<template>
  <div>
    <!--对话框
            :visible.sync控制对话框显示与隐藏
        -->
    <el-dialog
      :title="tmFormdata.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!--form表单
                :model；把表单的数据收集到一个对象之中，将来eleui用于表单验证
            -->
      <el-form
        style="width: 80%"
        :model="tmFormdata"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmFormdata.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 照片上传
                       上传成功的回调 :on-success="handleAvatarSuccess" 其中返回值的res中包含图片的url
                       上传前的回调 :before-upload="beforeAvatarUpload"
                       设置图片的上传地址 action
                    -->
          <!-- 注意upload要上传本地图片，不是表单元素，使用action属性设定上传的地址 -->
          <!-- 且后端地址为admin/product/fileUpload，但是根据上传成功的照片来看路径需要加上/dev-api的前缀，感觉有点随便啊 -->
          <el-upload
            class="avatar-uploader"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
          >
            <img
              v-if="tmFormdata.logoUrl"
              :src="tmFormdata.logoUrl"
              class="avatar"
              alt=""
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUploadTrademark">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!--添加按钮-->
    <el-button
      @click="showDialog"
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      >添加</el-button
    >
    <!--表格
          data是表格展示的数据，数组类型
          border是表格是否显示边框，布尔类型
          label显示的标题，字符串型
          width对应列的宽度，字符串型
          align对应列的对齐方式，字符串型
          -->
    <el-table style="width: 100%" border="border" :data="list">
      <!--
              type="index" 列表展示序号
              prop对应列内容的字段名，字符串型
             -->
      <el-table-column
        prop="prop"
        type="index"
        label="序号"
        width="80px"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="品牌logo" width="width">
        <!-- 服务器传回的数据是网页字符串地址，需要改变成图片形式，每个el标签相当于一个小组件，temp相当于是column的子组件，使用插槽传递图片的在线动态地址-->
        <template v-slot="{ row, $index }">
          <img :src="row.logoUrl" alt="!" style="width: 50px; height: 50px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template v-slot="{ row, $index }">
          <!--row就是当前用户选中的信息-->
          <el-button
            @click="updateTradeMark(row)"
            type="primary"
            icon="el-icon-edit"
            size="mini"
            >修改
          </el-button>
          <el-button
            @click="delTrademark(row)"
            type="primary"
            icon="el-icon-delete"
            size="mini"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页器
          page是当前页，数字类型
          pageSize是每页显示的条数，数字类型
          pageCount是总页数，数字类型
          total是总条数，数字类型
        -->
    <el-pagination
      @current-change="getPageList"
      @size-change="handleSizeChange"
      :current-page="page"
      :page-size="limit"
      :page-count="7"
      :page-sizes="[3, 6, 9, 12, 15]"
      layout=" prev, pager, next, jumper,->, sizes, total"
      :total="total"
      style="margin-top: 20px; text-align: center"
    >
    </el-pagination>
  </div>
</template>

<script>
import { Message } from "element-ui";
import {
  getLimit,
  getPage,
  saveLimit,
  savePage,
} from "@/utils/trademarkReload";

export default {
  name: "TardeMark",
  data() {
    return {
      page: getPage(), //分页器第几页
      limit: getLimit(), //分页器每页显示的条数
      total: 0, //分页器总条数
      list: [], //表格数据
      dialogFormVisible: false, //控制对话框的显示隐藏
      tmFormdata: {
        //收集品牌信息，
        tmName: "", //品牌名称
        logoUrl: "", //logourl
      },
      rules: {
        //表单验证规则
        tmName: [
          //品牌名称校验
          { required: true, message: "请输入品牌信息", trigger: "blur" },
          {
            min: 3,
            max: 5,
            message: "长度最少在 3 到 5 个字符",
            trigger: "change",
          },
        ],
        logoUrl: [
          //品牌logo验证规则
          { required: true, message: "请选择品牌图片" },
        ],
      },
    };
  },
  methods: {
    //获取品牌列表接口
    async getPageList(pager) {
      pager && (this.page = pager);
      const { page, limit } = this;
      //   es6 const page = this.page
      const res = await this.$api.trademark.reqTrademarkList(page, limit);
      if (res.code === 200) {
        //渲染数据和设置数据条数
        this.total = res.data.total;
        this.list = res.data.records;
        savePage(page);
        saveLimit(limit);
      } else {
        Message.error("获取信息失败");
      }
    },
    //表格数据展示条数更新重新发请求
    handleSizeChange(e) {
      this.limit = e;
      this.getPageList();
    },
    //展示对话框
    showDialog() {
      this.dialogFormVisible = true;
      this.tmFormdata = { tmName: "", logoUrl: "" };
    },
    //表单修改按钮回调
    updateTradeMark(row) {
      // row为element-ui设计，点击后会返回被点击对象的全部信息（本项目中返回id，品牌名，图片在线路径
      console.log(row);
      this.tmFormdata = { ...row }; //获取修改项的信息（浅拷贝
      this.dialogFormVisible = true;
    },
    /*对话框上传图片的回调*/
    handleAvatarSuccess(res, file) {
      //res是上传成功之后返回给前端的数据其中包含图片的url
      //也就说使用该组件上传图片的逻辑顺序：用户添加完品牌信息，本地图片（此时为本地地址），前端页面验证信息长度、图片大小无误后会先通知服务器，服务器开辟好空间并返回服务器的图片地址(包含在res中，用户单击添加后发送服务器地址通知服务器储存），新商品数据正式上架
      this.tmFormdata.logoUrl = res.data; //收集品牌logo数据
      console.log(res);
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    //图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //确认上传的回调，可添加/修改品牌
    addOrUpdateTrademark() {
      //当全部验证的字段通过再书写业务逻辑，该段代码官网cv
      this.$refs.ruleForm.validate(async (valid) => {
        //全部字段符合条件
        if (valid) {
          const re = await this.$api.trademark.reqUpdateTrademark(
            this.tmFormdata
          );
          console.log(re);
          if (re.code === 200) {
            this.dialogFormVisible = false;
            Message.success("上传成功");
            this.getPageList();
          } else {
            Message.error("上传失败，请检查网络");
          }
        } else {
          Message.error("请确认表单信息已完善");
          return false;
        }
      });
    },
    //取消上传
    async cancelUploadTrademark() {
      const re = await this.$confirm("是否确认取消上传？");
      if (re === "confirm") {
        this.dialogFormVisible = false;
      } else {
        return;
      }
    },
    //删除按钮
    delTrademark(row) {
      this.$confirm(`您将要删除${row.tmName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 点击确定时触发
          const re = await this.$api.trademark.deleteTrademark(row.id); //发送删除的请求
          if (re.code === 200) {
            this.$notify({
              type: "success",
              message: "删除成功",
              title: "success",
            });
            this.getPageList();
          }
        })
        // 点击取消时触发
        .catch(() => {
          this.$notify({
            type: "error",
            message: "删除失败",
            title: "failed",
          });
        });
    },
  },
  mounted() {
    this.getPageList();
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
