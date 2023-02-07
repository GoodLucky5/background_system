<template>
  <div>
    <!--inline代表行内表单：一行可以防止多个表单元素-->
    <el-form :inline="true" class="demo-form-inline" :model="categoryFrom">
      <el-form-item label="一级分类">
        <!--v-model数据双向绑定   :model收集数据-->
        <el-select @change="handler1" v-model="categoryFrom.category1id" :disabled="showTable"
                   placeholder="请选择">
          <el-option
            v-for="(c1,index) in category1Data" :key="c1.id"
            :label="c1.name"
            :value="c1.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select @change="handler2" v-model="categoryFrom.category2id" :disabled="showTable"
                   placeholder="请选择">
          <el-option
            v-for="(c2,index) in category2Data" :key="c2.id"
            :label="c2.name"
            :value="c2.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select @change="handler3" v-model="categoryFrom.category3id" :disabled="showTable"
                   placeholder="请选择">
          <el-option
            v-for="(c3,index) in category3Data" :key="c3.id"
            :label="c3.name"
            :value="c3.id"/>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  data () {
    return {
      category1Data: [],//一级分类数据
      category2Data: [],//二级分类数据
      category3Data: [],//三级分类数据
      categoryFrom: {
        category1id: '',
        category2id: '',
        category3id: ''
      }
    }
  },
  props: ['showTable'],
  methods: {
    //获取一级分类的数据
    async getCategory1List () {
      const res = await this.$api.attr.reqCategory1();
      if (res.code === 200) {
        this.category1Data = res.data;
      } else {
        Message.error('获取信息失败');
      }
    },
    //当一级分类的数据发生变化时，获取二级分类的数据
    async handler1 () {
      this.category2Data = [];
      this.category3Data = [];
      this.categoryFrom.category2id = '';
      this.categoryFrom.category3id = '';
      /*解构出一级分类的id*/
      const category1id = this.categoryFrom.category1id;
      this.$emit('getCategoryId', {categoryId: category1id, level: 1});
      const res = await this.$api.attr.reqCategory2(category1id);
      if (res.code === 200) {
        this.category2Data = res.data;
      } else {
        Message.error('获取二级分类信息失败');
      }
    },
    //当二级分类数据变化时，获取三级分类的数据
    async handler2 () {
      this.category3Data = [];
      this.categoryFrom.category3id = '';
      const category2id = this.categoryFrom.category2id;
      this.$emit('getCategoryId', {categoryId: category2id, level: 2});
      const res = await this.$api.attr.reqCategory3(category2id);
      if (res.code === 200) {
        this.category3Data = res.data;
      } else {
        Message.error('获取三级分类信息失败');
      }
    },
    //当三级分类数据变化时，发送请求
    handler3 () {
      const category3id = this.categoryFrom.category3id;
      this.$emit('getCategoryId', {categoryId: category3id, level: 3});
    }
  },
  mounted () {
    //获取一级分类数据
    this.getCategory1List();
  }
}
</script>

<style scoped>

</style>
