import React, { Component } from 'react'
import { Card, Select, Input, Button, Table, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api/index'
import { PAGE_SIZE } from '../../utils/constants'
const Option = Select.Option

export default class ProductHome extends Component {

    state = {
        products: [], //商品数组
        total: 0, //商品总数量
        loading: false,
        searchName: '',
        searchType: 'productName',
    }



    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '￥' + price //当前指定了对应的属性，所以传入的是对应的属性值
            },
            {
                title: '状态',
                //dataIndex: 'status',
                width: 100,
                render: (product) => {
                    const { status, _id } = product
                    return (
                        <span>
                            <Button
                                type='primary'
                                onClick={() => this.updateStatus(_id, status === 1 ? 2 : 1)}
                            >
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                width: 100,
                render: (product) => {

                    return (
                        <span>
                            {/*将product对象使用state传递给目标路由组建  */}
                            <LinkButton onClick={() =>
                                this.props.history.push('/product/detail', { product })}>详情</LinkButton>
                            <LinkButton onClick={() =>
                                this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                        </span>
                    )
                }
            },
        ];
    }

    //获取指定页码的列表数据显示
    getProducts = async (pageNum) => {
        this.pageNum = pageNum //保存当前页码
        this.setState({
            loading: true
        })
        const { searchName, searchType } = this.state
        let result
        if (searchName) {
            result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
        } else {
            result = await reqProducts(pageNum, PAGE_SIZE)
        }

        this.setState({
            loading: false
        })
        if (result.status === 0) {
            const { total, list } = result.data
            this.setState({
                total,
                products: list,
            })
        }
    }

    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if (result.status === 0) {
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }
    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getProducts(1)
    }
    render() {

        // 取出数据
        const { products, total, loading, searchType, searchName } = this.state

        const title = (
            <span>
                <Select
                    value={searchType}
                    style={{ width: 150 }}
                    onChange={value => this.setState({ searchType: value })}>
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input
                    placeholder='关键字'
                    style={{ width: 150, margin: '0 20px' }}
                    value={searchName}
                    onChange={event => this.setState({ searchName: event.target.value })}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )

        const extra = (
            <Button type='primary'
                onClick={() => this.props.history.push('/product/addupdate')}>
                <PlusOutlined />
                添加商品
            </Button>
        )




        return (
            <Card title={title} extra={extra}>
                <Table
                    dataSource={products}
                    columns={this.columns}
                    rowKey='_id'
                    loading={loading}
                    pagination={{
                        total: total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.getProducts
                    }}
                />
            </Card>
        )
    }
}
