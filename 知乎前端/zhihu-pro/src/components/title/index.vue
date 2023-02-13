<template>
    <div class="header-title">
        <div class="header-content">
            <div>
                <router-link to="/" class="header-content-title">
                    知心
                </router-link>
            </div>
            <div class="main-content">
                <router-link to="/ago" class="ago">
                    过去
                </router-link>
                <router-link to="/" class="content">
                    首页
                </router-link>
                <router-link to="/care" class="hotmessage">
                    关心
                </router-link>
                <router-link to="/secret" class="secret">
                    悄悄话
                </router-link>
            </div>
            <div class="search">
                <div class="search-content">
                    <label class="search-label">
                        <input type="text" placeholder="搜索你感兴趣的内容" class="search-input" v-model="search">
                        <button class="search-button">
                            <svg t="1667057437594" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="3197" width="18" height="18">
                                <path
                                    d="M966.4 924.8l-230.4-227.2c60.8-67.2 96-156.8 96-256 0-217.6-176-390.4-390.4-390.4-217.6 0-390.4 176-390.4 390.4 0 217.6 176 390.4 390.4 390.4 99.2 0 188.8-35.2 256-96l230.4 227.2c9.6 9.6 28.8 9.6 38.4 0C979.2 950.4 979.2 934.4 966.4 924.8zM102.4 441.6c0-185.6 150.4-339.2 339.2-339.2s339.2 150.4 339.2 339.2c0 89.6-35.2 172.8-92.8 233.6-3.2 0-3.2 3.2-6.4 3.2-3.2 3.2-3.2 3.2-3.2 6.4-60.8 57.6-144 92.8-233.6 92.8C256 780.8 102.4 627.2 102.4 441.6z"
                                    p-id="3198" fill="#1ba784"></path>
                            </svg>
                        </button>
                    </label>
                </div>
                <button class="heart-words">
                    心语
                </button>
            </div>
            <div class="userinfo">
                <div class="message">
                    <button class="message-button">
                        <div class="top-icon">
                            <svg t="1667120621323" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="3767" width="18" height="18">
                                <path
                                    d="M594.917 144.399c0-43.804-37.123-79.478-82.916-79.478-45.7 0-82.918 35.585-82.918 79.478 0 4.473 0.386 8.86 1.13 13.133-114.498 38.254-208.43 155.73-208.43 294.718v109.423s0 157.59-40.389 158.964c-24.082 0-42.528 17.792-42.528 39.74 0 22.1 18.557 39.738 41.452 39.738h663.366c23.005 0 41.451-17.791 41.451-39.737 0-22.104-18.557-39.741-41.45-39.741-41.466 0-41.466-157.854-41.466-157.854v-110.52c0-139.166-87.828-256.69-208.409-294.828a76.963 76.963 0 0 0 1.107-13.036z m41.46 695.39c-0.123 65.905-55.285 119.29-124.377 119.29-68.617 0-124.255-53.164-124.379-119.29h248.757z"
                                    fill="#ffffff" p-id="3768"></path>
                            </svg>
                        </div>
                        <p>消息</p>
                    </button>
                </div>
                <div class="talk">
                    <button class="talk-button">
                        <div class="top-icon">
                            <svg t="1667121389641" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="2321" width="18" height="18">
                                <path
                                    d="M809.890909 884.363636H214.109091c-93.090909 0-167.563636-74.472727-167.563636-165.236363V311.854545C46.545455 216.436364 121.018182 139.636364 214.109091 139.636364h595.781818c93.090909 0 167.563636 76.8 167.563636 172.218181v407.272728c0 90.763636-74.472727 165.236364-167.563636 165.236363m-27.927273-528.290909c-6.981818-13.963636-20.945455-20.945455-34.909091-20.945454-6.981818 0-13.963636 2.327273-20.945454 4.654545l-221.090909 134.981818-200.145455-134.981818c-6.981818-4.654545-16.290909-4.654545-23.272727-4.654545-16.290909 0-32.581818 6.981818-39.563636 20.945454-13.963636 18.618182-4.654545 44.218182 16.290909 55.854546l218.763636 141.963636c6.981818 4.654545 13.963636 4.654545 20.945455 4.654546h13.963636c6.981818 0 13.963636-2.327273 20.945455-4.654546l232.727272-141.963636c20.945455-11.636364 27.927273-34.909091 16.290909-55.854546"
                                    p-id="2322" fill="#ffffff"></path>
                            </svg>
                        </div>
                        <p>聊天</p>
                    </button>
                </div>
                <div class="article">
                    <button class="edit-center">
                        <div class="top-icon">
                            <svg t="1667121440605" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="2879" width="18" height="18">
                                <path
                                    d="M896 874.218667c17.674667 0 32 14.432 32 32.224A32.106667 32.106667 0 0 1 896 938.666667H128a32.106667 32.106667 0 0 1-32-32.213334 32.106667 32.106667 0 0 1 32-32.234666zM597.898667 238.325333l0.106666 0.106667 150.944 152a21.333333 21.333333 0 0 1 0 30.069333l-324.8 327.061334a159.690667 159.690667 0 0 1-78.048 43.264l-152.085333 34.432c-23.808 5.386667-44.608-16.981333-37.706667-40.554667l43.296-147.84a161.344 161.344 0 0 1 40.32-68.373333l327.797334-330.058667a21.333333 21.333333 0 0 1 30.176-0.106667zM840.746667 130.602667l15.082666 15.189333c45.824 46.144 45.824 120.949333 0 167.082667l-31.552 31.786666a21.333333 21.333333 0 0 1-30.176 0.106667l-0.106666-0.106667-150.944-152a21.333333 21.333333 0 0 1 0-30.08l31.754666-31.978666a116.768 116.768 0 0 1 165.941334 0z"
                                    p-id="2880" fill="#ffffff"></path>
                            </svg>
                        </div>
                        <p>创作中心</p>
                    </button>
                </div>
                <div class="user">
                    <button class="user-button" @click="changeUser">
                        <img src="http://localhost:80/upload/head.jpg" alt="">
                    </button>
                    <ul v-show="isShow" class="user-list">
                        <li>
                            <button @click="homepage" class="user-list-home">
                                <div class="homepage-icon">
                                    <svg t="1667179473526" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                        xmlns="http://www.w3.org/2000/svg" p-id="2583" width="18" height="18">
                                        <path
                                            d="M500 128.8c-95.2 5.6-173.6 83.2-180 178.4-7.2 112 80.8 205.6 191.2 205.6 106.4 0 192-86.4 192-192 0.8-110.4-92-198.4-203.2-192zM512 575.2c-128 0-383.2 64-383.2 192v96c0 17.6 14.4 32 32 32h702.4c17.6 0 32-14.4 32-32V766.4c0-127.2-255.2-191.2-383.2-191.2z"
                                            p-id="2584" fill="#1ba784"></path>
                                    </svg>
                                </div>
                                <p>我的主页</p>
                            </button>
                        </li>
                        <li>
                            <button @click="settingpage" class="user-list-setting">
                                <div class="homepage-icon">
                                    <svg t="1667187218888" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                        xmlns="http://www.w3.org/2000/svg" p-id="2560" width="18" height="18">
                                        <path
                                            d="M940 596l-76-57.6c0.8-8 1.6-16.8 1.6-26.4s-0.8-18.4-1.6-26.4l76-57.6c20.8-16 26.4-44 12.8-68l-84.8-143.2c-9.6-16.8-28-27.2-47.2-27.2-6.4 0-12 0.8-18.4 3.2L712 228c-15.2-10.4-31.2-19.2-47.2-26.4l-13.6-92c-4-26.4-26.4-45.6-53.6-45.6H426.4c-27.2 0-49.6 19.2-53.6 44.8L360 201.6c-16 7.2-31.2 16-47.2 26.4l-90.4-35.2c-6.4-2.4-12.8-3.2-19.2-3.2-19.2 0-37.6 9.6-46.4 26.4L71.2 360c-13.6 22.4-8 52 12.8 68l76 57.6c-0.8 9.6-1.6 18.4-1.6 26.4s0 16.8 1.6 26.4l-76 57.6c-20.8 16-26.4 44-12.8 68l84.8 143.2c9.6 16.8 28 27.2 47.2 27.2 6.4 0 12-0.8 18.4-3.2L312 796c15.2 10.4 31.2 19.2 47.2 26.4l13.6 92c3.2 25.6 26.4 45.6 53.6 45.6h171.2c27.2 0 49.6-19.2 53.6-44.8l13.6-92.8c16-7.2 31.2-16 47.2-26.4l90.4 35.2c6.4 2.4 12.8 3.2 19.2 3.2 19.2 0 37.6-9.6 46.4-26.4l85.6-144.8c12.8-23.2 7.2-51.2-13.6-67.2zM704 512c0 105.6-86.4 192-192 192S320 617.6 320 512s86.4-192 192-192 192 86.4 192 192z"
                                            p-id="2561" fill="#1ba784"></path>
                                    </svg>
                                </div>
                                <p>设置</p>
                            </button>
                        </li>
                        <li>
                            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" :icon="InfoFilled"
                                icon-color="#626AEF" title="确定要退出吗？" @confirm="confirmEvent">
                                <template #reference>
                                    <el-button class="user-list-out">
                                        <div class="homeout-icon">
                                            <svg t="1667211141743" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                                xmlns="http://www.w3.org/2000/svg" p-id="2558" width="18" height="18">
                                                <path
                                                    d="M689.664 172.992l0 133.781333c89.28 58.176 148.394667 158.698667 148.394667 273.216 0 180.032-145.984 325.994667-326.058667 325.994667-180.032 0-326.016-145.962667-326.016-325.994667 0-101.781333 46.634667-192.618667 119.722667-252.437333L305.706667 186.773333C164.373333 261.098667 67.968 409.216 67.968 579.946667 67.968 825.173333 266.794667 1024 512.042667 1024c245.205333 0 443.989333-198.826667 443.989333-444.053333C956.010667 397.888 846.464 241.536 689.664 172.992z"
                                                    p-id="2559" fill="#1ba784"></path>
                                                <path
                                                    d="M577.344 459.989333c0 28.693333-29.248 51.989333-65.344 51.989333l0 0c-36.053333 0-65.322667-23.274667-65.322667-51.989333L446.677333 51.989333C446.677333 23.274667 475.946667 0 512 0l0 0c36.096 0 65.344 23.274667 65.344 51.989333L577.344 459.989333z"
                                                    p-id="2560" fill="#1ba784"></path>
                                            </svg>
                                        </div>
                                        <p>退出</p>
                                    </el-button>
                                </template>
                            </el-popconfirm>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { InfoFilled } from '@element-plus/icons-vue'
