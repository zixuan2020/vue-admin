// 专门用来请求用户模块接口
import { postAxios, getAxios } from '@/lib/http'

export default {
    // 分页查询用户列表
    userList: data => getAxios('/user/getList', data),


}
