const multer=require('multer')

const router=require('express').Router()
const uploadfn=require('../controller/upload')




const storage=multer.diskStorage({
    destination:function (req:any,file:any,cb:any){
        cb(null,'public/upload')
    },
    filename:function(req:any,file:any,cb:any){
        cb(null,file.originalname)
    }
})

const upload=multer({storage:storage})

router.post('/',upload.single('file'),uploadfn)
//发布文章的路由

module.exports=router










