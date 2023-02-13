知乎后端服务器项目

经过postman进行测试，项目运行正常，
使用mongodb数据库进行数据存储，joi进行前端传输数据校验，jwt进行鉴权验证是否存在token，cors进行处理跨域



创建目录
config 配置信息
routes 路由信息
model 存放数据库的设置
controller 存放路由逻辑

创建config/index.ts
module.exports={
    app:{
        port :process.env.PORT||3000
    }
}
**来动态设计端口，部署时，可能会进行端口的更改**

app.listen(config.app.port,()=>{
    console.log(`项目成功 http://127.0.0.1:${config.app.port}`);
})
# 中间件
处理json数据的中间件

app.use(express.json)
处理跨域的中间件
const cors=require('cors')

app.use(cors())

处理日志
npm i morgan
const morgan=require('morgan')
处理日志
app.use(morgan('dev'))
**当客户端请求失败后，在服务端控制台进行报错**

# 用户模块搭建

```js   index.js
export const router=require('express').Router()

//用户接口
router.use('/user',require('./user'))

module.exports=router
```
```js   user.js
const router=require('express').Router()

// 注册用户
router.post('/',(req:any,res:any)=>{
        res.send('注册')
}) 



// 获取所有用户
router.get('/',(req:any,res:any)=>{
    res.send('获取所有用户')
}) 

// 获取指定用户
router.get('/:id',(req:any,res:any)=>{
    res.send('获取指定用户')
}) 


// 编辑/修改指定用户
router.post('/:id',(req:any,res:any)=>{
    res.send('修改指定用户')
}) 

// 删除指定用户
router.delete('/',(req:any,res:any)=>{
    res.send('删除指定用户')
}) 

module.exports=routes
```
```js   app.js
//引入路由中间件
app.use('/api',require('./routes/index'))
```
## 应用mongodb数据库
下载mongodb
 http://dl.mongodb.org/dl/win32/x86_64，
 在model中创建index.js来管理数据库项目

```js
const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost:27017/dwzhihu')

const db=mongoose.connection

db.on('error',err=>{
    console.log('数据库连接失败',err);
})

db.on('open',()=>{
    console.log('数据库连接成功');
})
```
**在config中指定数据库地址，来应对以后数据库地址的改变**
```js
module.exports={
    app:{
        port:process.env.PORT||80
    },
    db:{
        url:process.env.MONGODB_URL ||'mongodb://localhost:27017/dwzhihu'
    }
}
```
export const config=require('../config')
const db=mongoose.connect(config.db.url)

**app.ts中进行引入 require('./model/index.ts')**

## 创建用户数据模块
model
新建user.ts 来管理user的数据库
```js
const mongoose=require('mongoose')

//定义字段的类型，以及各种属性，和mysql不同的是，mongodb直接在这创建
定义user结构
const userSchema=new mongoose.schema({
    // 邮箱
    email:{
        type:String,
        required:true,
        minlength:6,
        maxlength:30,
        unique:true
    },
    name:{//名字
        type:String,
        required:true,
        minlength:2,
        maxlength:20
     },
     //密码
     password:{
        type:String,
        required:true,
        minlength:6,
        maxlength:16
     }
})

const User=mongoose.model('User',userschema)

module.exports={
    User
}
```
**mongoose在定义email类型时，就对传输过来的属性进行检查，是否符合类型**
**mongoose自动创建id,_v这俩属性**
自动检测email是否具有重复选项，
**mongoose中请求时，不返回密码，只需要在定义password字段加上select:false即可**

password:{
    type:String,
    required:true,
    minlength:6,
    maxlength:16,
    select:false
}

### 用户数据校验
joi,
下载joi-objectid

const joi=require('joi')
joi.objectId=require('joi-objectid')(joi)

```js
.trim()//去除空格
.lowercase()//不区分大小写

function userValidator(data){
    const schema=joi.object({
        email:joi.string().email().trim().lowercase().min(6).max(30).required(),
        name:joi.string().min(2).max(20).required(),
        password:joi.string().pattern(/^[a-zA-Z0-9]{6,16}$/).required(),
        _id:joi.objectId() //对id进行校验，joi库中自带
    })
    return schema.validate(data)
}
exports ={
    userValidator
}
```
### 封装校验中间件
创建middleware//validate.ts

```js
module.exports=(validator)=>{
    return (req:any,res:any,next:Function)=>{
        const {error,value}=validator(req.body)
// 将已经进行校验的值进行解构出来，
        // 如果错误则打印，如果正确则赋值给req.valiValue

        if(error)return res.status(400).json({
            code:400,
            value:error._orignal,
            msg:error.detail[0].message
        })
        //数据校验通过，响应成功的信息

        req.validValue=value

        next()
    }
}


```

```js user.ts
const {useValidator}=require('../model/user.ts')
const validator=require('../middleware/validate.ts')

router.post('/',validator(userValidator),(req,res)=>{

})
```

### 自定义错误信息
当joi进行校验后，如果错误返回给客户端的是英文，不利于客户端阅读，
可以自定义 message来返回对应的报错信息
joi.message({
    
})
```js
function userValidator(data:any){
   const schema=joi.object({
      email:joi.string().email().trim().lowercase().min(6).max(30).required().messages({
         'any.required':'缺少必选参数 email',
         'string.email':'email 格式错误',
         'string.min':'email最少为6个字符',
         'string.max':'email最多为30个字符'
      }),
      name:joi.string().min(2).max(20).required().messages({
         'any.required':'缺少必须参数 name',
         'string.base':'name 必须为string类型',
         'string.min':'name最少为2个字符',
         'string.max':'name最多为20个字符'
      }),
      password:joi.string().min(6).max(16).pattern(/^[a-zA-Z0-9]{6,16}$/).required().messages({
         'any.required':'密码不允许为空',
         'string.min':'password最少为6个字符',
         'string.max':'password最多为16个字符'
      }),
      id:joi.objectId()
   })
   return schema.validate(data)
}
```

### 抽离routes路由中的函数
controller/user.ts

```js
// 注册用户
exports.register=(req:any,res:any,next:Function)=>{

    try{
        res.send('注册用户')
    }catch(err){
        next(err)
    }
}

exports.getUserList=(req:any,res:any,next:Function)=>{
    try{
        res.send('获取所有用户')
    }catch(err){
        next(err)
    }
}

exports.getUser=(req:any,res:any)=>{
    res.send('获取指定用户')
}

exports.updateUser =(req:any,res:any)=>{
    res.send('修改指定用户')
}

exports.deleteUser=(req:any,res:any)=>{
    res.send('删除指定用户')
}
```

### 错误处理中间件
middleware/err.ts
```
module.export=(err:Error,req:any,res:any,next:Function)=>{
    if(err) res.status(500).json({
        code:500,
        message:'服务器错误'
    })
    console.log(err)//在服务器端打印错误信息
}
```
引用错误中间件
app.use(require('./middleware/error.ts'))

### 用户注册 密码加密

bcrypt
cosnt bcrypt=require('bcryptjs')
```js
try{
    let  {email,password,name}=req.validValue
    let user=await User.findOne({email})
    if(user){
        return res.status(400).json({
            code:400,
            msg:'邮箱已经被注册了，请重新输入',
            data:{email}
        })
    }

    当用户注册成功后，对密码进行加密
    password=await bcrypt.hashSync(password,10)

    对用户注册的内容进行保存
    await new User({
        email,password,name
    }).save()

    res.status(400).json({
        code:400,
        msg:'用户注册成功'
    })
}
```
### 登录功能的实现

当mongodb设计schema里设计password，为不可显示时，再次创建user实例就不会显示，
不需要删除select文件
可以通过 User.select('+password')进行添加进来


登录接口
给登录创建一个单独的文件，
routes/auth.ts

```js
const router=require('express').Router()

const auth=require('../controller/auth.ts')

router.post('/',auth.login)
module.exports=router

```
routes/index.ts

router.use('/auth',require('./auth.ts'))

```js  操作函数
const bcrypt=require('bcryptjs')
export const {User}= require('../model/user')
const jwt=require('jsonwebtoken')
const {jwt_key}=require('../config/index')


exports.login=async (req:any,res:any,next:Function)=>{
     try{
        //  获取用户校验过后的数据
        const validValue=req.validValue
        
        // 检测用户是否存在
        let  user= await User.findOne({email:validValue.email}).select('+password')
        // 如果用户不存在，直接返回错误
        if(!user){
            res.status(400).json({
                code:'400',
                msg:'用户不存在'
            })
        }

        // 如果用户存在，检测密码是否正确
        const is_password=bcrypt.compareSync(validValue.password,user.password)
        
        // 如果密码不正确，返回失败的响应
        if(!is_password){
            res.status(400).json({
                code:'400',
                msg:'密码错误，请重新输入'
            })
        }
        // const userinfo={...user,password:''}
        // const tokenStr=jwt.sign(userinfo,jwt_key.jwtSecretKey,{expiresIn:jwt_key.expiresIn})

        // 登录成功，响应成功的信息
        
        res.status(200).json({
            code:'200',
            msg:'用户登陆成功',
            data:{
                tokenStr:'Bearer '+tokenStr
            }
        })
     }catch(err){
        next(err)
     }
} 
```

