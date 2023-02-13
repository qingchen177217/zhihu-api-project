export const {Comment}=require('../model/comment')


// 获取评论列表
exports.getCommentList=async(req:any,res:any,next:Function)=>{
    try{
        //当前是第几页
        //当page传入一个负值后，返回1，来防止数据错误
        const page=Math.max(req.query.page*1,1)-1
        // 每页有几条数据
       
        const {per_page=10}=req.query
        //给per_page一个默认值为2来展示没有输入参数的时候
        const perPage=Math.max(per_page*1,1);

        // 对标题以及评论描述进行模糊匹配
        // 提供了{$or:[{title:keyword},{description:keyword}]}来多次匹配
        const keyword=new RegExp(req.query.keyword)
        const {questionId,answerId}=req.params
        // const {rootCommentId}=req.query


        //通过questionId来查询评论的id，查询回答的id
         const CommentList=await Comment.find({content:keyword,questionId,answerId})
         .limit(perPage)
         .skip(page*perPage)
         .populate("commentator replyTo")

         //limit(3)是只显示3条数据，skip（3）跳过几条数据
         if(!CommentList)return res.out(400,'获取评论列表失败')
         
         res.status(200).json({
            code:200,
            msg:"获取评论列表成功",
            data:CommentList
         })   
    }catch(err){
        next(err)
    }
}

// 获取指定评论
exports.getComment=async(req:any,res:any,next:Function)=>{
    try{
        const {field=""}=req.query
        const selectFields=field.split(";").filter((f:any)=>f).map((f:any)=>" +"+f).join("")
        //获取指定用户的
        const comment=await Comment.findById(req.params.id).select(selectFields).populate("commentator")

        if(!comment)return res.out(400,'获取评论失败')
        
        res.status(200).json({
           code:200,
           msg:"获取评论成功",
           data:comment
        })   
    }catch(err){
        next(err)
    }
}
// 新增评论
//不需要进行检查评论是否存在，评论可以有多个创建者
exports.createComment=async(req:any,res:any,next:Function)=>{
    try{
    const {questionId,answerId}=req.params
    const commentator=req.auth._id
    const comment =new Comment({...req.body,commentator,questionId,answerId,answerer:req.auth._id})
    await comment.save()
    res.status(200).json({
        code:200,
        msg:"评论添加成功",
        data:comment
    })
    }catch(err){
        next(err)
    }
}
// 更新评论
exports.updateComment=async(req:any,res:any,next:Function)=>{
    try{
      let CommentId=req.params.id

      const {content}=req.body
      const comment=await Comment.findByIdAndUpdate(CommentId,content)
      
      if(!comment)return res.status(400).json({
        code:400,
        msg:'评论更新失败',
        value:comment
      })

      res.status(200).json({
          code:200,
          msg:"更新评论成功",
          data:req.body
      })
    }catch(err){
        next(err)
    }
}
// 删除评论
exports.deleteComment=async(req:any,res:any,next:Function)=>{
    try{
        const data=await Comment.findByIdAndDelete(req.params.id)

        if(!data)res.out(400,'删除评论失败')

        res.status(200).json({
            code:200,
            msg:"删除评论成功",
            data:data
        })
    }catch(err){
        next(err)
    }
}