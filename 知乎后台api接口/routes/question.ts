export const router=require('express').Router()
const question=require('../controller/question')
const {questionValidator}=require('../model/question')
const validator=require('../middleware/validate')
const checkQuestioner=require('../middleware/checkQuestioner')
const checkQuestionExist=require('../middleware/checkQuestionExist')


// 获取问题列表
router.get('/',question.getQuestionList)

// 获取指定问题
router.get('/:id',checkQuestionExist,question.getQuestion)

// 新增问题
router.post('/',validator(questionValidator),question.createQuestion)

//修改问题
router.patch('/:id',[validator(questionValidator),checkQuestionExist,checkQuestioner],question.updateQuestion)

// 删除问题
router.delete('/:id',[checkQuestionExist,checkQuestioner],question.deleteQuestion)



module.exports=router