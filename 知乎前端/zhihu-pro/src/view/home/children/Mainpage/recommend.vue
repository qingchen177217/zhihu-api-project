<template>
   <div class="list">
      <div class="TopItem" v-for="item in questionData" :key="item._id">
         <div class="feed">
            <div class="question-title">
               <router-link :to="`/question/${item._id}`">
                  {{ item.title }}
               </router-link>
            </div>
            <!-- 回答 -->
            <div class="answerList">
               <div class="answerItem">
                  <div class="normalContent" v-if="item.answerData?.state">
                     {{ item.answerData!.answerer.name }}:
                     <span style="padding-left:12px;cursor:pointer;font-size:16px;"
                        @click="showContent(item.answerData)">
                        {{ item.answerData!.savecontentData }}
                     </span>
                     <span>
                        <button class="readAll" @click="showContent(item.answerData)">
                           阅读全文
                           <span>
                              <svg t="1667397875998" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                 xmlns="http://www.w3.org/2000/svg" p-id="2536" width="18" height="18">
                                 <path
                                    d="M133.404444 349.108148l365.131852 352.616296c1.232593 1.137778 2.56 2.085926 3.982222 2.939259 7.205926 4.361481 16.592593 3.508148 22.945185-2.56l365.131852-352.616296c7.68-7.395556 7.774815-19.816296 0-27.306667-7.395556-7.205926-19.342222-6.826667-26.737778 0.379259l-351.762963 339.626667c0 0 0 0-0.094815 0L160.047407 322.180741c-7.395556-7.205926-19.342222-7.49037-26.737778-0.379259C125.62963 329.291852 125.724444 341.712593 133.404444 349.108148z"
                                    p-id="2537" fill="#1ba784"></path>
                              </svg>
                           </span>
                        </button>
                     </span>
                  </div>
                  <div class="hideContent" v-else>
                     <div class="user">
                        <img :src="item.answerData?.answerer.avatar_url" alt="">
                        <router-link :to="`/user/${item.answerData?.answerer._id}`" class="userName">{{
                              item.answerData?.answerer.name
                        }}</router-link>
                        <div style="line-height:28px;">
                           {{ item.answerData?.answerer.headline }}
                        </div>
                     </div>
                     <button class="agreeAnswer">
                        {{ item.answerData?.voteCount }}
                        <span style="margin-left:2px;">
                           人赞同了该回答
                        </span>
                     </button>
                     <p class="answerContent">
                        <span>{{ item.answerData?.content }}</span>
                     </p>
                     <p class="updateDate">编辑于{{ item.answerData?.updatedDate }}</p>
                  </div>
               </div>
            </div>
            <!-- 问题底部 -->
            <div class="question-footer">
               <div class="agree">
                  <button @click="agreeanswer(item.answerData)" :class="{ agreeAN: item.answerData?.isAgree }">
                     <span>
                        <svg t="1667539496725" class="icon" viewBox="0 0 1024 1024" version="1.1"
                           xmlns="http://www.w3.org/2000/svg" p-id="2533" width="10" height="10"
                           :class="{ svgicon: item.answerData?.isAgree }">
                           <path
                              d="M573.056 272l308.8 404.608A76.8 76.8 0 0 1 820.736 800H203.232a76.8 76.8 0 0 1-61.056-123.392L450.976 272a76.8 76.8 0 0 1 122.08 0z"
                              p-id="2534"></path>
                        </svg>
                     </span>
                     赞同
                     {{ item.answerData?.voteCount }}
                  </button>
               </div>
               <!-- 不同意 -->
               <div class="disagree">
                  <button @click="disagree(item.answerData)" :class="{ disagreeAN: item.answerData?.isdisAgree }">
                     <span>
                        <svg t="1667539058030" class="icon" viewBox="0 0 1024 1024" version="1.1"
                           xmlns="http://www.w3.org/2000/svg" p-id="1371" width="10" height="10"
                           :class="{ svgicon: item.answerData?.isdisAgree }">
                           <path
                              d="M573.056 752l308.8-404.608A76.8 76.8 0 0 0 820.736 224H203.232a76.8 76.8 0 0 0-61.056 123.392l308.8 404.608a76.8 76.8 0 0 0 122.08 0z"
                              p-id="1372"></path>
                        </svg>
                     </span>
                  </button>
               </div>
               <!-- 评论按钮 -->
               <button class="comment" @click="showComment(item._id,item.answerData?._id as string,item.answerData?.comment)">
                  <span style="vertical-align:middle;">
                     <svg t="1667543153777" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="3672" width="18" height="18">
                        <path
                           d="M512 85.333333c235.637333 0 426.666667 191.029333 426.666667 426.666667S747.637333 938.666667 512 938.666667a424.778667 424.778667 0 0 1-219.125333-60.501334 2786.56 2786.56 0 0 0-20.053334-11.765333l-104.405333 28.48c-23.893333 6.506667-45.802667-15.413333-39.285333-39.296l28.437333-104.288c-11.008-18.688-18.218667-31.221333-21.802667-37.909333A424.885333 424.885333 0 0 1 85.333333 512C85.333333 276.362667 276.362667 85.333333 512 85.333333z m-102.218667 549.76a32 32 0 1 0-40.917333 49.216A223.178667 223.178667 0 0 0 512 736c52.970667 0 103.189333-18.485333 143.104-51.669333a32 32 0 1 0-40.906667-49.216A159.189333 159.189333 0 0 1 512 672a159.189333 159.189333 0 0 1-102.218667-36.906667z"
                           p-id="3673" fill="#76839b"></path>
                     </svg>
                  </span>
                  {{ item.answerData?.comment?.allComment.length}}
                  条评论
               </button>
               <!-- 收藏按钮 -->
               <button class="collect" @click="collectAnswers(item.answerData)">
                  <span style="vertical-align:middle;">
                     <svg t="1667544180665" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="4760" width="18" height="18">
                        <path
                           d="M509.606998 104.904235c-24.043602 0-45.922912 13.226233-56.177464 33.95637L356.189863 336.302419l-223.674269 32.54216c-22.983457 3.304256-42.100864 18.718317-49.481971 39.659255-7.381108 21.048385-1.812275 44.23241 14.431687 60.033281l163.916257 160.125931-38.011732 222.016513c-3.868097 22.408359 6.03239 44.819788 25.458835 57.94676 10.69662 7.116071 23.204491 10.784624 35.757388 10.784624 10.298554 0 20.663622-2.475378 30.055526-7.337105l194.987926-102.7205L704.662463 912.072815c9.369392 4.861728 19.712971 7.337105 29.990035 7.337105 12.57541 0 25.082258-3.668553 35.778878-10.784624 19.426445-13.126972 29.305443-35.538401 25.460882-57.94676l-38.012755-222.016513 163.937746-160.125931c16.22145-15.812127 21.810748-38.984896 14.408151-60.033281-7.402597-20.940938-26.51898-36.353976-49.503461-39.659255L663.04767 336.302419l-97.240695-197.441814C555.619962 118.131491 533.695626 104.904235 509.606998 104.904235L509.606998 104.904235z"
                           p-id="4761" :fill="item.answerData?.collecticon"></path>
                     </svg>
                  </span>
                  收藏
               </button>
               <!-- 收起按钮 -->
               <div class="stowAnswer" v-show="!item.answerData?.state" @click="showContent(item.answerData)">
                  收起
                  <span>
                     <svg t="1667547137757" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="5857" data-spm-anchor-id="a313x.7781069.0.i25"
                        width="13" height="13">
                        <path
                           d="M854.016 739.328l-313.344-309.248-313.344 309.248q-14.336 14.336-32.768 21.504t-37.376 7.168-36.864-7.168-32.256-21.504q-29.696-28.672-29.696-68.608t29.696-68.608l376.832-373.76q14.336-14.336 34.304-22.528t40.448-9.216 39.424 5.12 31.232 20.48l382.976 379.904q28.672 28.672 28.672 68.608t-28.672 68.608q-14.336 14.336-32.768 21.504t-37.376 7.168-36.864-7.168-32.256-21.504z"
                           p-id="5858" fill="#8590a6"></path>
                     </svg>
                  </span>
               </div>
            </div>
            <!-- 评论展示，二级评论 -->
            <div style="overflow:unset" v-if="!item.answerData?.comment?.commentState">
               <div class="commentList">
                  <div class="write-comment">
                     <div class="headimg">
                        <img :src="selfData!.avatar_url" alt="">
                     </div>
                     <div class="inputComment">
                       <comment :item="item"/>
                     </div>
                  </div>
                  <div class="comment-container">
                        <div class="sumComment">
                              {{item.answerData?.comment?.allComment.length}}条评论
                        </div>
                        <div class="allComment">
                               <div class="firstComment">
                                   
                               </div>
                        </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <div class="question-foot">
         (●'◡'●) 已经到底了哦
      </div>
   </div>

