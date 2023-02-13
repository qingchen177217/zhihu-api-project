<template>
  <div id="root">
    <div class="app-main">
      <main class="main">
        <div class="main-content">
          <div class="title">
            <h3>知心</h3>
            <p>抚慰你内心的伤痛</p>
          </div>
          <div class="sign-container">
            <div class="sign-container-left">
              <el-carousel trigger="click" height="600px" arrow="never" interval="5000">
                <el-carousel-item v-for="item in runImg" :key="item">
                  <img :src="item.imgSrc" alt="">
                </el-carousel-item>
              </el-carousel>
            </div>
            <div class="sign-container-right">
              <div class="content">
                <form action="">
                  <div class="header">
                    <div class="header-left" @click="isActive = isActive ? true : !isActive"
                      :class="{ signActive: isActive }">快来注册</div>
                    <div class="header-right" @click="isActive = !isActive ? isActive : false"
                      :class="{ signActive: !isActive }">账号登录</div>
                  </div>
                  <div class="form-data">
                    <div class="phoneNumber">
                      <label class="label-phoneNumber" v-if="emailState">
                        <input type="text" placeholder="邮箱或手机号" class="input-phoneNumber" v-model="form.email"
                          @blur="checkinputdata" autofocus>
                      </label>
                      <div v-else class="phoneNumber-alert" @click="returnPhoneInput">
                        {{ alertmessage }}
                      </div>
                    </div>
                    <div class="userName">
                      <label class="label-userName" v-if="userState">
                        <input type="text" placeholder="用户名" class="input-userName" v-model="form.name"
                          @blur="checkUserdata">
                      </label>
                      <div v-else class="userName-alert" @click="returnUserInput">
                        请输入用户名
                      </div>
                    </div>
                    <div class="password">
                      <div class="Input-wrapper">
                        <label class="label-password" v-if="passwordMessage">
                          <input :type="passwordState ? 'text' : 'password'" placeholder="密码" class="input-password"
                            v-model="form.password" @blur="checkPassworddata">
                        </label>
                        <div v-else class="password-alert" @click="returnPasswordInput">
                          请输入密码
                        </div>
                      </div>
                      <button class="password-icon" v-if="passwordState" @click="passwordState = !passwordState">
                        <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" class="ZDI ZDI--EyeAlt24 Button-zi"
                          fill="currentColor">
                          <path fill-rule="evenodd"
                            d="M12.001 20.717c5.343 0 8.282-3.087 9.674-5.294a5.88 5.88 0 0 0 .392-5.525C20.919 7.293 18.107 3.283 12 3.283c-6.103 0-8.916 4.005-10.066 6.61l1.372.606-1.372-.606a5.882 5.882 0 0 0 .392 5.534c1.395 2.207 4.334 5.29 9.674 5.29Zm-8.406-6.091a4.382 4.382 0 0 1-.288-4.127c1.025-2.322 3.425-5.716 8.694-5.716 5.272 0 7.67 3.398 8.693 5.72a4.38 4.38 0 0 1-.288 4.12c-1.224 1.94-3.75 4.594-8.405 4.594-4.653 0-7.18-2.65-8.406-4.591ZM9.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z"
                            clip-rule="evenodd"></path>
                        </svg>
                      </button>
                      <button class="password-icon" v-else @click="passwordState = !passwordState">
                        <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" class="ZDI ZDI--EyeSlash24 Button-zi"
                          fill="currentColor">
                          <path fill-rule="evenodd"
                            d="M7.517 4.474c1.206-.453 2.608-.724 4.234-.724 6.036 0 8.834 3.715 9.985 6.161a5.255 5.255 0 0 1-.393 5.219 11.207 11.207 0 0 1-3.027 3.036.75.75 0 1 1-.835-1.245c.058-.04.115-.078.171-.118a9.704 9.704 0 0 0 2.447-2.511 3.755 3.755 0 0 0 .28-3.742c-1.003-2.131-3.374-5.3-8.628-5.3-1.456 0-2.679.242-3.706.628a.75.75 0 1 1-.528-1.404ZM5.498 6.382a.75.75 0 0 1-.07 1.059c-1.126.987-1.854 2.148-2.306 3.105a3.756 3.756 0 0 0 .281 3.749c1.206 1.787 3.71 4.26 8.348 4.26 1.237 0 2.315-.175 3.253-.462a.75.75 0 1 1 .438 1.435c-1.084.33-2.31.527-3.69.527-5.28 0-8.198-2.855-9.592-4.921a5.256 5.256 0 0 1-.394-5.228c.513-1.09 1.353-2.435 2.674-3.593a.75.75 0 0 1 1.058.07Z"
                            clip-rule="evenodd"></path>
                          <path fill-rule="evenodd"
                            d="M20.048 20.012a.75.75 0 0 1-1.06.036l-15.5-14.5a.75.75 0 0 1 1.025-1.096l15.5 14.5a.75.75 0 0 1 .035 1.06Z"
                            clip-rule="evenodd"></path>
                          <path fill-rule="evenodd"
                            d="M9.559 11.535c-.203 1.067.554 2.164 1.808 2.374a2.36 2.36 0 0 0 1.707-.36.75.75 0 0 1 1.043.191.75.75 0 0 1-.215 1.04 3.893 3.893 0 0 1-2.816.602c-1.984-.331-3.381-2.13-3.007-4.094.06-.311.16-.607.297-.881a.768.768 0 0 1 1.01-.358.733.733 0 0 1 .338.995 1.908 1.908 0 0 0-.165.491Zm1.219-2.362a.769.769 0 0 1 .716-.797c.302-.02.61-.007.92.045 1.784.299 3.086 1.775 3.066 3.501a.77.77 0 0 1-.762.754.73.73 0 0 1-.744-.74c.011-.948-.72-1.854-1.842-2.041a2.427 2.427 0 0 0-.566-.028.732.732 0 0 1-.788-.694Z"
                            clip-rule="evenodd"></path>
                        </svg>
                      </button>
                    </div>
                    <div class="login-option">
                      <span class="ocean">海外手机号登录</span>
                      <span v-show=!isActive>
                        忘记密码
                      </span>
                    </div>
                    <button type="submit" class="submit-button" @click="submitData">{{ signState }}</button>
                  </div>
                </form>
              </div>
              <div class="other-sign">
                <div class="solid-left">
                </div>
                <p>其他方式登录</p>
                <div class="solid-right">
                </div>
              </div>
              <div class="other-sign-method">
                <span>
                  <button>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" class="ZDI ZDI--Wechat24">
                      <path fill="#07C160"
                        d="M20.314 18.59c1.333-.968 2.186-2.397 2.186-3.986 0-2.91-2.833-5.27-6.325-5.27-3.494 0-6.325 2.36-6.325 5.27 0 2.911 2.831 5.271 6.325 5.271.698.001 1.393-.096 2.064-.288l.186-.029c.122 0 .232.038.336.097l1.386.8.12.04a.21.21 0 0 0 .212-.211l-.034-.154-.285-1.063-.023-.135a.42.42 0 0 1 .177-.343ZM9.09 3.513C4.9 3.514 1.5 6.346 1.5 9.84c0 1.905 1.022 3.622 2.622 4.781a.505.505 0 0 1 .213.412l-.026.16-.343 1.276-.04.185c0 .14.113.254.252.254l.146-.047 1.663-.96a.793.793 0 0 1 .403-.116l.222.032c.806.231 1.64.348 2.478.348l.417-.01a4.888 4.888 0 0 1-.255-1.55c0-3.186 3.1-5.77 6.923-5.77l.411.011c-.57-3.02-3.71-5.332-7.494-5.332Zm4.976 10.248a.843.843 0 1 1 0-1.685.843.843 0 0 1 0 1.684v.001Zm4.217 0a.843.843 0 1 1 0-1.685.843.843 0 0 1 0 1.684v.001ZM6.561 8.827a1.012 1.012 0 1 1 0-2.023 1.012 1.012 0 0 1 0 2.023Zm5.061 0a1.012 1.012 0 1 1 0-2.023 1.012 1.012 0 0 1 0 2.023Z"
                        clip-rule="evenodd"></path>
                    </svg>
                  </button>
                  <button>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#50C8FD" class="ZDI ZDI--Qq24">
                      <path fill-rule="evenodd"
                        d="M12.003 2c-2.265 0-6.29 1.364-6.29 7.325v1.195S3.55 14.96 3.55 17.474c0 .665.17 1.025.281 1.025.114 0 .902-.483 1.748-2.072 0 0-.18 2.197 1.904 3.967 0 0-1.77.495-1.77 1.182 0 .686 4.078.43 6.29 0 2.239.425 6.288.687 6.288 0 0-.688-1.77-1.182-1.77-1.182 2.086-1.77 1.906-3.967 1.906-3.967.845 1.588 1.634 2.072 1.746 2.072.111 0 .283-.36.283-1.025 0-2.514-2.165-6.954-2.165-6.954V9.325C18.29 3.364 14.268 2 12.003 2Z"
                        clip-rule="evenodd"></path>
                    </svg>
                  </button>
                  <button>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" class="ZDI ZDI--Weibo24">
                      <path fill="#FB6622"
                        d="M15.518 3.06c8.834-.854 7.395 7.732 7.394 7.731-.625 1.44-1.673.31-1.673.31.596-7.52-5.692-6.33-5.692-6.33-.898-1.067-.03-1.71-.03-1.71Zm4.13 6.985c-.66 1.01-1.376.126-1.375.126.205-3.179-2.396-2.598-2.396-2.598-.72-.765-.091-1.346-.091-1.346 4.882-.55 3.863 3.818 3.863 3.818ZM5.318 7.52s4.615-3.86 6.443-1.328c0 0 .662 1.08-.111 2.797.003-.003 3.723-1.96 5.408.16 0 0 .848 1.094-.191 2.648 0 0 2.918-.099 2.918 2.715 0 2.811-4.104 6.44-9.315 6.44-5.214 0-8.026-2.092-8.596-3.102 0 0-3.475-4.495 3.444-10.33Zm10.448 7.792s.232-4.41-5.71-4.207c-6.652.231-6.58 4.654-6.58 4.654.022.39.098 3.713 5.843 3.713 5.98 0 6.447-4.16 6.447-4.16Zm-9.882.86s-.06-3.632 3.804-3.56c3.412.06 3.206 3.164 3.206 3.164s-.026 2.98-3.684 2.98c-3.288 0-3.326-2.584-3.326-2.584Zm2.528 1.037c.672 0 1.212-.447 1.212-.998 0-.55-.543-.998-1.212-.998-.672 0-1.215.447-1.215.998 0 .551.546.998 1.215.998Z"
                        clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </span>
              </div>
              <div class="message">
                未注册手机验证后自动登录，注册即代表同意《知乎协议》《隐私保护指引》
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { signUser } from '../../api/user'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import store from '../../store/index'
import { throttle } from '../../utils/other/index'



