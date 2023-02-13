<template>
        <main class="main-content">
               <div class="TopStory">
                        <div class="topRouter">
                                 <router-link to="/follow"  @click="change('/follow')" :class="{isActive:focus}">
                                    关注
                                 </router-link>
                                 <router-link to="/recommend" @click="change('/recommend')" :class="{isActive:!focus}">
                                    推荐
                                 </router-link>
                        </div>
                        <div>
                            <router-view></router-view>
                        </div>
               </div>
               <div class="right-side">
                      
               </div>
        </main>
</template>

<script setup lang='ts'>
const focus=ref<boolean>(false)
const change=(text:string)=>{
     if(text==="/follow"){
         focus.value=true
     }
     if(text==='/recommend'){
      focus.value=false
     }
}

</script>

<style lang='less' scoped>
     .main-content{
      display:flex;
       background-color: #fff;
       .TopStory{
         width: 654px;
         flex-shrink:0;
         margin-right:10px;
         .topRouter{
            display:flex;
            width: 100%;
            height: 60px;
            border-bottom:1px solid rgb(240 242 247);
            a{
               display:flex;

               height: 60px;
               font-size:16px;
               margin:0 22px;
               line-height: 60px;
               &:hover{
                  color:rgb(67, 135, 112);
               }
            }
            .isActive{
               color:#1ba784;
               font-weight:500;
            }
         }
       }
       .right-side{
         flex:1;
       }
     }
</style>