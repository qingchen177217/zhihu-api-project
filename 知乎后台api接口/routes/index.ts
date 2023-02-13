export const router=require('express').Router()


//用户接口
router.use('/user',require('./user'))


router.use('/auth',require('./auth'))

// 上传文件接口
router.use('/upload',require('./uploade'))

//话题模块接口
router.use('/topics',require('./topics'))

// 问题模块接口
router.use('/question',require('./question'))

//在问题接口的后面，匹配问题的id，然后进行回答
//答案接口
router.use('/question',require('./answers'))

// 评论接口
router.use('/question',require('./comment'))

// 文章分类接口
 router.use('/category',require('./categories'))

// 文章接口
router.use('/article',require('./article'))

module.exports=router
