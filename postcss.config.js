// https://github.com/michael-ciniawsky/postcss-load-config
module.exports = {
  plugins: {
    autoprefixer: {
      browsers: ['Android >= 4.0', 'iOS >= 8']
    }
  }
}

// const path = require('path')
// module.exports = ({ file }) => {
//   return {
//     plugins: {
//       autoprefixer: {},
//       'postcss-px-to-viewport': {
//         viewportWidth: file.dirname.includes(path.join('node_modules', 'vant')) ? 375 : 750
//       }
//     }
//   }
// }
