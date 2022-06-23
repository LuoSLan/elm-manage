<template>
  <div class="fillcontain">
    <HeadTop />
    <div class="table_container">
      <el-table
        :data="tableData"
        stripe
        height="800px"
        :header-cell-style="{ 'background-color': '#EEF1F6' }"
        style="width: 100%; border: 1px solid #ebeef5"
        @expand-change="expandChange"
      >
        <el-table-column width="100" type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="食品名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="店铺名称">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="食品 ID">
                <span>{{ props.row.item_id }}</span>
              </el-form-item>
              <el-form-item label="店铺 ID">
                <span>{{ props.row.restaurant_id }}</span>
              </el-form-item>
              <el-form-item label="食品介绍">
                <span>{{ props.row.description }}</span>
              </el-form-item>
              <el-form-item label="食品评分">
                <span>{{ props.row.rating }}</span>
              </el-form-item>
              <el-form-item label="食品分类">
                <span>{{ props.row.recent_order_num }}</span>
              </el-form-item>
              <el-form-item label="月销量">
                <span>{{ props.row.month_sales }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column width="300" prop="name" label="食品名称">
        </el-table-column>
        <el-table-column prop="description" label="食品介绍"> </el-table-column>
        <el-table-column prop="rating" label="评分"> </el-table-column>
        <el-table-column label="操作" width="160" header-align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
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
      <el-dialog title="修改食品信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="食品名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="食品介绍" :label-width="formLabelWidth">
            <el-input v-model="form.description" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="食品分类" :label-width="formLabelWidth">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="食品图片" :label-width="formLabelWidth">
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
          <el-table :data="detailTableData">
            <el-table-column label="规格"></el-table-column>
            <el-table-column label="包装费"></el-table-column>
            <el-table-column label="价格"></el-table-column>
            <el-table-column label="操作"></el-table-column>
          </el-table>
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
        :total="foodsCount"
        class="pagination"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  reqFoodsCount,
  reqFoodsList,
  reqRestaurantsDetail,
  reqDeleteFood,
} from "network/getData";

export default {
  name: "FoodList",
  components: {},
  data() {
    return {
      tableData: [
        {
          //该对象为示例，下面会清空
          name: "包子",
          description: "好吃",
          rating: "5",
          item_id: "1",
          restaurant_id: "1",
          category_id: "1",
          month_sales: "1",
        },
      ],
      detailTableData: [
        {
          //该对象为示例，下面会清空
          name: "包子",
          description: "好吃",
          rating: "5",
          item_id: "1",
          restaurant_id: "1",
          category_id: "1",
          month_sales: "1",
        },
      ],
      selectTableData: {},
      restaurant_id: null,

      //dialog相关
      dialogFormVisible: false,
      form: {
        name: "",
        description: "",
        category_id: "",
        imageUrl: "",
      },
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      value: "",
      formLabelWidth: "120px",
      //食品总数量
      foodsCount: null,
      //获取数据数量（默认20）
      limit: 20,
      //跳过数据条数 默认 0
      offset: 0,
      //当前页 默认 1
      currentPage: 1,
    };
  },
  created() {
    this.restaurant_id = this.$route.query;
    this.getFoodsCount();
  },
  methods: {
    //获取食品总数量
    async getFoodsCount() {
      try {
        let result = await reqFoodsCount();
        this.foodsCount = result.count;
        this.getFoodsList();
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message,
        });
      }
    },
    //获取食品列表
    async getFoodsList() {
      try {
        let result = await reqFoodsList(
          this.limit,
          this.offset,
          this.restaurant_id
        );
        // console.log(result);
        //将每条数据存入tableData
        this.tableData = [];
        result.forEach((element) => {
          const foodInfo = {};
          foodInfo.name = element.name;
          foodInfo.description = element.description;
          foodInfo.rating = element.rating;
          foodInfo.item_id = element.item_id;
          foodInfo.restaurant_id = element.restaurant_id;
          foodInfo.category_id = element.category_id;
          foodInfo.month_sales = element.month_sales;
          this.tableData.push(foodInfo);
        });
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message,
        });
      }
    },
    //
    expandChange(row) {
      // console.log(row);
      this.getRestaurantsDetails(row);
    },
    //获取店铺详情
    async getRestaurantsDetails(row) {
      try {
        console.log(row);

        let result = await reqRestaurantsDetail(row.restaurant_id);
        // console.log(result);
        // console.log(row);
        this.selectTableData = { ...row, shopName: result.name };
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message,
        });
      }
    },

    //编辑食品
    handleEdit(index, data) {
      //将tableData中每食品的信息各自存到from中给dialog编辑食品信息使用
      this.dialogFormVisible = true;
      // this.value = data.category;
      this.form.name = data.name;
      this.form.description = data.description;
      this.form.imageUrl = data.imageUrl;
      console.log(data);
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

    //删除食品
    async handleDelete(index, data) {
      try {
        let result = await reqDeleteFood(data.id);

        // console.log(result);
        if (result.status == 1) {
          this.$message({
            type: "success",
            message: "删除食品成功",
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

    //分页器
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getFoodsList();
    },
  },
};
</script>

<style  lang="less" scoped>
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

.el-dialog__header {
  padding: 20px 20px 0;
}
.el-dialog .el-form-item {
  margin-bottom: 10px;
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