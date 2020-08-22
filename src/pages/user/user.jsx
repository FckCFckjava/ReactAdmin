import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { formateDate } from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { PAGE_SIZE } from '../../utils/constants'
import { reqGetUsers, reqAddOrUpdateUser, reqDeleteUser } from '../../api'
import UserForm from './user-form'
//用户路由
export default class User extends Component {

    state = {
        users: [],
        roles: [],
        isShow: false
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            },

        ]
    }

    deleteUser = (user) => {
        Modal.confirm({
            title: `确认删除${user.username}吗？`,
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    message.success('删除用户成功！')
                    this.getUsers()
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        })
    }

    showUpdate = (user) => {
        this.user = user
        this.setState({
            isShow: true
        })
    }

    showAdd = () => {
        this.user = null
        this.setState({
            isShow: true
        })
    }

    addorUpdateUser = async () => {
        // 收集输入数据
        const user = this.form.getFieldsValue()
        this.form.resetFields()
        //如果是更新需要给user指定_id值
        if (this.user) {
            user._id = this.user._id
        }
        // 提交添加请求
        const result = await reqAddOrUpdateUser(user)
        // 更新列表显示
        if (result.status === 0) {
            message.success(`${this.user ? '修改' : '添加'}用户成功`)
            this.getUsers()
            this.setState({
                isShow: false
            })
        }

    }

    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})

        this.roleNames = roleNames
    }


    getUsers = async () => {
        const result = await reqGetUsers()
        if (result.status === 0) {
            const { users, roles } = result.data
            this.initRoleNames(roles)
            this.setState({
                users,
                roles
            })
        } else {

        }
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers()
    }

    render() {

        const { users, isShow, roles } = this.state
        const user = this.user || {}
        const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button>

        return (
            <Card title={title}>
                <Table
                    dataSource={users}
                    columns={this.columns}
                    rowKey='_id'
                    bordered
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true
                    }}
                />
                <Modal
                    title={user._id ? '修改用户' : "添加用户"}
                    visible={isShow}
                    onOk={this.addorUpdateUser}
                    onCancel={() => {
                        this.form.resetFields()
                        this.setState({ isShow: false })
                    }}
                >
                    <UserForm
                        setForm={form => this.form = form}
                        roles={roles}
                        user={user}
                    />
                </Modal>
            </Card>
        )
    }
}