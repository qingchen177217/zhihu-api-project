export const router=require('express').Router()
const Article=require('../controller/article')
const {articleValidator}=require('../model/article')
const validator=require('../middleware/validate')



// 获取文章列表
router.get('/',Article.getArticleList)

// 获取指定文章
router.get('/:id',Article.getArticle)

// 新增文章
router.post('/',validator(articleValidator),Article.createArticle)

//修改文章
router.patch('/:id',validator(articleValidator),Article.updateArticle)

// 删除文章
router.delete('/:id',Article.deleteArticle)



module.exports=router