在model/user.ts中定义生成token的函数
const jwt=require('jsonwebtoken')
export const {jwt_key}=require('../config/index')

//定义生成token的函数
userSchema.methods.generateToken=function(){
   return  jwt.sign({_id:this._id},jwt_key.jwtSecretKey,{expiresIn:jwt_key.expiresIn})
}

**引用**
直接挂载在user里，创建实例时方法
 data:{
                tokenStr:'Bearer '+user.generateToken()
}
#### 发送信息中间件

app.use((req:any,res:any,next:Function)=>{
    return res.out=function(status:number,error:Error){
         res.status(status).json({
            code:status,
            msg:error instanceof Error ? error.message:error
         })
    }
})
#### 接口鉴权中间件 效果和express-jwt相同

**不同点**
express-jwt 会在前面加上一个字符串 'Bearer '拼接后进行返回

而我们自己定义的使用 jwt.verify进行验证的方法，不能加上字符串，否则会报错


middleware/auth.ts

```js
const jwt =require('jsonwebtoken')
export const {jwt_key}=require('../config/index')

module.exports =function(req:any,res:any,next:any){
    //  前端在请求接口的时候，需要在header,带上后端生成的token
    // 保存数据token
    const token=req.header('authorization')
    // 检测的时候不存在token
    if(!token){
        return res.out(400,'Unauthorization 无token')
    }
    try{
        // 当token存在的时候，验证是否有效
        const userData=jwt.verify(token,jwt_key)
        req.userData=userData
        // 将token解析值存储在req.userData
        next()
    }catch(err){
        return res.out(401,'Unauthorization 无token')
    }
}
```

**使用方法 在 路由中进行引用 然后当做中间件进行使用**
const auth=require('../middleware/auth')**

router.get('/:id',auth,user.getUser) 

**记得：express-jwt会添加Bearer 这个字符串，而jwt.verify使用的是原本的token值，不需要添加**

如果使用自己写的，在登录时不需要添加token

如果使用express-jwt则在登录时加上

本次就使用express-jwt插件

### 查询用户列表与指定用户功能
mongodb查询当前表中的内容的语句 user.find()

查询表中单个用户的语句 user.findById(user.id)

查询表中是否具有某个相同的属性 user.findOne({email:231@qq.com}).select('+password')
把隐藏的password重新添加

添加用户 new User({email,password,name}).save()

这里查询的id是mongodb数据库生成的id
```js
exports.getUserList=async(req:any,res:any,next:Function)=>{
    try{
        查询所有用户
        let userlist=await User.find()
        若用户列表不存在，返回失败响应
        if(!userlist)return res.out(400,'用户列表不存在')

        res.status(200).json({
            code:200,
            msg:'查询成功',
            data:{
                userlist
            }
        })
    }catch(err){
        next(err)
    }
}
```
```js    获取单个用户的信息
exports.getUserList=async(req:any,res:any,next:Function)=>{
    try{
        查询所有用户
        const userId=req.params.id
        let userlist=await User.findById(userId)
        若用户列表不存在，返回失败响应
        if(!userlist)return res.out(400,'用户列表不存在')

        res.status(200).json({
            code:200,
            msg:'查询成功',
            data:{
                userlist
            }
        })
    }catch(err){
        next(err)
    }
}
```
### 用户更新与删除   User.findByIdAndUpdate(userid,body) User.findByIdAndDelete(userid)
```js
router.put('/user/:id',(req:any,res:any,next:Function)=>{
    try{
       const body=req.body
       const userId=req.params.id
       const data=User.findByIdAndUpdate(userId,body)
    
        if(!data)return res.out(400,'更新信息失败')
        
        res.status(200).json({
            code:200,
            msg:'更新用户成功',
            data:{body}
        }
        )

    }catch(err){
        next(err)
    }
})

```

删除是要更新用户的状态值，而不是真正删除（先删除）
```js
router.delete('/user/:id',(req:any,res:any,next:Function)=>{
    try{
       const userId=req.params.id
       const data=User.findByIdAndDelete(userId)
    
        if(!data)return res.out(400,'更新信息失败')
        
        res.status(200).json({
            code:200,
            msg:'更新用户成功',
            data:{body}
        }
        )
    }catch(err){
        next(err)
    }
})
```
## 文件上传 !!重要
文件上传功能
安装模块
npm install --save multer

请求体FormData格式

使用multer解析表单数据
使用express.urlencoded()中间件无法解析multipart/form-data格式的请求体数据

搭建路由
routes/uploade.ts

对表单数据进行解析
```js   简单解析
const multer=require('multer')

// 导入处理路径的核心模块
const path=require('path')

// 创建multer的实例对象，通过dest属性指定文件的存放路径
const upload=multer({dest:path.join(__dirname,'../uploads')})

// 发布新文章的路由
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中

router.post('/add',upload.single('cover_img'),article_handle.articleAdd)
//发布文章的路由
```

**对传输过来的文件进行解析，使其保持原来的样式，进行展示而不是进行二进制数据**
```js  完整封装，显示图片格式，以及存放地址，保存图片原名称
const multer=require('multer')

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
```


**返回保存在服务器的地址  return 'http:127.0.0.1:80'+'/upload/'+req.file.originalname**
```js   返回一个地址，图片存放在服务器后的地址
module.exports=(req:any,res:any,next:Function)=>{
    try{
     res.status(200).json({
        code:200,
        msg:'上传成功',
        data:'http://localhost:80'+'/upload/'+req.file.originalname
     })
     res.out(200,'上传文件成功')
    }catch(err){
        next(err)
    }
}
```
## 个人资料
### 个人资料更改
设计在model/user.ts中，重新设置

和user用户放在一块
```js
interface T{//定义职业经历的两个字段类型
   company:String,
   job:String
}

type Education={//定义教育程度这个字段的类型
     school:string,
     major:string,
     diploma:number|[1,2,3,4,5],
     entrance_year:Number,
     grations_year:Number
   }
// 定义user结构
const userSchema=new mongoose.Schema({
     //邮箱
     email:{//定义字段的类型，以及各种属性，和mysql不同的是，mongodb直接在这创建
        type:String,
        required:true,
        minlength:6,
        maxlength:30,
        unique:true
     },
     //用户名
     name:{
        type:String,
        required:true,
        minlength:2,
        maxlength:20
     },
     //密码
     password:{
        type:String,
        required:true,
        minlength:6,
        maxlength:1000,
        select:false
     },
     //隐藏版本信息
     __v:{
      type:Number,
      select:false
     },






   //   封面/头像
   avatar_url:{
      type:String
   },
   // 性别
   gender:{
      type:String,
      enum:['male','female'],
      default:'male',
      required:true
   },
   //一句话介绍
   headline:{
      type:String,
   },
   //居住地
   locations:{
      type:Array<String>,
   },
   // 行业
   business:{
      type:String
   },
   //职业经历  
   occupation:{
      type:Array<T>
   },
   // 教育经历
   educations:{
      type:Array<Education>
   }
})
```
设置数据校验，对传输过来的数据进行检验，在joi中
 
```js
function userValidator(data:any){
   const schema=joi.object({
      // 对用户的各种资料进行校验
      avatar_url:joi.string().messages({
         "string.base":'图像地址必须为string类型'
      }),
      gender:joi.valid('male','female').default('male').messages({
         'any.only':'只能传入male或者female'
      }),
      headline:joi.string().max(100).messages({
            'string.base':'headline必须为String类型',
            'string.max':'headline最多100个字符'
      }),
      locations:joi.array().items(joi.string()).messages({
         'array.base':'locations必须为数组',
         'string.base':'数组中必须传入string类型'
      }),
      business:joi.string().messages({
            'string.base':'business 必须为string类型'
      }),
       educations:joi.array().items(
         joi.object().keys({
            school:joi.string(),
            major:joi.string(),
            diploma:joi.number().valid(1,2,3,4,5),
            entrance_year:joi.number(),
            grations_year:joi.number()
         })
      ).messages({
         'array.base':'employments必须为数组',
         'object.unknown':'传入的数据有误',
         'any.only':'diploma 只能从1,2,3,4,5中进行选取',
         'string.base':'school与major只能是string类型',
         'number.base':'entrance_year与grations_year只能是number类型'
      }),
      employments:joi.array().items(
         joi.object().keys({
            company:joi.string(),
            job:joi.string()
         })
      ).messages({
         'array.base':'employments必须为数组',
         'object.unknown':'传入的数据有误'
      })
   }) 
   return schema.validate(data)
}
``` 

