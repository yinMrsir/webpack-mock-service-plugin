module.exports = (req) => {
  return {
    code: 200,
    data: {
      username: req.body.username || ''
    },
    message: req.query.message || '成功'
  }
}
