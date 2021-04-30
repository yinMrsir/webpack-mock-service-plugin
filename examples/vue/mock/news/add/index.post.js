module.exports = req => {
  const { username = '654' } = req.body
  return {
    code: 200,
    data: {
      username
    },
    message: "添加成功"
  }
}