**利用postman进行数据的更改时，要在parms传入id数据，是数据库自带的id值**
请求方法，1利用raw数据进行数据请求
```json
{
    "email":"123@qq.com",
    "name":"1234",
    "password":"123456",
    "id": "6352130543e6b9a9d1888bb9",
    "avatar_url":"222",
    "gender":"female",
    "headline":"或许我不该问，让你平静的心再起涟漪，应该是我不该问",
    "locations":["苏州","杭州"],
    "business":"宇宙学",
    "education":[{
        "school":"沐子学校",
        "major":"本科",
        "diploma":1,
        "entrance_year":2020,
        "grations_year":2024
    }],
    "employments":[{
        "company":"苏州连击科技公司",
        "job":"地球理事会会长"
    }]
}
```

http://127.0.0.1/api/user/635223b572e2ec26cb3d6d6c
将id值进行传输

**更新信息时，如果不加以过滤，会将email,name，password进行更改，password也未进行加密**
需要对修改用户的函数进行修改，要么进行重新加密之后在进行存储，要么不进行更改，只更改别的信息，重要信息修改重新进行写接口

```js
exports.updateUser = async(req:any,res:any,next:Function)=>{
    try{
        let userId=req.params.id
        let body=req.body
        body.password=bcrypt.hashSync(body.password,10)

        let data=await User.findByIdAndUpdate(userId,body)
        // 查找并修改
        if(!data)return res.out(400,'更新失败')

        // 更新成功，响应成功信息
        res.status(200).json({
            code:200,
            msg:'更新用户信息成功',
            data:{body}
        })

    }catch(err){
        next(err)
    }
}
```
### 字段过滤  查询特定用户时，展示想特定的信息
将没有必要显示出来的字段进行隐藏

在model/user.ts中添加
select:false
给avatar_url,locations,business,employments,education
当我们想要查看这些信息时，进行展示
在params中添加 field:想要展示的字段 locations,educations

查询特定用户时，指定要展示的信息
```js
// 获取单个用户 user.findById(数据库自带Id)
exports.getUser=async(req:any,res:any,next:Function)=>{
    try{
        // 当params中field这个参数不存在时，selectField仍会执行，但会报错split函数无法操作，因为没有值
        // 所以需要给field添加上默认值，当前台没有传输过来值时，仍不会进行报错
        const {field=""}=req.query
        // 将field的值进行解构出来
        // 查询所有用户
        const userId=req.params.id

        const selectField=field.split(';').filter((f:any)=>f).map((f:any)=>" +"+f).join("")
        // 对params中field中传输过来的参数进行格式化，解构出来，
        let user=await User.findById(userId).select(selectField)
        // 若用户列表不存在，返回失败响应
        if(!user)return res.out(400,'用户列表不存在')

        //  若用户列表存在，返回成功的响应
        res.status(200).json({
            code:200,
            data:{user} 
        })
    }catch(err){
        next(err)
    }
}
```
### 关注与粉丝模块
关注，取消关注，获取关注人，粉丝列表    

#### 数据模块设计以及校验
增加数据库字段，following

```js
following:{
    type:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
            //将following 的类型固定为 数据库中自然生成的id,
            然后通过 ref:user 对数据进行绑定
        }
    ]
}

对following进行校验
 following:joi.array().items(
       joi.object.keys({
          type:joi.objectId()
       })
 ).messages({
    "array.base":"following的类型必须为数组"
 })
```

#### 获取关注列表接口
创建接口
routes/user.ts
router.get(/:id/following,user.listFollowing)

controller/user.ts
```js
module.exports=(req:any,res:any,next)=>{
    let userId=req.params.id

    const user=await user.findById(userId).select('+followding').populate('following')
    //populate这个属性是查找数据库中的following连接的属性，可以查找到对应的id属性代表的值
    
    if(!user)res.out(400,'获取关注列表失败')

    res.status(200).json({
        code:200,
        msg:'获取关注列表成功',
        data:user
    })
}
```

#### 关注与取消关注
设置两个接口来关注和取消关注

routes/user.ts  
router.put('/following/:id',user.follow)
```js  follow

exports.follow=(req:any,res:any,next:Funciton)=>{
     let userId=req.auth._id
    
     const user=await User.findById(userId).select("+following")
    //  如果已经关注，则return 
    if(!user.following.includes(req.params.id))return res.out(400,'已关注，关注失败')
    
    // 如果没有关注，则关注
    user.following.push(req.params.id)
    await user.save()
    
    res.status(200).json({
        code:200,
        msg:'关注成功',
        data:user
    })
}
```

router.delete('/following/:id',user.unfollow)

```js  unfollow

exports.unfollow=(req:any,res:any,next:Funciton)=>{ 
    let userId=req.params.id
    const user=User.findById(userId).select("+following")
    //获取所有关注用户的索引
    const index=user.following.indexOf(req.params.id)
     //若没有关注，则取消关注
    if(index==-1)return res.out(400,'未关注，取消关注失败')

    //已关注，进行取消操作
    user.following.splice(index,1)
    await user.save()
     res.status(200).json({
        code:200,
        msg:"取消关注成功",
        data:user
    })
```

#### 获取粉丝列表

routes/user.ts

router.get("/:id/followers",user.listFollowers)

```js
exports.listFollowers=async (req:any,res:any,next:Function)=>{
    const users=await user.find({following:req.params.id})

    //通过查询数据库中的所有用户的following来查询有多少个人关注
    //只适合在练习接口中使用，不然查找效率极低
    if(!users)return res.status(400).json({
        code:400,
        msg:"查询粉丝列表失败"
    })
    res.status(200).json({
        code:200,
        msg:"查询粉丝列表成功",
        data:users
    })
}
```
## 话题模块
### 数据模型及校验 数据库模块
model/toppics.ts

```js
const mongoose=require('mongoose')

const joi=require('joi')
joi.objectId=require('joi-objectid')(joi)

定义topic结构
const topicSchema=new mongoose.Schema({
    _v:{
        type:number,
        select:false
    },
    name:{
        type:String,
        require:true
    },
    avatar_url:{
        type:string
    },

    introduction:{
        type:string,
        select:false,
        maxlength:500,
    }
})

function topicValidator(data){
    const schem=joi.object({
        name:joi.string().required(),
        avatar_url:joi.string(),
        intruduction:joi.string().max(500)
    })
}

const Topic =mongoose.model('Topic',topicSchema)

module.exports={
    导出model
    Topic,
    导出话题校验规则
    topicValidator
}
```
### 话题列表与指定话题接口

routes/topics.ts

controller/topics.ts

index.ts===>router.use('/topics',require('./topics'))

```js   路由接口
export const router=require('express').Router()

const topic=require('../controller/topics')
//获取话题列表
router.get('/',topic.getTopicsList)

// 获取指定话题
router.get('/:id',topic.getTopics)

module.exports=router
```
```js   接口函数controller/topics.ts
export const {Topic}=require('../model/topics')

//获取话题列表
exports.getTopicsList=async(req:any,res:any,next:Function)=>{
    try{
         const topicList=await Topic.find()

         if(!topicList)return res.out(400,'获取话题列表失败')
         
         res.status(200).json({
            code:200,
            msg:"获取话题列表成功",
            data:topicList
         })   
    }catch(err){
        next(err)
    }
}
//获取指定话题

exports.getTopics=async(req:any,res:any,next:Function)=>{
    try{
        const {field=""}=req.query
        const selectFields=field.split(";").filter((f:any)=>f).map((f:any)=>" +"+f).join("")
        //获取指定话题，使用field进行过滤
        const topicList=await Topic.findById(req.params.id).select(selectFields)

        if(!topicList)return res.out(400,'获取话题失败')
        
        res.status(200).json({
           code:200,
           msg:"获取话题成功",
           data:topicList
        })   
    }catch(err){
        next(err)
    }
}
```
### 话题的创建与更新

接口
const validator=require('../middleware/validate')
const {topicValidator}=require('../model/topics')

// 创建话题
router.post('/',validator(topicValidator),topic.create)

// 更新话题
router.patch('/:id',validator(topicValidator),topic.update)

