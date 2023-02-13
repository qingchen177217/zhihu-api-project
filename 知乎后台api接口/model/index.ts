const mongoose=require('mongoose')
export const config=require('../config')

mongoose.connect(config.db.url)

const db=mongoose.connection

db.on('error',(err:Error)=>{
    console.log('数据库连接失败',err);
})

db.on('open',()=>{
    console.log('数据库连接成功');
})












