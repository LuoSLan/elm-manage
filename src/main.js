import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//引入全局组件
import HeadTop from 'components/HeadTop'
//全局组件注册
Vue.component(HeadTop.name, HeadTop)


Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.prototype.$bus = new Vue();

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')