```js  update更新函数
exports.update=async (req:any,res:any,next:Function)=>{
    let body=req.body

    const user=await Topic.findByIdAndUpdate(req.params.id,body)

    if(!user)return res.status(400).json({
        code:400,
        msg:"更新话题失败",
        value:user
    })

    res.status(200).json({
        code:200,
        msg:"更新话题成功",
        data:user
    }) 
}
```
```js  create创建函数
exports.create=(req:any,res:any,next:Function)=>{

    //    1.检测话题是否存在
     const body=req.body
     let Topic=Topic.findOne(body)
   
    // 2.若已经存在，则不创建
     if(data)return res.status(404).json({
        code:404,
        msg:"话题已经存在，创建失败",
        data:data
     })

     new Topic(body).save()
    //  创建数据库实例，并返回响应

     res.status(200).json({
        code:200,
        msg:"话题创建成功",
        data:data
     })
}
```
### 分页功能
通过mongoose的方法来限制数据的显示，来进行分页展示

```js   controller/topics.ts  //  getTopicsList()函数进行

//当前是第几页
//当page传入一个负值后，返回1，来防止数据错误
const page=Math.max(req.query.page*1,1)-1

// 每页有几条数据
const {per_page}=req.query
//给per_page一个默认值为2来展示没有输入参数的时候
const pagePage=Math.max(per_page*1,1)

const user=Topic.find().limit(perPage).skip(page*perPage)

 //limit(3)是只显示3条数据，skip（3）跳过几条数据
```
### 模糊搜索
模糊搜索，搜索我们想要的关键字，将文章中的所有关键字进行查询

通过Topic.find({
    name:new RegExp(req.query.keyword)
})

**分页功能，模糊搜索，查询话题列表**
```js 
exports.getTopicsList=async(req:any,res:any,next:Function)=>{
    try{
        //当前是第几页
        //当page传入一个负值后，返回1，来防止数据错误

        const page=Math.max(req.query.page*1,1)-1
        // 每页有几条数据
        const {per_page=10}=req.query
        //给per_page一个默认值为2来展示没有输入参数的时候
        const perPage=Math.max(per_page*1,1);

         const topicList=await Topic.find({
            name:new RegExp(req.query.keyword)
            //通过搜索的关键字来进行正则匹配，name中的字段，然后在进行查询
         }).limit(perPage).skip(page*perPage)

         //limit(3)是只显示3条数据，skip（3）跳过几条数据
         if(!topicList)return res.out(400,'获取话题列表失败')
         
         res.status(200).json({
            code:200,
            msg:"获取话题列表成功",
            data:topicList
         })   
    }catch(err){
        next(err)
    }
}
```
### !!!用户话题中的属性引用

**在用户资料中引用话题的值，来对应各种资料**
改造user数据模型以及校验规则

**对数据模型进行更改**
将locations business employments.company employments.job education.school education.major
这些数据的类型改变
变为 topic对应的id值

{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Topic"
    **绑定Topic的id值，填写数据时，只需要从topic的id值中进行查找填入，不需要自定义**
}

```js  model/user.ts

const userSchema=new mongoose.schema({
   //居住地
   locations: {
      type: [{
        //只需要更改它们的类型即可
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
   }
})
```

**对校验规则进行更改**
**将joi.string更改为joi.ObjectId()这样就会进行校验，更改数据时，只能传入topic话题中的id**
```js  对数据进行更改 

 locations: joi.array().items(joi.ObjectId()).messages({
         'array.base': 'locations必须为数组',
         'string.pattern.base': '数组中必须为objectId类型'
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
```

#### **通过postman进行数据的验证规则**
1.获取token
11@qq.com
11
123456


2.编辑修改用户//对用户进行修改后的数据验证，更改

token值:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzUzZjM5NDA1YWEwNGNhNjExMTllMDkiLCJpYXQiOjE2NjY0NDYyNDMsImV4cCI6MTY3NTA4NjI0M30.oQizhtlt6RbTha6vYW8U6YeyAuSPrHVvXnzKnNpLVuQ

```json  将locations,business,educaiton,employments中的数据重新填入，填入的是ref="Topic"的对应id值，进行查找
{
    "email":"11@qq.com",
    "name":"22",
    "password":"123456",
    "id": "6352130543e6b9a9d1888bb9",
    "avatar_url":"222",
    "gender":"female",
    "headline":"或许我不该问，让你平静的心再起涟漪，应该是我不该问",
    "locations":["6353b8a19fca1972a1a7a04e","6353b8a79fca1972a1a7a051"],
    "business":"6353c2a5ede6bcdefe066add",
    "education":[{
        "school":"6353f524f3737e5855567805",
        "major":"6353f5f1f3737e5855567825",
        "diploma":1,
        "entrance_year":2020,
        "grations_year":2024
    }],
    "employments":[{
        "company":"6353f4e0f3737e58555677e9",
        "job":"6353f591f3737e585556781e"
    }]
}
```


获取单个用户
controller/user.ts  getUser
在getUser这个方法里 进行新的模型的查询

**只需要添加上.populate()这个方法就可以对传入的topic的对应id值进行查询出来**

 let user=await User.findById(userId).select(selectField)
        .populate(
            "following locations business employments.company employments.job education.school education.major"
        )
将所有需要查询topic的id值的字段写在populate中

**查询单个用户的数据**
http://127.0.0.1/api/user/6353f39405aa04ca61119e09?field=education;locations

params
field    education;locations

数据就会进行自助查询

```json 查询结果  对绑定的topic的id值进行了查询
{    "code": 200,
    "data": {
        "user": {
            "_id": "6353f39405aa04ca61119e09",
            "email": "11@qq.com",
            "name": "22",
            "gender": "female",
            "locations": [
                {
                    "_id": "6353b8a19fca1972a1a7a04e",
                    "name": "重庆",
                    "__v": 0
                },
                {
                    "_id": "6353b8a79fca1972a1a7a051",
                    "name": "河南",
                    "__v": 0
                }
            ],
            "following": [],
            "education": [
                {
                    "school": {
                        "_id": "6353f524f3737e5855567805",
                        "name": "苏州大学",
                        "__v": 0
                    },
                    "major": {
                        "_id": "6353f5f1f3737e5855567825",
                        "name": "计算机科学与技术",
                        "__v": 0
                    },
                    "diploma": 1,
                    "entrance_year": 2020,
                    "grations_year": 2024,
                    "_id": "6353fc8a79d061c5c3036cb0"
                }
            ],
            "business": {
                "_id": "6353c2a5ede6bcdefe066add",
                "name": "互联网",
                "avatar_url": "111",
                "__v": 0
            },
            "headline": "或许我不该问，让你平静的心再起涟漪，应该是我不该问"}}}
```

以上查询将所有信息都进行了查询返回，而无法进行选择性查询
.populate(
            "following locations business employments.company employments.job education.school education.major"
        )
这样过于固定了

**通过field 传输过来的值，进行筛选，查询特定的值**

// 查询优化，获取特定的属性，而不是返回所有结果，
// 如果field传输了education，就只显示这个属性的内容

const populateStr=field.split(";").filter((f:any)=>f).map((f:any)=>{
    if(f==='education')return {
        "education.school education.major"
    }
    if(f==='employments')return {
        "employments.company employments.job"
    }
    return f
}).json(" ")
//这样如果没有传入那些值，就不会进行返回

let user=await User.findById(userId).select(selectField).populate(populateStr)

进行重新传入
### !!!话题关注，取消关注，话题列表
对数据模型进行更改，添加**followTopic**字段
**在user.ts数据模型中进行添加**

```js  数据库
 followTopic:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Topic"
        }],
        select:false
    }
```
user.ts中添加 校验规则
```js
follwingTopic:joi.array().items(
    joi.object().keys({
        type:joi.objectId()
    })
).message({
    "array.base":"followTopic必须为数组类型",
    "string.pattern.name":"必须为objectId类型"
})
```
在controller/user.ts中添加关注话题，和取消关注话题

只需要对之前的关注和取消关注进行更改即可

```js  关注话题，取消关注话题
//只需要对following 更改为followTopic即可对话题进行关注
//关注话题
exports.follow=async(req:any,res:any)=>{
    let userId=req.auth._id
    
    const user=await User.findById(userId).select("+followTopic")
    //如果已经关注过了，那我们就直接return 
    if(!user)res.out(404,'用户不存在')
     if(user.followTopic.includes(req.params.id))return res.status(400).json({
         code:400,
         msg:"已关注，关注失败"
     })
    //如果没有关注过，在关注
    user.followTopic.push(req.params.id)

    await user.save()

    res.status(200).json({
     code:200,
     msg:"关注成功",
     data:user
    })
}
// 取消关注话题
exports.unfollowTopic=async(req:any,res:any)=>{
   let userId=req.auth._id
  const user=await User.findById(userId).select("+followTopic");

 //   获取所有关注用户的索引
 const index=user.followTopic.indexOf(req.params.id)
  //若没有关注，则取消关注
  if(index==-1)return  res.out(400,'未关注，取消关注失败')

 //  已关注，就进行取消操作
 user.followTopic.splice(index,1);
 await user.save()
 res.status(200).json({
     code:200,
     msg:"取消关注成功",
     data:user
 })
}
```

