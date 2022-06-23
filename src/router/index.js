import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

//一级路由
const Login = () =>
  import ('../views/Login.vue')
const Manage = () =>
  import ('../views/Manage.vue')

//二级路由
const Home = () =>
  import ('../views/Home.vue')
const UserList = () =>
  import ('../views/dataManage/UserList.vue')
const ShopList = () =>
  import ('../views/dataManage/ShopList.vue')
const FoodList = () =>
  import ('../views/dataManage/FoodList.vue')
const OrderList = () =>
  import ('../views/dataManage/OrderList.vue')
const AdminList = () =>
  import ('../views/dataManage/AdminList.vue')
const AddShop = () =>
  import ('../views/addData/AddShop.vue')
const AddGoods = () =>
  import ('../views/addData/AddGoods.vue')
const Visitor = () =>
  import ('../views/chart/Visitor.vue')
const VueEdit = () =>
  import ('../views/edit/VueEdit.vue')
const AdminSet = () =>
  import ('../views/set/AdminSet.vue')
const Explain = () =>
  import ('../views/explain/Explain.vue')



const routes = [{
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/manage',
    component: Manage,
    children: [
      //首页
      {
        path: '',
        component: Home,

      },
      //数据管理分类
      {
        path: '/userList',
        component: UserList,
        meta: ['数据管理', '用户列表']
      },
      {
        path: '/shopList',
        component: ShopList,
        meta: ['数据管理', '商家列表']
      },
      {
        path: '/foodList',
        component: FoodList,
        meta: ['数据管理', '食品列表']
      },
      {
        path: '/orderList',
        component: OrderList,
        meta: ['数据管理', '订单列表']
      },
      {
        path: '/adminList',
        component: AdminList,
        meta: ['数据管理', '管理员列表']
      },
      //添加数据分类
      {
        path: '/addShop',
        component: AddShop,
        meta: ['添加数据', '添加商铺']
      },
      {
        path: '/addGoods',
        component: AddGoods,
        meta: ['添加数据', '添加商品']
      },
      //图表分类
      {
        path: '/visitor',
        component: Visitor,
        meta: ['图表', '用户分布']
      },
      //编辑分类
      {
        path: '/vueEdit',
        component: VueEdit,
        meta: ['编辑', '文本编辑']
      },
      //设置分类
      {
        path: '/adminSet',
        component: AdminSet,
        meta: ['设置', '管理员设置']
      },
      //说明分类
      {
        path: '/explain',
        component: Explain,
        meta: ['说明', '说明']
      },
    ]
  }

]

const router = new VueRouter({
  mode: '',
  base: process.env.BASE_URL,
  routes
})

export default router