let isActive = ref(false)//判断那个组件是活跃的，进行添加对应属性
//判断当isActive为true时，再次点击不会更改

const runImg = [
  {
    imgSrc: "http://localhost:80/upload/9.jpg"
  },
  {
    imgSrc: "http://localhost:80/upload/6.jpg"
  },
  {
    imgSrc: "http://localhost:80/upload/7.jpg"
  },
  {
    imgSrc: "http://localhost:80/upload/8.jpg"
  }
]
const signState = computed(() => {//判断返回注册还是登录状态
  return isActive.value ? '注册' : '登录'
})


const form = reactive({
  email: "",
  name: "",
  password: ""
})
//email数据
let emailState = ref(true)//绑定email状态
const alertmessage = ref()//指定返回的错误信息

const returnPhoneInput = () => {
  //当错误提示结束后，转换状态显示input输入框
  emailState.value = !emailState.value
}
const checkinputdata = () => {
  if (form.email === "") {//匹配是否是邮箱
    emailState.value = !emailState.value
    return alertmessage.value = '请输入手机号或邮箱'
  } else {
    if (new RegExp(/\s+/g).test(form.email)) {//匹配是否符合邮箱格式
      return form.email = form.email.replace(/\s+/g, "")
    }
    if (new RegExp(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(?:\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/).test(form.email)) {
      return form.email
    } else {
      form.email = ""
      //将数据清空重新输入
      emailState.value = !emailState.value
      return alertmessage.value = '请输入正确的邮箱格式'
      //更改提示信息的数据 输入手机号和邮箱更新为请输入正确的邮箱
    }
  }
}
//email结束

//userName数据
// const username = ref()//双向绑定username
let userState = ref(true)//绑定user状态

const returnUserInput = () => {
  //当错误提示结束后，转换状态显示input输入框
  userState.value = !userState.value
}
const checkUserdata = () => {
  if (form.name === "") {//匹配是否是邮箱
    userState.value = !userState.value
  } else {
    if (new RegExp(/\s+/g).test(form.name)) {//匹配是否符合邮箱格式
      return form.name = form.name.replace(/\s+/g, "")
    }
  }
}
//userName结束

//password数据
let passwordState = ref(false)//判断密码的状态，是否进行显示
let passwordMessage = ref(true)//判断信息是否输入
// const password = ref()//双向绑定password

const returnPasswordInput = () => {
  passwordMessage.value = !passwordMessage.value
}
const checkPassworddata = () => {
  if (form.password === "") {//匹配是否是邮箱
    passwordMessage.value = !passwordMessage.value
  } else {
    if (new RegExp(/\s+/g).test(form.password)) {//匹配是否符合邮箱格式
      return form.password = form.password.replace(/\s+/g, "")
    }
  }
}
//password结束



// 注册/登录请求发送

const putData = async () => {
  const userstore = store()
  if (isActive.value === false) {
    await userstore.login(form)
  } else {
    try {
      await signUser(form).then((res: any) => {
        ElMessage({
          message: '注册成功,请进行账号登录',
          type: 'success',
        })
        isActive.value = !isActive.value
      })
    } catch (err: any) {
      ElMessage.error(err.response.data.msg);
    }
  }
}

const submitData = throttle(putData, 1500)





</script>

<style lang='less' scoped>
#root {
  .app-main {
    height: 100vh;
    width: 100vw;
    background-image: url('http://localhost:80/upload/3.png');
    background-size: 100% 140%;
    background-position: 0 0px;
    background-color: rgb(184 229 248);


    .main {
      display: flex;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      flex-direction: column;

      &::before {
        content: '';
        display: block;
        height: 42px;
        width: inherit;
      }

      .main-content {
        display: flex;
        flex-direction: column;
        // flex:1;
        align-items: center;
        justify-content: center;
        height: calc(100% - 84px);

        .title {
          width: 128px;
          height: 81px;
          margin-bottom: 24px;
          text-align: center;

          h3 {
            color: #1ba784;
            margin: 0;
            font-family: '华文隶书';
            font-size: 57px;
          }

          p {
            font-size: 16px;
            font-weight: 700;
            margin: 0;
          }

        }

        .sign-container {
          flex: 1;
          display: flex;
          background-color: #fff;

          .sign-container-left {
            width: 372px;
            height: 100%;
            box-sizing: border-box;

            // background-image: url('http://127.0.0.1:80/upload/4.jpg');
            // background-size: cover;
            img {
              width: 100%;
              height: 100%;
            }
          }

          .sign-container-right {
            box-sizing: border-box;
            width: 440px;
            height: 100%;

            .content {
              margin: 0 auto;
              text-align: center;

              form {
                padding: 0 24px 30px 24px;

                .header {
                  display: flex;
                  width: 100%;
                  height: 49px;
                  margin-top: 28px;

                  .header-left {
                    position: relative;
                    cursor: pointer;
                    line-height: 49px;
                    font-size: 18px;
                  }

                  .header-right {
                    position: relative;
                    cursor: pointer;

                    margin-left: 20px;
                    line-height: 49px;
                    font-size: 18px;
                  }

                  .signActive {
                    font-weight: 600;

                    &::after {
                      display: block;
                      position: absolute;
                      bottom: 0;
                      content: "";
                      width: 100%;
                      height: 3px;
                      // background-color: rgb(17 117 235);
                      background-color: #1ba784;
                    }
                  }
                }

                .form-data {
                  box-sizing: border-box;
                  height: 270px;
                  width: 100%;

                  input::placeholder {
                    color: black;
                  }

                  .phoneNumber {
                    margin-top: 30px;
                    border-bottom: 1px solid #ccc;
                    overflow: hidden;

                    .label-phoneNumber {
                      width: 100%;
                      height: 44px;
                      overflow: hidden;

                      .input-phoneNumber {
                        padding: 0;
                        width: 100%;
                        height: 48px;
                        outline: none;
                        border: 0;
                        font-size: 16px;
                        color: rgb(68 68 68);
                      }
                    }

                    .phoneNumber-alert {
                      height: 48px;
                      width: 100%;
                      box-sizing: border-box;
                      padding-top: 12px;
                      font-size: 16px;
                      color: #f1403c;
                      text-align: left;
                    }
                  }

                  .userName {
                    margin-top: 15px;
                    border-bottom: 1px solid #ccc;

                    .label-userName {
                      width: 100%;
                      height: 44px;
                      overflow: hidden;

                      .input-userName {
                        padding: 0;
                        width: 100%;
                        height: 48px;
                        outline: none;
                        border: 0;
                        font-size: 16px;
                        color: rgb(68 68 68);
                      }
                    }

                    .userName-alert {
                      height: 48px;
                      width: 100%;
                      box-sizing: border-box;
                      padding-top: 12px;
                      font-size: 16px;
                      color: #f1403c;
                      text-align: left;
                    }
                  }

                  .password {
                    margin-top: 15px;
                    border-bottom: 1px solid #ccc;
                    display: flex;

                    .Input-wrapper {
                      width: 100%;
                      display: flex;
                      justify-content: space-between;

                      .label-password {
                        width: 100%;
                        height: 44px;
                        overflow: hidden;

                        .input-password {
                          padding: 0;
                          width: 100%;
                          height: 46px;
                          outline: none;
                          border: 0;
                          font-size: 16px;
                          color: rgb(68 68 68);
                        }
                      }
                    }

                    .password-alert {
                      height: 48px;
                      width: 100%;
                      box-sizing: border-box;
                      padding-top: 12px;
                      font-size: 16px;
                      color: #f1403c;
                      text-align: left;
                    }

                    .password-icon {
                      border: 0;
                      background-color: #fff;
                    }
                  }

                  .login-option {
                    margin-top: 15px;
                    height: 20px;
                    font-size: 16px;
                    display: flex;
                    justify-content: space-between;
                    text-align: right;

                    .ocean {
                      color: #0066ff;
                      cursor: pointer;
                    }
                  }

                  .submit-button {
                    width: 100%;
                    margin-top: 20px;
                    height: 40px;
                    border: 0;
                    background-color: #1ba784;
                    // background-color: #0066ff;
                    border-radius: 5px;
                    color: #fff;
                    font-size: 16px;
                  }


                }
              }
            }

            .other-sign {
              margin: 0 24px 10px 24px;
              height: 17px;
              display: flex;
              align-items: center;

              .solid-left {
                width: 144px;
                border-top: 1px solid rgb(235 235 235);
              }

              p {
                flex: 1;
                font-size: 12px;
                color: rgb(153 153 153);
                margin-left: 16px;
                margin-right: 16px;
                line-height: 17px;
              }

              .solid-right {
                width: 144px;
                border-top: 1px solid rgb(235 235 235);
              }
            }

            .other-sign-method {
              width: 440px;
              height: 60px;
              display: flex;
              align-items: center;

              span {
                width: 250px;
                height: 36px;
                display: flex;
                justify-content: space-between;
                margin: auto;

                button {
                  border-radius: 50%;
                  border: 0;
                  padding-top: 5px;
                }
              }
            }

            .message {
              box-sizing: border-box;
              height: 80px;
              width: 440px;
              padding: 18px 24px 30px 24px;
              font-size: 14px;
              color: rgb(153 153 153);
            }
          }
        }
      }
    }
  }
}

:deep(.el-message-box__status) {
  position: absolute !important;
}
</style>