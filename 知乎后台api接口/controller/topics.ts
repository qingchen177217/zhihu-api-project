export const {Topic}=require('../model/topics')
const {Question}=require('../model/question')
//获取话题列表
exports.getTopicsList=async(req:any,res:any,next:Function)=>{
    try{
        //当前是第几页
        //当page传入一个负值后，返回1，来防止数据错误

        const page=Math.max(req.query.page*1,1)-1
        // 每页有几条数据
       
        const {per_page=10}=req.query
        //给per_page一个默认值为2来展示没有输入参数的时候
        const perPage=Math.max(per_page*1,1);

         const topicList=await Topic.find({
            name:new RegExp(req.query.keyword)
         }).limit(perPage).skip(page*perPage)

         //limit(3)是只显示3条数据，skip（3）跳过几条数据
         if(!topicList)return res.out(400,'获取话题列表失败')
         
         res.status(200).json({
            code:200,
            msg:"获取话题列表成功",
            data:topicList
         })   
    }catch(err){
        next(err)
    }
}

//获取指定话题
exports.getTopics=async(req:any,res:any,next:Function)=>{
    try{
        const {field=""}=req.query
        const selectFields=field.split(";").filter((f:any)=>f).map((f:any)=>" +"+f).join("")
        //获取指定用户的
        const topicList=await Topic.findById(req.params.id).select(selectFields)

        if(!topicList)return res.out(400,'获取话题失败')
        
        res.status(200).json({
           code:200,
           msg:"获取话题成功",
           data:topicList
        })   
    }catch(err){
        next(err)
    }
}

// 创建话题
exports.create=async(req:any,res:any,next:Function)=>{
    try{
    //    1.检测话题是否存在
    const data=req.body
    let topic=await Topic.findOne(data)

    // 2.若已经存在，则不创建
     if(topic)return res.status(400).json({
        code:400,
        msg:"该话题已经存在",
        value:data
     })

    // 3.创建我们的数据并返回响应
     new Topic(data).save()

    res.status(200).json({
        code:200,
        msg:"话题添加成功",
        data:data
    })


    }catch(err){
        next(err)
    }
}

// 更新话题
exports.update=async(req:any,res:any,next:Function)=>{
    try{
      let topicId=req.params.id
      const data=await Topic.findByIdAndUpdate(topicId,req.body)
      
      if(!data)return res.status(400).json({
        code:400,
        msg:'话题更新失败',
        value:data
      })

      res.status(200).json({
          code:200,
          msg:"更新话题成功",
          data:req.body
      })

    }catch(err){
        next(err)
    }
}

//获取话题的问题列表
exports.listQuestion=async(req:any,res:any)=>{
    const question=await Question.find({topics:req.params.id})
    // 查询每一个问题，查看里面的topic是否具有传入的id属性值
    if(!question)return res.out(400,'查询话题的问题列表失败')
    res.status(200).json({
        code:200,
        msg:"查询话题的问题列表成功",
        data:question
    })
}


































