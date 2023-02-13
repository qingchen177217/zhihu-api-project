import { defineStore } from "pinia";
import { auth as login } from '../api/user'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import { setTokenTime } from "../utils/localStorage";
import router from '../router/index'

const store = defineStore('main', {
    state: () => {
        return {
            token: localStorage.getItem('token') || '',
            selfId:localStorage.getItem('selfId')|| ''
        }
    },
    getters: {
        getToken: (state) => state.token,
        getSelfId:(state)=>state.selfId
    },
    actions: {
        setToken(state: any, token: string,selfId:string) {
            state.token = token
            localStorage.setItem('token', token)
            //将token保存到localStorage中，来获取token
            state.selfId=selfId
             localStorage.setItem('selfId',selfId)
        },
        login(userinfo: any) {
            return new Promise((resolve, reject) => {
                login(userinfo).then((res: any) => {
                    //登录保存token值
                    const {tokenStr,selfId}=res.data
                    this.setToken(this.$state, tokenStr,selfId)
                    //将token和id值都进行取出，然后保存到浏览器中
                    setTokenTime()
                    //设置登陆时间，来进行后续判断是否到达规定时间，退出登录
                    ElMessage({
                        message: '登录成功',
                        type: 'success',
                    })
                    router.replace('/')//登陆成功后，路由跳转到首页
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        logout() {
            this.$state.token = ''
            localStorage.clear()
            router.replace('/loading')
        }
    }
})



export default store








