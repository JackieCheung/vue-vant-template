const { sh } = require('tasksfile')
const chalk = require('chalk')
const config = require('../vue.config.js')
const rawArgv = process.argv.slice(2)
const args = rawArgv.join(' ')

sh(`vue-cli-service build ${args}`)

if (process.env.npm_config_preview || rawArgv.includes('--preview')) {
  const publicPath = config.publicPath

  const connect = require('connect')
  const serveStatic = require('serve-static')
  const app = connect()

  app.use(
    publicPath,
    serveStatic('./dist', {
      index: ['index.html', '/']
    })
  )

  const port = 9526
  app.listen(port, function () {
    console.log(chalk.green(`> Preview at  http://localhost:${port}${publicPath}`))

    const report = rawArgv.includes('--report')
    if (report) {
      console.log(chalk.green(`> Report at  http://localhost:${port}${publicPath}report.html`))
    }
  })
}