**获取关注的话题列表**
```js   获取关注的话题列表
exports.listFollowTopic=async(req:any,res:any)=>{
    let userId=req.params.id
    const user=await User.findById(userId).select("+followTopic").populate("followTopic")

    if(1user)return res.out(400,'获取关注话题列表失败')
    res.status(200).json({
        code:200,
        msg:"获取关注话题列表成功",
        data:user
    })       
}
```

路由接口
routes/user.ts
router.get('/:id/followTopic',user.listFollowTopic)

**检测话题是否存在中间件**
```js   middleware/checkTopicExist.ts
const {Topic}=require('../model/Topic')

module.exports=async(req:any,res:any,next:Function)=>{
    const Topic=await Topic.findById(req.params.id)
    if(!Topic)return res.out(404,'话题不存在')
    next()
}
```
**路由引入检测话题是否存在中间件**
const checkTopicExist=require('../middleware/checkTopicExist')

//关注话题，取消关注话题引入中间件
router.put('/followTopic/:id',checkTopicExist,user.followTopic)
router.delete('/followTopic/:id',checkTopicExist,user.unfollowTopic)
### 话题粉丝
```js  controller/user.ts
exports.listFollowersTopic=(req:any,res:any,next:Function)=>{
       const field=req.query.field.split(';').filter((f:any)=>f).map((f:any)=>" +"+f).join("")
     const users=await User.find({followingTopic:req.params.id}).select(field)
      //查询每一个用户的followingTopic属性，来检测是否有req.params.id这个话题
     if(!users)return res.out(400,'获取失败')
     res.status(200).json({
        code:200,
        msg:"获取成功",
        data:users
     })
}
```

路由接口
// 获取话题的粉丝
router.get('/:id/followersTopic',user.listTopicFollowers)
## 问题模块
问题和话题是多对多的关系
一个问题可以有多个话题
一个话题可有有多个问题
一个用户可以有多个问题
### (用户-问题)数据结构与校验规则

写数据库 问题数据库
```js
const mongoose=require('mongoose')

const joi=require('joi')
joi.objectId=require('joi-objectid')(joi)
const questionSchema=new mongoose.schema({

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
    }
})
function questionValidator(data){
    //对传输过来的问题数据进行校验
    const schema= joi.object({
        title:joi.String().required(),
        description:joi.String(),
        questioner:joi.objectId()
     })
     return schema.validate(data)
}
// 创建model
const Question=mongoose.model('Question',questionSchema)

module.exports={
    Question,
    questionValidator
}
```
### (用户-问题)封装中间件
1.检测话题是否存在的中间件
/middleware/checkQuestionExist.ts

```js
export const {Question}=require('../model/question')


module.exports=(req:any,res:any,next:Function)=>{
    const question=Question.findById(req.params.id).select("+questioner")
    if(!question)return res.out(404,'问题不存在')

    next()
}
```
2.查看话题时是否是话题创建者，如果不是话题创建者，则无权限查看问题
只有是问题的提出者才能进行问题的更改
```js
export const {Question}=require('../model/question')

module.exports=(req:any,res:any,next:Function)=>{
    const question=Question.findById(req.params.id).select("questioner")
    if(question.questioner.toString()!==req.auth.id)return res.out(404,'无权限')

    next()
}
```
### (用户-问题)问题的增删改查

#### 操作方法  controller/question.ts
对话题的增删改查进行稍作修改

1.对title,description都进行模糊匹配

// 对标题以及问题描述进行模糊匹配
        // 提供了{$or:[{title:keyword},{description:keyword}]}来多次匹配
        const keyword=new RegExp(req.query.keyword)
         const questionList=await Question.find({$or:[{title:keyword},{description:keyword}]})
         .limit(perPage)
         .skip(page*perPage)

2.添加.populate("questioner")进行查询时添加
3.新增问题，不需要进行检查，一个问题可以有多个创建者
//从token中取出创建者id,一同保存
 const question =new Question({...req.body,questioner:req.auth.id})
    await question.save()

4.删除问题
const data=await Question.findByIdAndDelete(req.params.id)
```js
export const {Question}=require('../model/question')
// 获取问题列表
exports.getQuestionList=async(req:any,res:any,next:Function)=>{
    try{
        //当前是第几页
        //当page传入一个负值后，返回1，来防止数据错误
        const page=Math.max(req.query.page*1,1)-1
        // 每页有几条数据
       
        const {per_page=10}=req.query
        //给per_page一个默认值为2来展示没有输入参数的时候
        const perPage=Math.max(per_page*1,1);


        // 对标题以及问题描述进行模糊匹配
        // 提供了{$or:[{title:keyword},{description:keyword}]}来多次匹配
        const keyword=new RegExp(req.query.keyword)
         const questionList=await Question.find({$or:[{title:keyword},{description:keyword}]})
         .limit(perPage)
         .skip(page*perPage)

         //limit(3)是只显示3条数据，skip（3）跳过几条数据
         if(!questionList)return res.out(400,'获取话题列表失败')
         
         res.status(200).json({
            code:200,
            msg:"获取话题列表成功",
            data:questionList
         })   
    }catch(err){
        next(err)
    }
}

// 获取指定问题
exports.getQuestion=async(req:any,res:any,next:Function)=>{
    try{
        const {field=""}=req.query
        const selectFields=field.split(";").filter((f:any)=>f).map((f:any)=>" +"+f).join("")
        //获取指定用户的
        const question=await Question.findById(req.params.id).select(selectFields).populate("questioner")

        if(!question)return res.out(400,'获取话题失败')
        
        res.status(200).json({
           code:200,
           msg:"获取话题成功",
           data:question
        })   
    }catch(err){
        next(err)
    }
}
// 新增问题
//不需要进行检查问题是否存在，问题可以有多个创建者
exports.createQuestion=async(req:any,res:any,next:Function)=>{
    try{
    const question =new Question({...req.body,questioner:req.auth.id})
    await question.save()
    res.status(200).json({
        code:200,
        msg:"问题添加成功",
        data:question
    })
    }catch(err){
        next(err)
    }
}
// 更新问题
exports.updateQuestion=async(req:any,res:any,next:Function)=>{
    try{
      let questionId=req.params.id
      const question=await Question.findByIdAndUpdate(questionId,req.body)
      
      if(!question)return res.status(400).json({
        code:400,
        msg:'问题更新失败',
        value:question
      })

      res.status(200).json({
          code:200,
          msg:"更新问题成功",
          data:req.body
      })
    }catch(err){
        next(err)
    }
}
// 删除问题

exports.deleteQuestion=async(req:any,res:any,next:Function)=>{
    try{
        const data=await Question.findByIdAndDelete(req.params.id)

        if(!data)res.out(400,'删除问题失败')

        res.status(200).json({
            code:200,
            msg:"删除问题成功",
            data:data
        })
    }catch(err){
        next(err)
    }
}
```
#### 接口    routes/question.ts
```js
export const router=require('express').Router()
const question=require('../controller/question')
const {questionValidator}=require('../model/question')
const validator=require('../middleware/validate')

// 检查问题是否是问题的创建者，否则不进行修改和删除
const checkQuestioner=require('../middleware/checkQuestioner')
const checkQuestionExist=require('../middleware/checkQuestionExist')
// 检查问题是否存在，否则不进行操作

// 获取问题列表
router.get('/',question.getQuestionList)

// 获取指定问题
router.get('/:id',checkQuestionExist,question.getQuestion)

// 新增问题
router.post('/',validator(questionValidator),question.createQuestion)

//修改问题
router.patch('/:id',[validator(questionValidator),checkQuestionExist,checkQuestioner],question.updateQuestion)

// 删除问题
router.delete('/:id',[checkQuestionExist,checkQuestioner],question.deleteQuestion)

module.exports=router
```
### (用户-问题)用户的问题列表
通过在每一个话题的pointer中查询是否存在某个用户来查询一个用户的问题创建列表
```js  //controller/user.ts 
const {Question}=require('../model/question')

exports.listQuestion=(req:any,res:any)=>{
      const question=Question.find({questioner:req.params.id})
      if(!question)return res.out(400,'没有问题被创建，创建一个吧')
      res.status(200).json({
        code:200,
        msg:"问题列表查询成功",
        data:question
      })
}
```
routes/user.ts

router.get('/:id/question')
### (问题-话题)问题的话题列表
数据结构与校验
在//model/question.ts

