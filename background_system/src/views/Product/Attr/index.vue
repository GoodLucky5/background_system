<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect :showTable="!showTable" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <!--表格-->
      <div v-show="showTable">
        <el-button
          @click="editAttr"
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3id"
          style="margin: 0 0 15px 0"
          >添加属性
        </el-button>
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column
            label="序号"
            width="80"
            type="index"
            align="center"
          />
          <el-table-column prop="attrName" label="属性名称" width="150" />
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template v-slot="{ row, $index }">
              <el-tag
                v-for="(item, index) in row.attrValueList"
                :key="item.id"
                type="success"
                @click=""
                style="margin: 0 5px"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template v-slot="{ row, $index }">
              <!--编辑按钮-->
              <el-button
                icon="el-icon-edit"
                type="warning"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <!--删除按钮-->
              <el-popconfirm
                :title="`是否确认删除${row.valueName}`"
                @onConfirm="deleteAttr($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--添加属性和修改属性的解构-->
      <div v-show="!showTable">
        <el-form :inline="true" ref="form" :model="attrInfo" label-width="80px">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <el-button
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          type="primary"
          icon="el-icon-plus"
          style="margin: 0 8px"
          >添加属性值
        </el-button>
        <el-button @click="showTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 10px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            type="index"
            align="center"
            width="80"
            label="序号"
          />
          <el-table-column align="center" width="width" label="属性值名称">
            <!--row是数组里的每一个元素-->
            <template v-slot="{ row, $index }">
              <el-input
                @blur="changeReadOnly(row)"
                :ref="$index"
                v-if="row.flag"
                v-model="row.valueName"
                size="small"
                placeholder="请输入属性值名称"
              />
              <span
                @click="changeReadOnly(row, $index)"
                v-else
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column align="center" width="width" label="操作">
            <template v-slot="{ row, $index }">
              <el-popconfirm
                :title="`是否确认删除${row.valueName}`"
                @onConfirm="deleteAttr($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  slot="reference"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          :disabled="this.attrInfo.attrValueList.length < 1"
          type="primary"
          @click="saveAttrInfo"
          >保存
        </el-button>
        <el-button @click="showTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";

export default {
  name: "Attr",
  data() {
    return {
      showTable: true, //控制table隐藏显示
      category1id: "",
      category2id: "",
      category3id: "",
      attrList: [], //接收服务器返回数据
      attrInfo: {
        //收集属性和修改属性
        attrName: "", //属性名
        attrValueList: [
          //属性值，可以多个
        ],
        categoryId: 0, //三级分类id
        categoryLevel: 3, //三级分类级别
      },
    };
  },
  methods: {
    //自定义事件回调
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1id = categoryId;
        this.category2id = "";
        this.category3id = "";
      } else if (level === 2) {
        this.category2id = categoryId;
        this.category3id = "";
      } else {
        this.category3id = categoryId;
        //发请求获取平台属性
        this.getAttrList();
      }
    },
    //获取品牌属性
    async getAttrList() {
      const { category1id, category2id, category3id } = this;
      const res = await this.$api.attr.reqAttrInfoList(
        category1id,
        category2id,
        category3id
      );
      if (res.code === 200) {
        this.attrList = res.data;
      }
    },
    //添加属性
    editAttr() {
      //清除新增属性和修改属性的数据
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3id, //收集三级分类id
        categoryLevel: 3,
      };
      this.showTable = false;
    },
    //编辑属性
    updateAttr(row) {
      //由于对象中嵌套数组，数组中有对象，因此需要深拷贝
      this.attrInfo = cloneDeep(row);
      //在修改某一个属性的时候，将一个属性值添加上flag属性，用于判断是否可以编辑
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
      this.showTable = false;
    },
    //气泡确认框确认删除回调
    deleteAttr(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    //添加属性值
    addAttrValue() {
      //向属性值内部添加元素
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true, //控制编辑模式和只读模式切换
      });
      //表单聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //编辑模式和只读模式切换
    changeReadOnly(row, index) {
      //切换为只读模式时
      if (row.flag) {
        if (!row.valueName.trim()) {
          this.$message.error("属性值名称不能为空");
          return;
        }
        /*属性名重复验证*/
        const re = this.attrInfo.attrValueList.some((item) => {
          if (item.valueName === row.valueName && item !== row) {
            this.$message.error("属性值名称不能重复");
            return true;
          }
        });
        /*属性值是否重复*/
        if (re) return;
        row.flag = false;
      }
      //切换为编辑模式时
      else {
        row.flag = true;
        this.$nextTick(() => {
          this.$refs[index].focus();
        });
      }
    },
    //修改或保存属性
    async saveAttrInfo() {
      //如果用户添加了很多属性值，则需要判断是否有空值
      //包含切换编辑和只读模式的flag字段也不应该提交给服务器
      this.attrInfo.attrValueList.filter((item) => {
        //判断非空
        if (!item.valueName) {
          delete item.flag;
          return true;
        }
      });
      try {
        //发请求
        const res = await this.$api.attr.reqSaveAttrInfo(this.attrInfo);
        this.$message({
          message: "保存成功",
          type: "success",
        });
        this.getAttrList();
        this.showTable = true;
      } catch (e) {
        this.$message({
          message: "保存失败",
          type: "error",
        });
      }
    },
  },
};
</script>

<style scoped>
</style>
