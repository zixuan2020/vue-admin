<template>
    <div class="card">
        <div class="actionBar">
            <i-button type="info" @click="changeCheckBoxValue">新增用户</i-button>
        </div>
        <i-table height="450" ref="selection" border :columns="columns4" :data="data1"></i-table>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <template>
            <Page ref="page" class="page"
                  @on-page-size-change="changePageSize" :current="pageNum" :page-size="pageSize"
                  @on-change="changePageNumber" :total="total" show-sizer>
            </Page>
        </template>

        <Modal v-model="modal6" width="360">
            <p slot="header" style="color:#95f153;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>编辑用户信息</span>
            </p>
            <div style="text-align:center">
                <p>您当前的用户信息</p>

            </div>
            <div slot="footer">
                <Button type="info" size="large" long :loading="loading" @click="del">Delete</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import userApi from '@/api/user'

export default {
    name: 'userList',
    data() {
        return {
            pageSize: 10,
            pageNum: 1,
            total: 0,
            spinShow: true,
            modal6: false, // 是否显示模态框
            loading: false, // 点击按钮是否加载
            userInfo: {
                id: 0,
                username: '',
                password: '',
                birthday: '',
                fullName: '',
            },
            columns4: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                },
                {
                    title: '用户名',
                    key: 'username',
                    align: 'center',
                },
                {
                    title: '生日',
                    key: 'birthday',
                    align: 'center',
                },
                {
                    title: '姓名',
                    key: 'fullName',
                    align: 'center',
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, params) => h('div', [
                        h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small',
                            },
                            style: {
                                marginRight: '5px',
                            },
                            on: {
                                click: () => {
                                    let { row } = params
                                    this.userInfo.id = row.id
                                    this.userInfo.username = row.username
                                    this.userInfo.password = row.password
                                    this.userInfo.birthday = row.birthday
                                    this.userInfo.fullName = row.fullName
                                    this.modal6 = true
                                    console.log(this.userInfo)
                                },
                            },
                        }, '编辑'),
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small',
                            },
                            on: {
                                click: () => {
                                    console.log(params)
                                    console.log(h)
                                },
                            },
                        }, '删除'),
                    ]),
                },
            ],
            data1: [],
        }
    },
    mounted() {


        // 页面渲染完成发送一次获取用户列表请求
        this.sendUserListPage()

    },
    methods: {

        changeCheckBoxValue() {
            console.log(this.$refs.selection.getSelection())
        },

        changePageNumber(currentPage) {
            this.pageNum = currentPage
            // 发送axios向后端请求数据
            this.sendUserListPage()
        },
        changePageSize(newPageSize) {
            this.pageSize = newPageSize

            // 发送 axios请求向前台发送书
            this.sendUserListPage()
        },
        sendUserListPage() {
            // 数据加载效果

            userApi.userList({
                pageNum: this.pageNum,
                pageSize: this.pageSize,
            })
            .then((resp) => {
                let list = resp.data.records
                if (list && list.length != 0) {
                    this.data1 = list
                    this.pageNum = resp.data.current
                    this.pageSize = resp.data.size
                    this.total = resp.data.total


                }
                this.spinShow = false
            })
            .catch(err => {
                this.spinShow = false
            })

        },
        del() {
            this.modal_loading = true
            setTimeout(() => {
                this.modal_loading = false
                this.modal2 = false
                this.$Message.success('Successfully delete')
            }, 2000)
        },
    },
}
</script>

<style scoped>
    .card {
        background: #eee;
        padding: 20px;
    }

    .actionBar {
        padding: 10px 10px 10px 0px;
    }

    .page {
        text-align: right;
        padding: 10px 0px 10px 0px;
    }


    .demo-spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }

    @keyframes ani-demo-spin {
        from {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .demo-spin-col {
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
</style>