import store from '../../store'
import router from '../../router'
const search = ref<string>()
const isShow = ref(false);

const changeUser = () => {
    isShow.value = !isShow.value
}

const homepage = () => {
    router.replace('/userPage')
}
const settingpage = () => {
    router.replace('/setting')
}
const confirmEvent = () => {
    const userStore = store()
    userStore.logout()
}
const header = ref<HTMLElement>()




</script>

<style lang='less' scoped>
.header-title {
    .header-content {
        height: 52px;
        margin: auto;
        max-width: 1180px;
        min-width: 1000px;
        display: flex;
        align-items: center;
        .header-content-title {
            width: 64px;
            height: 52px;
            color: #fff;
            margin: 0;
            font-family: '华文隶书';
            font-size: 30px;
        }
        .main-content {
            width: 330px;
            height: inherit;
            display: flex;
            justify-content: space-around;
            align-items: center;
            font-size: 16px;

            .ago {
                color: #fff;
            }

            .content {
                color: #fff;
            }

            .hotmessage {
                color: #fff;
            }

            .secret {
                color: #fff;
            }

        }

        .search {
            display: flex;
            width: 500px;
            height: 100%;
            align-items: center;

            .search-content {
                box-sizing: border-box;
                width: 400px;
                height: 35px;

                .search-label {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 19.6471rem;
                    height: 35px;
                    border-radius: 2.3529rem;
                    padding-left: .9412rem;
                    background-color: rgb(255 255 255 / 20%) !important;

                    .search-input {
                        padding: 0;
                        width: 17.8824rem;
                        height: 20px;
                        outline: none;
                        border: 0;
                        background: none;
                        color: #fff;
                        font-size: 14px;
                        font-weight: 400;

                        &::input-placeholder {
                            color: #fff;
                        }
                    }

                    .search-button {
                        margin-right: .2941rem;
                        cursor: pointer;
                        height: 1.1765rem;
                        width: 1.4706rem;
                        background: none;
                        border: 0;

                    }
                }
            }

            .heart-words {
                width: 70px;
                height: 35px;
                margin-left: 1.1765rem;
                border-radius: 2.3529rem;
                border: 0;
                padding: 0;
                font-size: 14px;
                font-weight: 400;
                color: #1ba784;
            }
        }

        .userinfo {
            display: flex;
            justify-content: space-around;
            width:260px;
            align-items: center;
            margin-left:20px;
            height: 2.3529rem;
            color: #fff;

            .message {
                width: 2.8235rem;
                height: inherit;
                display: flex;
                justify-content: center;

                .message-button {
                    padding: 0;
                    border: 0;
                    width: 1.4706rem;
                    height: 2.3529rem;
                    background: none;

                    .top-icon {
                        width: 1.0588rem;
                        height: 1.0588rem;
                    }

                    p {
                        width: 1.4706rem;
                        height: 1.0588rem;
                        font-size: .7059rem;
                        line-height: 1.1765rem;
                        color: #fff;
                        text-align: left;
                    }
                }
            }

            .talk {
                width: 2.8235rem;
                height: inherit;
                display: flex;
                justify-content: center;

                .talk-button {
                    padding: 0;
                    border: 0;
                    width: 1.4706rem;
                    height: 2.3529rem;
                    background: none;

                    .top-icon {
                        width: 1.0588rem;
                        height: 1.0588rem;
                    }

                    p {
                        width: 1.4706rem;
                        height: 1.0588rem;
                        font-size: .7059rem;
                        line-height: 1.1765rem;
                        color: #fff;
                        text-align: left;
                    }
                }

            }

            .article {
                width: 4.2353rem;
                height: inherit;
                box-sizing: border-box;

                .edit-center {
                    margin-top: 2px;
                    padding: 0;
                    border: 0;
                    width: 3.2353rem;
                    height: 40px;
                    background: none;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    p {
                        width: 3.2353rem;
                        height: .8824rem;
                        font-size: .7059rem;
                        line-height: 1.0588rem;
                        color: #fff;
                    }
                }
            }

            .user {
                width: 40px;
                height: 40px;
                position: relative;

                .user-button {
                    padding: 0;
                    border: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }

                .user-list {
                    position: absolute;
                    top: 60px;
                    left: -45px;
                    width: 5.8824rem;
                    height: 140px;
                    background-color: #1ba784;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    border-radius: 5px;
                    padding: 10px;

                    &::before {
                        content: '';
                        display: block;
                        position: absolute;
                        top: -5px;
                        left: 55px;
                        transform: rotate(45deg);
                        width: 20px;
                        height: 20px;
                        background-color: rgb(27, 167, 132);
                    }

                    li {
                        z-index: 999;

                        .user-list-home {
                            width: 100px;
                            border: 0;
                            padding: 0;
                            background: none;
                            display: flex;
                            justify-content: center;
                            padding: 7px 0;
                            background-color: #fff;
                            border-radius: 5px;

                            .homepage-icon {
                                height: 25px;
                                display: flex;
                                align-items: center;
                            }

                            p {
                                line-height: 25px;
                                margin-left: 5px;
                                color: #1ba784;
                                font-size: 14px;
                            }
                        }

                        .user-list-setting {
                            box-sizing: content-box;
                            margin-top: 5px;
                            width: 100px;
                            height: 25px;
                            border: 0;
                            padding: 7px 0;
                            background: none;
                            display: flex;
                            justify-content: center;
                            background-color: #fff;
                            border-radius: 5px;

                            .homepage-icon {
                                display: flex;
                                align-items: center;
                                height: 25px;
                            }

                            p {
                                width: 56px;
                                text-align: center;
                                margin-left: 5px;
                                color: #1ba784;
                                font-size: 14px;
                                line-height: 25px;
                            }
                        }

                        .user-list-out {
                            margin-top: 5px;
                            width: 100px;
                            height: 25px;
                            border: 0;
                            padding: 0;
                            background: #fff;
                            padding: 7px 0px;
                            display: flex;
                            justify-content: center;
                            box-sizing: content-box;

                            .homeout-icon {
                                width: 18px;
                                height: 25px;
                                display: flex;
                                align-items: center;
                            }

                            p {
                                width: 56px;
                                text-align: center;
                                margin-left: 5px;
                                color: #1ba784;
                                font-size: 14px;
                            }
                        }

                    }

                }
            }
        }
    }
}


:deep(.el-button) {
    background-color: #1ba784;
    color: #fff;
}
</style>