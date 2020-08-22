// 包含应用中所有接口请求函数的模块
import jsonp from 'jsonp'
import ajax from './ajax'
import { message } from 'antd'
//登录
// export function reqLogin(usename, password){
//     return ajax('/login', {usename, password}, 'POST')
// }

export const reqLogin = (username, password) =>
    ajax('/login', { username, password }, 'POST')


export const reqWeather = (city) => {
    return new Promise((reslove, reject) => {
        const url = `http://apis.juhe.cn/simpleWeather/query?city=${city}&key=f60e7cd729ca1b634def26161155923f`
        jsonp(url, { timeout: 10000 }, (err, data) => {
            console.log('jsonp()', err, data)
            //如果成功了
            if (!err && data.reason === "查询成功!") {
                const { weather } = data.result.future[0]
                reslove({ weather })
            } else {
                message.error('获取天气信息失败')
            }
        })
    })

}

//获取一级/二级分类列表
export const reqCategorys = (parentId) =>
    ajax('/manage/category/list', { parentId })

export const reqAddCategorys = (categoryName, parentId) =>
    ajax('/manage/category/add', { categoryName, parentId }, 'POST')

export const reqUpdateCategorys = (categoryId, categoryName) =>
    ajax('/manage/category/update', { categoryId, categoryName }, 'POST')

export const reqProducts = (pageNum, pageSize) =>
    ajax('/manage/product/list', { pageNum, pageSize })

export const reqSearchProducts = ({ pageNum, pageSize, searchName, searchType }) =>
    ajax('/manage/product/search', { pageNum, pageSize, [searchType]: searchName })

export const reqCategory = (categoryId) =>
    ajax('/manage/category/info', { categoryId })

export const reqUpdateStatus = (productId, status) =>
    ajax('/manage/product/updateStatus', { productId, status }, 'POST')

export const reqDeleteImg = (name) =>
    ajax('/manage/img/delete', { name }, 'POST')
//添加或修改商品
export const reqAddOrUpdateProduct = (product) =>
    ajax('/mange/product/' + product._id ? 'update' : 'add', product, 'POST')

// export const reqUpdateProduct = (product) => 
//     ajax('/manage/product/update', product, 'POST')

export const reqRoles = () =>
    ajax('/manage/role/list')

// 添加角色
export const reqAddRole = (roleName) => ajax('/manage/role/add', { roleName }, 'POST')
// 添加角色
export const reqUpdateRole = (role) => ajax('/manage/role/update', role, 'POST')

export const reqGetUsers = () => ajax('/manage/user/list')

export const reqDeleteUser = (userId) => ajax('/manage/user/delete', { userId }, 'POST')

export const reqAddOrUpdateUser = (user) => ajax('/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')

