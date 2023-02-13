export const router=require('express').Router()
const answer=require('../controller/answers')
const {AnswersValidator}=require('../model/answers')
const validator=require('../middleware/validate')
const checkAnswerer=require('../middleware/checkAnswerer')
const checkAnswerExist=require('../middleware/checkAnswerExist')


// 获取答案列表
router.get('/:questionId/answer',answer.getAnswerList)

// 获取指定答案
router.get('/:questionId/answer/:id',checkAnswerExist,answer.getAnswer)

// 新增答案
router.post('/:questionId/answer',validator(AnswersValidator),answer.createAnswer)

//修改答案
router.patch('/:questionId/answer/:id',[validator(AnswersValidator),checkAnswerExist,checkAnswerer],answer.updateAnswer)

// 删除答案
router.delete('/:questionId/answer/:id',[checkAnswerExist,checkAnswerer],answer.deleteAnswer)



module.exports=router