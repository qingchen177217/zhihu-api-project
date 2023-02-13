import { createWebHashHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/loading",
    name: "Loading",
    meta: {
      title: '知心-登录',
      transition: "animate__backInDown"
    },
    component: () => import('../view/login/index.vue'),
  },
  {
    path: "/",
    name: "home",
    redirect: "/recommend",
    meta: {
      title: '知心-守护你的心',
      transition: "animate__backInDown"
    },
    component: () => import('../view/home/index.vue'),
    children: [
      {
        path: "/recommend",
        name: "推荐",
        component: () => import('../view/home/children/Mainpage/recommend.vue')
      },
      {
        path: "/follow",
        name: "关注",
        component: () => import('../view/home/children/Mainpage/follow.vue')
      }
    ]
  },
  {
    path: "/question/:id",
    name: "问题路由",
    component: () => import('../view/question/index.vue')
  },
  {
    path:"/user/:id",
    name:"用户路由",
    component:()=>import('../view/user/index.vue')
  },
  {
    path: "/ago",
    name: "过去",
    meta: {
      title: "知心-欢迎您",
      transition: "animate__backInDown"
    },
    component: () => import('../view/ago/index.vue')
  },
  {
    path: "/care",
    name: "关心",
    meta: {
      transition: "animate__backInDown"
    },
    component: () => import('../view/care/index.vue')
  },
  {
    path: "/secret",
    name: "悄悄话",
    component: () => import('../view/secret/index.vue')
  },
  {
    path: "/userPage",
    name: "我的主页",
    component: () => import('../view/userpage/index.vue')
  },

  {
    path: "/setting",
    name: "设置",
    component: () => import('../view/setting/index.vue')
  }


]




const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router