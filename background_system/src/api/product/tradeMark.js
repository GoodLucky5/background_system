import request from '@/utils/request'


/**
 * @description 获取品牌列表接口
 * @URL admin/product/baseTrademark/{pages}/{limit}
 * @Method GET
 * @param: {page,limit}
 * */
export const reqTrademarkList = (page, limit) => request({
  url: `admin/product/baseTrademark/${ page }/${ limit }`,
  method: 'GET'
})

/**
 * @description 修改品牌&添加品牌的接口
 * @修改param: {品牌id，品牌名称，品牌logo}
 * @添加param: {品牌名称， 品牌logo}
 * @添加url: admin/prodyct/baseTrademark/save
 * @修改url: admin/product/baseTrademark/update
 * @修改method: PUT
 * @添加method: POST
 * */
// 修改/添加品牌（服务器已有该品牌
export const reqUpdateTrademark = (trademark) => {
  //修改已有品牌
  if (trademark.id) {
    return request({
      url: `admin/product/baseTrademark/update`,
      method: 'PUT',
      data: trademark
    })
  }
  //添加新的品牌
  else {
    return request({
      url: `admin/product/baseTrademark/save`,
      method: 'POST',
      data: trademark
    })
  }
}

/**
 * @description 删除品牌的接口
 * @Method delete
 * @URL /admin/product/baseTrademark/remove/{id}
 * @param {id}
 * */
export const deleteTrademark = (id) => request({
  url: `/admin/product/baseTrademark/remove/${ id }`,
  method: 'DELETE'
})



