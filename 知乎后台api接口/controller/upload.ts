module.exports=(req:any,res:any,next:Function)=>{
    try{
     const fileUrl='http://127.0.0.1:80'+'/upload/'+req.file.originalname
     res.status(200).json({
        code:200,
        msg:'上传成功',
        data:fileUrl
     })
    }catch(err){
        next(err)
    }
}