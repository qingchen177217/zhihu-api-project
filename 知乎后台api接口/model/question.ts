const mongoose=require('mongoose')

export const joi=require('joi')
joi.objectId=require('joi-objectid')(joi)


const questionSchema=new mongoose.Schema({

    // 创建问题的数据模型
    _v:{
        type:Number,
        select:false
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    questioner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        select:false
    },


    //在问题中储存topic话题
    topics:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Topic"
        }],
        select:false
    }
},{timestamps:true})

function questionValidator(data:any){
    //对传输过来的问题数据进行校验
    const schema= joi.object({
        title:joi.string().required(),
        description:joi.string(),
        questioner:joi.objectId(),

        topics:joi.array().items(joi.objectId())
     })
     return schema.validate(data)
}


// 创建model
const Question=mongoose.model('Question',questionSchema)

module.exports={
    Question,
    questionValidator
}
