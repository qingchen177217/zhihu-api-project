const jwt = require('jsonwebtoken')
export const { jwt_key } = require('../config/index')


const mongoose = require('mongoose')

// 引入joi
const joi = require('joi')
joi.objectId = require('joi-objectid')(joi)


// 定义user结构
const userSchema = new mongoose.Schema({
   //邮箱
   email: {//定义字段的类型，以及各种属性，和mysql不同的是，mongodb直接在这创建
      type: String,
      required: true,
      minlength: 6,
      maxlength: 30,
      unique: true
   },
   //用户名
   name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 20
   },
   //密码
   password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 1000,
      select: false
   },
   //隐藏版本信息
   __v: {
      type: Number,
      select: false
   },

   // 个人资料部分
   //   封面/头像
   avatar_url: {
      type: String,
      default:'http://127.0.0.1:80/userAvatar/codezhennan.jpg'
   },
   // 性别
   gender: {
      type: String,
      enum: ['male', 'female'],
      default: 'male',
      required: true
   },
   //一句话介绍
   headline: {
      type: String
   },
   //居住地
   locations: {
      type: [{
         type: mongoose.Schema.Types.ObjectId, ref: "Topic"
      }],
      select: false
   },
   // 行业
   business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      select: false
   },
   //职业经历  
   employments: {
      type: [{
         company: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
         job: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" }
      }],
      select: false
   },
   // 教育经历
   education: {
      type: [{
         school: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
         major: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
         diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
         entrance_year: Number,
         grations_year: Number
      }],
      select: false
   },


   //关注与粉丝部分
   following: {
      type: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
         }
      ],
      //通过id连接到对应用户的信息
      select: false
   },

   // 话题部分
   followTopic: {
      type: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: "Topic"
      }],
      select: false
   },

   dislinkAnswer: {
      type: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: "Answer"
      }],
      select: false
   },
   linkAnswers: {
      type: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: "Answer"
      }],
      select: false
   },

   // 收藏答案
   collectingAnswers:{
      type:[{
         type:mongoose.Schema.Types.ObjectId,
         ref:"Answer"
      }],
      select:false
   }

})


// 创建内容校验对象
function userValidator(data: any) {
   const schema = joi.object({
      email: joi.string().email().trim().lowercase().min(6).max(30).required().messages({
         'any.required': '缺少必选参数 email',
         'string.email': 'email 格式错误',
         'string.min': 'email最少为6个字符',
         'string.max': 'email最多为30个字符'
      }),
      name: joi.string().min(2).max(20).required().messages({
         'any.required': '缺少必须参数 name',
         'string.base': 'name 必须为string类型',
         'string.min': 'name最少为2个字符',
         'string.max': 'name最多为20个字符'
      }),
      password: joi.string().min(6).max(16).pattern(/^[a-zA-Z0-9]{6,16}$/).required().messages({
         'any.required': '密码不允许为空',
         'string.min': 'password最少为6个字符',
         'string.max': 'password最多为16个字符'
      }),
      id: joi.objectId(),

      // 对用户的各种资料进行校验
      avatar_url: joi.string().messages({
         "string.base": '图像地址必须为string类型'
      }),
      gender: joi.valid('male', 'female').default('male').messages({
         'any.only': '只能传入male或者female'
      }),
      headline: joi.string().max(100).messages({
         'string.base': 'headline必须为String类型',
         'string.max': 'headline最多100个字符'
      }),
      locations: joi.array().items(joi.objectId()).messages({
         'array.base': 'locations必须为数组',
         'string.pattern.name': 'locations数组中必须为objectId类型'
      }),
      business: joi.objectId().messages({
         'string.base': 'business 必须为objectId类型'
      }),
      education: joi.array().items(
         joi.object().keys({
            school: joi.objectId(),
            major: joi.objectId(),
            diploma: joi.number().valid(1, 2, 3, 4, 5),
            entrance_year: joi.number(),
            grations_year: joi.number()
         })
      ).messages({
         'array.base': 'employments必须为数组',
         'object.unknown': '传入的数据有误',
         'any.only': 'diploma 只能从1,2,3,4,5中进行选取',
         'string.base': 'school与major只能是objectId类型',
         'number.base': 'entrance_year与grations_year只能是number类型'
      }),
      employments: joi.array().items(
         joi.object().keys({
            company: joi.objectId(),
            job: joi.objectId()
         })
      ).messages({
         'array.base': 'employments必须为数组',
         'object.unknown': '传入的数据有误'
      }),
      following: joi.array().items(
         joi.object().keys({
            type: joi.objectId()
         })
      ).messages({
         "array.base": "following必须为数组类型"
      }),
      //关注话题部分
      followTopic: joi.array().items(
         joi.object().keys({
            type: joi.objectId()
         })
      ).messages({
         "array.base": "followTopic必须为数组类型",
         "string.pattern.name": "必须为objectId类型"
      })
   })
   return schema.validate(data)
}


//定义生成token的函数
userSchema.methods.generateToken = function () {
   return jwt.sign({ _id: this._id }, jwt_key.jwtSecretKey, { expiresIn: jwt_key.expiresIn })
}


// 创建model
const User = mongoose.model('User', userSchema)

module.exports = {
   User,
   userValidator
}








