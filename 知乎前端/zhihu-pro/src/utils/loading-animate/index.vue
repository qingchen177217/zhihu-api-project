<template>
    <div class="out">
        <div class="bar" ref="bar">
        </div>
    </div>
</template>

<script setup lang='ts'>

let bar = ref();
let time = ref();
let speed = ref(0);

const startRun =() => {
    let main = bar.value as HTMLElement
    
    time.value=window.requestAnimationFrame(function fn(){
         if(speed.value<80){
            speed.value+=1;
            main.style.width=speed.value +'%'
            window.requestAnimationFrame(fn)
         }else{
            speed.value=1;
            window.cancelAnimationFrame(time.value)
         } 
    })
}

const endRun = () => {
      let main=bar.value as HTMLElement
      setTimeout(()=>{
            window.requestAnimationFrame(()=>{
                   speed.value=100
                   main.style.width=speed.value+'%'
            })
      },1200)
}

defineExpose({startRun,endRun})
</script>

<style lang='less' scoped>
.out {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 1.5px;

    .bar {
        height: inherit;
        width: 0;
        background-color: rgb(0, 102, 255);
    }
}
</style>