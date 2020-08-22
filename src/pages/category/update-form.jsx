import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input
} from 'antd'


const Item = Form.Item
const formRef = React.createRef();

export default class UpdateForm extends Component {

    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }


    componentWillMount() {

        this.props.setForm(formRef.current)
    }
    render() {
        const { categoryName } = this.props
        return (
            <Form>
                <Item
                    name='categoryName'
                    initialValue={categoryName}
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
