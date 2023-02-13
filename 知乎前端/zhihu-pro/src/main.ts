import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/normalize.css'
import './router/beforeEach'
import router from './router/index'
import { createPinia } from 'pinia'
//引入el-icon来解决elment的显示错误
import * as Elicons from '@element-plus/icons-vue';
//引入Elmessage和Elloading的css样式文件
import 'element-plus/theme-chalk/el-loading.css';
import 'element-plus/theme-chalk/el-message.css';



const app=createApp(App)
const store=createPinia()//全局注册pinia

//全局注册elementplus icon
Object.keys(Elicons).forEach((key) => {
  // 如果使用的是ts语法，加上as keyof typeof Elicons可避免报错
    app.component(key, Elicons[key as keyof typeof Elicons]);
});



app.use(router)
app.use(store)





app.mount('#app')
