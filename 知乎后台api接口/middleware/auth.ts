const jwt = require('jsonwebtoken')

export const { jwt_key } = require('../config/index')


module.exports = function (req: any, res: any, next:Function) {
    //  前端在请求接口的时候，需要在header,带上后端生成的token
    // 保存数据token
    const token = req.header('authorization')
    // 检测的时候不存在token
    if (!token) {
        return res.out(400, 'Unauthorization 无token')
    }
    // 当token存在的时候，验证是否有效
    const  userData=jwt.verify(token,jwt_key.jwtSecretKey)

    req.userData = userData
    
    // 将token解析值存储在req.userData
    next()
}

























