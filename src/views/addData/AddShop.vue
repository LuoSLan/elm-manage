<template>
  <div class="fillcontain">
    <HeadTop />
    <div class="table_container">
      <el-row>
        <el-col :span="12" :offset="4">
          <el-form
            :model="form"
            size="medium"
            :rules="rules"
            ref="form"
            :label-width="formLabelWidth"
          >
            <el-form-item label="店铺名称" prop="name">
              <el-input
                v-model="form.name"
                placeholder=""
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
              <el-autocomplete
                class="demo-address"
                v-model="form.address"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                :trigger-on-focus="false"
                @select="handleSelect"
              ></el-autocomplete>

              <span>当前城市：{{ cityInfo.name }}</span>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone" type="number">
              <el-input
                v-model.number="form.phone"
                maxlength="11"
                placeholder=""
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="店铺简介">
              <el-input
                v-model="form.description"
                placeholder=""
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="店铺标语">
              <el-input
                v-model="form.promotion_info"
                placeholder=""
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="店铺分类" prop="categoryValue">
              <el-cascader
                v-model="form.categoryValue"
                placeholder="请选择一个分类"
                :options="options"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="店铺特点">
              <span>品牌保证</span
              ><el-switch v-model="form.is_premium"> </el-switch>
              <span>蜂鸟专送</span
              ><el-switch v-model="form.delivery_mode"> </el-switch>
              <span>新开店铺</span
              ><el-switch v-model="form.is_new"> </el-switch>
            </el-form-item>
            <el-form-item label="">
              <span>外 卖 保</span><el-switch v-model="form.bao"> </el-switch>
              <span>准 时 达</span><el-switch v-model="form.zhun"> </el-switch>
              <span>开 发 票</span><el-switch v-model="form.piao"> </el-switch>
            </el-form-item>

            <el-form-item label="配送费" prop="float_delivery_fee">
              <el-input-number
                v-model="form.float_delivery_fee"
                controls-position="right"
                @change="handleChange"
                :min="0"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="起送价" prop="float_minimum_order_amount">
              <el-input-number
                v-model="form.float_minimum_order_amount"
                controls-position="right"
                @change="handleChange"
                :min="0"
              ></el-input-number>
            </el-form-item>
            <!-- ---------------------------------------------------------------- -->

            <el-form-item label="营业时间" style="white-space: nowrap">
              <el-time-select
                placeholder="起始时间"
                v-model="form.startTime"
                :picker-options="{
                  start: '05:30',
                  step: '00:15',
                  end: '23:30',
                }"
                style="margin-right: 5px"
              >
              </el-time-select>
              <el-time-select
                placeholder="结束时间"
                v-model="form.endTime"
                :picker-options="{
                  start: '05:30',
                  step: '00:15',
                  end: '23:30',
                  minTime: form.startTime,
                }"
              >
              </el-time-select>
            </el-form-item>
            <!-- ---------------------------------------------------------------- -->

            <el-form-item label="上传店铺头像" prop="image_path">
              <el-upload
                class="avatar-uploader"
                :action="baseUrl + '/v1/addimg/shop'"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeUpload"
              >
                <img
                  v-if="form.image_path"
                  :src="baseImgPath + form.image_path"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="上传营业执照">
              <el-upload
                class="avatar-uploader"
                :action="baseUrl + '/v1/addimg/shop'"
                :show-file-list="false"
                :on-success="handleBusinessLicenseSuccess"
                :before-upload="beforeUpload"
              >
                <img
                  v-if="form.business_license_image"
                  :src="baseImgPath + form.business_license_image"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="上传餐饮服务许可证">
              <el-upload
                class="avatar-uploader"
                :action="baseUrl + '/v1/addimg/shop'"
                :show-file-list="false"
                :on-success="handleCateringLicenseSuccess"
                :before-upload="beforeUpload"
              >
                <img
                  v-if="form.catering_service_license_image"
                  :src="baseImgPath + form.catering_service_license_image"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="优惠活动">
              <el-select
                v-model="activitiesValue"
                placeholder="请选择优惠活动"
                @change="selectActivities"
              >
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-table :data="activities">
              <el-table-column
                prop="icon_name"
                header-align="center"
                align="center"
                width="80"
                label="活动标题"
              ></el-table-column>
              <el-table-column
                prop="name"
                header-align="center"
                align="center"
                label="活动名称"
              ></el-table-column>
              <el-table-column
                prop="description"
                header-align="center"
                align="center"
                label="活动详情"
              ></el-table-column>
              <el-table-column header-align="center" width="76" label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-form-item class="button_submit">
              <el-button type="primary" @click="submitForm('form')"
                >立即创建</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  reqAddRestaurant,
  reqRestaurantsCategory,
  cityGuess,
  addressSearch,
} from "network/getData";
import { baseUrl, baseImgPath } from "@/config/env";

