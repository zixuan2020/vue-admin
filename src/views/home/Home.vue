<template>
    <div class="home-container">
        <Row :gutter="20">
            <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`"
                   style="height: 120px;padding-bottom: 10px;">
                <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
                    <count-to :end="infor.count" count-class="count-style"/>
                    <p>{{ infor.title }}</p>
                </infor-card>
            </i-col>
        </Row>
        <Row :gutter="20" style="margin-top: 10px;">
            <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
                <Card shadow>
                    <chart-pie style="height: 300px;" :value="pieData" text="用户访问来源"></chart-pie>
                </Card>
            </i-col>
            <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
                <Card shadow>
                    <chart-bar style="height: 300px;" :value="barData" text="每周用户活跃量"/>
                </Card>
            </i-col>
        </Row>
        <Row>
            <Card shadow>
                <example style="height: 230px;"/>
            </Card>
        </Row>
    </div>
</template>

<script>
import InforCard from '@/components/info-card'
import CountTo from '@/components/count-to'
import { ChartPie, ChartBar } from '@/components/charts'
import { fetchUserData } from '@/api'
import example from './example'

export default {
    name: 'home',
    components: {
        InforCard,
        CountTo,
        ChartPie,
        ChartBar,
        example,
    },
    data() {
        return {
            inforCardData: [
                {
                    title: '用户数量',
                    icon: 'md-person',
                    count: 10,
                    color: '#2d8cf0',
                },
                {
                    title: '累计点击',
                    icon: 'md-locate',
                    count: 200,
                    color: '#19be6b',
                },
                {
                    title: '新增问答',
                    icon: 'md-help-circle',
                    count: 10,
                    color: '#ff9900',
                },
                {
                    title: '分享统计',
                    icon: 'md-share',
                    count: 12,
                    color: '#ed3f14',
                },
                {
                    title: '新增互动',
                    icon: 'md-chatbubbles',
                    count: 12,
                    color: '#E46CBB',
                },
                {
                    title: '新增页面',
                    icon: 'md-map',
                    count: 14,
                    color: '#9A66E4',
                },
            ],
            pieData: [
                {
                    value: 10,
                    name: '直接访问',
                },
                {
                    value: 20,
                    name: '邮件营销',
                },
                {
                    value: 30,
                    name: '联盟广告',
                },
                {
                    value: 40,
                    name: '视频广告',
                },
                {
                    value: 50,
                    name: '搜索引擎',
                },
            ],
            barData: {
                Mon: 10,
                Tue: 20,
                Wed: 30,
                Thu: 40,
                Fri: 50,
                Sat: 60,
                Sun: 70,
            },
        }
    },
    methods: {
        getUserData() {
            // 获取当前用户的github信息
            fetchUserData()
            .then((resp) => {
                this.userInfo = JSON.stringify(resp)
            })

        },
    },
}
</script>

<style scoped>
.home-container {
    padding: 18px;

}
.home-content {
    padding: 10px;
    border-radius: 5px;
    background: #fff;
}
</style>
