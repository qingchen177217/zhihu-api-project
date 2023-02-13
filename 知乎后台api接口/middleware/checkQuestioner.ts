export const {Question}=require('../model/question')

module.exports=async(req:any,res:any,next:Function)=>{
    const question=await Question.findById(req.params.id).select("+questioner")
    if(question.questioner.toString() !== req.auth._id)return res.out(400,'无权限')

    next()
}