
const joi=require('jsonwebtoken')

module.exports=(err:Error,req:any,res:any,next:Function)=>{
    // if(err.name==='UnauthorizedError')return  res.out(400,'身份认证失败,无法获取token')
    // if(err instanceof joi.ValidationError){
    //     return res.out(400,err)
    // }
    res.out(500,err)    // 在服务器端输出错误的信息
}