</template>

<script setup lang='ts'>
import {
   getQuestion
}
   from '../../../../api/question'
import {
   getAnswer, getAppointAnswer, agreeAnswer,
   deleteAgree,
   disAgreeAnswer,
   deleteDisAgreeAnswer,
   collectingAnswers,
   uncollectingAnswers
}
   from '../../../../api/answer'
import {
   getUser
}
   from '../../../../api/user'
import {
   deleteComment,
   PostSecondComment,
   getSecondComment,
   getComment
} from '../../../../api/comment'
import store
   from '../../../../store/index'
import { throttle } from '../../../../utils/other'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'
// import autosize from 'autosize'
import comment from './recommend/index.vue'
//绑定自己的数据
let selfData = ref<answerer>()

//点击是否进行阅读全文
const showContent = (i: any) => {
   i.state = !i.state
}

interface topic {//话题接口信息
   avatar_url?: string,
   name: string,
   __v: number,
   id: number
}
interface answerer {
   email: string,
   gender: 'male'|'female',
   name: string,
   _id: number,
   avatar_url: string,
   headline?: string
}

interface allComment{
   length:number,
   answerId:string,
   commentator:answerer,
   content:string,
   questionId:string,
   updateAt:string,
   _id:string
}
interface comment {
   commentState: boolean,
   isHiddenButton: boolean,
   isShowSubmit: boolean,
   commentData: string,
   commentIndex: number,
   allComment:Array<allComment>
}
interface answer {//回答接口类型
   _id: string,
   content: string,
   voteCount: number,//回答的点赞数量
   __v: number,
   answerer: answerer,
   state: {
      type: boolean,
      default: true
   },
   savecontentData: string,
   updatedDate: string,
   comment?: comment,
   collectState: boolean,
   collecticon: string,
   isAgree: {
      type: boolean,
      default: false
   },
   isdisAgree: {
      type: boolean,
      default: true
   }
}
interface question {//问题接口类型
   _id: string,
   __v: number,
   title: string,
   description?: string,
   topics?: Array<topic>,
   answerData?: answer,
}


