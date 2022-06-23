<template>
  <div class="fillcontain">
    <HeadTop />
    <div class="table_container">
      <el-row>
        <el-col :span="16" :offset="4">
          <el-form
            :model="categoryForm"
            size="medium"
            :rules="rules"
            ref="categoryForm"
            :label-width="formLabelWidth"
            style="margin-bottom: 15px"
          >
            <el-header class="form_header">选择食品种类</el-header>
            <el-row class="row">
              <el-form-item label="食品种类" prop="category_id">
                <el-select
                  v-model="goodsForm.category_id"
                  placeholder="请选择"
                  style="width: 100%"
                  @change="change_category_id"
                >
                  <el-option
                    v-for="item in category_list"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>

            <el-collapse-transition>
              <div v-show="add_category_show">
                <el-form-item label="食品种类">
                  <el-input
                    v-model="categoryForm.name"
                    placeholder=""
                  ></el-input>
                </el-form-item>
                <el-form-item label="种类描述">
                  <el-input
                    v-model="categoryForm.description"
                    placeholder=""
                  ></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom: 0">
                  <el-button
                    type="primary"
                    size="small"
                    @click="submitNewCategory"
                    >提交</el-button
                  >
                </el-form-item>
              </div>
            </el-collapse-transition>

            <div class="add_category_button" @click="is_add_category_show">
              <i
                class="el-icon-caret-top edit_icon"
                v-if="add_category_show"
              ></i>
              <i class="el-icon-caret-bottom edit_icon" v-else></i>
              <span>添加食品种类</span>
            </div>
          </el-form>
          <!-- ------------------------------------------------------------------ -->
          <el-form
            :model="goodsForm"
            size="medium"
            :rules="rules"
            ref="goodsForm"
            :label-width="formLabelWidth"
          >
            <el-header class="form_header">添加食品</el-header>
            <el-row class="row">
              <el-form-item label="食品名称" prop="name">
                <el-input v-model="goodsForm.name"></el-input>
              </el-form-item>
              <el-form-item label="食品活动">
                <el-input v-model="goodsForm.activity"></el-input>
              </el-form-item>
              <el-form-item label="食品详情">
                <el-input v-model="goodsForm.description"></el-input>
              </el-form-item>
              <el-form-item label="上传店铺头像" prop="image_path">
                <el-upload
                  class="avatar-uploader"
                  :action="baseUrl + '/v1/addimg/food'"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeUpload"
                >
                  <img
                    v-if="goodsForm.image_path"
                    :src="baseImgPath + goodsForm.image_path"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="食品特点">
                <el-select
                  v-model="specsValue"
                  multiple
                  @change="specsChange"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="食品规格" prop="specs">
                <el-radio v-model="radio" label="1">单规格</el-radio>
                <el-radio v-model="radio" label="2">多规格</el-radio>
              </el-form-item>
              <el-row class="single" v-if="radio == '1'">
                <el-form-item label="包装费">
                  <el-input-number
                    v-model="goodsForm.specs[0].packing_fee"
                    controls-position="right"
                    @change="handleChange"
                    :min="0"
                  ></el-input-number>
                </el-form-item>
                <el-form-item label="价格">
                  <el-input-number
                    v-model="goodsForm.specs[0].price"
                    controls-position="right"
                    @change="handleChange"
                    :min="0"
                  ></el-input-number>
                </el-form-item>
              </el-row>
              <el-row
                class="multi"
                v-else
                style="overflow: auto; text-align: center"
              >
                <el-button type="primary" size="small">添加规格</el-button>

                <el-table :data="tableData">
                  <el-table-column
                    prop="specs"
                    label="规格"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    prop="packing_fee"
                    label="包装费"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    prop="price"
                    label="价格"
                    align="center"
                  ></el-table-column>
                  <el-table-column label="操作" align="center">
                    <el-button
                      size="mini"
                      @click="handleDelete(scope.$index, scope.row)"
                      type="danger"
                      >删除</el-button
                    ></el-table-column
                  >
                </el-table>
              </el-row>
              <el-form-item>
                <el-button
                  type="primary"
                  size="small"
                  @click="submitForm('goodsForm')"
                  >确认添加食品</el-button
                >
              </el-form-item>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { baseUrl, baseImgPath } from "@/config/env";
import {
  reqAddFoodsCategory,
  reqFoodsCategoryList,
  reqAddFood,
} from "network/getData";

