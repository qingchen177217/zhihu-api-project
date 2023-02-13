
// 引入model
const { Category } = require('../model/categories')


// 获取分类列表
exports.getCategoryList = async (req: any, res: any, next: Function) => {
    try {
        // 分页系统
        const page = Math.max(req.query.page * 1, 1) - 1;
        // 每页有几条数据
        const { per_page = 10 } = req.query//默认查询10条数据
        const perPage = Math.max(per_page * 1, 1)
        const keyword = new RegExp(req.query.keyword)

        //  查询所有分类
        const category = await Category.find({ name: keyword }).limit(perPage).skip(perPage * page)

        if (!category) return res.out(400, '查找分类列表失败')

        res.status(200).json({
            code: "200",
            msg: "分类获取成功",
            data: category
        })
    } catch (err) {
        next(err)
    }
}

// 获取分类列表
exports.getCategory = async (req: any, res: any, next: Function) => {
    try {
        //  1.检测分类是否存在
        const id = req.params.id
        if (!id) return res.out(400, '请传入分类id')

        const data = await Category.findById(id)
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
            msg: "分类信息获取成功",
            data
        })
    } catch (err) {
        next(err)
    }
}

//新增分类
exports.createCategory=async(req:any,res:any,next:Function)=>{
    try{
    //    1.检测分类是否存在
    const data=req.body

    let cate=await Category.findOne(data)
    // 2.若分类信息已存在
    if(cate){
        return res.status(400).json({
            code:400,
            msg:"分类已存在",
            value:data
        })
    }

    cate=new Category(data)
    await cate.save()

    res.status(200).json({
        code:200,
        msg:"分类添加成功",
        value:data
    })
    }catch(err){
        next(err)
    }
}

// 更新分类
exports.updateCategory=async(req:any,res:any,next:Function)=>{
    try{
    //   1.检测id是否存在
    const id=req.params.id
    if(!id)return res.out(400,'请传入id')
  
    // 更新
    const data=await Category.findByIdAndUpdate(id,req.body,{new:true})
    if(!data)return res.status(400).json({
        code:400,
        msg:"编辑分类失败",
        value:req.body
    })
    res.status(200).json({
        code:200,
        msg:"编辑分类成功",
        data
    })

    }catch(err){
        next(err)
    }
}

// 删除分类
exports.deleteCategory=async (req:any,res:any,next:Function)=>{
    try{
        const id=req.params.id
        if(!id)return res.out(400,'请传入id')
        
        const data=await Category.findByIdAndDelete(id)

        if(!data)return res.out(400,'删除失败')

        res.status(200).json({
            code:200,
            msg:"删除分类成功",
            data
        })

    }catch(err){
        next(err)
    }
}
























