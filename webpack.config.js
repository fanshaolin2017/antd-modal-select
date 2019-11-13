//开发环境的配置
var webpack = require('webpack');
var path = require('path');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    index: './src/dev.js'
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    //设置它引入js文件时可以不用写.js后缀
    extensions: ['.js', '.jsx', '.css', '.less'],

    alias: {}
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: 'eslint-loader'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_moudles/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              plugins: [['import', { libraryName: 'antd', style: 'css' }]]
            }
          }
        ]
      },

      {
        test: /\.(css|less)$/,
        exclude: /node_moudles/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: true,
                sourceMap: true,
                modules: {
                  localIdentName: '[local]'
                }
              }
            },
            {
              loader: 'postcss-loader'
            },

            {
              loader: 'less-loader'
            }
          ]
        })
      },

      {
        test: /\.(jpg|jpeg|png|gif|bmp)/i,

        use: [
          {
            loader: 'url-loader',
            options: {
              publicPath: '',
              outputPath: 'img/',
              limit: 5000
            }
          }
        ]
      },

      {
        test: /\.(woff|woff2|svg|ttf|eot)($|\?)/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              publicPath: '',
              limit: 5000
            }
          }
        ]
      },

      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', 'img:data-src']
            }
          }
        ]
      }
    ]
  },
  plugins: [
    //提取css
    new ExtractTextPlugin({
      filename: 'style.css',
      disable: true
    }),
    // html 模板插件
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.html'
    }),

    // 热加载插件
    new webpack.HotModuleReplacementPlugin()
  ],
  optimization: {
    //webpack4 代码压缩
    minimize: true //第一种方法
  },

  devServer: {
    port: 3000,
    contentBase: './dist',
    compress: true,
    inline: true,
    hot: true,
    proxy: {},
    host: '127.0.0.1',
    disableHostCheck: true,
    hotOnly: true,
    historyApiFallback: true,
    overlay: true,
    open: false
  }
};
