import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './login.less'
import logo from '../../assets/images/pic.jpg'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storager from '../../utils/storageUtils'
import { Redirect } from 'react-router-dom';
export default class Login extends Component {

    render() {
        //如果用户已经登录自动跳转到admin
        const user = memoryUtils.user
        if (user && user._id) {
            return <Redirect to='/' />
        }
        const onFinish = async values => {
            // console.log('Received values of form: ', values);
            //请求登录
            const { username, password } = values

            const result = await reqLogin(username, password)
            // console.log('请求成功', response.data)

            if (result.status === 0) {
                //登陆成功
                message.success('登录成功')
                //保存user
                const user = result.data
                memoryUtils.user = user //保存在内存中
                storager.saveUser(user) //保存到local中
                //跳转到管理界面
                this.props.history.replace('/')
            } else {
                //登录失败
                message.error(result.msg)
            }
        };

        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="" />
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    whitespace: true,
                                    message: '请输入您的用户名!'
                                },
                                {
                                    min: 4,
                                    message: '用户名最少4位'
                                },
                                {
                                    max: 12,
                                    message: '用户名最多12位'
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_]+$/,
                                    message: '用户名必须是英文数字下划线组合！'
                                }
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined
                                    className="site-form-item-icon" />}
                                placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    validator: (rule, value) => {
                                        return new Promise((resolve, reject) => {
                                            if (!value) {
                                                reject('密码必须输入！')
                                            } else if (value.length < 4) {
                                                reject('密码长度不能小于4位')
                                            } else if (value.length > 12) {
                                                reject('密码长度不能大约12位')
                                            } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                                                reject('密码必须是英文数字下划线组合')
                                            } else {
                                                resolve()
                                            }
                                        })
                                    }
                                }
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}