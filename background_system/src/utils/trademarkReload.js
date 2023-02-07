//获取页码
export function getPage () {
  const page = sessionStorage.getItem('page');
  if (page) {
    console.log(page);
    return +page;
  } else {
    return 1;
  }
}

//获取展示数据条数
export function getLimit () {
  const limit = sessionStorage.getItem('limit');
  if (limit) {
    console.log(limit);
    return +limit;
  } else {
    return 3;
  }
}

//本地存储页码
export function savePage (page) {
  sessionStorage.setItem('page', page);
}

//本地存储展示数据条数
export function saveLimit (limit) {
  sessionStorage.setItem('limit', limit);
}
