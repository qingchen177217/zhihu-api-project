export const { User } = require('../model/user')
const bcrypt = require('bcryptjs')
const { Question } = require('../model/question')
const { Answer } = require('../model/answers')

// 注册用户  new user({email,password,name}).save
exports.register = async (req: any, res: any, next: Function) => {
    try {
        let { email, name, password } = req.validValue
        // 查询邮箱是否被注册过了
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                code: 400,
                msg: '邮箱已经被注册了，请重新输入',
                data: { email }
            })
        }

        // 对密码进行加密
        password = await bcrypt.hashSync(password, 10)

        // 创建use实例 
        new User({
            email, password, name
        }).save()

        // 进行数据存储
        // await  user.save()

        // 成功的响应
        res.out(200, '注册用户成功')
    } catch (err) {
        next(err)
    }
}

// 获取所有用户列表 user.find()
exports.getUserList = async (req: any, res: any, next: Function) => {
    try {
        // 查询所有用户
        let userList = await User.find()
        // 若用户列表不存在，返回失败响应
        if (!userList) return res.out(400, '用户列表不存在')

        //  若用户列表存在，返回成功的响应
        res.status(200).json({
            code: 200,
            data: { userList }
        })

    } catch (err) {
        next(err)
    }
}

// 获取单个用户 user.findById(数据库自带Id)
exports.getUser = async (req: any, res: any, next: Function) => {
    try {
        const { field = "" } = req.query
        console.log(field);
        
        // 查询所有用户
        const userId = req.params.id

        const selectField = field.split(';').filter((f: any) => f).map((f: any) => " +" + f).join("")

        // 查询优化，获取特定的属性，而不是返回所有结果，
        // 如果field传输了education，就只显示这个属性的内容
        const populateStr = field.split(';').filter((f: any) => f).map((f: any) => {
            if (f === 'education') return "education.school education.major"
            if (f === 'employments') return "employments.company employments.job"
            return f
        }).join(" ")

        // 对params中field中传输过来的参数进行格式化，解构出来，
        let user = await User.findById(userId).select(selectField)
            .populate(populateStr)

        // 若用户列表不存在，返回失败响应
        if (!user) return res.out(400, '用户列表不存在')

        //  若用户列表存在，返回成功的响应
        res.status(200).json({
            code: 200,
            data: { user }
        })
    } catch (err) {
        next(err)
    }
}

//修改指定用户
exports.updateUser = async (req: any, res: any, next: Function) => {
    try {
        let body = req.body
        let userId = req.params.id

        //对更改后的密码再次进行加密存储
        body.password = await bcrypt.hashSync(body.password, 10)

        // 查找并修改
        let data = await User.findByIdAndUpdate(userId, body)

        if (!data) return res.out(400, '更新失败')


        // 更新成功，响应成功信息
        res.status(200).json({
            code: 200,
            msg: '更新用户信息成功',
            data: { body }
        })

    } catch (err) {
        next(err)
    }
}

exports.deleteUser = async (req: any, res: any, next: Function) => {
    try {
        let userId = req.params.id

        const data = await User.findByIdAndDelete(userId)
        // 查找并修改
        if (!data) return res.out(400, '删除失败')

        let body = req.body
        // 更新成功，响应成功信息
        res.status(200).json({
            code: 200,
            msg: '删除用户信息成功',
            data: { body }
        })
    } catch (err) {
        next(err)
    }
}

//获取关注列表
exports.listFollowing = async (req: any, res: any, next: Function) => {
    let userId = req.params.id
    const user = await User.findById(userId).select("+following").populate("following")
    //populate这个属性是查找数据库中的following连接的属性，可以查找到对应的id属性代表的值

    if (!user) return res.out(400, '获取关注列表失败')

    res.status(200).json({
        code: 200,
        msg: '获取关注列表成功',
        data: user
    })
}

//关注
exports.follow = async (req: any, res: any) => {
    let userId = req.auth._id

    const user = await User.findById(userId).select("+following")
    //如果已经关注过了，那我们就直接return 
    if (!user) res.out(404, '用户不存在')
    if (user.following.includes(req.params.id)) return res.out(400, '已关注，关注失败')
    //如果没有关注过，在关注
    user.following.push(req.params.id)

    await user.save()

    res.status(200).json({
        code: 200,
        msg: "关注成功",
        data: user
    })
}
// 取消关注
exports.unfollow = async (req: any, res: any) => {
    let userId = req.auth._id
    const user = await User.findById(userId).select("+following");

    //   获取所有关注用户的索引
    const index = user.following.indexOf(req.params.id)
    //若没有关注，则取消关注
    if (index == -1) return res.out(400, '未关注，取消关注失败')

    //  已关注，就进行取消操作
    user.following.splice(index, 1);
    await user.save()
    res.status(200).json({
        code: 200,
        msg: "取消关注成功",
        data: user
    })
}

