import request from './request'
 

export const getUserList=()=>{//获取用户列表
    return request({
        url:'user'
    })
}

export const auth=(data:any)=>{//登录账号
    return request({
        url:'auth',
        method:"POST",
       data
    })
}

export const signUser=(data:any)=>{//注册账号
    return request({
        url:'user',
        method:'POST',
        data
    })
}

export const getUser=(id:string,data:string)=>{//获取单个用户信息
      return request({
        url:`user/${id}`,
        params:{
            field:data
        }
      })
}























