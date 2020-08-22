import React, { Component } from "react";
import { formateDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import { reqWeather } from '../../api/index'
import { withRouter } from 'react-router-dom'
import menuList from '../../config/menuConfig'
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './index.less'
import storageUtils from "../../utils/storageUtils";

class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()),//当前时间字符串
        weather: '' //天气的文本
    }

    getTime = () => {
        //每隔一秒获取当前时间，并更新状态数据currentTime
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({ currentTime })
        }, 1000)
    }

    getWeather = async () => {
        const { weather } = await reqWeather('杭州')
        this.setState({ weather })
    }

    getTitle = () => {
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key === path) { //如果当前item对象的key与path一样
                title = item.title
            } else if (item.children) {
                //在所有子item中查找
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                if (cItem) {//有值才说明有匹配
                    title = cItem.title
                }
            }
        })
        return title
    }

    logout = () => {
        //显示确认对话框
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: '确认退出吗？',
            onOk: () => {
                // console.log('OK');
                //删除user数据
                storageUtils.removeUser()
                memoryUtils.user = {}
                //跳转到login界面
                this.props.history.replace('/login')
            },
        })
    }
    //第一次render（）之后执行
    //一般在此执行异步操作：发ajxa请求/启动定时器
    componentDidMount() {
        //获取当前时间
        this.getTime()
        //获取当前天气显示
        this.getWeather()
    }

    //当前组件卸载之前调用
    componentWillUnmount() {
        //清楚定时器
        clearInterval(this.intervalId)
    }
    render() {

        const { currentTime, weather } = this.state
        const username = memoryUtils.user.username
        const title = this.getTitle()

        return (
            <div className="header">
                <div className='header-top'>
                    <span>欢迎，{username}</span>
                    <a href="javascript:" onClick={this.logout}>退出</a>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span className='currentTime'>{currentTime}</span>
                        <span className='weather'>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)