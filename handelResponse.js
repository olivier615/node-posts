const header = require('./header')

function handelSuccess (res, data) {
  res.writeHead(200, header)
  res.write(JSON.stringify({
    'statue': 'success',
    data
  }))
  res.end()
}

function handelError (res, error) {
  res.writeHead(400, header)
  let message = ''
  if (error) {
    message = error.message
  } else {
    message = '欄位格式不正確或找不到此 id'
  }
  res.write(JSON.stringify({
    'statue': 'false',
    message
  }))
  res.end()
}

module.exports = { handelSuccess, handelError }