export const router=require('express').Router()
const topic=require('../controller/topics')
const validator=require('../middleware/validate')
const {topicValidator}=require('../model/topics')
const checkTopicExist=require('../middleware/checkTopicExist')
//获取话题列表
router.get('/',topic.getTopicsList)

// 获取指定话题
router.get('/:id',topic.getTopics)

// 创建话题
router.post('/',validator(topicValidator),topic.create)

// 更新话题
router.patch('/:id',validator(topicValidator),topic.update)

// 话题的粉丝
router.get('/:id/questions',checkTopicExist,topic.listQuestion)



module.exports=router