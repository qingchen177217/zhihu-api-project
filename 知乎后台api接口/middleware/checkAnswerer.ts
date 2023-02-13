const {Answer}=require('../model/answers')

module.exports=async(req:any,res:any,next:Function)=>{
    const answer=await Answer.findById(req.params.id).select('+answerer')
    if(answer.answerer.toString() !== req.auth._id)return res.out(400,'没有权限进行修改')
    next()
}