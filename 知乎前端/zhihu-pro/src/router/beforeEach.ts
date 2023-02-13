import router from './index'
import { startLoading, endLoading } from '../utils/loading-animate/index'
import store from '../store/index'


// 设置白名单，用户没有登录也可以访问的页面
let whiteList = ['/loading']


router.beforeEach((to: any, from: any, next: Function) => {
    const usestore=store()
    document.title = to.meta.title as string || '知心-抚慰你内心的伤痛'
    startLoading()
    if (usestore.getToken) {
          if(to.path=='/loading'){//如果是从loading来的，则定位到首页
            next('/')
          }else{//如果是其他页面则不指定去的地方
            next()
          }
    }else{
        if(whiteList.includes(to.path)){
            //如果白名单内包括路由，则进行跳转
            next()
        }else{
            next('/loading')
            //如果都没有就指定跳转到登录页
        }
    }


})

router.afterEach((to: any, from: any) => {
    endLoading()
})





