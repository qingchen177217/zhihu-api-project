const mongoose=require('mongoose')

export const joi=require('joi')
joi.objectId=require('joi-objectid')(joi)


const answersSchema=new mongoose.Schema({
    // 创建问题的数据模型
    _v:{
        type:Number,
        select:false
    },
    content:{//文本内容
        type:String,
        required:true
    },
    answerer:{//回答者
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:"true",
        select:false
    },
    questionId:{//问题的id
        type:String
    },
    voteCount:{
        //点赞统计数量
        type:Number,
        default:0,
        required:true
    }
},{timestamps:true})

function AnswersValidator(data:any){
    //对传输过来的问题数据进行校验
    const schema= joi.object({
        content:joi.string().required(),
        questionId:joi.string(),
        answerer:joi.objectId(),
        voteCount:joi.number()
     })
     return schema.validate(data)
}

// 创建model
const Answer=mongoose.model('Answer',answersSchema)
module.exports={
    Answer,
    AnswersValidator
}
