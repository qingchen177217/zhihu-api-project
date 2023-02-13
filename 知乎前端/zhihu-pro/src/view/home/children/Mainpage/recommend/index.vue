<template>
    <div class="insertComment">
        <textarea class="talk" id="talk" placeholder="说点什么吧" rows="1"
            :currentIndex="item.answerData?.comment?.commentIndex"
            @input="inputComment($event, item.answerData?.comment)"
            @focus="focusComment($event, item.answerData?.comment)"></textarea>
    </div>
    <div class="submitComment" v-show="item.answerData?.comment?.isHiddenButton">
        <p>
            希望您温暖的话语能够抚慰更多失落的人的心灵
        </p>
        <button :class="{ submitData: item.answerData?.comment?.isShowSubmit }"
            @click="putComment(item._id, item.answerData?._id as string, item.answerData?.comment as comment, item.answerData?.comment?.commentIndex as number)">
            发布
        </button>
    </div>
</template>

<script setup lang='ts'>
import autosize from 'autosize'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import {
    postComment
} from '../../../../../api/comment'

interface comment {
    commentState: boolean,
    isHiddenButton: boolean,
    isShowSubmit: boolean,
    commentData: string,
    commentIndex: number
}

type Props = {
    item: any
}
defineProps<Props>()


//聚焦事件，当输入框被聚焦后，做出的方法
const focusComment = (e: any, comment: any) => {
    autosize(e.target);
    //调用插件，自动计算textarea的高度，实现自适应
    comment.isHiddenButton = true
}
//输入事件，将输入框中的值赋值给commentData中，等待提交
const inputComment = (e: any, comment: any) => {

    if (e.target.value !== '') {
        comment.isShowSubmit = true
    } else {
        comment.isShowSubmit = false
    }
    //将输入框里的内容保存到commentData框中进行提交
    comment.commentData = e.target.value
}

//提交评论
const putComment = async (
    questionId: string,
    answerId: string,
    comment: comment,
    commentIndex: number
) => {
    //查询当前已经打开的元素的输入框，然后进行比对，找出和当前commentIndex相符合的输入框
    const talk = Array.prototype.find.bind(document.querySelectorAll('#talk') as any)
    //借用数组方法find进行查找，找到之后，进行判断，当发送成功后，将输入框中的内容进行清空
    const talkValue = talk(((item: any) => {
        if (item.getAttribute('currentIndex') == commentIndex) {
            return item
        }
    }))

    await postComment(
        questionId,
        answerId,
        comment.commentData)
        .then((res: any) => {
            if (res.code == '200' || '201') {
                ElMessage({
                    message: "评论添加成功",
                    type: 'success'
                })
                //将输入框中的值进行清空
                talkValue.value = ''
                //请求成功后，将输入框中的值进行删除，
                //改变按钮状态
                comment.isShowSubmit = !comment.isShowSubmit
            }
        })
}


</script>

<style lang='less' scoped>
.insertComment {
    .talk {
        width:100%;
        padding: 0;
        font-size: 15px;
        // overflow-y: hidden;
        box-shadow: none;
        resize: none;
        outline: none;
        border: 0;
        background: none;
        height: 24px;

        &::placeholder {
            color: #ccc;
            font-size: 15px;
        }

    }
}

.submitComment {
    margin-top: 8px;
    border-top: 1px solid rgb(235, 235, 235);
    padding-top: 5px;
    width: 100%;
    height: 30px;
    display: flex;

    p {
        padding-left: 10px;
        flex: 1;
        height: 30px;
        font-size: 16px;
        color: #ccc;
        line-height: 30px;
    }

    .submitData {
        background-color: #1ba784 !important;
    }

    button {
        padding: 0;
        width: 62px;
        height: 30px;
        background-color: #68cab1;
        color: #fff;
        font-size: 15px;
        border-radius: 3px;
        font-weight: 700;
    }
}
</style>