export default {
  name: "AddShop",
  data() {
    return {
      form: {
        name: "", //店铺名字
        address: "", //店铺地址
        phone: null, //店铺联系方式
        description: "", //店铺简介
        promotion_info: "", //店铺标语
        categoryValue: [], //店铺分类
        is_premium: false, //品牌商铺
        delivery_mode: false, //蜂鸟专送
        is_new: false, //新开店铺(后台字段为new，js禁止使用该字段)
        bao: false, //支持保险
        zhun: false, //准时达
        piao: false, //开发票
        float_delivery_fee: 5, //配送费
        float_minimum_order_amount: 20, //起送价
        startTime: "", //营业起始时间
        endTime: "", //营业结束时间
        image_path: "", //店铺头像
        business_license_image: "", //营业执照
        catering_service_license_image: "", //餐饮服务许可证
      },

      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { type: "number", message: "电话号码必须是数字", length: 11 },
        ],
        categoryValue: [
          { required: true, message: "请选择一个分类", trigger: "blur" },
        ],
        float_delivery_fee: [{ required: true, message: "请输入配送费" }],
        float_minimum_order_amount: [
          { required: true, message: "请输入起送价" },
        ],
        image_path: [
          { required: true, message: "请上传店铺头像", trigger: "blur" },
        ],
      },
      formLabelWidth: "140px",

      //优惠活动的table数据
      activities: [
        {
          icon_name: "减",
          name: "满减优惠",
          description: "满30减5，满60减8",
        },
      ],

      //编辑按钮级联选择器

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
      activitiesValue: [],
      options2: [
        //结构示例，下面会清空
        {
          value: "reduce",
          label: "满减优惠",
        },
        {
          value: "special",
          label: "优惠大酬宾",
        },
        {
          value: "newUser",
          label: "新用户立减",
        },
        {
          value: "voucher",
          label: "进店领券",
        },
      ],
      //----------------------------------

      //当前定位城市相关信息
      cityInfo: {},

      baseUrl,
      baseImgPath,
    };
  },
  created() {
    this.getRestaurantsCategory();
    this.getCityInfo();
  },
  methods: {
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

    //获取定位城市
    async getCityInfo() {
      this.cityInfo = await cityGuess();
    },

    //搜索地址--------------------------------------------
    async querySearch(queryString, cb) {
      let city_id = this.cityInfo.id;
      let keyword = queryString;
      try {
        let results = await addressSearch(city_id, keyword);
        if (results instanceof Array) {
          results.map((item) => {
            item.value = item.address;
            return item;
          });
          // 调用 callback 返回建议列表的数据
          cb(results);
        }
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message,
        });
      }
    },
    handleSelect(item) {
      // console.log(item);
    },
    //----------------------------------------------

    //选择优惠活动的回调------------------------
    selectActivities(select) {
      this.$prompt("请输入活动详情", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          if (value == null) {
            this.$message({
              type: "info",
              message: "请输入活动详情",
            });
          } else {
            let newActivity = {};

            switch (select) {
              case "reduce":
                newActivity = {
                  icon_name: "减",
                  name: "满减优惠",
                  description: value,
                };
                break;
              case "special":
                newActivity = {
                  icon_name: "特",
                  name: "优惠大酬宾",
                  description: value,
                };
                break;
              case "newUser":
                newActivity = {
                  icon_name: "新",
                  name: "新用户立减",
                  description: value,
                };
                break;
              case "voucher":
                newActivity = {
                  icon_name: "领",
                  name: "进店领券",
                  description: value,
                };
                break;
            }
            this.activities.push(newActivity);
            this.$message({
              type: "success",
              message: "优惠活动添加成功",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    //删除优惠活动按钮
    handleDelete(index) {
      this.activities.splice(index, 1);
    },
    //-------------------------------------------------

    handleChange() {},

    //上传图片
    handleAvatarSuccess(res, file) {
      if (res.status == 1) {
        this.form.image_path = res.image_path;
      }
    },
    handleBusinessLicenseSuccess(res) {
      if (res.status == 1) {
        this.form.business_license_image = res.image_path;
      }
    },
    handleCateringLicenseSuccess(res) {
      if (res.status == 1) {
        this.form.catering_service_license_image = res.image_path;
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
    //提交表单创建店铺按钮
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // alert("submit!");
          const shopInfo = this.form;
          let result = await reqAddRestaurant(shopInfo);
          try {
            if (result.status == 1) {
              this.$message({
                type: "success",
                message: "添加成功",
              });
              //还原form相关数据为默认状态
              this.form = {
                name: "", //店铺名字
                address: "", //店铺地址
                phone: null, //店铺联系方式
                description: "", //店铺简介
                promotion_info: "", //店铺标语
                categoryValue: [], //店铺分类
                is_premium: false, //品牌商铺
                delivery_mode: false, //蜂鸟专送
                is_new: false, //新开店铺(后台字段为new，js禁止使用该字段)
                bao: false, //支持保险
                zhun: false, //准时达
                piao: false, //开发票
                float_delivery_fee: 5, //配送费
                float_minimum_order_amount: 20, //起送价
                startTime: "", //营业起始时间
                endTime: "", //营业结束时间
                image_path: "", //店铺头像
                business_license_image: "", //营业执照
                catering_service_license_image: "", //餐饮服务许可证
              };
              this.activities = [
                {
                  icon_name: "减",
                  name: "满减优惠",
                  description: "满30减5，满60减8",
                },
              ];
              this.activitiesValue = [];
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
  },
};
</script>

<style lang="less">
@import "@/style/mixin";

.demo-address {
  display: block;
}

.el-switch {
  margin: 0 5px;
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

.button_submit {
  margin-top: 20px;
  text-align: center;
}
</style>