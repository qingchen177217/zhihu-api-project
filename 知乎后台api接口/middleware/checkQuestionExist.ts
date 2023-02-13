export const {Question}=require('../model/question')
module.exports=(req:any,res:any,next:Function)=>{
    const question=Question.findById(req.params.id).select("+questioner")
    if(!question)return res.out(404,'问题不存在')

    next()
}

















