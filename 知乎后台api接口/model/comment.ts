const mongoose=require('mongoose')

export const joi=require('joi')
joi.objectId=require('joi-objectid')(joi)


const commentSchema=new mongoose.Schema({

    // 创建问题的数据模型
    _v:{
        type:Number,
        select:false
    },
    content:{
        type:String,
        required:true
    },
    commentator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        select:false
    },
    questionId:{
         type:String
    },
    answerId:{
        type:String
    },
// ?rootCommentId=xxx代表访问的是一个二级评论 
    rootCommentId:{
        type:String
    },
    replyTo:{//二级评论回复的是谁
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

},{timestamps:true})

function commentValidator(data:any){
    //对传输过来的问题数据进行校验
    const schema= joi.object({
          content:joi.string().required(),
          commentator:joi.objectId(),
          questionId:joi.string(),
          answerId:joi.string(),


          rootCommentId:joi.string(),
          replyTo:joi.objectId()
     })
     return schema.validate(data)
}


// 创建model
const Comment=mongoose.model('Comment',commentSchema)

module.exports={
    Comment,
    commentValidator
}
