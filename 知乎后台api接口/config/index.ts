module.exports={
    app:{
        port:process.env.PORT||80
    },
    db:{
        url:process.env.MONGODB_URL ||'mongodb://localhost:27017/dwzhihu'
    },
    jwt_key:{
        jwtSecretKey:'##########(0_0)(^__^)(^_0)(*0__0*)(0*__*0)',
        expiresIn:'2400h'
    }
}