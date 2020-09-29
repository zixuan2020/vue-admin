import Axios from 'axios'
import { Message, Spin } from 'view-design'
import config from '@/config'

import cookie from '@/lib/cookie'
// 之所以封装这个axios，是因为在一些请求中，无法上传信息，很尴尬，估计原因是继承的有问题，无法携带headers
export const baseUrl = config.baseUrl.apiUrl
export const socketBaseUrl = config.baseUrl.webSocketUrl

let axios = Axios.create({
    baseURL: baseUrl,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        // 'Content-Type': 'application/x-www-form-urlencoded',
    },
})

axios.interceptors.request.use(
    (config) => {
        // 在每次发送请求都携带token
        if (cookie.getToken()) {
            config.headers['small-admin-token'] = cookie.getToken()
        }
        return config
    },
    (error) => {
        // 对请求错误做些什么
        Spin.hide()
        return Promise.reject(error)
    },
)
// 添加响应拦截器
axios.interceptors.response.use(
    res => {
        if (res.config.responseType === 'blob') {
            let isReturnJson = res.headers && res.headers['content-type'] && res.headers['content-type'].indexOf('json') > -1
            // 后端返回错误信息
            if (isReturnJson) {
                let reader = new FileReader()
                reader.onload = function (event) {
                    let content = reader.result
                    let parseRes = JSON.parse(content) // 错误信息
                    return validateResponseCode({
                        data: parseRes,
                    })
                }
                reader.readAsText(res.data)
                return true
            }
            // 下载文件
            download(res)
        } else {
            // 正常json请求
            return validateResponseCode(res)
        }
    },
    error => {
        Spin.hide()
        Message.error('服务内部错误')
        console.log('1111', error)
        // 对响应错误做点什么
        return Promise.reject(error)
    },
)

function validateResponseCode(res) {
    let { data } = res
    if (data && data.code == 401) {
        // 提示当前身份验证失败默认跳转回登录页面
        cookie.clearToken()
        localStorage.clear()

        Message.error('当前身份验证失败,请输入账号密码进行正确的验证')
        // 回到登录页面
        this.$router.push({ path: '/login' })
        return
    }
    /* if (data && data.code && data.code !== 1) {
        if (data.code === 1001) {
            cookie.clearToken()
            localStorage.clear()
            window.location.href = window.location.pathname + '#/login'
            Message.error('未登录，或登录失效，请登录')
            return
        }
        if (data.code === 502) {
            window.location.href = window.location.pathname + '#/500'
            return
        }
        Spin.hide()
        Message.error(data.msg)
        return Promise.reject(res)
    } */
    return Promise.resolve(data)
}

function blobToText(blob) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.readAsText(blob)
        fileReader.onload = function () {
            try {
                const result = JSON.parse(this.result)
                if (result && result.resultCode === 'fail') {
                    resolve(result)
                } else {
                    reject()
                }
            } catch (e) {
                // TODO handle the exception
                reject()
            }
        }
    })
}

export const postAxios = (url, data) => axios.post(url, data)

export const postFileUploadAxios = (url, data) => axios.post(url, data, { headers: { 'Content-Type': 'multipart/form-data' } })

export const getDownloadAxios = (url) => axios.get(url, { responseType: 'blob' })

export const postDownloadAxios = (url, data) => axios.post(url, data, { responseType: 'blob' })

export const getAxios = (url, data) => axios.get(url, {
    params: data,
})

function download(res) {
    let reader = new FileReader()
    let data = res.data
    reader.onload = e => {
        if (e.target.result.indexOf('Result') != -1 && JSON.parse(e.target.result).Result == false) {
            // 进行错误处理
        } else {
            let fileName = 'download'
            let contentDisposition = res.headers['Content-Disposition']
            contentDisposition = contentDisposition || res.headers['content-disposition']
            if (contentDisposition) {
                fileName = window.decodeURI(contentDisposition.split('=')[1], 'UTF-8')
            }
            executeDownload(data, fileName)
        }
    }
    reader.readAsText(data)
}

//  模拟点击a 标签进行下载
function executeDownload(data, fileName) {
    if (!data) {
        return
    }
    let url = window.URL.createObjectURL(new Blob([data]))
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
