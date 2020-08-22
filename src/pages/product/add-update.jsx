import React, { Component } from 'react'
import { Card, Form, Input, Cascader, Upload, Button } from 'antd'
import LinkButton from '../../components/link-button'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { reqCategorys, reqAddOrUpdateProduct } from '../../api'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

const { Item } = Form
const { TextArea } = Input
const options = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        isLeaf: false,
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        isLeaf: false,
    },
];

export default class ProductAddUpdate extends Component {


    state = {
        options: [],
    };

    constructor(props) {
        super(props)
        //创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
        this.formRef = React.createRef();
    }
    initOptions = async (categorys) => {
        //根据categorys生成options数组
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))

        // 如果是一个二级分类商品的更新
        const { isUpdate, product } = this
        const { pCategoryId } = product
        if (isUpdate && pCategoryId !== '0') {
            // 获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)
            // 生成二级下拉列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))

            // 找到当前商品对应的一级option对象
            const targetOption = options.find(option => option.value === pCategoryId)

            // 关联对应的一级option上
            targetOption.children = childOptions
        }


        this.setState({
            options
        })
    }

    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        // debugger
        if (result.status === 0) {
            const categorys = result.data
            //如果是一级分类
            if (parentId === '0') {
                this.initOptions(categorys)
            } else {
                return categorys //返回二级列表,当前async函数返回的promise成功且value为categorys
            }
        }
    }
    //验证价格
    validatePrice = (rule, value, callback) => {
        if (value * 1 > 0) {
            callback() //验证通过
        } else {
            callback('价格必须大于0')
        } //验证没通过

    }
    submit = () => {
        //进行表单验证
        // this.formRef.current.validateFields((error, values) => {
        //     if (!error) {
        //         alert('hello')
        //     }
        // })
        // const imgs = this.pw.current.getImgs()
        // const detail = this.editor.current.getDetail()

        // 1.收集数据，并封装成product对象
        // 2.调用接口请求函数去添加/更新
        // 3.根据结果显示
    }

    loadData = async selectedOptions => {
        //得到选择的option对象
        const targetOption = selectedOptions[0];
        targetOption.loading = true;

        //根据选中的分类获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false;
        if (subCategorys && subCategorys.length > 0) {
            //生成一个二级列表的options
            const cOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            //关联到当前的option上
            targetOption.children = cOptions
        } else {
            targetOption.isLeaf = true
        }
        // load options lazily模拟请求异步获取二级列表
        this.setState({
            options: [...this.state.options]
        })
    };

    componentDidMount() {
        this.getCategorys('0')
    }

    componentWillMount() {
        //取出携带的state
        const product = this.props.location.state//如果是添加没值，否则有值
        this.isUpdate = !!product //保存是否是更新的标识
        this.product = product || {}//保存商品(如果没有保存的是空对象)
    }

    render() {
        const { isUpdate, product } = this
        const { pCategoryId, categoryId, imgs } = product
        const categoryIds = [] //用来接收级联数组

        if (isUpdate) {
            // 商品是一级分类商品
            if (pCategoryId === '0') {
                categoryIds.push(categoryId)
            } else {
                // 商品是二级分类商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined />
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>

            </span>
        )



        //指定Item布局的配置对象
        const layout = {
            labelCol: { span: 2 }, //左侧label宽度
            wrapperCol: { span: 6 },
        };


        return (
            <Card title={title}>
                <Form {...layout}>
                    <Item label='商品名称：' name='name'
                        initialValue={product.name}
                        rules={[{
                            required: true,
                            message: '请输入商品名称'
                        }]}>
                        <Input placeholder='商品名称' />
                    </Item>
                    <Item label='商品描述：' name='description'
                        initialValue={product.desc}
                        rules={[{
                            required: true,
                            message: '请输入商品描述'
                        }]}>
                        <TextArea placeholder='请输入商品描述' autoSize />
                    </Item>
                    <Item label='商品价格：' name='price'
                        initialValue={product.price}
                        rules={[{
                            required: true,
                            message: '请输入商品价格'
                        },
                        {
                            validator: this.validatePrice
                        }]}>
                        <Input type='number' placeholder='商品价格' addonAfter='元' />
                    </Item>
                    <Item label='商品分类：' name='categoryIds'>
                        <Cascader
                            options={this.state.options}//需要显示的列表数据
                            loadData={this.loadData}//当选择某个列表项，加载下一级列表的监听回调
                            initialValue={categoryIds}
                        />
                    </Item>
                    <Item label='商品图片：' name='picture'>
                        <PicturesWall ref={this.pw} imgs={imgs} />
                    </Item>
                    <Item label='商品详情：' name='detail' labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
                        <RichTextEditor ref={this.editor} />
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
