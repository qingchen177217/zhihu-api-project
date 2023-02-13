export const {Question}=require('../model/question')


// 获取问题列表
exports.getQuestionList=async(req:any,res:any,next:Function)=>{
    try{
        //当前是第几页
        //当page传入一个负值后，返回1，来防止数据错误
        const page=Math.max(req.query.page*1,1)-1
        // 每页有几条数据
       
        const {per_page=10}=req.query
        //给per_page一个默认值为2来展示没有输入参数的时候
        const perPage=Math.max(per_page*1,1);


        // 对标题以及问题描述进行模糊匹配
        // 提供了{$or:[{title:keyword},{description:keyword}]}来多次匹配
        const keyword=new RegExp(req.query.keyword)
         const questionList=await Question.find({$or:[{title:keyword},{description:keyword}]})
         .limit(perPage)
         .skip(page*perPage).select("+topics").populate("topics")

         //limit(3)是只显示3条数据，skip（3）跳过几条数据
         if(!questionList)return res.out(400,'获取问题列表失败')
         
         res.status(200).json({
            code:200,
            msg:"获取问题列表成功",
            data:questionList
         })   
    }catch(err){
        next(err)
    }
}

// 获取指定问题
exports.getQuestion=async(req:any,res:any,next:Function)=>{
    try{
        console.log(req.params.id);
        
        const {field=""}=req.query
        const selectFields=field.split(";").filter((f:any)=>f).map((f:any)=>" +"+f).join("")
        //获取指定用户的
        const question=await Question.findById(req.params.id).select(selectFields).populate("questioner")

        if(!question)return res.out(400,'获取问题失败')
        
        res.status(200).json({
           code:200,
           msg:"获取问题成功",
           data:question
        })   
    }catch(err){
        next(err)
    }
}
// 新增问题
//不需要进行检查问题是否存在，问题可以有多个创建者
exports.createQuestion=async(req:any,res:any,next:Function)=>{
    try{
    const question =new Question({...req.body,questioner:req.auth._id})
    await question.save()
    res.status(200).json({
        code:200,
        msg:"问题添加成功",
        data:question
    })
    }catch(err){
        next(err)
    }
}
// 更新问题
exports.updateQuestion=async(req:any,res:any,next:Function)=>{
    try{
      let questionId=req.params.id
      const question=await Question.findByIdAndUpdate(questionId,req.body)
      
      if(!question)return res.status(400).json({
        code:400,
        msg:'问题更新失败',
        value:question
      })

      res.status(200).json({
          code:200,
          msg:"更新问题成功",
          data:req.body
      })
    }catch(err){
        next(err)
    }
}
// 删除问题
exports.deleteQuestion=async(req:any,res:any,next:Function)=>{
    try{
        const data=await Question.findByIdAndDelete(req.params.id)

        if(!data)res.out(400,'删除问题失败')

        res.status(200).json({
            code:200,
            msg:"删除问题成功",
            data:data
        })
    }catch(err){
        next(err)
    }
}