//平台属性管理的请求文件

import request from '@/utils/request'

/**
 * @description 获取一级分类数据的接口
 * @URL '/admin/product/getCategory1'
 * @Method GET
 * */
export const reqCategory1 = () => request({
  url: '/admin/product/getCategory1',
  method: 'GET'
})
/**
 * @description 获取二级分类数据的接口
 * @Method: GET
 * @URL: '/admin/product/getCategory2/{category1d}'
 * */
export const reqCategory2 = (id1) => request({
  url: `/admin/product/getCategory2/${ id1 }`,
  method: 'GET'
})
/**
 * @description 获取三级分类的接口
 * @Method: GET
 * @URL: '/admin/product/getCategory3/{category2id}'
 * */
export const reqCategory3 = (id2) => request({
  url: `/admin/product/getCategory3/${ id2 }`,
  method: 'GET'
})
/**
 * @description 商品基础属性接口
 * @Method: GET
 * @URl: '/admin/product/attrInfoList/{category1Id}'/{category2Id}'/{category3Id}'
 * */
export const reqAttrInfoList = (id1, id2, id3) => request({
  url: `/admin/product/attrInfoList/${ id1 }/${ id2 }/${ id3 }`,
  method: 'GET'
})
/**
 * @description 添加属性值接口
 * @URL: `/admin/product/saveAttrInfo`
 * @Method: POST
 * 参数data：{
 *   attrName: String,
 *   attrValueList:[
 *      {
 *        attrId: Number,
 *        valueName: String
 *      }
 *   ],
 *   categoryId: Number
 *   categoryLevel: 3
 * }
 * */
export const reqSaveAttrInfo = (data) => request({
  url: '/admin/product/saveAttrInfo',
  method: 'POST',
  data,
})
