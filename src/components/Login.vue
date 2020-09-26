<template>
    <div class="login-vue" :style="bg">
        <div class="container">
            <p class="title">后台管理系统</p>
            <div class="input-c">
                <Input prefix="ios-contact" v-model="account" placeholder="用户名" clearable @on-blur="verifyAccount"/>
                <p class="error">{{accountError}}</p>
                <p></p>
            </div>
            <div class="input-c">
                <Input type="password" v-model="pwd" prefix="md-lock" placeholder="密码" clearable @on-blur="verifyPwd"
                       @keyup.enter.native="submit"/>
                <p class="error">{{pwdError}}</p>

            </div>
            <Button :loading="isShowLoading" class="submit" type="primary" @click="submit">登陆</Button>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import { localSave, localRead } from '@/lib/local'

export default {
    name: 'login',
    data() {
        return {
            account: '',
            pwd: '',
            accountError: '',
            pwdError: '',
            isShowLoading: false,
            bg: {},
        }
    },
    created() {
        this.bg.backgroundImage = 'url(' + require('../assets/imgs/bg0' + new Date().getDay() + '.jpg') + ')'
    },
    watch: {
        $route: {
            handler(route) {
                this.redirect = route.query && route.query.redirect
            },
            immediate: true,
        },
    },
    methods: {
        ...mapActions(['handleLogin']),

        verifyAccount() {
            if (this.account.match(/^[a-zA-Z0-9_-]{4,16}$/)) {
                this.accountError = ''
            } else {
                this.accountError = '用户名格式4到16位'
            }
        },
        verifyPwd() {
            // this.pwd.match(/^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/)
            if (this.pwd != '') {
                this.pwdError = ''
            } else {
                this.pwdError = '最少6位,至少1个大写字母,1个小写字母,1个数字,1个特殊字符'
            }
        },
        register() {

        },
        forgetPwd() {

        },
        submit() {
            if (this.accountError == '' && this.pwdError == '') {
                this.isShowLoading = true
                // 发送axios请求检查用户登录是否成功

                this.handleLogin({
                    username: this.account,
                    password: this.pwd,
                })
                .then((resp) => {
                    this.isShowLoading = false
                    // 当前需要回到的页面
                    console.log('当前需要回到的页面: ' + this.redirect)
                    this.$router.push({ path: this.redirect || '/home' })
                })
                .catch((err) => {
                    this.isShowLoading = false
                })
            }
        },
    },
}
</script>

<style>
    .login-vue {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
    }

    .login-vue .container {
        background: rgba(255, 255, 255, .5);
        width: 300px;
        text-align: center;
        border-radius: 10px;
        padding: 30px;
    }

    .login-vue .ivu-input {
        background-color: transparent;
        color: #fff;
        outline: #fff;
        border-color: #fff;
    }

    .login-vue ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
        color: rgba(255, 255, 255, .8);
    }

    .login-vue :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: rgba(255, 255, 255, .8);
    }

    .login-vue ::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: rgba(255, 255, 255, .8);
    }

    .login-vue :-ms-input-placeholder { /* Internet Explorer 10-11 */
        color: rgba(255, 255, 255, .8);
    }

    .login-vue .title {
        font-size: 16px;
        margin-bottom: 20px;
    }

    .login-vue .input-c {
        margin: auto;
        width: 200px;
    }

    .login-vue .error {
        color: red;
        text-align: left;
        margin: 5px auto;
        font-size: 12px;
        padding-left: 30px;
        height: 30px;
    }


    .login-vue .submit {
        width: 200px;
    }

    .login-vue .account {
        margin-top: 30px;
    }

    .login-vue .account span {
        cursor: pointer;
    }

    .login-vue .ivu-icon {
        color: #eee;
    }

    .login-vue .ivu-icon-ios-close-circle {
        color: #777;
    }
</style>
