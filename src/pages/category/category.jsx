//商品分类
import React, { Component } from 'react'
import { Card, Button, Table, message, Modal } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import { reqCategorys, reqUpdateCategorys, reqAddCategorys } from '../../api/index'
import AddForm from './add-form'
import UpdateForm from './update-form'
import './category.less'
export default class Category extends Component {

    state = {
        categorys: [], //一级分类列表
        subCategorys: [],//二级分类列表
        loading: false, //是否正在获取数据
        parentId: '0',
        parentName: '',
        showStatus: 0,//标识确认框是否显示0：都不显示，1：显示添加，2：显示更新
    }

    //初始化table的所有列数组
    initColumns = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',//指定显示属性对应的属性名
            },
            {
                title: '操作',
                width: 300,
                render: (category) => ( //返回需要显示的界面标签
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        {this.state.parentId === '0'
                            ? <LinkButton onClick={() => { this.showSubCategorys(category) }}>查看子分类</LinkButton>
                            : null}
                    </span>
                )
            },
        ];
    }

    showSubCategorys = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name,
        }, () => {//状态更新且重新render后执行
            this.getCategorys()
        })//更新状态时异步操作
        //consle.log(this.state.paretId) //0

        //setstate不能获取最新的状态：因为setState是异步更新
    }
    showCategorys = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: [],
        })
    }

    //响应点击取消：隐藏确定矿
    handleCancel = () => {
        //清楚输入数据
        // this.form.resetFields()
        //隐藏form
        this.setState({
            showStatus: 0
        })
    }

    addCategory = async () => {
        this.state({
            showStatus: 0
        })

        //收集数据并提交请求
        // const { parentId, categoryName } = this.form.getFieldValue()
        // const result = await reqAddCategorys(categoryName, parentId)
        // if(result.status === 0){
        //     //添加的分类就是当前分类
        //     if(parentId === this.state.parentId){
        //         //重新获取分类列表显示
        //         this.getCategorys()
        //     } else if(parentId === '0'){
        //         //在二级分类列表下添加一级分类,重新获取一级分类列表但不需要显示
        //         this.getCategorys('0')

        //     }
        // }
    }

    updateCategory = async () => {
        this.state({
            showStatus: 0
        })
        // 进行表单验证
        // this.form.validateFields(async (err, value) => {
        //      if(!err) {
        //          全部代码
        // }
        // })
        // const categoryId = this.category._id
        // const categoryName = this.form.getFieldValue('categoryName')
        // //发请求保存更新
        // const result = await reqUpdateCategorys({ categoryId, categoryName })
        // this.form.resetFields()

        // if (result.status === 0) {//重新显示列表
        //     this.getCategorys()
        // }
    }

    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    showUpdate = (category) => {
        //保存分类对象
        this.category = category

        this.setState({
            showStatus: 2
        })
    }

    //如果没有指定根据状态中的parentId请求，如果指定了根据参数
    getCategorys = async (parentId) => {
        //再发请求前显示loading
        this.setState({ loading: true })
        parentId = parentId || this.state.parentId
        //reqCategory返回promise对象,用await转换成数据
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            const categorys = result.data
            //更新状态
            this.setState({
                categorys,
                loading: false
            })
            //更新一级分类
            if (parentId === '0') {
                this.setState({
                    categorys
                })
            } else {//更新二级分类
                this.setState({
                    subCategorys: categorys
                })
            }
        } else {
            message.error('获取数据失败！')
        }
    }

    //为第一次render准备数据
    componentWillMount() {
        this.initColumns()
    }

    //发异步ajax请求，执行异步任务
    componentDidMount() {
        this.getCategorys()
    }
    render() {
        const { showStatus, categorys, loading, subCategorys, parentId, parentName } = this.state

        const category = this.category || {} //如果还没有先建立一个空对象
        //card的左侧标题
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <ArrowRightOutlined style={{ margin: '0 10px' }} />
                <span>{parentName}</span>
            </span>
        )
        //card的右侧
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <PlusOutlined />
                添加
            </Button>
        )


        return (
            <Card
                title={title}
                extra={extra}
                style={{ width: '100%' }}>
                <Table
                    dataSource={parentId === '0' ? categorys : subCategorys}
                    columns={this.columns}
                    rowKey='_id'
                    bordered
                    pagination={{
                        defaultPageSize: 5,
                        showQuickJumper: true
                    }}
                    loading={loading}
                />
                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm parentId={parentId} categorys={categorys} />
                </Modal>
                <Modal
                    title="更新分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        categoryName={category.name}
                        setForm={(form) => { this.form = form }}
                    />
                </Modal>
            </Card>
        )
    }
}