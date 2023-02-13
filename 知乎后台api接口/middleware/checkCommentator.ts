export const {Comment}=require('../model/comment')

module.exports=async(req:any,res:any,next:Function)=>{
    const comment=await Comment.findById(req.params.id).select('+commentator')
    
    if(comment.commentator.toString() !== req.auth._id)return res.out(400,'没有权限进行修改')
    next()
}