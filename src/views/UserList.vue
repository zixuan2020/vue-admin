<template>
    <div class="card">
        <div class="actionBar">
            <i-button type="info" @click="changeCheckBoxValue">信息按钮</i-button>
        </div>
        <i-table height="450" ref="selection" border :columns="columns4" :data="data1"></i-table>
        <template>
            <Page ref="page" class="page"
                  @on-page-size-change="changePageSize" :current="pageNum" :page-size="pageSize"
                  @on-change="changePageNumber" :total="total" show-sizer>
            </Page>
        </template>
    </div>
</template>

<script>
    import userApi from '@/api/user'


    export default {
        name: 'userList',
        data() {
            return {
                pageSize: 10,
                pageNum: 1,
                total: 0,
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
                                        console.log(111)
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
                    })

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
</style>
