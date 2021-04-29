module.exports = req => {
  return {
    "code": 200,
    "data": {
      "list|20": [{
        "goodsClass": "女装",
        "goodsId|+1": 1,
        "goodsName": "@ctitle(10)",
        "goodsAddress": "@county(true)",
        "goodsStar|1-5": "★",
        "goodsImg": "@Image('100x100','@color','小甜甜')",
        "goodsSale|30-500": 30
      }]
    }
  }
}
