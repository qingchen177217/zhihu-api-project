const mongoose=require('mongoose')

// 引入joi
export const joi=require('joi')
joi.objectId=require('joi-objectid')(joi)

// 定义topic结构
const topicSchema=new mongoose.Schema({
    _v:{
        type:Number,
        select:false
    },
    // 话题名称
    name:{
        type:String,
        require:true
    },

    // 图像
    avatar_url:{
        type:String
    },
    // 简介
    introduction:{
        type:String,
        maxlength:500,
        select:false
    }
    
})

function topicValidator(data:any){
    const schema=joi.object({
         name:joi.string().required(),
         avatar_url:joi.string(),
         introduction:joi.string().max(500),
    })
    return schema.validate(data)
}


// 创建model
const Topic=mongoose.model("Topic",topicSchema)



module.exports={
    // 导出model
    Topic,
    //导出话题校验规则
    topicValidator
}





