//设置token时间,以及设置token过期事件，来判断登录的时间
import {TOKEN_TIME,TOKEN_TIME_VALUE}from './token'


export const setTokenTime=()=>{
    //保存登陆时间
    localStorage.setItem(TOKEN_TIME,Date.now().toString())
}

export const getTokenTime=()=>{
    return localStorage.getItem('tokenTime')
}

// 对比token已经登录的时间，如果已经超过设置的登录时间则进行退出重新登录
export const diffTokenTime =()=>{

    const currenTime=Date.now() as any
    const tokenTime=getTokenTime() as any
    
    return (currenTime - tokenTime) >TOKEN_TIME_VALUE
}






















