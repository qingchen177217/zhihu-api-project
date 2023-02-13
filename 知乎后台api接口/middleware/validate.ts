module.exports = (validator: Function) => {

    return (req: any, res: any, next: Function) => {

        const { error, value } = validator(req.body)
        // 将已经进行校验的值进行解构出来，
        // 如果错误则打印，如果正确则赋值给req.valiValue

        if (error) return  res.status(400).json({
            code: 400,
            value: error._orginal,
            msg: error.details[0].message
        })
         
        //数据校验通过，响应成功的信息
        req.validValue = value

        next()
    }
}