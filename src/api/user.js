// 专门用来请求用户模块接口
import { postAxios, getAxios } from '@/lib/http'

export default {
    // 登录
    userList: data => getAxios('/user/getList', data),

}
