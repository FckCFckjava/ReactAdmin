import axios from 'axios'
import { message } from 'antd'

export default function ajax(url, data = {}, type = 'GET') {
    return new Promise((resolve, reject) => {
        let promise
        //1.执行异步ajax请求
        if (type === 'GET') {
            promise = axios.get(url, {
                params: data
            })
        } else {
            promise = axios.post(url, data)
        }
        //2.如果成功了调用reslove(value)
        promise.then(response => {
            resolve(response.data)
        }).catch(error => {//3.失败了，不调用reject，而是提示异常信息
            message.error('请求出错了：' + error.message)
        })
    })

}

// ajax('39.100.225.255:5000/login',
//     {usename: 'admin', password: 'admin'},
//     'post'
//     ).then()