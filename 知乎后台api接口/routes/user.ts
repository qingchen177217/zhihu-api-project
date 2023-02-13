const router = require('express').Router()
export const { userValidator } = require('../model/user')

const validator = require('../middleware/validate')
const multer=require('multer')
// 引用文件检测中间件


const user = require('../controller/user')
const checkTopicExist=require('../middleware/checkTopicExist')
const checkUserExist=require('../middleware/checkUserExist')
const checkAnswerExist=require('../middleware/checkAnswerExist')


// const auth=require('../middleware/auth')
// 自定义的接口鉴权中间件，来替代express-jwt了解一下即可

// 注册用户
router.post('/', validator(userValidator), user.register)

// 获取所有用户
router.get('/', user.getUserList)

// 获取指定用户
router.get('/:id', user.getUser)

// 编辑/修改指定用户
router.patch('/:id', validator(userValidator), user.updateUser)

// 删除指定用户
router.delete('/:id', validator(userValidator), user.deleteUser)

//获取关注列表
router.get('/:id/following', user.listFollowing)

// 关注
router.put("/following/:id",checkUserExist, user.follow)

//取消关注
router.delete('/following/:id',checkUserExist, user.unfollow)

// 获取某个用户的粉丝
router.get("/:id/followers", user.listFollowers)

// 关注话题
router.put('/followTopic/:id',checkTopicExist,user.followTopic)

// 取消关注话题
router.delete('/followTopic/:id',checkTopicExist,user.unfollowTopic)

// 获取关注话题列表
router.get('/:id/followTopic',user.listFollowerTopic)

// 获取话题的粉丝
router.get('/:id/followersTopic',user.listTopicFollowers)

//获取用户问题列表
router.get('/:id/question',user.listQuestion)

/*
点赞
*/
// 点赞答案
router.put('/linkAnswers/:id',user.linkAnswer,user.undislinkAnswer)

// 取消点赞
router.delete('/linkAnswers/:id',user.unlinkAnswer)

//点赞列表
router.get('/:id/linkAnswers',user.listLinkAnswer)

/*
点踩
*/
// 点踩答案
router.put('/dislinkAnswers/:id',user.dislinkAnswer,user.unlinkAnswer)

// 取消点踩
router.delete('/dislinkAnswers/:id',user.undislinkAnswer)

//点踩列表
router.get('/:id/dislinkAnswers',user.listDisLinkAnswer)


/*
收藏列表
*/
//收藏
router.put('/collectingAnswers/:id',user.collectingAnswer)

// 取消收藏
router.delete('/collectingAnswers/:id',user.uncollectingAnswers)

// 收藏列表
router.get('/:id/collectingAnswers',user.listCollectingAnswers)


/*
上传头像
*/
const storage=multer.diskStorage({
    destination:function (req:any,file:any,cb:any){
        cb(null,'public/userAvatar')
    },
    filename:function(req:any,file:any,cb:any){
        cb(null,file.originalname)
    }
})

const upload=multer({storage:storage})

router.post('/avatar',upload.single('file'),user.uploadAvatar)





module.exports = router