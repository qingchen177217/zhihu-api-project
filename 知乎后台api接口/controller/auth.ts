
const bcrypt=require('bcryptjs')
export const {User}= require('../model/user')


exports.login=async (req:any,res:any,next:Function)=>{
     try{
        //  获取用户校验过后的数据
        const validValue=req.validValue
        
        // 检测用户是否存在
        let  user= await User.findOne({email:validValue.email}).select('+password')
        // 如果用户不存在，直接返回错误
        if(!user){
            res.out(400,'用户不存在')
        }
        // 检测用户名称是否正确
        if(validValue.name!==user.name){
            res.out(400,'用户名称错误，请重新输入')
        }

        // 如果用户存在，检测密码是否正确
        const is_password=bcrypt.compareSync(validValue.password,user.password)
        
        // 如果密码不正确，返回失败的响应
        if(!is_password){
           res.out(400,'密码错误，请重新输入')
        }

        // 登录成功，响应成功的信息
        const selfId=user._id
        
        res.status(200).json({
            code:'200',
            msg:'用户登陆成功',
            data:{
                tokenStr:'Bearer '+user.generateToken(),
                selfId
            }
        })
     }catch(err){
        next(err)
     }
} 