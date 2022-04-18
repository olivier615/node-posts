const http = require('http')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const header = require('./header')
const Post = require('./models/post.js')
const { handelSuccess, handelError } = require('./handelResponse')

dotenv.config({path:'./config.env'})

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
)
mongoose.connect(DB)
.then(() => {
  console.log('連線成功')
})
.catch(error => {
  console.log(error)
})

const requestListener = async (req, res) => {
  let body = ''
  req.on('data', chunk => {
    body += chunk
  })
  if (req.url === '/posts' && req.method === 'GET') {
    const posts = await Post.find()
    handelSuccess(res, posts)
  } else if (req.url === '/posts' && req.method === 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body)
        if (data.content) {
          const newPost = await Post.create(
            {
              "type": data.type,
              "tags": data.tags,
              "image": data.image,
              "name": data.name,
              "content": data.content
            }
          )
          handelSuccess(res, newPost)
        } else {
          handelError(res)
        }
      } catch (error) {
        handelError(res, error)
      }
    })
  } else if (req.url === '/posts' && req.method === 'DELETE') {
    await Post.deleteMany({})
    handelSuccess(res)
  } else if (req.url.startsWith('/posts/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop()
    const posts = await Post.find()
    const index = posts.findIndex(item => item.id === id)
    if (index !== -1) {
      await Post.findByIdAndRemove(id)
      handelSuccess(res)
    } else {
      handelError(res)
    }
  } else if (req.url.startsWith('/posts/') && req.method === 'PATCH') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body)
        const id = req.url.split('/').pop()
        const posts = await Post.find()
        const index = posts.findIndex(item => item.id === id)
        if (index !== -1) {
          await Post.findByIdAndUpdate(id, data)
          const editPost = await Post.find({
            '_id': id
          })
          handelSuccess(res, editPost)
        }
      } catch (error) {
        handelError(res, error)
      }
    })
  } else if (req.url === '/posts' && req.method === 'OPTIONS') {
    res.writeHead(200, header)
    res.end()
  } else {
    res.writeHead(404, header)
    res.write(JSON.stringify({
      'statue': 'false',
      'message': 'page not found'
    }))
    res.end()
  }
} 

const sever = http.createServer(requestListener)
sever.listen(process.env.PORT)
