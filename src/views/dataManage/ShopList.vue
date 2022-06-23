<template>
  <div class="fillcontain">
    <HeadTop />
    <div class="table_container">
      <!-- 表格 -->
      <el-table
        :data="tableData"
        stripe
        height="800px"
        :header-cell-style="{ 'background-color': '#EEF1F6' }"
        style="width: 100%; border: 1px solid #ebeef5"
      >
        <el-table-column width="100" type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="店铺名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="店铺地址">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="店铺介绍">
                <span>{{ props.row.description }}</span>
              </el-form-item>
              <el-form-item label="店铺 ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="联系电话">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="评分">
                <span>{{ props.row.rating }}</span>
              </el-form-item>
              <el-form-item label="销售量">
                <span>{{ props.row.recent_order_num }}</span>
              </el-form-item>
              <el-form-item label="分类">
                <span>{{ props.row.category }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          width="300"
          prop="name"
          label="店铺名称"
          header-align="left"
        >
        </el-table-column>
        <el-table-column prop="address" label="店铺地址" header-align="left">
        </el-table-column>
        <el-table-column
          prop="description"
          label="店铺介绍"
          header-align="left"
        >
        </el-table-column>
        <el-table-column label="操作" width="240" header-align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button size="mini" @click="addFood(scope.$index, scope.row)"
              >添加商品</el-button
            >
            <el-button
              size="mini"
              @click="handleDelete(scope.$index, scope.row)"
              type="danger"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 编辑对话框 -->
      <el-dialog title="修改店铺信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="店铺名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" :label-width="formLabelWidth">
            <el-input v-model="form.address" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="店铺介绍" :label-width="formLabelWidth">
            <el-input v-model="form.description" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" :label-width="formLabelWidth">
            <el-input v-model="form.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="店铺分类" :label-width="formLabelWidth">
            <el-cascader
              v-model="value"
              :placeholder="defaultCategory"
              :options="options"
              :props="{ expandTrigger: 'hover' }"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="店铺图片" :label-width="formLabelWidth">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false"
            >确 定</el-button
          >
        </div>
      </el-dialog>

      <!-- 分页器 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="limit"
        layout="prev, pager, next, jumper"
        :total="restaurantsCount"
        class="pagination"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  cityGuess,
  reqRestaurantsCount,
  reqRestaurantsList,
  reqDeleteRestaurant,
  reqRestaurantsCategory,
  reqAddImg,
} from "network/getData";

export default {
  name: "ShopList",
  data() {
    return {
      tableData: [
        {
          //该对象为示例，下面会清空
          name: "王小虎",
          address: "上海市普陀区金沙江路",
          shopDesc: "上海市普陀区金沙江路 1517 弄",
          imageUrl: "",
        },
      ],
      //编辑按钮级联选择器
      value: [],
      defaultCategory: "",
      options: [
        //结构示例，下面会清空
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
            },
            {
              value: "daohang",
              label: "导航",
            },
          ],
        },
      ],
      //dialog相关
      dialogFormVisible: false,
      form: {
        name: "",
        address: "",
        description: "",
        phone: "",
        imageUrl: "",
      },
      formLabelWidth: "120px",
      //定位城市信息
      cityInfo: {},
      //餐馆总数量
      restaurantsCount: null,
      //获取数据数量（默认20）
      limit: 20,
      //跳过数据条数 默认 0
      offset: 0,
      //当前页 默认 1
      currentPage: 1,
    };
  },
  created() {
    this.getCityInfo();
    this.getRestaurantsCount();
    this.getRestaurantsList();
    this.getRestaurantsCategory();
  },
  computed: {
    getImageUrl() {},
  },
  methods: {
    //获取定位城市
    async getCityInfo() {
      this.cityInfo = await cityGuess();
    },
    //获取餐馆总数量
    async getRestaurantsCount() {
      try {
        let result = await reqRestaurantsCount();
        this.restaurantsCount = result.count;
      } catch (error) {
        alert(error.message);
      }
    },
    //获取商家列表
    async getRestaurantsList() {
      try {
        const { limit, offset } = this;
        let result = await reqRestaurantsList({
          limit,
          offset,
          latitude: this.cityInfo.latitude,
          longitude: this.cityInfo.longitude,
        });
        // console.log(result);
        this.tableData = [];
        result.forEach((element) => {
          //将返回数据中所需要的数据存储到tableData中，每家店为一个对象，tableData为数组
          const restaurantsInfo = {};
          restaurantsInfo.name = element.name;
          restaurantsInfo.address = element.address;
          restaurantsInfo.description = element.description;
          restaurantsInfo.id = element.id;
          restaurantsInfo.phone = element.phone;
          restaurantsInfo.rating = element.rating;
          restaurantsInfo.recent_order_num = element.recent_order_num;
          restaurantsInfo.category = element.category;
          restaurantsInfo.imageUrl =
            "https://elm.cangdu.org/img/" + element.image_path;
          this.tableData.push(restaurantsInfo);
        });
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message,
        });
      }
    },
    //获取店铺分类
    async getRestaurantsCategory() {
      try {
        let result = await reqRestaurantsCategory();
        // console.log(result);
        this.options = [];
        //将分类存到选择器中
        result.forEach((element) => {
          // console.log(element);
          const restaurantsCategory = {};
          restaurantsCategory.value = element.id;
          restaurantsCategory.label = element.name;
          restaurantsCategory.children = [];
          const sub_categories = element.sub_categories;
          sub_categories.forEach((element) => {
            // console.log(element);
            const childrenCategory = {};
            childrenCategory.value = element.id;
            childrenCategory.label = element.name;
            restaurantsCategory.children.push(childrenCategory);
          });

          this.options.push(restaurantsCategory);
        });
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message,
        });
      }
    },

    //编辑餐馆
    handleEdit(index, data) {
      //将tableData中每家店铺的信息各自存到from中给dialog编辑店铺信息使用
      this.dialogFormVisible = true;
      this.defaultCategory = data.category;
      this.form.name = data.name;
      this.form.address = data.address;
      this.form.description = data.description;
      this.form.phone = data.phone;
      this.form.imageUrl = data.imageUrl;
      // console.log(data);
    },
    //添加商品
    addFood(index, data) {
      this.$router.push({
        path: "addGoods",
        query: { restaurants_id: data.id },
      });
    },
    //删除餐馆
    async handleDelete(index, data) {
      try {
        let result = await reqDeleteRestaurant(data.id);

        // console.log(result);
        if (result.status == 1) {
          this.$message({
            type: "success",
            message: "删除店铺成功",
          });
          this.tableData.splice(index, 1);
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message,
        });
      }
    },

    //编辑餐馆级联选择器
    handleChange(value) {
      console.log(value);
    },
    //级联选择器上传图片
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
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

    //分页器
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getRestaurantsList();
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/style/mixin";
.table_container {
  padding: 20px;
}
.demo-table-expand {
  padding: 20px 50px;
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

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
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}

.pagination {
  text-align: center;
  margin-top: 20px;
}
</style>