//在问题中储存topic话题
```js  增加topic字段校验
topics:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Topic"
        }],
    select:false
}

topics:joi.array().items(joi.objectId())
```
问题的话题列表
```js 对查询方法增加  .select("+topics").populate("topics")来查询topic话题

const questionList=await Question.find({$or:[{title:keyword},{description:keyword}]})
         .limit(perPage)
         .skip(page*perPage).select("+topics").populate("topics")
```
### (问题-话题)话题的问题列表
写在controller/topic.js中
```js
exports.listQuestion=async(req:any,res:any)=>{
    const question=await Question.find({topic:req.params.id})

    if(!question)return res.out(400,'查询话题的问题列表失败')
    res.status(200).json({
        code:200,
        msg:"查询话题的问题列表成功",
        data:question
    })
}
```
routes/topic.ts
router.get('/:id/questions',checkTopicExist,topic.listQuestions)
## 答案模块
需求分析   增删改查，问题-答案，用户-答案    赞和踩  收藏
### 数据模块和校验
```js
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
    }
})

function AnswersValidator(data:any){
    //对传输过来的问题数据进行校验
    const schema= joi.object({
        content:joi.string().required(),
        questionId:joi.string(),
        answerer:joi.objectId()
     })
     return schema.validate(data)
}

// 创建model
const Answer=mongoose.model('Answer',answersSchema)
module.exports={
    Answer,
    AnswersValidator
}
```
### 封装中间件
```js  checkAnswerer.js  检查是否是回答的创建者
const {Answer}=require('../model/answers')

module.exports=async(req:any,res:any)=>{
    const answer=await Answer.findById(req.params.id).select('+answer')

    if(answer.answerer.toString() !== req.auth._id)return res.out(400,'没有权限进行修改')
    next()
}
```
```js checkAnswerExist.js 检查回答是否存在
const {Answer}=require('../model/answers')

module.exports=async(req:any,res:any,next:Function)=>{
    const answer=await Answer.findById(req.params.id).select("+answerer")
    if(!answer)return res.out(404,'答案不存在')

//判断问题下面有没有答案
    if(answer.questionId !== req.params.questionId){
        return res.out(404,'该问题没有答案')
    }
}
```
### 答案的增删改查

直接复制稍作修改
```js
export const {Answer}=require('../model/answers')

// 获取答案列表
exports.getAnswerList=async(req:any,res:any,next:Function)=>{
    try{
        //当前是第几页
        //当page传入一个负值后，返回1，来防止数据错误
        const page=Math.max(req.query.page*1,1)-1
        // 每页有几条数据
       
        const {per_page=10}=req.query
        //给per_page一个默认值为2来展示没有输入参数的时候
        const perPage=Math.max(per_page*1,1);

        // 对内容以及答案id描述进行模糊匹配
        const keyword=new RegExp(req.query.keyword)
         const AnswerList=await Answer.find({content:keyword,questionId:req.params.questionId})
         .limit(perPage)
         .skip(page*perPage).select("+topics").populate("topics")

         //limit(3)是只显示3条数据，skip（3）跳过几条数据
         if(!AnswerList)return res.out(400,'获取答案列表失败')
         
         res.status(200).json({
            code:200,
            msg:"获取答案列表成功",
            data:AnswerList
         })   
    }catch(err){
        next(err)
    }
}

// 获取指定答案
exports.getAnswer=async(req:any,res:any,next:Function)=>{
    try{
        const {field=""}=req.query
        const selectFields=field.split(";").filter((f:any)=>f).map((f:any)=>" +"+f).join("")
        //获取指定用户的
        const answer=await Answer.findById(req.params.id).select(selectFields).populate("answerer")

        if(!answer)return res.out(400,'获取答案失败')
        
        res.status(200).json({
           code:200,
           msg:"获取答案成功",
           data:answer
        })   
    }catch(err){
        next(err)
    }
}
// 新增答案
exports.createAnswer=async(req:any,res:any,next:Function)=>{
    try{
        //添加回答者，以及回答问题的id
    const answer =new Answer({...req.body,answerer:req.auth._id,questionId:req.params.questionId})
    await answer.save()
    res.status(200).json({
        code:200,
        msg:"答案添加成功",
        data:answer
    })
    }catch(err){
        next(err)
    }
}
// 更新答案
exports.updateAnswer=async(req:any,res:any,next:Function)=>{
    try{
      let answerId=req.params.id
      const answer=await Answer.findByIdAndUpdate(answerId,req.body)
      
      if(!answer)return res.status(400).json({
        code:400,
        msg:'答案更新失败',
        value:answer
      })

      res.status(200).json({
          code:200,
          msg:"更新答案成功",
          data:req.body
      })
    }catch(err){
        next(err)
    }
}
// 删除答案
exports.deleteAnswer=async(req:any,res:any,next:Function)=>{
    try{
        const data=await Answer.findByIdAndDelete(req.params.id)

        if(!data)res.out(400,'删除答案失败')

        res.status(200).json({
            code:200,
            msg:"删除答案成功",
            data:data
        })
    }catch(err){
        next(err)
    }
}
```

路由接口
```js
export const router=require('express').Router()
const answer=require('../controller/answers')
const {AnswersValidator}=require('../model/answers')
const validator=require('../middleware/validate')
const checkAnswerer=require('../middleware/checkAnswerer')
const checkAnswerExist=require('../middleware/checkAnswerExist')


// 获取答案列表
router.get('/',answer.getAnswerList)

// 获取指定答案
router.get('/:id',checkAnswerExist,answer.getAnswer)

// 新增答案
router.post('/',validator(AnswersValidator),answer.createAnswer)

//修改答案
router.patch('/:id',[validator(AnswersValidator),checkAnswerExist,checkAnswerer],answer.updateAnswer)

// 删除答案
router.delete('/:id',[checkAnswerExist,checkAnswerer],answer.deleteAnswer)

module.exports=router
```

//   中间要添加上问题的id值，然后再添加answer

获取答案接口
http://127.0.0.1/api/question/6354fc2348453db57cd4f38e/answer

//   获取指定答案
http://127.0.0.1/api/question/6354fc2348453db57cd4f38e/answer/6355402eae1afafe6537baba

//新增答案
http://127.0.0.1/api/question/6354fc2348453db57cd4f38e/answer

//修改答案
http://127.0.0.1/api/question/6354fc2348453db57cd4f38e/answer/6355402eae1afafe6537baba

删除答案
http://127.0.0.1/api/question/6354fc2348453db57cd4f38e/answer/6355403cae1afafe6537babc
###  赞和踩逻辑
增添
answers.ts

voteCount:{
        type:Number,
        default:0,
        required:true
}

校验
voteCount:joi.number()

在model/user.ts中增添
```js
linkAnswers:{
   type:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Answer"
   }],
   select:false
  },
  dislinkAnswer:{
   type:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"Answer"
      }
   ],
   select:false
  }
```

```js 点赞答案的函数
/*
点赞
*/
//点赞答案
exports.likeAnswer = async (req: any, res: any,next:Function) => {
    let userId = req.auth._id

    const user = await User.findById(userId).select("+linkAnswers")

    if (user.linkAnswers.includes(req.params.id)) {
        //如果没有点赞过，在点赞
        user.linkAnswers.push(req.params.id)
        await user.save()
    }
    res.status(200).json({
        code: 200,
        msg: "点赞成功",
        data: user
    })
    next()
}

//取消点赞答案
exports.unlinkAnswer = async (req: any, res: any) => {
    let userId = req.auth._id
    const user = await User.findById(userId).select("+linkAnswers");

     // 获取所有关注用户的索引，查询是否未关注话题，如果没有则发出错误，无法发出错误
    const index = user.dislinkAnswer.indexOf(req.params.id)
    if (index > -1) {
        //若已经点赞，则进行取消
        await user.dislinkAnswer.splice(index, 1)
        await user.save()
    }
}

//点赞答案的列表
exports.listLinkAnswer = async (req: any, res: any) => {

    let userId = req.params.id
    const user = await User.findById(userId).select("+linkAnswers").populate("linkAnswers")
    //populate这个属性是查找数据库中的following连接的属性，可以查找到对应的id属性代表的值

    if (!user) return res.out(400, '获取点赞列表失败')
    res.status(200).json({
        code: 200,
        msg: '获取点赞列表成功',
        data: user
    })
}
```

