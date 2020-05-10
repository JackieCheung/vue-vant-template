import Mock from 'mockjs'

import { param2Obj } from './tools'

/**
 * note: polyfill for require.context
 * refer to https://stackoverflow.com/questions/38332094/how-can-i-mock-webpacks-require-context-in-jest/42191018#42191018,
 *          https://www.jianshu.com/p/fb0de8a9f115
 */
// This condition actually should detect if it's an Node environment
if (typeof require.context === 'undefined') {
  const fs = require('fs')
  const path = require('path')

  require.context = (base = '.', scanSubDirectories = false, regularExpression = /\.[jt]s$/) => {
    const files = {}

    function readDirectory (directory) {
      fs.readdirSync(directory).forEach((file) => {
        const fullPath = path.resolve(directory, file)

        if (fs.statSync(fullPath).isDirectory()) {
          if (scanSubDirectories) readDirectory(fullPath)

          return
        }

        if (!regularExpression.test(fullPath)) return

        files[fullPath] = true
      })
    }

    readDirectory(path.resolve(__dirname, base))

    function Module (file) {
      // return require(path.resolve(__dirname, base, file))
      return require(file)
    }

    Module.keys = () => Object.keys(files)

    return Module
  }
}

const moduleFiles = require.context('./modules', true, /\.js$/)

// you do not need `import xxx from './modules/xxx'`
// it will auto require all mock modules from module files
/* Mock Modules */
const modules = moduleFiles.keys().reduce((modules, modulePath) => [...modules, moduleFiles(modulePath).default], [])

const mocks = [
  ...modules
]

// for front mock
// please use it cautiously, it will redefine XMLHttpRequest,
// which will cause many of your third-party libraries to be invalidated(like progress event).
export function mockXHR () {
  // mock patch
  // https://github.com/nuysoft/Mock/issues/300
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function () {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType
      }
    }
    this.proxy_send(...arguments)
  }

  function XHR2ExpressReqWrap (response) {
    return function (options) {
      let result = null
      if (response instanceof Function) {
        const { body, type, url } = options
        // https://expressjs.com/en/4x/api.html#req
        result = response({
          method: type,
          body: JSON.parse(body),
          query: param2Obj(url)
        })
      } else {
        result = response
      }
      return Mock.mock(result)
    }
  }

  for (const i of mocks) {
    Mock.mock(new RegExp(i.url), i.type || 'get', XHR2ExpressReqWrap(i.response))
  }
}

export default mocks
