import React, { Component } from "react";
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd';
import {
    AppstoreOutlined,
    PieChartOutlined,
    BarsOutlined,
    HomeOutlined,
    ToolOutlined,
    UserOutlined,
    SafetyCertificateOutlined,
    AreaChartOutlined,
    BarChartOutlined,
    LineChartOutlined,
} from '@ant-design/icons';
import logo from '../../assets/images/pic.jpg'
import './index.less'
import menuList from '../../config/menuConfig'

const { SubMenu } = Menu;
const Icons = {
    'AppstoreOutlined': <AppstoreOutlined />,
    'PieChartOutlined': <PieChartOutlined />,
    'BarsOutlined': <BarsOutlined />,
    'HomeOutlined': <HomeOutlined />,
    'ToolOutlined': <ToolOutlined />,
    'UserOutlined': <UserOutlined />,
    'SafetyCertificateOutlined': <SafetyCertificateOutlined />,
    'AreaChartOutlined': <AreaChartOutlined />,
    'BarChartOutlined': <BarChartOutlined />,
    'LineChartOutlined': <LineChartOutlined />,
}
class LeftNav extends Component {
    state = {
        collapsed: false,
    };

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
        return menuList.map(item => {
            /*
            title
            key
            icon
            children
            */
            if (!item.children) {
                return (
                    <Menu.Item key={item.key} icon={Icons[item.icon]} >
                        <Link to={item.key}>
                            <span >{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                if (cItem) {
                    this.openKey = item.key
                }
                return (
                    <SubMenu key={item.key} icon={Icons[item.icon]} title={item.title}>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }
    //在第一次render（）之前执行一次
    //为第一次render（）准备数据（必须同步）
    componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }
    render() {
        //const menuNodes = this.getMenuNodes(menuList)
        //得到当前路由路径
        let path = this.props.location.pathname
        if (path.indexOf('/product') === 0) {
            //当前请求的事商品或商品子路由
            path = '/product'
        }
        const openKey = this.openKey
        return (
            <div className="left-nav">
                <Link to='/home' className="left-nav-header">
                    <img src={logo} alt="logo" />
                    <h1>后台管理</h1>
                </Link>

                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={this.state.collapsed}
                >
                    {this.menuNodes}
                </Menu>


            </div>
        )
    }
}
/*
withRouter是高阶组件
包装非路由组件，返回一个新组件
新的组件向非路由组件传递三个属性：history、location、match
*/
export default withRouter(LeftNav)