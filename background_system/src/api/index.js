//统一暴露四个模块
import * as trademark from './product/tradeMark';
import * as attr from './product/attr';
import * as spu from './product/spu';
import * as sku from './product/sku';

import permission from '@/api/acl/permission'
import role from '@/api/acl/role'
import * as user from '@/api/acl/user'

export default {
  trademark,
  sku,
  spu,
  attr,
  permission,
  user,
  role,
}
