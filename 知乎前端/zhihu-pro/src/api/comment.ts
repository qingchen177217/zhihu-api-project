import request from './request'


//获取评论接口
export const getComment=(
    quesionId:string,
    answerId:string
    )=>{
    return request({
        url:`question/${quesionId}/answer/${answerId}/comment`,
    })
}


//新增评论
export const postComment=(
    quesionId:string,
    answerId:string,
    content:string
    )=>{
      return request({
        url:`question/${quesionId}/answer/${answerId}/comment`,
        method:'POST',
        data:{
          content
        }
      })
}
//删除评论
export const deleteComment=(
    quesionId:string,
    answerId:string,
    commentId:string
    )=>{
      return request({
        url:`question/${quesionId}/answer/${answerId}/comment/${commentId}`,
        method:'DELETE',
      })
}

//添加二级评论
export const PostSecondComment=(
    quesionId:string,
    answerId:string,
    content:string,
    replyTo:string,
    rootCommentId:string
    )=>{
    return request({
      url:`question/${quesionId}/answer/${answerId}/comment`,
      params:{
        content,
        replyTo,
        rootCommentId
      }
    })
}


//获取二级评论
export const getSecondComment=(
    quesionId:string,
    answerId:string,
    rootCommentId:string
    )=>{
    return request({
      url:`question/${quesionId}/answer/${answerId}/comment`,
      params:{
        rootCommentId
      }
    })
}












