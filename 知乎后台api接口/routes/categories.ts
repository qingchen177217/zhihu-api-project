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