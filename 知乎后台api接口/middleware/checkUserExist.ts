const { User } = require('../model/user')

module.exports = async(req: any, res: any, next: Function) => {
    const user =await User.findById(req.params.id)
    if (!user) return res.out(404,'用户不存在')
    next()
}