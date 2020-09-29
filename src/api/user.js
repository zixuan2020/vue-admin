// 专门用来请求用户模块接口
import { postAxios, getAxios } from '@/lib/http'

export default {
    // 分页查询用户列表
    userList: data => getAxios('/user/getList', data),

    // 更新用户数据
    saveUser: data => postAxios('/user/saveUser', data),

    // 删除用户数据
    delUser: data => postAxios('/user/delUser', data),
}
