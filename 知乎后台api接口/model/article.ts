
const mongoose = require('mongoose')

export const joi = require('joi')
joi.objectId = require('joi-objectid')(joi)


const articleSchema = new mongoose.Schema({

    // 创建问题的数据模型
    _v: {
        type: Number,
        select: false
    },
    title: {
        type: String,
        required: true,
        maxlength: 50,
    },
    content: {
        type: String,
        required: true,
        maxlength: 200,
        minlength: 2
    },
    status: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true })

function articleValidator(data: any) {
    //对传输过来的问题数据进行校验
    const schema = joi.object({
        title: joi.string().min(2).max(50).required().messages({
            "string.base": "title必须为String",
            "string.min": "title最少为2个字符",
            "string.max": "title最多为50个字符",
            "any.required": "缺少必选参数title"
        }),
        content: joi.string().min(2).max(200).required().messages({
            "string.base": "content必须为String",
            "string.min": "content最少为2个字符",
            "string.max": "content最多为200个字符",
            "any.required": "缺少必选参数content"
        }),
        status: joi.string().min(2).max(50).required().messages({
            "string.base": "status必须为String",
            "any.required": "缺少必选参数title",
            "any.only": "volid取值有误，可选值为published|drafted|trashed"
        }),
        category: joi.objectId().required().messages({
            "string.pattern.name": "category格式有误，应为ObjectId格式",
            "any.required": "category必须设置"
        })
    })
    return schema.validate(data)
}


// 创建model
const Article = mongoose.model('Article', articleSchema)

module.exports = {
    Article,
    articleValidator
}
