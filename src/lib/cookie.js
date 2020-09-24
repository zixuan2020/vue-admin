import Cookies from 'js-cookie'
import config from '@/config'

const { cookieExpires } = config
export const TOKEN_KEY = 'token'

export default {
    setToken: token => {
        const expiration = new Date()
        expiration.setTime(expiration.getTime() + cookieExpires * 60 * 1000)

        console.log('设置Cookie过期时间: ' + expiration)

        Cookies.set(TOKEN_KEY, token, {
            // token在Cookie中存储的天数，默认1天
            expires: expiration,

        })
    },
    getToken: () => {
        const token = Cookies.get(TOKEN_KEY)
        if (token) return token
        return null
    },
    clearToken: () => {
        Cookies.remove(TOKEN_KEY)
    },
}
