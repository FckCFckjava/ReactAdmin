import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Select,
    Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option
export default class AddForm extends Component {
    static propTypes = {
        categorys: PropTypes.array.isRequired, //一级分类的数组
        parentId: PropTypes.string.isRequired
    }

    render() {
        // const { getFieldDecorator } = this.props.form
        const { categorys, parentId } = this.props
        return (
            <Form>
                <Item
                    name='parentId'
                    initialValue={parentId}
                >
                    <Select>
                        <Option value='0'>一级分类</Option>
                        {
                            categorys.map(c => <Option value={c._id}>{c.name}</Option>)
                        }
                    </Select>
                </Item>
                <Item
                    name='categoryName'
                    initialValue=''
                    rules={[
                        {
                            required: true,
                            message: '分类名称必须输入',
                        },
                    ]}
                >
                    <Input placeholder='请输入分类名称'>

                    </Input>
                </Item>
            </Form>
        )
    }
}
