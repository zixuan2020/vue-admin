import { postAxios, getAxios } from '@/lib/http'

export const loginApi = {
    // 登录
    login: data => postAxios('/user/login', data),
    // 根据token获取session
    getSession: () => getAxios('/session/get'),
    // 登出
    logout: (token) => getAxios(`/session/logOut?x-access-token=${token}`),
    // 获取验证码
    getVerificationCode: () => getAxios('/session/verificationCode'),
}
