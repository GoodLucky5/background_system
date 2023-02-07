import request from '@/utils/request'

//查看sku详情
export const reqSkuDetails = (skuId) => request({
  url: `/admin/product/getSkuById/${ skuId }`,
  method: 'get',
})

//sku上架
export const reqOnSale = (skuId) => request({
  url: `/admin/product/onSale/${ skuId }`,
  method: 'get',
})

//sku下架
export const reqSoldOut = (skuId) => request({
  url: `/admin/product/cancelSale/${ skuId }`,
  method: 'get'
})

//sku模块获取数据
export const reqAllSkuInfo = ({page, limit}) => request({
  url: `/admin/product/list/${ page }/${ limit }`,
  method: 'get',
})

//获取sku列表数据
export const reqDetailSkuFormList = (spuId) => request({
  url: `/admin/product/findBySpuId/${ spuId }`,
  method: 'get',
})

//添加sku
export const reqAddSku = (skuInfo) => request({
  url: "/admin/product/saveSkuInfo",
  method: 'post',
  data: skuInfo
})

//获取图片接口
export const reqSpuImageList = (spuId) => request({
  url: `/admin/product/spuImageList/${ spuId }`,
  method: 'get',
})

//获取销售属性列表
export const reqSpuSaleAttrList = (spuId) => request({
  url: `/admin/product/spuSaleAttrList/${ spuId }`,
  method: 'get'
})

//获取平台属性
export const reqAttrInfoList = ({category1Id, category2Id, category3Id}) => request({
  url: `/admin/product/attrInfoList/${ category1Id }/${ category2Id }/${ category3Id }`,
  method: 'get'
})