const questionData = ref<Array<question>>()
//将请求的问题保存到这里

/*
赞同模块
*/
const reGetAnswer = async (answer: any) => {
   // 重新调用计算点赞数量路由
   await getAppointAnswer(answer.questionId, answer._id).then((res: any) => {
      answer.voteCount = res.data.voteCount
   })
}

//点击赞同按钮触发
const agreeanswer = (answer: any) => {

   answer.isAgree = !answer.isAgree

   if (answer.isAgree) {
      if (answer.isdisAgree) {
         answer.isdisAgree = !answer.isdisAgree
      }
   }

   const requestagree = throttle(async () => {
      if (answer.isAgree) {
         await agreeAnswer(answer._id)
         //触发路由，点击赞同

         // 重新获取数据
         reGetAnswer(answer)
      } else {
         // 触发取消点赞接口
         await deleteAgree(answer._id)
         // 重新调用计算点赞数量路由
         reGetAnswer(answer)
      }
   }, 500)

   requestagree()
}

//保存不赞同的答案的id，让不赞同按钮，只进行一次网络请求，后续网络不进行请求
let disAnswerData: Array<string> = []
//点击不赞同触发的文件
const disagree = async (answer: any) => {

   answer.isdisAgree = !answer.isdisAgree

   //判断按钮的显示状态
   if (answer.isdisAgree) {
      if (answer.isAgree) {
         answer.isAgree = !answer.isAgree
      }
      //当点击取消的时候，取消对答案的赞同
      if (disAnswerData.find((item: any) => item == answer._id) !== undefined) {
         await deleteAgree(answer._id)
      }
   }

   const requestdisagree = throttle(async () => {
      if (disAnswerData.find((item: any) => item == answer._id) == undefined) {
         if (answer.isdisAgree) {
            await disAgreeAnswer(answer._id)
            //重新获取答案数据
            reGetAnswer(answer)
         } else {
            await deleteDisAgreeAnswer(answer._id)
         }
         disAnswerData.push(answer._id)
         //将点踩答案保存，只允许执行一次，之后的点踩，不会引发网络请求
      }
   }, 500)

   requestdisagree()
}

/*
评论模块
*/

//保存状态，是否已经添加过索引值，如果添加过则不进行添加
const saveIndex: Array<number> = []

