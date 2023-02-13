export const {Comment}=require('../model/comment')

module.exports=async(req:any,res:any,next:Function)=>{
    const answer=await Comment.findById(req.params.id).select("+commentator")
    if(!answer)return res.out(404,'评论不存在')

    //判断问题下面有没有答案
    if(req.params.questionId && Comment.questionId !== req.params.questionId){
        return res.out(404,'该评论下没有答案')
    }

    if(req.params.answerId&& Comment.answerId !== req.params.answerId){
        return res.out(404,'该答案下没有评论')
    }
    next()
}