// 获取粉丝列表
exports.listFollowers = async (req: any, res: any) => {
    const user = await User.find({ following: req.params.id })
    if (!user) return res.out(400, '查询粉丝列表失败')

    //通过查询数据库中的所有用户的following来查询有多少个人关注
    res.status(200).json({
        code: 200,
        msg: "查询粉丝列表成功",
        data: user
    })


}

//关注话题
exports.followTopic = async (req: any, res: any) => {
    let userId = req.auth._id

    const user = await User.findById(userId).select("+followTopic")
    //如果已经关注过了，那我们就直接return 
    if (!user) res.out(404, '用户不存在')
    if (user.followTopic.includes(req.params.id)) return res.out(400, '已经关注，无法关注')

    //如果没有关注过，在关注
    user.followTopic.push(req.params.id)
    await user.save()

    res.status(200).json({
        code: 200,
        msg: "关注成功",
        data: user
    })
}
// 取消关注话题
exports.unfollowTopic = async (req: any, res: any) => {
    let userId = req.auth._id
    const user = await User.findById(userId).select("+followTopic");

    //   获取所有关注用户的索引，查询是否未关注话题，如果没有则发出错误，无法发出错误
    const index = user.followTopic.indexOf(req.params.id)
    //若没有关注，则取消关注
    if (index == -1) return res.out(400, '未关注，取消关注失败')

    //  已关注，就进行取消操作
    user.followTopic.splice(index, 1);
    await user.save()
    res.status(200).json({
        code: 200,
        msg: "取消关注成功",
        data: user
    })
}

//获取用户关注话题列表
exports.listFollowerTopic = async (req: any, res: any) => {
    let userId = req.params.id
    const user = await User.findById(userId).select("+followTopic").populate("followTopic")
    //populate这个属性是查找数据库中的following连接的属性，可以查找到对应的id属性代表的值

    if (!user) return res.out(400, '获取关注列表失败')
    res.status(200).json({
        code: 200,
        msg: '获取关注列表成功',
        data: user
    })
}

// 话题的粉丝
exports.listTopicFollowers = async (req: any, res: any) => {
    const field = req.query.field.split(';').filter((f: any) => f).map((f: any) => " +" + f).join("")
    const users = await User.find({ followingTopic: req.params.id }).select(field)
    //查询每一个用户的followingTopic属性，来检测是否有req.params.id这个话题
    if (!users) return res.out(400, '获取失败')
    res.status(200).json({
        code: 200,
        msg: "获取成功",
        data: users
    })
}

//获取用户的问题列表
exports.listQuestion = async (req: any, res: any) => {

    const question = await Question.find({ questioner: req.params.id })

    if (!question) return res.out(400, '没有问题被创建，创建一个吧')
    res.status(200).json({
        code: 200,
        msg: "问题列表查询成功",
        data: question
    })
}

/*
点赞
*/
//点赞答案
exports.linkAnswer = async (req: any, res: any, next: Function) => {
    let userId = req.auth._id

    const user = await User.findById(userId).select("+linkAnswers").populate("linkAnswers")

    //这个是统计了并返回了一个对象，所以不可以使用indexOf来查找是否相同

    //查找是否已经点赞过
    const count = user.linkAnswers.find((item: any) => item._id == req.params.id)

    if (count == undefined) {
        //如果没有点赞过，在点赞
        user.linkAnswers.push(req.params.id)

        await Answer.findByIdAndUpdate(req.params.id, { $inc: { voteCount: 1 } })
        await user.save()
        //对点赞数量进行统计添加
        res.status(200).json({
            code: 200,
            msg: "点赞成功",
            data: user
        })
        next()
    } else {
        res.out(400, '点赞失败，已经点赞过')
    }
}

//取消点赞答案
exports.unlinkAnswer = async (req: any, res: any) => {

    let userId = req.auth._id
    const user = await User.findById(userId).select("+linkAnswers");

    //这个则没有进行连接，所以可以查找indexof然后进行检测是否存在，而不用数组的方式进行查找

    //   获取所有关注用户的索引，查询是否未关注话题，如果没有则发出错误，无法发出错误
    const index = user.linkAnswers.indexOf(req.params.id)

    
    if (index > -1) {
        //若已经点赞，则进行取消
        await user.linkAnswers.splice(index, 1)
        //对点赞数量进行减一
        if(res.state===undefined){
            await Answer.findByIdAndUpdate(req.params.id, { $inc: { voteCount: -1 } })
        }
        await user.save()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
    }
    res.status(200).json({
        code: 200,
        msg: "取消点赞成功",
        data: user
    })
}

