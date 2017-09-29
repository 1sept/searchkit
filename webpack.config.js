const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')

module.exports = {
  entry: {
    "bundle":['./src/index.ts']
  },
  output: {
    path: path.join(__dirname, 'release'),
    filename: '[name].js',
    library:["Searchkit"],
    libraryTarget:"umd",
    publicPath: ''
  },
  resolve: {
    extensions:[".js", ".ts", ".tsx","", ".webpack.js", ".web.js"]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    // new ExtractTextPlugin("theme.css", {allChunks:true}),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['require', 'export', '$super']
      },
      compress: {
        warnings: false,
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: true
      }
    })
  ],
  externals: {
    "react": "React",
    "react-dom":"ReactDOM"
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loaders: ['ts'],
        include: [path.join(__dirname, 'src'),path.join(__dirname, 'theming')]
      }
    ]
  }
};
