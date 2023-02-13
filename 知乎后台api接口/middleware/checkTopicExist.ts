const { Topic } = require('../model/topics')

module.exports = async(req: any, res: any, next: Function) => {
    const topic =await Topic.findById(req.params.id)
    if (!topic) return res.out(404,'话题不存在')
    next()
}