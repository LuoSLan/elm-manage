<template>
  <div class="header_container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        v-for="(bread, index) in this.$route.meta"
        :key="index"
        >{{ bread }}</el-breadcrumb-item
      >
    </el-breadcrumb>
    <el-dropdown
      @command="handleCommand"
      class="dropdown_container"
      placement="bottom"
    >
      <img :src="baseImgPath + adminInfo.avatar" class="avatar" />
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="home">首页</el-dropdown-item>
        <el-dropdown-item command="signOut">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { signOut } from "network/getData";
import { baseImgPath } from "@/config/env";
import { mapActions, mapState } from "vuex";

export default {
  name: "HeadTop",
  computed: {},
  data() {
    return {
      baseImgPath,
    };
  },
  created() {
    if (!this.adminInfo.id) {
      this.getAdminData();
    }
  },
  computed: {
    ...mapState(["adminInfo"]),
  },
  methods: {
    ...mapActions(["getAdminData"]),
    async handleCommand(command) {
      if (command == "home") {
        console.log(command);
        this.$router.push("/manage");
      } else if (command == "signOut") {
        const result = await signOut();
        console.log(result);
        if (result.status == 1) {
          this.$message({
            type: "success",
            message: result.success,
          });
        } else {
          this.$message({
            type: "error",
            message: result.message,
          });
        }
      }
    },
  },
};
</script>

<style scoped>
.header_container {
  display: flex;
  justify-content: space-between;
  padding: 20px 20px 0 20px;
}
.dropdown_container {
  margin-right: 10px;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;

  text-align: center;
}
</style>