//点击触发显示评论,改变状态，以及给每一个评论模块添加一个索引值，来进行标记
//索引值，作用，添加后，等待每一个评论提交后，将特定的输入框中的内容进行清空
const showComment = async (questionId:string,answerId:string,comment: any) => {
   comment.commentState = !comment.commentState
   if (comment.commentState == false) {
      //判断是否是打开评论，只有打开评论才可以进行
      if (!saveIndex.includes(comment.commentIndex)) {
         //当评论第一次点击之后，后续点击，不会进行赋值
         if (saveIndex.length === 0) {
            comment.commentIndex = 0
         } else {
            //将最后一个值加一进行保存
            comment.commentIndex = saveIndex[saveIndex.length - 1] + 1
         }
         saveIndex.push(comment.commentIndex)
      }
   }
   //将currentIndex的值等于commentIndex,来给textarea进行绑定，
   //这样可以在查询后，对特定的输入框进行操作


   //打开评论后，对评论数据进行请求
  await getComment(questionId,answerId).then((res:any)=>{
      comment.allComment=res.data
      //将评论数据进行保存
      comment.allComment.forEach((item:any)=>{
           item.updatedAt=item.updatedAt.slice(5,10)
      })
     
      
      
  })
}

/*
收藏模块
*/

//收藏按钮
const collectAnswers = async (item: any) => {
   item.collectState = !item.collectState
   item.collecticon = item.collectState ? "#8590a6" : "#1ba784"

   const requestCollect = throttle(async () => {
      if (!item.collectState) {
         await collectingAnswers(item._id)
         ElMessage({
            message: '收藏成功',
            type: 'success',
         })
      } else {
         await uncollectingAnswers(item._id)
         ElMessage({
            message: '取消收藏成功',
            type: 'success',
         })
      }
   }, 1500)
   requestCollect()
}

/*
初始化问题，答案数据
*/
onMounted(async () => {

   const useStore = store()
   let userData: Array<string> = []
   //取出当前登录用户点赞的答案，检测当前页面问题答案是否被当前用户点击，从而进行判断

   let userCollect: Array<string> = []
   // 取出当前用户收藏的答案
   await getUser(useStore.selfId, 'linkAnswers;collectingAnswers').then(res => {

      selfData.value = res.data.user

      //取出点赞数据的数组中的每个id值
      userData = res.data.user.linkAnswers.map((item: any) => {
         return item._id
      })

      userCollect = res.data.user.collectingAnswers.map((item: any) => {
         return item._id
      })
      //取出收藏的答案的id
   })

   await getQuestion(6, 2).then((res: any) => {
      //获取问题
      questionData.value = res.data
      //将数据问题数据进行保存

      questionData.value?.forEach((item: any) => {

         //获取每一个问题的答案数量，进行保存
         getAnswer(item._id, 1, 1).then(async(res: any) => {

            //每次只请求一页数据，只保存一次的数据，改变页面的时候，重新请求数据
            if (res.code == '200' || res.code == '201') {
               // 将答案数据进行保存到questionData数据的answerData对象中

               const { content, updatedAt } = res.data[0]

               item.answerData = {
                  ...res.data[0],
                  // 来判断文章是否进行展开显示,循环给每一个答案都加上state属性
                  state: true,
                  //将每一个答案的是否点击同意的状态进行修改
                  isAgree: false,
                  isdisAgree: false,
                  //给每一个传输过来的文本都增添一个节省后的文本类型//在文本未全文显示时的文本
                  savecontentData: content.slice(0, 56) + '...',
                  // 保存更新时间，进行格式化
                  updatedDate: updatedAt.replace("T", " ").slice(0, 16),
                  // 判断评论的状态
                  comment: {
                     commentState: true,
                     // //是否隐藏提交按钮
                     isHiddenButton: false,
                     // //输入框状态来判断按钮样式
                     isShowSubmit: false,
                     commentData: ""
                  },
                  collection: "#8590a6",
                  collectState: true
               }
               //通过请求的linkAnswer当前答案是否已经被当前登录账号点赞，来改变样式
               if (userData.includes(res.data[0]._id)) {
                  item.answerData.isAgree = true
               }
               if (userCollect.includes(res.data[0]._id)) {
                  item.answerData.collecticon = "#1ba784"
                  item.answerData.collectState = false
               } else {
                  item.answerData.collectState = true
                  item.answerData.collecticon = "#8590a6"
               }
               // await getComment(item._id,item.answerData._id).then((res:any)=>{
               //    //  item.answerData?.comment.allComment
               // })
            }
            
         })
      })

   })
})

