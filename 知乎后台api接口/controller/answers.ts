export const {Answer}=require('../model/answers')


// 获取答案列表
exports.getAnswerList=async(req:any,res:any,next:Function)=>{
    try{
        //当前是第几页
        //当page传入一个负值后，返回1，来防止数据错误
        const page=Math.max(req.query.page*1,1)-1
        // 每页有几条数据
        
        const {per_page=10}=req.query
        //给per_page一个默认值为2来展示没有输入参数的时候
        const perPage=Math.max(per_page*1,1);

        // 对内容以及答案id描述进行模糊匹配
        const keyword=new RegExp(req.query.keyword)
        
         const AnswerList=await Answer.find({content:keyword,questionId:req.params.questionId})
         .limit(perPage)
         .skip(page*perPage).populate("answerer")

         //limit(3)是只显示3条数据，skip（3）跳过几条数据
         if(!AnswerList)return res.out(400,'获取答案列表失败')
         
         res.status(200).json({
            code:200,
            msg:"获取答案列表成功",
            data:AnswerList
         })   
    }catch(err){
        next(err)
    }
}

// 获取指定答案
exports.getAnswer=async(req:any,res:any,next:Function)=>{
    try{
        const {field=""}=req.query
        const selectFields=field.split(";").filter((f:any)=>f).map((f:any)=>" +"+f).join("")
        //获取指定用户的
        const answer=await Answer.findById(req.params.id).select(selectFields).populate("answerer")

        if(!answer)return res.out(400,'获取答案失败')
        
        res.status(200).json({
           code:200,
           msg:"获取答案成功",
           data:answer
        })   
    }catch(err){
        next(err)
    }
}

// 新增答案
exports.createAnswer=async(req:any,res:any,next:Function)=>{
    try{
    //添加回答者，以及回答问题的id
    
    const answer =new Answer({...req.body,answerer:req.auth._id,questionId:req.params.questionId})
    await answer.save()
    
    res.status(200).json({
        code:200,
        msg:"答案添加成功",
        data:answer
    })
    }catch(err){
        next(err)
    }
}
// 更新答案
exports.updateAnswer=async(req:any,res:any,next:Function)=>{
    try{
      let answerId=req.params.id
      const answer=await Answer.findByIdAndUpdate(answerId,req.body)
      
      if(!answer)return res.status(400).json({
        code:400,
        msg:'答案更新失败',
        value:answer
      })

      res.status(200).json({
          code:200,
          msg:"更新答案成功",
          data:req.body
      })
    }catch(err){
        next(err)
    }
}
// 删除答案
exports.deleteAnswer=async(req:any,res:any,next:Function)=>{
    try{
        const data=await Answer.findByIdAndDelete(req.params.id)

        if(!data)res.out(400,'删除答案失败')

        res.status(200).json({
            code:200,
            msg:"删除答案成功",
            data:data
        })
    }catch(err){
        next(err)
    }
}