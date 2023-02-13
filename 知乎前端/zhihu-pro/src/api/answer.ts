import request from './request'


//获取答案的接口
export const getAnswer=async (questionId:string,per_page:number,page:number)=>{
    return await request({
       url:`question/${questionId}/answer`,
       params:{//获取第几个接口
           per_page,
           page
       }
    })
}

//获取指定答案的接口
export const getAppointAnswer=async (questionId:string,answerId:string)=>{
    return await request({
       url:`question/${questionId}/answer/${answerId}`
    })
}


//答案点赞
export const agreeAnswer=async(answerId:number)=>{
   return request({
        url:`user/linkAnswers/${answerId}`,
        method:"PUT"
   })
}

//取消点赞
export const deleteAgree=async(answerId:number)=>{
    return request({
         url:`user/linkAnswers/${answerId}`,
         method:"DELETE"
    })
 }

// 对答案点踩
export const disAgreeAnswer=async(answerId:number)=>{
    return request({
        url:`user/dislinkAnswers/${answerId}`,
        method:"PUT"
    })
}

// 取消点踩
export const deleteDisAgreeAnswer=async (answerId:number)=>{
    return request({
        url:`user/dislinkAnswers/${answerId}`,
       method:"DELETE"
    })
}

//收藏答案

export const collectingAnswers=async (answerId:number)=>{
    return request({
        url:`user/collectingAnswers/${answerId}`,
       method:"put"
    })
}

//取消收藏
export const uncollectingAnswers=async (answerId:number)=>{
    return request({
        url:`user/collectingAnswers/${answerId}`,
       method:"delete"
    })
}


