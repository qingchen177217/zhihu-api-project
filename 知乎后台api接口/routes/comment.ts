export const router=require('express').Router()
const comment=require('../controller/comment')
const {commentValidator}=require('../model/comment')
const validator=require('../middleware/validate')
const checkcommenter=require('../middleware/checkCommentator')
const checkcommentExist=require('../middleware/checkCommentExist')


// 获取评论列表
router.get('/:questionId/answer/:answerId/comment',comment.getCommentList)

// 获取指定评论
router.get('/:questionId/answer/:answerId/comment/:id',checkcommentExist,comment.getComment)

// 新增评论
router.post('/:questionId/answer/:answerId/comment',validator(commentValidator),comment.createComment)

//修改评论
router.patch('/:questionId/answer/:answerId/comment/:id',[validator(commentValidator),checkcommentExist,checkcommenter],comment.updateComment)

// 删除评论
router.delete('/:questionId/answer/:answerId/comment/:id',[checkcommentExist,checkcommenter],comment.deleteComment)



module.exports=router