</script>

<style lang='less' scoped>
.list {
   .TopItem {
      padding: 20px;
      border-bottom: 1px solid rgb(240 242 247);

      .feed {
         .question-title {
            cursor: pointer;
            color: rgb(18, 18, 18);
            font-size: 18px;
            font-weight: 600;
            transition: all 0.3s;

            &:hover {
               color: #58b79f;
            }
         }

         .answerItem {
            margin-top: 10px;
            flex: none;
            width: 614px;
            font-size: 17px;
            line-height: 1.5;

            .normalContent {
               .readAll {
                  color: #1ba784;
                  line-height: 1;

                  span {
                     display: inline-flex;
                     align-items: center;
                  }
               }
            }

            .hideContent {
               .user {
                  margin-top: 10px;
                  display: flex;
                  height: 28px;
                  width: 100%;

                  img {
                     width: 28px;
                     height: 28px;
                  }

                  .userName {
                     margin-left: 15px;
                     font-size: 15px;
                  }
               }

               .agreeAnswer {
                  margin: 10px 0;
                  height: 23px;
                  font-size: 14px;
                  color: rgb(133 144 166);
               }

               .answerContent {
                  font-size: 16px;
                  width: 100%;
               }

               .updateDate {
                  margin-top: 10px;
                  height: 23px;
                  font-size: 14px;
                  color: rgb(133 144 166);
               }
            }
         }

         .question-footer {
            display: flex;
            box-sizing: border-box;
            width: 100%;
            height: 52px;
            padding-top: 10px;
            align-items: center;


            .agree {
               .agreeAN {
                  background-color: #1ba784;
                  color: #fff !important;
               }

               button {
                  box-sizing: content-box;
                  padding: 0 12px;
                  height: 32px;
                  border-radius: 3px;
                  background: rgba(59, 198, 158, 0.1);
                  color: #1ba784;
                  font-size: 14px;

                  svg {
                     fill: #1ba784;
                  }

                  .svgicon {
                     fill: #fff !important;
                  }
               }
            }

            .disagree {
               .disagreeAN {
                  background-color: #1ba784;
               }

               button {
                  margin-left: 10px;
                  padding: 0 12px;
                  border-radius: 3px;
                  background: rgba(59, 198, 158, 0.1);
                  color: #1ba784;
                  height: 32px;

                  svg {
                     fill: #1ba784;
                  }

                  .svgicon {
                     fill: #fff !important;
                  }
               }
            }

            .comment {
               padding: 0;
               line-height: 23px;
               height: 23px;
               margin-left: 24px;
               font-size: 14px;
               color: #76839b;
            }

            .collect {
               padding: 0px;
               line-height: 23px;
               height: 23px;
               margin-left: 24px;
               color: #76839b;
               font-size: 14px;
            }

            .stowAnswer {
               cursor: pointer;
               flex: 1;
               text-align: right;
               font-size: 14px;
               color: #76839b;
            }
         }

         .commentList {
            margin-top: 10px;
            display: flex;
            box-sizing: border-box;
            width: 100%;
            align-items: center;
            flex-direction: column;
            .write-comment {
               display: flex;
               width: 100%;
               margin-bottom: 10px;

               .headimg {
                  width: 40px;
                  height: 40px;
                  margin: 0 10px 0 0;

                  img {
                     width: 100%;
                     height: 100%;
                  }
               }

               .inputComment {
                  border-radius: 5px;
                  box-sizing: border-box;
                  flex: 1 1 auto;
                  padding: 8px 12px;
                  border: 1px solid rgb(235, 235, 235);
                  width: 538px;
               }
            }

            .comment-container {
               width: 100%;
               border: 1px solid rgb(235, 235, 235);
               border-radius:5px;
               .sumComment{
                   padding:0 20px;
                   height: 50px;
                   font-size:15px;
                   color:rgb(68,68,68);
                   font-weight:600;
                   margin:0px;
                   line-height: 50px;
               }
               .allComment{
                  padding:10px 0;
                  width: 100%;
                  //  .firstComment{

                  //  }
               }
            }

         }

      }
   }

   .question-foot {
      margin: 40px 0;
      width: 100%;
      height: 52px;
      border-radius: 5px;
      text-align: center;
      line-height: 52px;
      color: #fff;
      background-color: #58b79f;
   }
}
</style>