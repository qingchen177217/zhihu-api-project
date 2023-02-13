import request from './request'


export const getQuestion= (per_page:number,page:number)=>{
    //获取所有问题的接口
     return request({
            url:"question",
            params:{//添加请求参数
                per_page:per_page,
                page:page,
                field:"topics"
            }
    })
}