export default {
  name: "AddGoods",
  data() {
    return {
      formLabelWidth: "140px",
      add_category_show: false,
      categoryForm: {
        name: "", //食品种类
        description: "", //种类描述
        restaurant_id: null, //餐馆id
        category_id: null, //分类id
      },
      goodsForm: {
        name: "", //食品名称
        image_path: "", //食品图片地址
        specs: [{ specs: "默认", packing_fee: 0, price: 20 }], //食品规格
        description: "", //食品详情
        activity: "", //食品活动
        restaurant_id: null, //餐馆id
        category_id: null, //分类id
        attributes: null, //食品特点
      },
      category_list: [],
      options: [
        {
          value: "新",
          label: "新品",
        },
        {
          value: "招",
          label: "招牌",
        },
      ],

      tableData: [
        {
          specs: "默认",
          packing_fee: 0,
          price: 20,
        },
      ],

      specsValue: [],
      radio: "1",
      baseUrl,
      baseImgPath,
      rules: {
        category_id: [
          { required: true, message: "请选择食品种类", trigger: "change" },
        ],
        name: [{ required: true, message: "请输入食品名称", trigger: "blur" }],
        specs: [
          { required: true, message: "请选择食品规格", trigger: "change" },
        ],
        image_path: [
          { required: true, message: "请上传店铺头像", trigger: "change" },
        ],
      },
    };
  },
  created() {
    if (this.$route.query.restaurants_id) {
      this.categoryForm.restaurant_id = this.$route.query.restaurants_id;
      this.goodsForm.restaurant_id = this.$route.query.restaurants_id;
    } else {
      this.categoryForm.restaurant_id = 1;
      this.goodsForm.restaurant_id = 1;
      this.$msgbox({
        title: "提示",
        message: "添加食品需要选择一个店铺，现在前去选择店铺吗？",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action == "confirm") {
            this.$router.push("/shopList");
            done();
          } else {
            this.$message({
              type: "info",
              message: "取消前往",
            });
            done();
          }
        },
      });
    }
  },
  mounted() {
    this.getFoodsCategoryList();
  },
  methods: {
    is_add_category_show() {
      this.add_category_show = !this.add_category_show;
    },
    change_category_id() {
      this.categoryForm.category_id = this.goodsForm.category_id;
    },
    //提交新食品种类
    async submitNewCategory() {
      try {
        const { name, description, restaurant_id } = this.categoryForm;
        let result = await reqAddFoodsCategory({
          name,
          description,
          restaurant_id,
        });
        this.categoryForm = {
          name: "", //食品种类
          description: "", //种类描述
          restaurant_id: null, //餐馆id
        };
        // console.log(result);
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message,
        });
      }
    },
    //获取食品种类列表
    async getFoodsCategoryList() {
      try {
        let result = await reqFoodsCategoryList(this.goodsForm.restaurant_id);
        // console.log(result);
        if (result.status == 1) {
          result.category_list.forEach((element) => {
            const categoryInfo = {};
            categoryInfo.value = element.id;
            categoryInfo.label = element.name;
            this.category_list.push(categoryInfo);
          });
        }
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message,
        });
      }
    },

    //上传图片
    handleAvatarSuccess(res, file) {
      if (res.status == 1) {
        this.goodsForm.image_path = res.image_path;
      }
    },
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //---------------------------------------------
    specsChange() {
      const xin = { value: "新", label: "新品" };
      const zhao = { value: "招", label: "招牌" };
      this.goodsForm.attributes = this.specsValue.map((element) => {
        if (element == "新") {
          return xin;
        } else if (element == "招") {
          return zhao;
        }
      });
    },

    //提交表单创建店铺按钮
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // alert("submit!");
          const foodInfo = this.goodsForm;
          let result = await reqAddFood(foodInfo);
          try {
            if (result.status == 1) {
              this.$message({
                type: "success",
                message: "添加成功",
              });
              //还原form相关数据为默认状态
              this.goodsForm = {
                name: "", //食品名称
                image_path: "", //食品图片地址
                specs: [{ specs: "默认", packing_fee: 0, price: 20 }], //食品规格
                description: "", //食品详情
                activity: "", //食品活动
                restaurant_id: null, //餐馆id
                category_id: null, //分类id
                attributes: null, //食品特点
              };
              this.specsValue = [];
            } else {
              this.$message({
                type: "error",
                message: result.message,
              });
            }
          } catch (error) {}
        } else {
          this.$notify.error({
            title: "错误",
            message: "请检查输入是否正确",
            offset: 100,
          });
          return false;
        }
      });
    },

    handleChange() {},

    handleDelete() {},
  },
};
</script>

<style lang="less">
@import "@/style/mixin";
.row {
  margin-top: 20px;
}
.form_header {
  height: 40px !important;
  text-align: center;
  line-height: 40px;
}

.add_category_button {
  position: relative;
  text-align: center;
  line-height: 40px;
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 6px;
  border: 1px solid #eaeefb;
  border-top: none;

  &:hover {
    background: #f9fafc;
    span,
    .edit_icon {
      color: #20a0ff;
    }
  }
  span {
    .sc(14px, #999);
  }
  .edit_icon {
    position: absolute;
    top: 7px;
    right: 580px;
    color: #ccc;

    font-size: 25px;
  }
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
</style>