```js 点踩答案的函数
/*
点踩
*/
//点踩
exports.dislikeAnswer = async (req: any, res: any,next:Funciton) => {
    let userId = req.auth._id

    const user = await User.findById(userId).select("+dislinkAnswer")

    if (user.dislinkAnswer.includes(req.params.id)) {
        //如果没有点赞过，在点赞
        user.dislinkAnswer.push(req.params.id)
        await user.save()
    }
    res.status(200).json({
        code: 200,
        msg: "点赞成功",
        data: user
    })
    next()
}

//取消点踩
exports.undislinkAnswer = async (req: any, res: any) => {
    let userId = req.auth._id
    const user = await User.findById(userId).select("+dislinkAnswer");

    // 获取所有关注用户的索引，查询是否未关注话题，如果没有则发出错误，无法发出错误
    const index = user.dislinkAnswer.indexOf(req.params.id)
    if (index > -1) {
        //若已经点赞，则进行取消
         user.dislinkAnswer.splice(index, 1)
         await user.save()
    }
   这里就不能再进行发送数据了，因为之前已经发送过了
}

//点踩答案的列表
exports.listDisLinkAnswer = async (req: any, res: any) => {

    let userId = req.params.id
    const user = await User.findById(userId).select("+dislinkAnswer").populate("dislinkAnswer")
    //populate这个属性是查找数据库中的following连接的属性，可以查找到对应的id属性代表的值

    if (!user) return res.out(400, '获取点赞列表失败')
    res.status(200).json({
        code: 200,
        msg: '获取点赞列表成功',
        data: user
    })
}
```

路由接口
写在user中，
```js
const checkAnswerExist=require('../middleware/checkAnswerExist')

引用checkAnswerExist

/*
点赞
*/
// 点赞答案
router.put('/linkAnswers/:id',checkAnswerExist,user.linkAnswer)

// 取消点赞
router.delete('/linkAnswers/:id',checkAnswerExist,user.unlinkAnswer)

//点赞列表
router.get('/:id/linkAnswers',user.listLinkAnswer)

/*
点踩
*/
// 点踩答案
router.put('/dislinkAnswers/:id',checkAnswerExist,user.dislinkAnswer)

// 取消点踩
router.delete('/dislinkAnswers/:id',checkAnswerExist,user.undislinkAnswer)

//点踩列表
router.get('/:id/dislinkAnswers',user.listDisLinkAnswer)
```

请求接口方式

点赞请求 
**后面的id是答案的id**
http://127.0.0.1/api/user/linkAnswers/63554045ae1afafe6537babe

点赞列表的获取
id值是用户的id值 ，获取用户已经点赞的答案的数量

http://127.0.0.1/api/user/63550212a064b3b59a3c1e9d/linkAnswers

#### 补充
统计数量，点完赞后，votecount数量加1，点完踩后数量减1
点完赞后，取消点踩，点完踩后，取消点赞

点赞之后，对answer中的voteCount进行添加数量进行统计

```js 
 if (!user.linkAnswers.includes(req.params.id)) {
        //如果没有点赞过，在点赞
        user.linkAnswers.push(req.params.id)

        //对点赞数量进行统计添加
        await Answer.findById(req.params.id,{$inc:{voteCount:1}})
        await user.save()
    }
```
```js
if (!user.dislinkAnswer.includes(req.params.id)) {
        //如果没有点赞过，在点赞
        user.dislinkAnswer.push(req.params.id)
        
        当点踩后，对点赞数量进行减一，
        await Answer.findById(req.params.id,{$inc:{voteCount:-1}})

        await user.save()
    }
```

**补充互斥，当点赞后，就取消点踩。当点踩后，就取消点赞**

在点赞之后，调用取消点踩函数
在点踩之后，调用取消点赞函数


*/
// 点赞答案
router.put('/linkAnswers/:id',checkAnswerExist,user.linkAnswer,user.undislinkAnswer)

// 点踩答案
router.put('/dislinkAnswers/:id',checkAnswerExist,user.dislinkAnswer,user.unlinkAnswer)

对函数user.linkAnswer,user.dislinkAnswer进行改造，使其设置为中间件，就可以实现互斥效果
### 收藏，取消收藏，收藏列表

数据模型
/model/user.ts

   // 收藏答案
   collectingAnswers:{
      type:[{
         type:mongoose.Schema.Types.ObjectId,
         ref:"Answer"
      }],
      select:false
   }

**直接进行复制，然后修改数据字段为collectingAnswers**
```js   controller/user.ts
/*
收藏答案
*/
//收藏答案
exports.collectingAnswer = async (req: any, res: any) => {
    let userId = req.auth._id
    const user = await User.findById(userId).select("+collectingAnswers")
    //如果已经关注过了，那我们就直接return 
    if (!user) res.out(404, '用户不存在')
    if (user.collectingAnswers.includes(req.params.id)) return res.out(400, '已经收藏，无法收藏')

    //如果没有关注过，在关注
    user.collectingAnswers.push(req.params.id)
    await user.save()

    res.status(200).json({
        code: 200,
        msg: "收藏成功",
        data: user
    })
}
// 取消收藏答案
exports.uncollectingAnswers = async (req: any, res: any) => {
    let userId = req.auth._id
    const user = await User.findById(userId).select("+collectingAnswers");

    //   获取所有关注用户的索引，查询是否未关注话题，如果没有则发出错误，无法发出错误
    const index = user.collectingAnswers.indexOf(req.params.id)
    //若没有关注，则取消关注
    if (index == -1) return res.out(400, '未收藏，取消收藏失败')

    //  已关注，就进行取消操作
    user.collectingAnswers.splice(index, 1);
    await user.save()
    res.status(200).json({
        code: 200,
        msg: "取消关注成功",
        data: user
    })
}
//收藏答案的列表
exports.listCollectingAnswers = async (req: any, res: any) => {
    let userId = req.params.id
    const user = await User.findById(userId).select("+collectingAnswers").populate("collectingAnswers")
    //populate这个属性是查找数据库中的following连接的属性，可以查找到对应的id属性代表的值

    if (!user) return res.out(400, '获取收藏列表失败')
    res.status(200).json({
        code: 200,
        msg: '获取收藏列表成功',
        data: user
    })
}
```
```js   routes/user.ts
  /*
收藏列表
*/
//收藏
router.put('/collectingAnswers/:id',checkAnswerExist,user.collectingAnswer)

// 取消收藏
router.delete('/collectingAnswers/:id',checkAnswerExist,user.uncollectingAnswers)

// 收藏列表
router.get('/:id/collectingAnswers',user.listCollectingAnswers)
```
## 评论需求模块分析
需求分析
评论的增删改查
答案-评论/问题-评论/用户-评论（1对多）
一级评论与二级评论
日期
### 数据结构以及中间件的编写
新建文件进行存储
//model /comment.ts
```js  数据模型
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
    }
})

function commentValidator(data:any){
    //对传输过来的问题数据进行校验
    const schema= joi.object({
          content:joi.string().required(),
          commentator:joi.objectId(),
          questionId:joi.string(),
          answerId:joi.string()
     })
     return schema.validate(data)
}


// 创建model
const Comment=mongoose.model('Comment',commentSchema)

module.exports={
    Comment,
    commentValidator
}
```

