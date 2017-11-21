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
        sequences: false,//true,
        dead_code: false,//true,
        conditionals: false,//true,
        booleans: false,//true,
        unused: false,//true,
        if_return: false,//true,
        join_vars: false,//true,
        drop_console: false
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
