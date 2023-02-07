import request from '@/utils/request'

//获取spu列表数据
export const reqSpuList = (page, limit, category3Id) => request({
  url: `/admin/product/${ page }/${ limit }`,
  method: 'get',
  params: {category3Id}
})

//通过ID获取spu信息
export const reqSpuInfoById = (spuid) => request({
  url: `/admin/product/getSpuById/${ spuid }`,
  method: 'get',
})

//获取品牌信息
export const reqSpuBrandInfo = () => request({
  url: '/admin/product/baseTrademark/getTrademarkList',
  method: 'get',
})

//获取spu图片接口
export const reqSpuImageList = (spuid) => request({
  url: `/admin/product/spuImageList/${ spuid }`,
  method: 'get',
})

//获取平台全部销售属性
export const reqAllAttr = () => request({
  url: '/admin/product/baseSaleAttrList',
  method: 'get',
})

//修改spu或者添加spu
//携带参数带有id表示保存
export const reqSaveOrAddspu = (spuInfo) => {
  const {id} = spuInfo;
  //保存
  if (id) {
    return request({url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo})
  }
  //添加
  else {
    return request({url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo})
  }
}

//删除spu
export const reqDeleteSpu = (spuId) => request({
  url: `/admin/product/deleteSpu/${ spuId }`,
  method: 'delete',
})
