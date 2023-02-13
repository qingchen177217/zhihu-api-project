export const {Answer}=require('../model/answers')

module.exports=async(req:any,res:any,next:Function)=>{
    const answer=await Answer.findById(req.params.id).select("+answerer")
    if(!answer)return res.out(404,'答案不存在')

    //判断问题下面有没有答案
    if(answer.questionId !== req.params.questionId){
        return res.out(404,'该问题没有答案')
    }
    next()
}