//点赞答案的列表
exports.listLinkAnswer = async (req: any, res: any) => {

    let userId = req.params.id
    const user = await User.findById(userId).select("+linkAnswers").populate("linkAnswers")
    //populate这个属性是查找数据库中的following连接的属性，可以查找到对应的id属性代表的值

    if (!user) return res.out(400, '获取点赞列表失败')
    res.status(200).json({
        code: 200,
        msg: '获取点赞列表成功',
        data: user
    })
}

/*
点踩
*/
//点踩
exports.dislinkAnswer = async (req: any, res: any, next: Function) => {
    let userId = req.auth._id

    const user = await User.findById(userId).select(" +dislinkAnswer").populate("dislinkAnswer")

    const count = user.dislinkAnswer.find((item: any) => item._id == req.params.id)

    if (count == undefined) {
        //如果没有点踩过，在点踩
        user.dislinkAnswer.push(req.params.id)
        const answer =await Answer.findById(req.params.id)
        if(answer.voteCount>0){
            await Answer.findByIdAndUpdate(req.params.id, { $inc: { voteCount: -1 } })
        }else{
            answer.voteCount=Math.max(answer.voteCount,0)
        }
        await answer.save()
        console.log(answer);
        
        await user.save()
        res.state=true
    //传输值，证明是在点踩之后进行请求取消点赞，不用进行对voteCount数值减一
    next()
    }
}

//取消点踩
exports.undislinkAnswer = async (req: any, res: any, next: Function) => {

    let userId = req.auth._id
    const user = await User.findById(userId).select("+dislinkAnswer");

    // 获取所有关注用户的索引，查询是否未关注话题，如果没有则发出错误，无法发出错误
    const index = user.dislinkAnswer.indexOf(req.params.id)
    if (index > -1) {
        //若已经点踩，则进行取消
        await user.dislinkAnswer.splice(index, 1)
        await user.save()
    }
    // res.status(200).json({
    //         code: 200,
    //         msg: "取消点踩成功",
    //         data: user
    //     })
}

//点踩答案的列表
exports.listDisLinkAnswer = async (req: any, res: any) => {
    let userId = req.params.id
    const user = await User.findById(userId).select("+dislinkAnswer").populate("dislinkAnswer")
    //populate这个属性是查找数据库中的following连接的属性，可以查找到对应的id属性代表的值

    if (!user) return res.out(400, '获取点赞列表失败')
    res.status(200).json({
        code: 200,
        msg: '获取点踩列表成功',
        data: user
    })
}

/*
收藏答案
*/
//收藏答案
exports.collectingAnswer = async (req: any, res: any) => {
    let userId = req.auth._id

    const user = await User.findById(userId).select("+collectingAnswers").populate("collectingAnswers")
    //如果已经关注过了，那我们就直接return 
    if (!user) res.out(404, '用户不存在')

    const count = user.collectingAnswers.find((item: any) => item._id == req.params.id)

    if (count == undefined) {
        //如果没有关注过，在关注
        user.collectingAnswers.push(req.params.id)
        await user.save()

        res.status(200).json({
            code: 200,
            msg: "收藏成功",
            data: user
        })
    } else {
        return res.out(400, '已经收藏，无法收藏')
    }
}
// 取消收藏答案
exports.uncollectingAnswers = async (req: any, res: any) => {

    let userId = req.auth._id
    const user = await User.findById(userId).select("+collectingAnswers")

    //获取所有关注用户的索引，查询是否未关注话题，如果没有则发出错误，无法发出错误
    const index = user.collectingAnswers.indexOf(req.params.id)

    //若没有关注，则取消关注
    if (index == -1) return res.out(400, '未收藏，取消收藏失败')

    //  已关注，就进行取消操作
    user.collectingAnswers.splice(index, 1);
    await user.save()
    res.status(200).json({
        code: 200,
        msg: "取消收藏成功",
        data: user
    })
}


//收藏答案的列表
exports.listCollectingAnswers = async (req: any, res: any) => {
    let userId = req.params.id
    const user = await User.findById(userId).select("+collectingAnswers").populate("collectingAnswers")
    //populate这个属性是查找数据库中的following连接的属性，可以查找到对应的id属性代表的值

    if (!user) return res.out(400, '获取收藏列表失败')
    res.status(200).json({
        code: 200,
        msg: '获取收藏列表成功',
        data: user
    })
}


// 上传头像
exports.uploadAvatar = async (req: any, res: any) => {
    const fileUrl = 'http://127.0.0.1:80' + '/userAvatar/' + req.file.originalname

    const userId = req.auth._id
    const avatar_url = {
        avatar_url: fileUrl
    }

    const user = await User.findByIdAndUpdate(userId, avatar_url).select("+avatar_url").populate("avatar_url")

    if (!user) res.out(400, '上传头像失败')

    res.status(200).json({
        coe: '200',
        msg: "上传头像成功",
        data: user
    })
}




