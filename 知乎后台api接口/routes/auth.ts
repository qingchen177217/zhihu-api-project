const router=require('express').Router()
const auth=require('../controller/auth')
const validate=require('../middleware/validate')
export const {userValidator}=require('../model/user')

router.post('/',validate(userValidator),auth.login)


module.exports=router