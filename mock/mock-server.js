const chokidar = require('chokidar')
const bodyParser = require('body-parser')
const multer = require('multer')
const chalk = require('chalk')
const path = require('path')
const Mock = require('mockjs')
const express = require('express')

const mockDir = path.join(process.cwd(), 'mock')

// https://github.com/expressjs/multer/blob/master/README.md
const upload = multer()

function unregisterRoutes () {
  Object.keys(require.cache).forEach(i => {
    if (i.includes(mockDir)) {
      delete require.cache[require.resolve(i)]
    }
  })
}

// for mock server
const responseFake = (url, type, resp) => {
  return {
    url: new RegExp(`^${process.env.VUE_APP_BASE_API}${url}$`),
    type: type || 'get',
    response (req, res) {
      console.log('request invoke:' + req.path)
      res.json(Mock.mock(resp instanceof Function ? resp(req, res) : resp))
    }
  }
}

let mockRouter = null

const setupMocks = app => {
  mockRouter = new express.Router()
  const { mocks } = require('./index.js')
  const mocksForServer = mocks.map(route => {
    return responseFake(route.url, route.type, route.response)
  })
  for (const mock of mocksForServer) {
    mockRouter[mock.type](mock.url, bodyParser.json(), bodyParser.urlencoded({
      extended: true
    }), upload.any(), mock.response)
  }
}

module.exports = app => {
  setupMocks(app)

  // watch files, hot reload mock server
  chokidar.watch(mockDir, {
    ignored: /mock-server/,
    ignoreInitial: true
  }).on('all', (event, path) => {
    if (event === 'change' || event === 'add') {
      try {
        // clear routes cache
        unregisterRoutes()

        setupMocks(app)

        console.log(chalk.magentaBright(`\n > Mock Server hot reload success! changed  ${path}`))
      } catch (error) {
        console.log(chalk.redBright(error))
      }
    }
  })
}
