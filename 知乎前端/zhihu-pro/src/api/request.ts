import axios from 'axios'
import {ElMessage}from 'element-plus'
import 'element-plus/es/components/message/style/css'
import store from '../store'
import { diffTokenTime } from '../utils/localStorage'


const request=axios.create({
    baseURL:import.meta.env.VITE_BASE_URL,
    timeout:5000
})


//设置默认token值
request.interceptors.request.use(request=>{
    const usestore=store()

    if(localStorage.getItem('token')){
        if(diffTokenTime()){
            //token过期退出登录页
            usestore.logout();
            return Promise.reject(new Error('token失效了'))             
        }   
    }
    //请求拦截器，请求时将自己的token携带
    request.headers!.Authorization=localStorage.getItem('token') as string 
    return request
},error=>{
    return Promise.reject(new Error(error))
}) 


request.interceptors.response.use(response=>{
   const {data}=response
   if(data.code=='200'||data.code=='201'){
    //当请求成功后，将响应的data值进行解构出来传输
        return data
   }
},error=>{
    error.response && ElMessage.error(error.response.data.msg)
    return Promise.reject(new Error(error))
})


export default  request
















