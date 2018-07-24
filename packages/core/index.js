const path = require('path')

const runCommand = (cmd, api) => (args, rawArgv) => {
  const execa = require('execa')
  const styleguidistBinPath = require.resolve('vue-styleguidist/bin/styleguidist')

  // save the config url of the user if need be
  if (args.config) {
    process.VUE_CLI_STYLEGUIDIST_CONFIG = args.config
  }
  return new Promise((resolve, reject) => {
    const child = execa(styleguidistBinPath, [cmd, '--config', path.join(__dirname, 'styleguide.config.js')], {
      cwd: api.resolve('.'),
      stdio: 'inherit'
    })
    child.on('error', reject)
    child.on('exit', code => {
      if (code !== 0) {
        reject(`vue-styleguidist exited with code ${code}.`)
      } else {
        resolve()
      }
    })
  })
}

module.exports = api => {
  api.registerCommand(
    'styleguidist',
    {
      description: 'launch the styleguidist dev server',
      usage: 'vue-cli-service styleguidist [options]',
      options: {
        '--config': 'path to the config file'
      }
    },
    runCommand('server', api)
  )

  api.registerCommand(
    'styleguidist:build',
    {
      description: 'build the styleguidist website',
      usage: 'vue-cli-service styleguidist:build [options]',
      options: {
        '--config': 'path to the config file'
      }
    },
    runCommand('build', api)
  )
}
