<template>
    <div class="card">
        <div class="actionBar">
            <i-button type="info" @click="changeCheckBoxValue">新增用户</i-button>
        </div>
        <i-table height="450" ref="selection" border :columns="tableHead" :data="tableData"></i-table>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <template>
            <Page ref="page" class="page"
                  @on-page-size-change="changePageSize" :current="pageNum" :page-size="pageSize"
                  @on-change="changePageNumber" :total="total" show-sizer>
            </Page>
        </template>

        <!--    新增用户   -->


        <!--   保存用户     -->
        <Modal v-model="isShowEditModal" width="540">
            <p slot="header" style="color:#FF6600;text-align:left">
                <Icon type="ios-information-circle"></Icon>
                <span>编辑用户信息</span>
            </p>
            <div>

                <Row :gutter="12" class="interval">
                    <i-col span="6"><Icon type="md-person" size="30" />用户名:</i-col>
                    <i-col span="14">
                        <i-input disabled v-model="userInfo.username" placeholder="用户名" style="width: 200px"></i-input>
                    </i-col>
                </Row>
                <Row :gutter="12" class="interval">
                    <i-col span="6"><Icon type="md-calendar" size="30" />生日:</i-col>
                    <i-col span="14">
                        <Date-picker @on-change="changeBirthday" type="date" format="yyyy-MM-dd" :value="userInfo.birthday"
                                 placeholder="选择日期" style="width: 300px"></Date-picker>
                    </i-col>
                </Row>
                <Row :gutter="12" class="interval">
                    <i-col span="6"><Icon type="md-ionitron" size="30" />真实姓名:</i-col>
                    <i-col span="14">
                        <i-input  v-model="userInfo.fullName"
                                 placeholder="用户名" style="width: 200px"></i-input>
                    </i-col>
                </Row>

            </div>
            <div slot="footer">
                <Button type="info" size="large" long :loading="loading" @click="saveUser">保存</Button>
            </div>
        </Modal>

        <!--  确认删除      -->
        <Modal
            title="确认删除"
            v-model="isDelModel"
            @on-ok="delUser"
            class-name="vertical-center-modal">
            <p>您确定需要删除当前用户信息吗？</p>
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
            isShowEditModal: false, // 是否显示模态框
            isDelModel: false, // 是否显示模态框
            loading: false, // 点击按钮是否加载
            isDel: false, // 确认删除模态框
            delUserId: 0,
            userInfo: {
                id: 0,
                username: '',
                birthday: '',
                fullName: '',
                remoteIp: '',
                updateTime: '',
                createTime: '',
            },
            tableHead: [
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
                    title: '登录IP',
                    key: 'remoteIp',
                    align: 'center',
                },
                {
                    title: '更新时间',
                    key: 'updateTime',
                    align: 'center',
                },
                {
                    title: '创建时间',
                    key: 'createTime',
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

                                    console.log(row)
                                    this.userInfo.id = row.id
                                    this.userInfo.username = row.username
                                    this.userInfo.birthday = row.birthday
                                    this.userInfo.fullName = row.fullName
                                    this.userInfo.remoteIp = row.remoteIp
                                    this.userInfo.updateTime = row.updateTime
                                    this.userInfo.createTime = row.createTime
                                    this.isShowEditModal = true

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
                                    let { row } = params
                                    // 删除当前用户数据通过uid

                                    this.isDelModel = true
                                    this.delUserId = row.id

                                },
                            },
                        }, '删除'),
                    ]),
                },
            ],
            tableData: [],
        }
    },
    mounted() {


        // 页面渲染完成发送一次获取用户列表请求
        this.sendUserListPage()

    },
    methods: {
        changeBirthday(e) {
            this.userInfo.birthday = e
        },
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
                    this.tableData = list
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

        saveUser() {
            this.loading = true

            // 发送ajax请求修改当前用户数据
            userApi.saveUser(this.userInfo)
            .then((resp) => {

                if (resp.code == 200) {
                    this.$Message.success('保存用户数据成功')
                } else {
                    this.$Message.error('用户数据保存失败')
                }
                this.loading = false
                this.isShowEditModal = false

                // 重新请求当前页面数据
                this.sendUserListPage()
            })
            .catch((err) => {
                this.loading = false
                this.isShowEditModal = false
                this.$Message.error('用户数据保存失败')

                // 重新请求当前页面数据
                this.sendUserListPage()
            })
        },

        delUser() {
            userApi.delUser({ id: this.delUserId })
            .then((resp) => {
                if (resp.code == 200) {
                    this.$Message.success('用户数据删除成功')
                } else {
                    this.$Message.error('用户数据删除失败')
                }
            }).catch(e => {
                this.$Message.error('用户数据删除失败')
            })
            this.sendUserListPage()
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

    .interval{
        padding: 10px;
    }
</style>
