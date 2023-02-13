
const mongoose=require('mongoose')

export const joi=require('joi')
joi.objectId=require('joi-objectid')(joi)


const categorySchema=new mongoose.Schema({

    // 创建问题的数据模型
    _v:{
        type:Number,
        select:false
    },
    name:{
        type:String,
        required:true,
        maxlength:20,
        minlength:2
    }

},{timestamps:true})

function categoryValidator(data:any){
    //对传输过来的问题数据进行校验
    const schema= joi.object({
        name:joi.string().max(20).min(2).required().messages({
              "string.base":"name必须为string类型",
              "string.min":"name最少为2个字符",
              "string.max":"name最多为20个字符",
              "any.required":"缺少必选参数name"
        })
     })
     return schema.validate(data)
}


// 创建model
const Category=mongoose.model('Category',categorySchema)

module.exports={
    Category,
    categoryValidator
}
