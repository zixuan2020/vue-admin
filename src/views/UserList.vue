<template>
    <div class="card">
        <div class="actionBar">
            <i-button type="info" @click="changeCheckBoxValue">信息按钮</i-button>
        </div>
        <i-table height="300" ref="selection" border :columns="columns4" :data="data1"></i-table>
        <template>
            <Page class="page" :total="100" show-sizer></Page>
        </template>
    </div>
</template>

<script>
    import userApi from '@/api/user'

    export default {
        name: 'userList',
        data() {
            return {
                columns4: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    },
                    {
                        title: '用戶名',
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
            userApi.userList()
                .then((resp) => {
                    this.data1 = resp.data
                })
        },
        methods: {
            changeCheckBoxValue() {
                console.log(this.$refs.selection.getSelection())
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
