import { createVNode,render } from "vue";
import loading from './index.vue'

const vnode=createVNode(loading)
//将loading挂载为vnode虚拟dom


// 然后进行挂载
render(vnode,document.body)

const startLoading=vnode.component?.exposed?.startRun
const endLoading=vnode.component?.exposed?.endRun

export {startLoading,endLoading}
























