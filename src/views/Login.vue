<template>
  <div class="login_page fillcontain">
    <transition name="form-fade" mode="in-out">
      <section class="form_contianer">
        <div class="manage_tip">
          <p>elm后台管理系统</p>
        </div>
        <el-form
          :model="loginForm"
          :rules="rules"
          status-icon
          ref="loginForm"
          class="demo-ruleForm"
        >
          <el-form-item prop="userName">
            <el-input
              type="text"
              placeholder="用户名"
              v-model="loginForm.userName"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              placeholder="密码"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('loginForm')"
              style="width: 100%; font-size: 16px"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
        <div class="notice">
          <p>温馨提示：</p>
          <p>未登录过的新用户，自动注册</p>
          <p>注册过的用户可凭账号密码登录</p>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
import { login, getAdminInfo } from "@/network/getData";
import { mapActions, mapState } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        userName: "",
        password: "",
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  mounted() {
    if (!this.adminInfo.id) {
      this.$store.dispatch("getAdminData");
    }
  },
  computed: {
    ...mapState(["adminInfo"]),
  },
  methods: {
    ...mapActions(["getAdminData"]),
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let result = await login({
            user_name: this.loginForm.userName,
            password: this.loginForm.password,
          });
          if (result.status == 1) {
            this.$message({
              type: "success",
              message: "登录成功",
            });
            this.$router.push("/manage");
          } else {
            this.$message({
              type: "error",
              message: result.message,
            });
          }
          // console.log(result);
        } else {
          this.$notify.error({
            title: "错误",
            message: "请输入正确的用户名密码",
            offset: 100,
          });
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "@/style/mixin";

.login_page {
  background-color: #324057;
}
.manage_tip {
  position: absolute;
  width: 100%;
  top: -100px;
  left: 0;
  p {
    font-size: 34px;
    color: #fff;
  }
}
.form_contianer {
  .wh(320px, 210px);
  .ctp(320px, 210px);
  padding: 25px;
  border-radius: 5px;
  text-align: center;
  background-color: #fff;
}
.notice {
  margin-top: -10px;
  p {
    font-size: 12px;
    color: #ff0000;
  }
}
</style>