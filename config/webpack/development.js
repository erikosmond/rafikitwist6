process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const environment = require('./environment')

module.exports = environment.toWebpackConfig()


// added below
// const alias = {
//   resolve: {
//     alias: {
//       'react-dom': '@hot-loader/react-dom'
//     }
//   }
// }


// const webpackConfig = environment.toWebpackConfig()

// const { resolve } = webpackConfig

// const newResolve = { ...resolve, ...alias}

// const newConfig = { ...webpackConfig, resolve: newResolve }

// module.exports = { ...environment.toWebpackConfig(), ...alias }

// const customConfig = require('./custom')

// environment.config.merge(customConfig)
