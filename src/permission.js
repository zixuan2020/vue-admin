import { LoadingBar } from 'view-design'
import router from './router'
import store from './store'
import cookie from '@/lib/cookie.js'
import createRoutes from '@/utils/createRoutes'
import { getDocumentTitle, resetTokenAndClearUser } from './utils'

// 是否有菜单数据
let hasMenus = false
router.beforeEach(async (to, from, next) => {
    document.title = getDocumentTitle(to.meta.title)
    LoadingBar.start()

    // 获取到Cookie数据内容
    // console.log(cookie.getToken())

    console.log('当前路由要去的路径: ' + to.name)
    console.log(from)
    console.log('当前路径: ' + from.fullPath)

    if (cookie.getToken()) {
        if (to.path === '/login') {
            next({ path: '/' })
        } else if (hasMenus) {
            next()
        } else {
            try {
                // 这里可以用 await 配合请求后台数据来生成路由
                // const data = await axios.get('xxx')
                // const routes = createRoutes(data)
                const routes = createRoutes(store.state.menuItems)
                // 动态添加路由
                router.addRoutes(routes)
                hasMenus = true
                console.log('当前所有的导航路径')
                console.log(routes)

                next({ path: to.path || '/' })
            } catch (error) {
                // 出错清除所有的缓存数据
                resetTokenAndClearUser()
                next(`/login?redirect=${to.path}`)
            }
        }
    } else {
        hasMenus = false
        if (to.path === '/login') {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
        }
    }
})

router.afterEach(() => {
    LoadingBar.finish()
})
