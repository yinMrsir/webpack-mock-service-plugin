module.exports = (req) => {
  return {
    code: 200,
    message: req.query.message || '成功'
  }
}
