
// 引入model
const { Article } = require('../model/article')


// 获取文章列表
exports.getArticleList = async (req: any, res: any, next: Function) => {
    try {
        // 分页系统
        const {status,category}=req.query
        let data;
        if(status||category){
            //如果传入值，就根据传入的值尽心查询
            data=await Article.find(req.query)
        }else{
            //如果没有传入，就直接进行查询
            data=await Article.find()
        }
        res.status(200).json({
            code: "200",
            msg: "文章获取成功",
            data
        })
    } catch (err) {
        next(err)
    }
}

// 获取文章列表
exports.getArticle = async (req: any, res: any, next: Function) => {
    try {
        //  1.检测文章是否存在
        const id = req.params.id
        if (!id) return res.out(400, '请传入文章id')

        //查询category,author字段
        const data = await Article.findById(id).populate("category author")
        if (!data) {
            return res.status(200).json({
                code: "200",
                msg: "获取信息失败，请稍后失败",
                value: {
                    id
                }
            })
        }

        res.status(200).json({
            code: 200,
            msg: "文章信息获取成功",
            data
        })
    } catch (err) {
        next(err)
    }
}

//新增文章
exports.createArticle=async(req:any,res:any,next:Function)=>{
    try{
    //    1.检测文章是否存在
    let data=new Article(Object.assign(req.body,{author:req.auth._id}))
    await data.save()
    res.status(200).json({
        code:200,
        msg:"文章添加成功",
        data
    })
    }catch(err){
        next(err)
    }
}

// 更新文章
exports.updateArticle=async(req:any,res:any,next:Function)=>{
    try{
    //   1.检测id是否存在
    const id=req.params.id
    if(!id)return res.out(400,'请传入id')
  
    // 更新
    const data=await Article.findByIdAndUpdate(id,req.body,{new:true})
    if(!data)return res.status(400).json({
        code:400,
        msg:"编辑文章失败",
        value:req.body
    })
    res.status(200).json({
        code:200,
        msg:"编辑文章成功",
        data
    })

    }catch(err){
        next(err)
    }
}

// 删除文章
exports.deleteArticle=async (req:any,res:any,next:Function)=>{
    try{
        const id=req.params.id
        if(!id)return res.out(400,'请传入id')
        
        const data=await Article.findByIdAndDelete(id)

        if(!data)return res.out(400,'删除失败')

        res.status(200).json({
            code:200,
            msg:"删除文章成功",
            data
        })

    }catch(err){
        next(err)
    }
}
