```js  中间件 checkCommentExist.ts   检查是否存在
export const {Comment}=require('../model/comment')

module.exports=async(req:any,res:any,next:Function)=>{
    const answer=await Comment.findById(req.params.id).select("+commentator")
    if(!answer)return res.out(404,'评论不存在')

    //判断问题下面有没有答案
    if(req.params.questionId && Comment.questionId !== req.params.questionId){
        return res.out(404,'该评论下没有答案')
    }

    if(req.params.answerId&& Comment.answerId !== req.params.answerId){
        return res.out(404,'该答案下没有评论')
    }
    next()
}
```
```js  中间件 checkCommentator.ts 检查评论的是否是原本发的人
export const {Comment}=require('../model/comment')

module.exports=async(req:any,res:any,next:Function)=>{
    const answer=await Comment.findById(req.params.id).select('+commentator')
    if(Comment.commentator.toString() !== req.auth._id)return res.out(400,'没有权限进行修改')
    next()
}
```
### 评论模块增删改查
```js controller函数
export const {Comment}=require('../model/comment')

// 获取评论列表
exports.getCommentList=async(req:any,res:any,next:Function)=>{
    try{
        //当前是第几页
        //当page传入一个负值后，返回1，来防止数据错误
        const page=Math.max(req.query.page*1,1)-1
        // 每页有几条数据
       
        const {per_page=10}=req.query
        //给per_page一个默认值为2来展示没有输入参数的时候
        const perPage=Math.max(per_page*1,1);


        // 对标题以及评论描述进行模糊匹配
        // 提供了{$or:[{title:keyword},{description:keyword}]}来多次匹配
        const keyword=new RegExp(req.query.keyword)
        const {questionId,answerId}=req.params
        //通过questionId来查询评论的id，查询回答的id
         const CommentList=await Comment.find({content:keyword,questionId,answerId})
         .limit(perPage)
         .skip(page*perPage)

         //limit(3)是只显示3条数据，skip（3）跳过几条数据
         if(!CommentList)return res.out(400,'获取评论列表失败')
         
         res.status(200).json({
            code:200,
            msg:"获取评论列表成功",
            data:CommentList
         })   
    }catch(err){
        next(err)
    }
}

// 获取指定评论
exports.getComment=async(req:any,res:any,next:Function)=>{
    try{
        const {field=""}=req.query
        const selectFields=field.split(";").filter((f:any)=>f).map((f:any)=>" +"+f).join("")
        //获取指定用户的
        const comment=await Comment.findById(req.params.id).select(selectFields).populate("commentator")

        if(!comment)return res.out(400,'获取评论失败')
        
        res.status(200).json({
           code:200,
           msg:"获取评论成功",
           data:comment
        })   
    }catch(err){
        next(err)
    }
}
// 新增评论
//不需要进行检查评论是否存在，评论可以有多个创建者
exports.createComment=async(req:any,res:any,next:Function)=>{
    try{
    const {questionId,answerId}=req.params
    const comment =new Comment({...req.body,commentator:req.auth._id,questionId,answerId})
    await comment.save()
    res.status(200).json({
        code:200,
        msg:"评论添加成功",
        data:comment
    })
    }catch(err){
        next(err)
    }
}
// 更新评论
exports.updateComment=async(req:any,res:any,next:Function)=>{
    try{
      let CommentId=req.params.id
      const comment=await Comment.findByIdAndUpdate(CommentId,req.body)
      
      if(!comment)return res.status(400).json({
        code:400,
        msg:'评论更新失败',
        value:comment
      })

      res.status(200).json({
          code:200,
          msg:"更新评论成功",
          data:req.body
      })
    }catch(err){
        next(err)
    }
}
// 删除评论
exports.deleteComment=async(req:any,res:any,next:Function)=>{
    try{
        const data=await Comment.findByIdAndDelete(req.params.id)

        if(!data)res.out(400,'删除评论失败')

        res.status(200).json({
            code:200,
            msg:"删除评论成功",
            data:data
        })
    }catch(err){
        next(err)
    }
}
```
```js 路由
export const router=require('express').Router()
const comment=require('../controller/comment')
const {commentValidator}=require('../model/comment')
const validator=require('../middleware/validate')
const checkcommenter=require('../middleware/checkCommentator')
const checkcommentExist=require('../middleware/checkCommentExist')

// 获取评论列表
router.get('/',comment.getCommentList)

// 获取指定评论
router.get('/:id',checkcommentExist,comment.getComment)

// 新增评论
router.post('/',validator(commentValidator),comment.createComment)

//修改评论
router.patch('/:id',[validator(commentValidator),checkcommentExist,checkcommenter],comment.updateComment)

// 删除评论
router.delete('/:id',[checkcommentExist,checkcommenter],comment.deleteComment)
module.exports=router
```
```js index.ts引入路由
// 评论接口
router.use('/question/:questionId/answer/:answerId/comment',require('./comment')
```
**获取所有评论id**
get //question/quesitonid问题id/answer/回答id/comment
http://127.0.0.1/api/question/6354fc0e48453db57cd4f38a/answer/6354fc2348453db57cd4f38e/comment

get //question/quesitonid问题id/answer/回答id/comment/评论的id
http://127.0.0.1/api/question/6354fc0e48453db57cd4f38a/answer/6354fc2348453db57cd4f38e/comment/635680d7479af9fa0a0aa5e4
### 一级与二级评论
增加模块
```js  comment.ts 数据模块
// ?rootCommentId=xxx代表访问的是一个二级评论
    rootCommentId:{
        type:String
    },
    replyTo:{//二级评论回复的是谁
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
```
```js   comment.ts数据校验
 rootCommentId:joi.string(),
replyTo:joi.objectId()
```

函数改造
```js getCommentList  增加.populate("commentator replyTo")
 //通过questionId来查询评论的id，查询回答的id
         const CommentList=await Comment.find({content:keyword,questionId,answerId})
         .limit(perPage)
         .skip(page*perPage)
         .populate("commentator replyTo")
```
```js createComment 增加commentator，在新增二级评论时需要添加 content,replyTo,rootCommentId
const commentator=req.auth._id
const comment =new Comment({...req.body,commentator,questionId,answerId,answerer:req.auth._id})
```
```js updateComment更新评论不能更改其他属性，只能更新content，防止id改变找不到评论
const {content}=req.body
const comment=await Comment.findByIdAndUpdate(CommentId,content)
```

```md  调用接口方式
**二级评论，必须要添加的字段为rootCommentId,replyTo**
route.post 评论接口相同，不过字段添加多了两个

http://127.0.0.1/api/question/6354fc0e48453db57cd4f38a/answer/6354fc2348453db57cd4f38e/comment

content==为你弹奏肖邦的夜曲，纪念我死去的爱情
replyTo  被评论的发布者的id
rootCommentId  一级评论的id
```
### 添加时间参数

数据结构的第三个参数
{timestamps:true}

只需要在const commentSchema=new mongoose.Schema({},{timestamps:true})
建立模型时添加第二个字段即可
## 文章分类与文章模块
创建数据模型categories.ts
```js

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
```

操作函数

```js

// 引入model
const { Category } = require('../model/categories')


// 获取分类列表
exports.getCategoryList = async (req: any, res: any, next: Function) => {
    try {
        // 分页系统
        const page = Math.max(req.query.page * 1, 1) - 1;
        // 每页有几条数据
        const { per_page = 10 } = req.query//默认查询10条数据
        const perPage = Math.max(per_page * 1, 1)
        const keyword = new RegExp(req.query.keyword)

        //  查询所有分类
        const category = await Category.find({ name: keyword }).limit(perPage).skip(perPage * page)

        if (!category) return res.out(400, '查找分类列表失败')

        res.status(200).json({
            code: "200",
            msg: "分类获取成功",
            data: category
        })
    } catch (err) {
        next(err)
    }
}

// 获取分类列表
exports.getCategory = async (req: any, res: any, next: Function) => {
    try {
        //  1.检测分类是否存在
        const id = req.params.id
        if (!id) return res.out(400, '请传入分类id')

        const data = await Category.findById(id)
        if (!data) {
            return res.status(200).json({
                code: "200",
                msg: "获取信息失败，请稍后失败",
                value: {
                    id
                }
            })
        }

        res.status(200).json({
            code: 200,
            msg: "分类信息获取成功",
            data
        })
    } catch (err) {
        next(err)
    }
}

//新增分类
exports.createCategory=async(req:any,res:any,next:Function)=>{
    try{
    //    1.检测分类是否存在
    const data=req.body

    let cate=await Category.findOne(data)
    // 2.若分类信息已存在
    if(cate){
        return res.status(400).json({
            code:400,
            msg:"分类已存在",
            value:data
        })
    }

    cate=new Category(data)
    await cate.save()

    res.status(200).json({
        code:200,
        msg:"分类添加成功",
        value:data
    })
    }catch(err){
        next(err)
    }
}

// 更新分类
exports.updateCategory=async(req:any,res:any,next:Function)=>{
    try{
    //   1.检测id是否存在
    const id=req.params.id
    if(!id)return res.out(400,'请传入id')
  
    // 更新
    const data=await Category.findByIdAndUpdate(id,req.body,{new:true})
    if(!data)return res.status(400).json({
        code:400,
        msg:"编辑分类失败",
        value:req.body
    })
    res.status(200).json({
        code:200,
        msg:"编辑分类成功",
        data
    })

    }catch(err){
        next(err)
    }
}

// 删除分类
exports.deleteCategory=async (req:any,res:any,next:Function)=>{
    try{
        const id=req.params.id
        if(!id)return res.out(400,'请传入id')
        
        const data=await Category.findByIdAndDelete(id)

        if(!data)return res.out(400,'删除失败')

        res.status(200).json({
            code:200,
            msg:"删除分类成功",
            data
        })

    }catch(err){
        next(err)
    }
}
```

路由
```js
export const router=require('express').Router()
const category=require('../controller/categories')
const {categoryValidator}=require('../model/categories')
const validator=require('../middleware/validate')



// 获取分类列表
router.get('/',category.getCategoryList)

// 获取指定分类
router.get('/:id',category.getCategory)

// 新增分类
router.post('/',validator(categoryValidator),category.createCategory)

//修改分类
router.patch('/:id',validator(categoryValidator),category.updateCategory)

// 删除分类
router.delete('/:id',category.deleteCategory)



module.exports=router


```

引入index.ts
// 文章分类接口
 router.use('/category',require('./categories'))
## 文章模块的具体实现

































