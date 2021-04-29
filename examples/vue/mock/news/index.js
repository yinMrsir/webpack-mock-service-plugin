module.exports = req => {
  const obj = {
    "goodsClass": "女装",
    "goodsId|+1": 1,
    "goodsName": "@ctitle(10)",
    "goodsAddress": "@county(true)",
    "goodsStar|1-5": "★",
    "goodsImg": "@Image('100x100','@color','小甜甜')",
    "goodsSale|30-500": 30
  }
  const list = []
  const pageSize = req.query.pageSize || 10
  for (let i = 0; i < pageSize; i++) {
    list.push(obj)
  }
  return {
    code: 200,
    list,
    page: req.query.page || 1,
    pageSize
  }
}
