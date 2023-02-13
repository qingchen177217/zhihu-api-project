<template>
    <div>
        <div class="mainHead" ref="header">
                <Head></Head>
        </div>
        <div style="margin-top:52px;">
            <div style="opacity:1;">
                <div class="main-bgi">
                    <img src="http://localhost:80/upload/main-2.jpg" alt="">
                    <p>人们聚和离，云朵来又往。时光飞逝，悄悄话变成纸张</p>
                </div>
            </div>
            <div style="height:200px">
                   <div class="css-1"> 
                   </div>
            </div>
        </div>
        <div class="mainpage">
            <mainpage></mainpage>
        </div>
    </div>
</template>
<script setup lang='ts'>
import Head from '../../components/title/index.vue'
import mainpage from './children/MainPage.vue'

const header=ref()
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 200 || document.body.scrollTop > 200) {
        header.value!.style.backgroundColor = "#1ba784"
       header.value!.style.boxShadow="0 1px 3px rgb(18 18 18 / 10%)"
    } else {
        header.value!.style.backgroundColor = ''
        header.value!.style.boxShadow=''
    }
})
</script>
<style lang='less' scoped>
.css-1{
    box-sizing: border-box;
    margin:0 auto;
    height: 220px;
    width: 1000px;
}

.mainHead{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 52px;
    z-index: 999;
    transition: all 0.3s;
}
.main-bgi {
    position:absolute;
    top:0px;
    width: 100%;
    height: 322px;
    opacity: 1;
    z-index: -1;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    p {
        position: absolute;
        width: 500px;
        text-align: center;
        font-family: "华文行楷";
        top: 35%;
        left: 50%;
        font-size: 20px;
        transform: translateX(-50%);
        color: #ffffff;
    }
}

.mainpage{
    position:relative;
       width: 1000px;
    margin:10px auto;
}
</style>