import fetch from '@/config/fetch'

//  登录
export const login = (data) => fetch('/admin/login', data, 'POST');

//  退出
export const signOut = () => fetch('/admin/signout')

//  获取管理员信息
export const getAdminInfo = () => fetch('/admin/info')

//  获取用户列表
export const reqUserList = data => fetch('/v1/users/list', data);

//  获取用户数量
export const reqUserCount = () => fetch('/v1/users/count');

//  获取某天用户注册量
export const reqUserCountByDate = (date) => fetch('/statis/user/' + date + '/count');

//  获取总共订单数量
export const reqOrderCount = () => fetch('/bos/orders/count');

//  获取某天订单数量
export const reqOrderCountByDate = (date) => fetch('/statis/order/' + date + '/count');

//  获取订单列表
export const reqOrderList = (data) => fetch('/bos/orders/', data)

//  获取总共管理员注册量
export const reqAdminCount = () => fetch('/admin/count/');

//  获取某天管理员注册量
export const reqAdminCountByDate = (date) => fetch('/statis/admin/' + date + '/count');

//  获取管理员列表
export const reqAdminList = (data) => fetch('/admin/all/', data)

//  获取城市列表 (type--->  guess:定位城市 hot:热门城市 group：所有城市)
export const cityGuess = () => fetch('/v1/cities/', { type: 'guess' })

//  搜索地址
export const addressSearch = (city_id, keyword) => fetch('/v1/pois/', { type: 'search', city_id: city_id, keyword: keyword })

//  获取餐馆总数量
export const reqRestaurantsCount = () => fetch('/shopping/restaurants/count/')

//  获取商家列表
export const reqRestaurantsList = (data) => fetch('/shopping/restaurants/', data)

//  获取店铺分类
export const reqRestaurantsCategory = () => fetch('/shopping/v2/restaurant/category/')

//  获取店铺详情
export const reqRestaurantsDetail = (shopid) => fetch('/shopping/restaurant/' + shopid)

//  编辑店铺
export const reqEditRestaurant = (data) => fetch('/shopping/updateshop/', data, 'POST')

//  上传图片
export const reqAddImg = (type) => fetch('/v1/addimg/' + type, 'POST')

//  添加餐馆
export const reqAddRestaurant = (data) => fetch('/shopping/addshop/', data, 'POST')

//  删除餐馆
export const reqDeleteRestaurant = (restaurant_id) => fetch('/shopping/restaurant/' + restaurant_id, {}, 'DELETE')

//  获取食品总数量
export const reqFoodsCount = () => fetch('/shopping/v2/foods/count/')

//  获取食品列表 (limit,offset,restaurant_id)
export const reqFoodsList = (data) => fetch('/shopping/v2/foods/', data)

//  添加食品
export const reqAddFood = (data) => fetch('/shopping/addfood', data, 'POST')

//  删除食品
export const reqDeleteFood = (food_id) => fetch('/shopping/v2/food/' + food_id, {}, 'DELETE')

//  添加店铺食品种类
export const reqAddFoodsCategory = (data) => fetch('/shopping/addcategory', data, 'POST')

//  获取店铺食品种类
export const reqFoodsCategoryList = (restaurant_id) => fetch('/shopping/getcategory/' + restaurant_id)

//  根据addressId获取地址
export const reqAddressById = (address_id) => fetch('/v1/addresse/' + address_id)

//  根据user_id获取信息
export const reqUserInfoById = (user_id) => fetch('/v1/user/' + user_id)

//  获取用户分布信息
export const reqUserCityChart = () => fetch('/v1/user/city/count')