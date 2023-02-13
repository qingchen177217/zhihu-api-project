// 导入配置文件
const config=require('./config')
const cors=require('cors')
const express=require('express')
const morgan=require('morgan')
const {expressjwt}=require('express-jwt')
const {jwt_key}=require('./config/index')
const app=express()



// 处理中间件
// 处理json的中间件
app.use(express.json())

// 处理x-www-form-urlencoded的中间件
app.use(express.urlencoded({extended:false}))

//静态资源托管
app.use(express.static('public'))

// 简化信息传送的中间件
app.use((req:any,res:any,next:Function)=>{
   res.out=function(status:number,error:Error){
         res.status(status).json({
            code:status,
            msg:error instanceof Error? error.message:error
         }) 
    }
   next()
})

// 处理跨域的中间件
app.use(cors())
//处理日志
app.use(morgan())

// 处理token事件
app.use(expressjwt({secret:jwt_key.jwtSecretKey,algorithms:['HS256']}).unless({path:['/api/user','/api/auth']}))


// 引入数据库 mongodb
require('./model')

//引入路由中间件
app.use('/api',require('./routes/index'))



// 引用错误中间件，对错误进行捕获，防止数据的泄露
app.use(require('./middleware/error'))




app.listen(config.app.port,()=>{
    console.log(`项目成功 http://127.0.0.1:${config.app.port}`);
})












