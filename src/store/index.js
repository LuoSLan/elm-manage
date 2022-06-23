import Vue from 'vue'
import Vuex from 'vuex'

import { getAdminInfo, reqUserCount, reqUserList } from '@/network/getData'

Vue.use(Vuex)

const state = {
  adminInfo: {
    avatar: 'default.jpg'
  },
  userList: [],
  userCount: null,
}

const getters = {

}

const mutations = {
  saveAdminInfo(state, adminInfo) {
    state.adminInfo = adminInfo
  },
  saveUserList(state, userList) {
    state.userList = userList
  },
  saveUserCount(state, userCount) {
    state.userCount = userCount
  }
}

const actions = {
  async getAdminData({ commit }) {
    let result = await getAdminInfo()
      // console.log(result);
    if (result.status == 1) {
      commit('saveAdminInfo', result.data)
    }
  },
  //获取用户总数量
  async getUserCount({ commit }) {
    let result = await reqUserCount()
    if (result.status == 1) {
      commit('saveUserCount', result.count)
    } else {
      return Promise.reject(new Error(result.message))
    }

  },
  //获取用户列表
  async getUserList({ commit }, data) {
    let result = await reqUserList(data)
    commit('saveUserList', result)
  }
}
const modules = {

}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules,
})